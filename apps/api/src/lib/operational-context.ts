import { prisma } from "@pdv/database";
import { MembershipStatus, UserRole } from "@prisma/client";
import { demoContext, demoOperator, demoProducts } from "@pdv/types";

interface ContextInput {
  organizationId: string;
  storeId: string;
  operatorId?: string | null;
  operatorName?: string | null;
  operatorEmail?: string | null;
}

export async function ensureOperationalContext(input: ContextInput) {
  const [organization, store] = await Promise.all([
    prisma.organization.findUnique({
      where: {
        id: input.organizationId
      },
      select: {
        id: true
      }
    }),
    prisma.store.findFirst({
      where: {
        id: input.storeId,
        organizationId: input.organizationId
      },
      select: {
        id: true
      }
    })
  ]);

  if (!organization || !store) {
    throw new Error("Contexto operacional invalido para a sessao atual.");
  }

  if (input.operatorId) {
    const email =
      input.operatorEmail?.trim() ||
      (input.operatorId === demoOperator.id ? demoOperator.email : `${input.operatorId}@pdv.local`);
    const name =
      input.operatorName?.trim() ||
      (input.operatorId === demoOperator.id ? demoOperator.name : `Operador ${input.operatorId}`);

    const operator = await prisma.user.upsert({
      where: {
        id: input.operatorId
      },
      update: {
        email,
        name,
        role: UserRole.CASHIER
      },
      create: {
        id: input.operatorId,
        email,
        name,
        role: UserRole.CASHIER
      }
    });

    const membership = await prisma.organizationMembership.upsert({
      where: {
        organizationId_userId: {
          organizationId: input.organizationId,
          userId: operator.id
        }
      },
      update: {
        role: UserRole.CASHIER,
        status: MembershipStatus.ACTIVE
      },
      create: {
        organizationId: input.organizationId,
        userId: operator.id,
        role: UserRole.CASHIER,
        status: MembershipStatus.ACTIVE
      }
    });

    await prisma.storeMembership.upsert({
      where: {
        organizationMembershipId_storeId: {
          organizationMembershipId: membership.id,
          storeId: input.storeId
        }
      },
      update: {
        role: UserRole.CASHIER
      },
      create: {
        organizationMembershipId: membership.id,
        storeId: input.storeId,
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
