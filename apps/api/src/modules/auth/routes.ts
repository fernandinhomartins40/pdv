import { prisma } from "@pdv/database";
import { MembershipStatus, UserRole } from "@prisma/client";
import { z } from "zod";
import type { FastifyInstance, FastifyRequest } from "fastify";
import {
  assertOrganizationAccess,
  assertStoreAccess,
  consumeEmailVerification,
  consumePasswordReset,
  createEmailVerification,
  createPasswordReset,
  createSession,
  destroySession,
  ensureUniqueOrganizationSlug,
  ensureUniqueStoreCode,
  ensureUniqueTerminalCode,
  hashPassword,
  normalizeEmail,
  readSessionToken,
  requireAuth,
  verifyPassword
} from "../../lib/auth";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  organizationName: z.string().min(2),
  organizationSlug: z.string().optional(),
  storeName: z.string().min(2),
  storeCode: z.string().optional(),
  terminalName: z.string().min(2),
  terminalCode: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  organizationId: z.string().optional(),
  storeId: z.string().optional(),
  terminalId: z.string().optional()
});

const switchContextSchema = z.object({
  organizationId: z.string(),
  storeId: z.string().optional().nullable(),
  terminalId: z.string().optional().nullable()
});

const verifyEmailSchema = z.object({
  token: z.string().min(16)
});

const forgotPasswordSchema = z.object({
  email: z.string().email()
});

const resetPasswordSchema = z.object({
  token: z.string().min(16),
  password: z.string().min(8)
});

function authMeta(request: FastifyRequest) {
  return {
    ipAddress: request.ip,
    userAgent: request.headers["user-agent"]
  };
}

function previewEnabled() {
  return process.env.NODE_ENV !== "production" || process.env.EXPOSE_AUTH_PREVIEW === "1";
}

async function selectLoginContext(userId: string, input: { organizationId?: string; storeId?: string; terminalId?: string }) {
  const memberships = await prisma.organizationMembership.findMany({
    where: {
      userId,
      status: MembershipStatus.ACTIVE
    },
    include: {
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

  const membership =
    memberships.find((entry) => entry.organizationId === input.organizationId) ??
    memberships.find((entry) => entry.stores.some((store) => store.storeId === input.storeId)) ??
    memberships[0];

  if (!membership) {
    throw Object.assign(new Error("Nenhuma organizacao ativa encontrada para este usuario."), { statusCode: 403 });
  }

  const storeMembership =
    membership.stores.find((entry) => entry.storeId === input.storeId) ?? membership.stores[0] ?? null;

  const terminals = storeMembership
    ? await prisma.pdvTerminal.findMany({
        where: {
          storeId: storeMembership.storeId,
          isActive: true
        },
        orderBy: {
          createdAt: "asc"
        }
      })
    : [];

  const terminal = terminals.find((entry) => entry.id === input.terminalId) ?? terminals[0] ?? null;

  return {
    organizationId: membership.organizationId,
    storeId: storeMembership?.storeId ?? null,
    terminalId: terminal?.id ?? null
  };
}

export async function authRoutes(app: FastifyInstance) {
  app.post(
    "/auth/register",
    {
      config: {
        rateLimit: {
          max: 10,
          timeWindow: "1 minute"
        }
      }
    },
    async (request, reply) => {
      const body = registerSchema.parse(request.body);
      const email = normalizeEmail(body.email);

      const existingUser = await prisma.user.findUnique({
        where: {
          email
        },
        select: {
          id: true
        }
      });

      if (existingUser) {
        return reply.code(409).send({
          message: "Ja existe uma conta com este e-mail."
        });
      }

      const passwordHash = await hashPassword(body.password);
      const organizationSlug = await ensureUniqueOrganizationSlug(body.organizationSlug ?? body.organizationName);

      const created = await prisma.$transaction(async (tx) => {
        const organization = await tx.organization.create({
          data: {
            name: body.organizationName,
            slug: organizationSlug
          }
        });

        const storeCode = await ensureUniqueStoreCode(organization.id, body.storeCode ?? body.storeName);
        const store = await tx.store.create({
          data: {
            organizationId: organization.id,
            name: body.storeName,
            code: storeCode
          }
        });

        const terminalCode = await ensureUniqueTerminalCode(body.terminalCode ?? `${store.code}-01`);
        const terminal = await tx.pdvTerminal.create({
          data: {
            organizationId: organization.id,
            storeId: store.id,
            name: body.terminalName,
            code: terminalCode
          }
        });

        const user = await tx.user.create({
          data: {
            email,
            name: body.name,
            passwordHash,
            role: UserRole.OWNER
          }
        });

        const membership = await tx.organizationMembership.create({
          data: {
            organizationId: organization.id,
            userId: user.id,
            role: UserRole.OWNER,
            status: MembershipStatus.ACTIVE
          }
        });

        await tx.storeMembership.create({
          data: {
            organizationMembershipId: membership.id,
            storeId: store.id,
            role: UserRole.OWNER
          }
        });

        return {
          user,
          organization,
          store,
          terminal
        };
      });

      const verification = await createEmailVerification(created.user.id);
      const session = await createSession(reply, {
        userId: created.user.id,
        organizationId: created.organization.id,
        storeId: created.store.id,
        terminalId: created.terminal.id,
        ...authMeta(request)
      });

      return reply.code(201).send({
        ...session.context,
        emailVerificationRequired: true,
        verification: previewEnabled() ? verification : undefined
      });
    }
  );

  app.post(
    "/auth/login",
    {
      config: {
        rateLimit: {
          max: 20,
          timeWindow: "1 minute"
        }
      }
    },
    async (request, reply) => {
      const body = loginSchema.parse(request.body);
      const email = normalizeEmail(body.email);

      const user = await prisma.user.findUnique({
        where: {
          email
        }
      });

      if (!user?.passwordHash) {
        return reply.code(401).send({
          message: "Credenciais invalidas."
        });
      }

      const passwordMatches = await verifyPassword(body.password, user.passwordHash);
      if (!passwordMatches) {
        return reply.code(401).send({
          message: "Credenciais invalidas."
        });
      }

      const selectedContext = await selectLoginContext(user.id, body);

      await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          lastLoginAt: new Date()
        }
      });

      const session = await createSession(reply, {
        userId: user.id,
        organizationId: selectedContext.organizationId,
        storeId: selectedContext.storeId,
        terminalId: selectedContext.terminalId,
        ...authMeta(request)
      });

      return session.context;
    }
  );

  app.get("/auth/session", { preHandler: requireAuth }, async (request) => request.auth.context);

  app.post("/auth/logout", { preHandler: requireAuth }, async (request, reply) => {
    await destroySession(reply, readSessionToken(request));
    return {
      ok: true
    };
  });

  app.post("/auth/context", { preHandler: requireAuth }, async (request, reply) => {
    const body = switchContextSchema.parse(request.body);
    const organizationId = assertOrganizationAccess(request, body.organizationId);
    const storeId = assertStoreAccess(request, organizationId, body.storeId ?? null);
    const terminalId = body.terminalId ?? null;

    await prisma.authSession.update({
      where: {
        id: request.auth.sessionId
      },
      data: {
        organizationId,
        storeId,
        terminalId
      }
    });

    const session = await createSession(reply, {
      userId: request.auth.context.user.id,
      organizationId,
      storeId,
      terminalId,
      ...authMeta(request)
    });

    await prisma.authSession.delete({
      where: {
        id: request.auth.sessionId
      }
    });

    return session.context;
  });

  app.post("/auth/verify-email/request", { preHandler: requireAuth }, async (request) => {
    const verification = await createEmailVerification(request.auth.context.user.id);

      return {
        ok: true,
        verification: previewEnabled() ? verification : undefined
      };
  });

  app.post("/auth/verify-email/confirm", async (request, reply) => {
    const body = verifyEmailSchema.parse(request.body);
    const userId = await consumeEmailVerification(body.token);

    if (!userId) {
      return reply.code(400).send({
        message: "Token de verificacao invalido ou expirado."
      });
    }

    return {
      ok: true
    };
  });

  app.post(
    "/auth/password/forgot",
    {
      config: {
        rateLimit: {
          max: 10,
          timeWindow: "1 minute"
        }
      }
    },
    async (request) => {
      const body = forgotPasswordSchema.parse(request.body);
      const user = await prisma.user.findUnique({
        where: {
          email: normalizeEmail(body.email)
        }
      });

      if (!user) {
        return {
          ok: true
        };
      }

      const reset = await createPasswordReset(user.id);
      return {
        ok: true,
        reset: previewEnabled() ? reset : undefined
      };
    }
  );

  app.post(
    "/auth/password/reset",
    {
      config: {
        rateLimit: {
          max: 10,
          timeWindow: "1 minute"
        }
      }
    },
    async (request, reply) => {
      const body = resetPasswordSchema.parse(request.body);
      const passwordHash = await hashPassword(body.password);
      const userId = await consumePasswordReset(body.token, passwordHash);

      if (!userId) {
        return reply.code(400).send({
          message: "Token de redefinicao invalido ou expirado."
        });
      }

      return {
        ok: true
      };
    }
  );
}
