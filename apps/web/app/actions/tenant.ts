"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@pdv/database";
import { requireSession } from "../../lib/auth";

function codeify(value: string) {
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

async function requireActiveMembership() {
  const session = await requireSession();
  const membership = await prisma.organizationMembership.findFirst({
    where: {
      organizationId: session.activeOrganizationId,
      userId: session.user.id,
      status: "ACTIVE"
    }
  });

  if (!membership) {
    throw new Error("Membro da organização não encontrado.");
  }

  return {
    session,
    membership
  };
}

export async function createStoreAction(formData: FormData) {
  const { session, membership } = await requireActiveMembership();
  const name = String(formData.get("storeName") ?? "").trim();
  const codeInput = String(formData.get("storeCode") ?? "").trim();

  if (!name) {
    throw new Error("Informe o nome da loja.");
  }

  let code = codeify(codeInput || name) || "LOJA";
  let suffix = 1;

  while (
    await prisma.store.findFirst({
      where: {
        organizationId: session.activeOrganizationId,
        code
      },
      select: {
        id: true
      }
    })
  ) {
    suffix += 1;
    code = `${(codeify(codeInput || name) || "LOJA").slice(0, 18)}-${suffix}`;
  }

  const store = await prisma.store.create({
    data: {
      organizationId: session.activeOrganizationId,
      name,
      code
    }
  });

  await prisma.storeMembership.create({
    data: {
      organizationMembershipId: membership.id,
      storeId: store.id,
      role: membership.role
    }
  });

  revalidatePath("/configuracoes");
}

export async function createTerminalAction(formData: FormData) {
  await requireActiveMembership();
  const storeId = String(formData.get("storeId") ?? "").trim();
  const name = String(formData.get("terminalName") ?? "").trim();
  const codeInput = String(formData.get("terminalCode") ?? "").trim();

  if (!storeId || !name) {
    throw new Error("Informe loja e nome do terminal.");
  }

  let code = codeify(codeInput || name) || "PDV";
  let suffix = 1;

  while (
    await prisma.pdvTerminal.findUnique({
      where: {
        code
      },
      select: {
        id: true
      }
    })
  ) {
    suffix += 1;
    code = `${(codeify(codeInput || name) || "PDV").slice(0, 18)}-${suffix}`;
  }

  const store = await prisma.store.findUnique({
    where: {
      id: storeId
    }
  });

  if (!store) {
    throw new Error("Loja não encontrada.");
  }

  await prisma.pdvTerminal.create({
    data: {
      organizationId: store.organizationId,
      storeId,
      name,
      code
    }
  });

  revalidatePath("/configuracoes");
}
