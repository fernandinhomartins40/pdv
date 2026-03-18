import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@pdv/database";
import type { AuthContext, OrganizationSummary, StoreSummary, TerminalSummary, UserIdentity } from "@pdv/types";

const SESSION_COOKIE_NAME = "pdv_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;
const EMAIL_TOKEN_TTL_MS = 1000 * 60 * 60 * 24;
const PASSWORD_RESET_TOKEN_TTL_MS = 1000 * 60 * 30;

export interface RequestAuth {
  token: string;
  sessionId: string;
  context: AuthContext;
}

declare module "fastify" {
  interface FastifyRequest {
    auth: RequestAuth;
  }
}

function baseUrl() {
  return process.env.APP_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function codeify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toUpperCase()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function generateRawToken(size = 32) {
  return randomBytes(size).toString("base64url");
}

export function emailVerificationExpiresAt() {
  return new Date(Date.now() + EMAIL_TOKEN_TTL_MS);
}

export function passwordResetExpiresAt() {
  return new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL_MS);
}

function sessionExpiresAt() {
  return new Date(Date.now() + SESSION_TTL_MS);
}

async function resolveOrganizations(userId: string) {
  return prisma.organizationMembership.findMany({
    where: {
      userId,
      status: "ACTIVE"
    },
    include: {
      organization: true,
      stores: {
        include: {
          store: true
        }
      }
    },
    orderBy: {
      createdAt: "asc"
    }
  });
}

export async function buildAuthContext(session: {
  id: string;
  userId: string;
  organizationId: string;
  storeId: string | null;
  terminalId: string | null;
  expiresAt: Date;
  token?: string;
}) {
  const [user, memberships] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: {
        id: session.userId
      }
    }),
    resolveOrganizations(session.userId)
  ]);

  const organizations: OrganizationSummary[] = memberships.map((membership) => ({
    id: membership.organization.id,
    name: membership.organization.name,
    slug: membership.organization.slug,
    role: membership.role
  }));

  const organizationMembership =
    memberships.find((membership) => membership.organizationId === session.organizationId) ?? memberships[0] ?? null;

  const activeOrganizationId = organizationMembership?.organizationId ?? session.organizationId;

  const stores: StoreSummary[] = memberships
    .flatMap((membership) =>
      membership.stores.map((storeMembership) => ({
        id: storeMembership.store.id,
        organizationId: membership.organizationId,
        name: storeMembership.store.name,
        code: storeMembership.store.code,
        role: storeMembership.role
      }))
    )
    .filter((store, index, array) => array.findIndex((entry) => entry.id === store.id) === index);

  const activeStores = stores.filter((store) => store.organizationId === activeOrganizationId);
  const activeStoreId =
    activeStores.find((store) => store.id === session.storeId)?.id ?? activeStores[0]?.id ?? session.storeId ?? null;

  const terminalsRaw = activeStoreId
    ? await prisma.pdvTerminal.findMany({
        where: {
          storeId: activeStoreId,
          isActive: true
        },
        orderBy: {
          createdAt: "asc"
        }
      })
    : [];

  const terminals: TerminalSummary[] = terminalsRaw.map((terminal) => ({
    id: terminal.id,
    organizationId: terminal.organizationId,
    storeId: terminal.storeId,
    name: terminal.name,
    code: terminal.code,
    isActive: terminal.isActive
  }));

  const activeTerminalId =
    terminals.find((terminal) => terminal.id === session.terminalId)?.id ?? terminals[0]?.id ?? session.terminalId ?? null;

  const userIdentity: UserIdentity = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  };

  return {
    user: userIdentity,
    organizations,
    stores,
    terminals,
    activeOrganizationId,
    activeStoreId,
    activeTerminalId,
    session: {
      token: session.token ?? "",
      expiresAt: session.expiresAt.toISOString()
    },
    emailVerified: Boolean(user.emailVerifiedAt)
  } satisfies AuthContext;
}

export async function createSession(
  reply: FastifyReply,
  input: {
    userId: string;
    organizationId: string;
    storeId?: string | null;
    terminalId?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
  }
) {
  const rawToken = generateRawToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = sessionExpiresAt();

  const session = await prisma.authSession.create({
    data: {
      userId: input.userId,
      organizationId: input.organizationId,
      storeId: input.storeId ?? null,
      terminalId: input.terminalId ?? null,
      tokenHash,
      expiresAt,
      lastUsedAt: new Date(),
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null
    }
  });

  reply.setCookie(SESSION_COOKIE_NAME, rawToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt
  });

  const context = await buildAuthContext({
    ...session,
    token: rawToken
  });

  return {
    rawToken,
    session,
    context
  };
}

export async function destroySession(reply: FastifyReply, token?: string | null) {
  if (token) {
    await prisma.authSession.deleteMany({
      where: {
        tokenHash: hashToken(token)
      }
    });
  }

  reply.clearCookie(SESSION_COOKIE_NAME, {
    path: "/"
  });
}

export function readSessionToken(request: FastifyRequest) {
  const authorization = request.headers.authorization;
  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice("Bearer ".length).trim();
  }

  return request.cookies[SESSION_COOKIE_NAME] ?? null;
}

export async function resolveRequestAuth(request: FastifyRequest) {
  const rawToken = readSessionToken(request);
  if (!rawToken) {
    return null;
  }

  const session = await prisma.authSession.findFirst({
    where: {
      tokenHash: hashToken(rawToken),
      expiresAt: {
        gt: new Date()
      }
    }
  });

  if (!session) {
    return null;
  }

  await prisma.authSession.update({
    where: {
      id: session.id
    },
    data: {
      lastUsedAt: new Date()
    }
  });

  const context = await buildAuthContext({
    ...session,
    token: rawToken
  });

  return {
    token: rawToken,
    sessionId: session.id,
    context
  } satisfies RequestAuth;
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  const auth = await resolveRequestAuth(request);
  if (!auth) {
    return reply.code(401).send({
      message: "Sessao invalida ou ausente."
    });
  }

  request.auth = auth;
}

export function assertOrganizationAccess(request: FastifyRequest, organizationId?: string | null) {
  const effectiveOrganizationId = organizationId ?? request.auth.context.activeOrganizationId;
  const allowed = request.auth.context.organizations.some((organization) => organization.id === effectiveOrganizationId);

  if (!allowed) {
    throw Object.assign(new Error("Acesso negado a organizacao selecionada."), { statusCode: 403 });
  }

  return effectiveOrganizationId;
}

export function assertStoreAccess(request: FastifyRequest, organizationId: string, storeId?: string | null) {
  const candidates = request.auth.context.stores.filter((store) => store.organizationId === organizationId);
  const effectiveStoreId = storeId ?? request.auth.context.activeStoreId ?? candidates[0]?.id ?? null;

  if (!effectiveStoreId) {
    return null;
  }

  const allowed = candidates.some((store) => store.id === effectiveStoreId);
  if (!allowed) {
    throw Object.assign(new Error("Acesso negado a loja selecionada."), { statusCode: 403 });
  }

  return effectiveStoreId;
}

export async function createEmailVerification(userId: string) {
  const rawToken = generateRawToken();

  await prisma.emailVerificationToken.create({
    data: {
      userId,
      tokenHash: hashToken(rawToken),
      expiresAt: emailVerificationExpiresAt()
    }
  });

  return {
    token: rawToken,
    url: `${baseUrl()}/verificar-email?token=${encodeURIComponent(rawToken)}`
  };
}

export async function createPasswordReset(userId: string) {
  const rawToken = generateRawToken();

  await prisma.passwordResetToken.create({
    data: {
      userId,
      tokenHash: hashToken(rawToken),
      expiresAt: passwordResetExpiresAt()
    }
  });

  return {
    token: rawToken,
    url: `${baseUrl()}/resetar-senha?token=${encodeURIComponent(rawToken)}`
  };
}

export async function consumeEmailVerification(token: string) {
  const stored = await prisma.emailVerificationToken.findFirst({
    where: {
      tokenHash: hashToken(token),
      consumedAt: null,
      expiresAt: {
        gt: new Date()
      }
    }
  });

  if (!stored) {
    return null;
  }

  await prisma.$transaction([
    prisma.emailVerificationToken.update({
      where: {
        id: stored.id
      },
      data: {
        consumedAt: new Date()
      }
    }),
    prisma.user.update({
      where: {
        id: stored.userId
      },
      data: {
        emailVerifiedAt: new Date()
      }
    })
  ]);

  return stored.userId;
}

export async function consumePasswordReset(token: string, passwordHash: string) {
  const stored = await prisma.passwordResetToken.findFirst({
    where: {
      tokenHash: hashToken(token),
      consumedAt: null,
      expiresAt: {
        gt: new Date()
      }
    }
  });

  if (!stored) {
    return null;
  }

  await prisma.$transaction([
    prisma.passwordResetToken.update({
      where: {
        id: stored.id
      },
      data: {
        consumedAt: new Date()
      }
    }),
    prisma.user.update({
      where: {
        id: stored.userId
      },
      data: {
        passwordHash
      }
    }),
    prisma.authSession.deleteMany({
      where: {
        userId: stored.userId
      }
    })
  ]);

  return stored.userId;
}

export async function ensureUniqueOrganizationSlug(base: string) {
  let candidate = slugify(base) || "empresa";
  let suffix = 1;

  while (
    await prisma.organization.findUnique({
      where: {
        slug: candidate
      },
      select: {
        id: true
      }
    })
  ) {
    suffix += 1;
    candidate = `${slugify(base) || "empresa"}-${suffix}`;
  }

  return candidate;
}

export async function ensureUniqueStoreCode(organizationId: string, base: string) {
  let candidate = codeify(base) || "LOJA-01";
  let suffix = 1;

  while (
    await prisma.store.findFirst({
      where: {
        organizationId,
        code: candidate
      },
      select: {
        id: true
      }
    })
  ) {
    suffix += 1;
    candidate = `${(codeify(base) || "LOJA").slice(0, 18)}-${suffix}`;
  }

  return candidate;
}

export async function ensureUniqueTerminalCode(base: string) {
  let candidate = codeify(base) || "PDV-01";
  let suffix = 1;

  while (
    await prisma.pdvTerminal.findUnique({
      where: {
        code: candidate
      },
      select: {
        id: true
      }
    })
  ) {
    suffix += 1;
    candidate = `${(codeify(base) || "PDV").slice(0, 18)}-${suffix}`;
  }

  return candidate;
}
