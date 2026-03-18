import { prisma } from "@pdv/database";
import { MovementType, Prisma, SaleStatus } from "@prisma/client";
import { z } from "zod";
import type { FastifyInstance } from "fastify";
import { mapSale } from "../../lib/mappers";

const createSaleSchema = z.object({
  organizationId: z.string(),
  storeId: z.string(),
  operatorId: z.string(),
  externalRef: z.string().optional().nullable(),
  discountAmount: z.number().nonnegative().default(0),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().positive(),
        unitPrice: z.number().nonnegative(),
        discountAmount: z.number().nonnegative().default(0)
      })
    )
    .min(1),
  payments: z
    .array(
      z.object({
        method: z.string(),
        amount: z.number().positive(),
        reference: z.string().optional().nullable()
      })
    )
    .min(1)
});

export async function salesRoutes(app: FastifyInstance) {
  app.get("/sales", async (request) => {
    const query = z
      .object({
        organizationId: z.string(),
        storeId: z.string().optional(),
        status: z.nativeEnum(SaleStatus).optional()
      })
      .parse(request.query);

    const sales = await prisma.sale.findMany({
      where: {
        organizationId: query.organizationId,
        storeId: query.storeId,
        status: query.status
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        payments: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return {
      data: sales.map(mapSale)
    };
  });

  app.get("/sales/:id", async (request, reply) => {
    const params = z.object({ id: z.string() }).parse(request.params);

    const sale = await prisma.sale.findUnique({
      where: {
        id: params.id
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        payments: true
      }
    });

    if (!sale) {
      return reply.code(404).send({ message: "Venda não encontrada." });
    }

    return mapSale(sale);
  });

  app.post("/sales", async (request, reply) => {
    const body = createSaleSchema.parse(request.body);

    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const productIds = body.items.map((item) => item.productId);
      const products = await tx.product.findMany({
        where: {
          id: {
            in: productIds
          }
        }
      });

      const subtotalAmount = body.items.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
      const totalAmount = subtotalAmount - body.discountAmount;

      const sale = await tx.sale.create({
        data: {
          organizationId: body.organizationId,
          storeId: body.storeId,
          operatorId: body.operatorId,
          externalRef: body.externalRef,
          status: SaleStatus.COMPLETED,
          subtotalAmount,
          discountAmount: body.discountAmount,
          totalAmount,
          items: {
            create: body.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              discountAmount: item.discountAmount,
              totalAmount: item.quantity * item.unitPrice - item.discountAmount
            }))
          },
          payments: {
            create: body.payments.map((payment) => ({
              method: payment.method as never,
              amount: payment.amount,
              reference: payment.reference
            }))
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          },
          payments: true
        }
      });

      for (const item of body.items) {
        const product = products.find((entry) => entry.id === item.productId);

        if (!product) {
          throw new Error(`Produto ${item.productId} nao encontrado.`);
        }

        await tx.stockBalance.upsert({
          where: {
            storeId_productId: {
              storeId: body.storeId,
              productId: item.productId
            }
          },
          update: {
            quantity: {
              decrement: item.quantity
            }
          },
          create: {
            storeId: body.storeId,
            productId: item.productId,
            quantity: -item.quantity
          }
        });

        await tx.stockMovement.create({
          data: {
            storeId: body.storeId,
            productId: item.productId,
            quantity: -item.quantity,
            reason: `Venda ${sale.id}`,
            type: MovementType.OUT
          }
        });
      }

      return sale;
    });

    reply.code(201);
    return mapSale(result);
  });

  app.post("/sales/:id/cancel", async (request, reply) => {
    const params = z.object({ id: z.string() }).parse(request.params);

    const sale = await prisma.sale.findUnique({
      where: {
        id: params.id
      },
      include: {
        items: true
      }
    });

    if (!sale) {
      return reply.code(404).send({ message: "Venda não encontrada." });
    }

    if (sale.status === SaleStatus.CANCELLED) {
      return {
        id: sale.id,
        status: sale.status
      };
    }

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.sale.update({
        where: {
          id: sale.id
        },
        data: {
          status: SaleStatus.CANCELLED,
          version: sale.version + 1
        }
      });

      for (const item of sale.items) {
        await tx.stockBalance.upsert({
          where: {
            storeId_productId: {
              storeId: sale.storeId,
              productId: item.productId
            }
          },
          update: {
            quantity: {
              increment: Number(item.quantity)
            }
          },
          create: {
            storeId: sale.storeId,
            productId: item.productId,
            quantity: item.quantity
          }
        });

        await tx.stockMovement.create({
          data: {
            storeId: sale.storeId,
            productId: item.productId,
            quantity: item.quantity,
            reason: `Cancelamento da venda ${sale.id}`,
            type: MovementType.IN
          }
        });
      }
    });

    return {
      id: sale.id,
      status: SaleStatus.CANCELLED
    };
  });
}
