import { prisma } from "@pdv/database";
import { UserRole } from "@prisma/client";
import { demoContext, demoOperator, demoProducts } from "@pdv/types";

interface ContextInput {
  organizationId: string;
  storeId: string;
  operatorId?: string | null;
  operatorName?: string | null;
  operatorEmail?: string | null;
}

function storeCode(storeId: string) {
  return `STORE-${storeId}`.toUpperCase().replace(/[^A-Z0-9-]/g, "-").slice(0, 48);
}

export async function ensureOperationalContext(input: ContextInput) {
  const organizationName =
    input.organizationId === demoContext.organizationId ? "Organização Demo PDV" : `Organização ${input.organizationId}`;
  const storeName = input.storeId === demoContext.storeId ? "Loja Demo PDV" : `Loja ${input.storeId}`;

  await prisma.organization.upsert({
    where: { id: input.organizationId },
    update: { name: organizationName },
    create: {
      id: input.organizationId,
      name: organizationName
    }
  });

  await prisma.store.upsert({
    where: { id: input.storeId },
    update: {
      organizationId: input.organizationId,
      name: storeName,
      code: storeCode(input.storeId)
    },
    create: {
      id: input.storeId,
      organizationId: input.organizationId,
      name: storeName,
      code: storeCode(input.storeId)
    }
  });

  if (input.operatorId) {
    const email =
      input.operatorEmail?.trim() ||
      (input.operatorId === demoOperator.id ? demoOperator.email : `${input.operatorId}@pdv.local`);
    const name =
      input.operatorName?.trim() ||
      (input.operatorId === demoOperator.id ? demoOperator.name : `Operador ${input.operatorId}`);

    await prisma.user.upsert({
      where: { id: input.operatorId },
      update: {
        organizationId: input.organizationId,
        email,
        name,
        role: UserRole.CASHIER
      },
      create: {
        id: input.operatorId,
        organizationId: input.organizationId,
        email,
        name,
        role: UserRole.CASHIER
      }
    });
  }

  if (input.organizationId === demoContext.organizationId) {
    for (const product of demoProducts) {
      await prisma.product.upsert({
        where: {
          id: product.id
        },
        update: {
          organizationId: input.organizationId,
          sku: product.sku,
          barcode: product.barcode,
          name: product.name,
          unit: product.unit,
          costPrice: product.costPrice,
          salePrice: product.salePrice,
          minStock: product.minStock,
          isActive: true
        },
        create: {
          id: product.id,
          organizationId: input.organizationId,
          sku: product.sku,
          barcode: product.barcode,
          name: product.name,
          unit: product.unit,
          costPrice: product.costPrice,
          salePrice: product.salePrice,
          minStock: product.minStock,
          isActive: true
        }
      });

      await prisma.stockBalance.upsert({
        where: {
          storeId_productId: {
            storeId: input.storeId,
            productId: product.id
          }
        },
        update: {
          quantity: product.stockQuantity
        },
        create: {
          storeId: input.storeId,
          productId: product.id,
          quantity: product.stockQuantity
        }
      });
    }
  }
}
