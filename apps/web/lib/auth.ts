import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@pdv/database";
import type { AuthContext, OrganizationSummary, StoreSummary, TerminalSummary, UserIdentity } from "@pdv/types";

const SESSION_COOKIE_NAME = "pdv_session";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

async function buildContext(session: {
  id: string;
  userId: string;
  organizationId: string;
  storeId: string | null;
  terminalId: string | null;
  expiresAt: Date;
  token: string;
}) {
  const [user, memberships] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: {
        id: session.userId
      }
    }),
    prisma.organizationMembership.findMany({
      where: {
        userId: session.userId,
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
    })
  ]);

  const organizations: OrganizationSummary[] = memberships.map((membership) => ({
    id: membership.organization.id,
    name: membership.organization.name,
    slug: membership.organization.slug,
    role: membership.role
  }));

  const activeOrganizationId =
    organizations.find((organization) => organization.id === session.organizationId)?.id ?? organizations[0]?.id ?? session.organizationId;

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
    activeTerminalId:
      terminals.find((terminal) => terminal.id === session.terminalId)?.id ?? terminals[0]?.id ?? session.terminalId ?? null,
    session: {
      token: session.token,
      expiresAt: session.expiresAt.toISOString()
    },
    emailVerified: Boolean(user.emailVerifiedAt)
  } satisfies AuthContext;
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

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

  return buildContext({
    ...session,
    token: rawToken
  });
}

export async function requireSession() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function clearCurrentSession() {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (rawToken) {
    await prisma.authSession.deleteMany({
      where: {
        tokenHash: hashToken(rawToken)
      }
    });
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function switchCurrentContext(input: {
  organizationId: string;
  storeId?: string | null;
  terminalId?: string | null;
}) {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!rawToken) {
    redirect("/login");
  }

  const session = await prisma.authSession.findFirstOrThrow({
    where: {
      tokenHash: hashToken(rawToken),
      expiresAt: {
        gt: new Date()
      }
    }
  });

  await prisma.authSession.update({
    where: {
      id: session.id
    },
    data: {
      organizationId: input.organizationId,
      storeId: input.storeId ?? null,
      terminalId: input.terminalId ?? null
    }
  });
}
