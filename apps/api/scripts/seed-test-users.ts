import process from "node:process";
import bcrypt from "bcryptjs";
import { prisma } from "@pdv/database";
import { MembershipStatus, UserRole } from "@prisma/client";

const sharedPassword = "Revendeo@123";

const organizations = [
  {
    name: "Revendeo Teste",
    slug: "revendeo-teste",
    stores: [
      {
        name: "Loja Centro",
        code: "CENTRO",
        terminalName: "PDV Centro 01",
        terminalCode: "PDV-CENTRO-01"
      },
      {
        name: "Loja Norte",
        code: "NORTE",
        terminalName: "PDV Norte 01",
        terminalCode: "PDV-NORTE-01"
      }
    ]
  },
  {
    name: "Revendeo Labs",
    slug: "revendeo-labs",
    stores: [
      {
        name: "Loja Labs",
        code: "LABS",
        terminalName: "PDV Labs 01",
        terminalCode: "PDV-LABS-01"
      }
    ]
  }
] as const;

const users = [
  {
    name: "Proprietário Teste",
    email: "owner.teste@revendeo.local",
    role: UserRole.OWNER,
    access: [
      { organizationSlug: "revendeo-teste", storeCodes: ["CENTRO", "NORTE"] },
      { organizationSlug: "revendeo-labs", storeCodes: ["LABS"] }
    ]
  },
  {
    name: "Administrador Teste",
    email: "admin.teste@revendeo.local",
    role: UserRole.ADMIN,
    access: [
      { organizationSlug: "revendeo-teste", storeCodes: ["CENTRO", "NORTE"] },
      { organizationSlug: "revendeo-labs", storeCodes: ["LABS"] }
    ]
  },
  {
    name: "Gerente Centro/Norte",
    email: "gerente.teste@revendeo.local",
    role: UserRole.MANAGER,
    access: [{ organizationSlug: "revendeo-teste", storeCodes: ["CENTRO", "NORTE"] }]
  },
  {
    name: "Caixa Centro",
    email: "caixa.centro@revendeo.local",
    role: UserRole.CASHIER,
    access: [{ organizationSlug: "revendeo-teste", storeCodes: ["CENTRO"] }]
  },
  {
    name: "Caixa Norte",
    email: "caixa.norte@revendeo.local",
    role: UserRole.CASHIER,
    access: [{ organizationSlug: "revendeo-teste", storeCodes: ["NORTE"] }]
  },
  {
    name: "Financeiro Teste",
    email: "financeiro.teste@revendeo.local",
    role: UserRole.FINANCE,
    access: [{ organizationSlug: "revendeo-teste", storeCodes: ["CENTRO", "NORTE"] }]
  },
  {
    name: "Suporte Teste",
    email: "suporte.teste@revendeo.local",
    role: UserRole.SUPPORT,
    access: [
      { organizationSlug: "revendeo-teste", storeCodes: ["CENTRO", "NORTE"] },
      { organizationSlug: "revendeo-labs", storeCodes: ["LABS"] }
    ]
  }
] as const;

type SeedOrganization = (typeof organizations)[number];
type SeedStore = SeedOrganization["stores"][number];
type SeedUser = (typeof users)[number];

function requireDatabaseUrl() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL não definida. Configure a variável antes de rodar o seed.");
  }
}

async function ensureOrganization(seed: SeedOrganization) {
  const organization = await prisma.organization.upsert({
    where: {
      slug: seed.slug
    },
    update: {
      name: seed.name
    },
    create: {
      name: seed.name,
      slug: seed.slug
    }
  });

  const stores = new Map<string, { id: string; code: string; name: string }>();

  for (const storeSeed of seed.stores) {
    const store = await ensureStore(organization.id, storeSeed);
    stores.set(store.code, {
      id: store.id,
      code: store.code,
      name: store.name
    });

    await prisma.pdvTerminal.upsert({
      where: {
        code: storeSeed.terminalCode
      },
      update: {
        organizationId: organization.id,
        storeId: store.id,
        name: storeSeed.terminalName,
        isActive: true
      },
      create: {
        organizationId: organization.id,
        storeId: store.id,
        name: storeSeed.terminalName,
        code: storeSeed.terminalCode,
        isActive: true
      }
    });
  }

  return {
    id: organization.id,
    slug: organization.slug,
    name: organization.name,
    stores
  };
}

async function ensureStore(organizationId: string, seed: SeedStore) {
  return prisma.store.upsert({
    where: {
      organizationId_code: {
        organizationId,
        code: seed.code
      }
    },
    update: {
      name: seed.name
    },
    create: {
      organizationId,
      name: seed.name,
      code: seed.code
    }
  });
}

async function ensureUser(seed: SeedUser, passwordHash: string, organizationMap: Map<string, Awaited<ReturnType<typeof ensureOrganization>>>) {
  const user = await prisma.user.upsert({
    where: {
      email: seed.email
    },
    update: {
      name: seed.name,
      role: seed.role,
      passwordHash,
      emailVerifiedAt: new Date()
    },
    create: {
      email: seed.email,
      name: seed.name,
      role: seed.role,
      passwordHash,
      emailVerifiedAt: new Date()
    }
  });

  for (const access of seed.access) {
    const organization = organizationMap.get(access.organizationSlug);

    if (!organization) {
      throw new Error(`Organização não encontrada para o slug ${access.organizationSlug}.`);
    }

    const membership = await prisma.organizationMembership.upsert({
      where: {
        organizationId_userId: {
          organizationId: organization.id,
          userId: user.id
        }
      },
      update: {
        role: seed.role,
        status: MembershipStatus.ACTIVE
      },
      create: {
        organizationId: organization.id,
        userId: user.id,
        role: seed.role,
        status: MembershipStatus.ACTIVE
      }
    });

    for (const storeCode of access.storeCodes) {
      const store = organization.stores.get(storeCode);

      if (!store) {
        throw new Error(`Loja ${storeCode} não encontrada para a organização ${organization.slug}.`);
      }

      await prisma.storeMembership.upsert({
        where: {
          organizationMembershipId_storeId: {
            organizationMembershipId: membership.id,
            storeId: store.id
          }
        },
        update: {
          role: seed.role
        },
        create: {
          organizationMembershipId: membership.id,
          storeId: store.id,
          role: seed.role
        }
      });
    }
  }
}

async function main() {
  requireDatabaseUrl();

  const passwordHash = await bcrypt.hash(sharedPassword, 12);
  const organizationMap = new Map<string, Awaited<ReturnType<typeof ensureOrganization>>>();

  for (const organization of organizations) {
    const created = await ensureOrganization(organization);
    organizationMap.set(organization.slug, created);
  }

  for (const user of users) {
    await ensureUser(user, passwordHash, organizationMap);
  }

  console.log("Seed de usuários de teste concluído.");
  console.log(`Senha padrão: ${sharedPassword}`);
  console.log("Credenciais documentadas em docs/credenciais-teste.md");
}

main()
  .catch((error) => {
    console.error("Falha ao executar seed de usuários de teste.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
