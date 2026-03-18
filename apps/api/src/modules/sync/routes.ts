import { prisma } from "@pdv/database";
import { MovementType, Prisma, SaleStatus, SyncEntity, SyncOperationType, SyncStatus } from "@prisma/client";
import { z } from "zod";
import type { FastifyInstance } from "fastify";
import type { SyncConflict } from "@pdv/types";
import { mapProduct } from "../../lib/mappers";
import { ensureOperationalContext } from "../../lib/operational-context";

const syncOperationSchema = z.object({
  id: z.string(),
  entity: z.enum(["product", "sale", "stock", "cash_session"]),
  operation: z.enum([
    "UPSERT_PRODUCT",
    "UPSERT_STOCK",
    "CREATE_SALE",
    "OPEN_CASH_SESSION",
    "CLOSE_CASH_SESSION"
  ]),
  payload: z.unknown(),
  status: z.enum(["PENDING", "PROCESSING", "FAILED", "SYNCED", "CONFLICT"]),
  attempts: z.number().nonnegative(),
  scheduledAt: z.string(),
  lastError: z.string().optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string()
});

const salePayloadSchema = z.object({
  saleId: z.string(),
  organizationId: z.string(),
  storeId: z.string(),
  operatorId: z.string(),
  operatorName: z.string().optional(),
  operatorEmail: z.string().optional(),
  subtotalAmount: z.number().nonnegative(),
  discountAmount: z.number().nonnegative(),
  totalAmount: z.number().nonnegative(),
  createdAt: z.string(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        productName: z.string(),
        quantity: z.number().positive(),
        unitPrice: z.number().nonnegative(),
        discountAmount: z.number().nonnegative(),
        totalAmount: z.number().nonnegative()
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

const cashSessionOpenPayloadSchema = z.object({
  cashSessionId: z.string(),
  organizationId: z.string(),
  storeId: z.string(),
  operatorId: z.string(),
  operatorName: z.string().optional(),
  operatorEmail: z.string().optional(),
  openedAt: z.string(),
  openingAmount: z.number().nonnegative()
});

const cashSessionClosePayloadSchema = z.object({
  cashSessionId: z.string(),
  organizationId: z.string(),
  storeId: z.string(),
  operatorId: z.string(),
  operatorName: z.string().optional(),
  operatorEmail: z.string().optional(),
  closedAt: z.string(),
  closingAmount: z.number().nonnegative()
});

async function upsertSyncAuditRecord(
  tx: Prisma.TransactionClient,
  operationId: string,
  storeId: string,
  entity: SyncEntity,
  operation: SyncOperationType,
  payload: Prisma.InputJsonValue,
  status: SyncStatus
) {
  const existing = await tx.syncQueue.findUnique({
    where: {
      id: operationId
    }
  });

  if (existing) {
    return tx.syncQueue.update({
      where: {
        id: operationId
      },
      data: {
        storeId,
        entity,
        operation,
        payload,
        status,
        lastError: null
      }
    });
  }

  return tx.syncQueue.create({
    data: {
      id: operationId,
      storeId,
      entity,
      operation,
      payload,
      status
    }
  });
}

async function processCreateSale(operationId: string, rawPayload: unknown) {
  const payload = salePayloadSchema.parse(rawPayload);

  await ensureOperationalContext({
    organizationId: payload.organizationId,
    storeId: payload.storeId,
    operatorId: payload.operatorId,
    operatorName: payload.operatorName,
    operatorEmail: payload.operatorEmail
  });

  await prisma.$transaction(async (tx) => {
    const existing = await tx.sale.findUnique({
      where: {
        id: payload.saleId
      }
    });

    await upsertSyncAuditRecord(
      tx,
      operationId,
      payload.storeId,
      SyncEntity.sale,
      SyncOperationType.CREATE_SALE,
      rawPayload as Prisma.InputJsonValue,
      SyncStatus.PROCESSING
    );

    if (!existing) {
      const products = await tx.product.findMany({
        where: {
          id: {
            in: payload.items.map((item) => item.productId)
          }
        }
      });

      for (const item of payload.items) {
        if (!products.some((product) => product.id === item.productId)) {
          throw new Error(`Produto ${item.productId} não encontrado na nuvem para sincronizar a venda.`);
        }
      }

      await tx.sale.create({
        data: {
          id: payload.saleId,
          organizationId: payload.organizationId,
          storeId: payload.storeId,
          operatorId: payload.operatorId,
          externalRef: operationId,
          status: SaleStatus.COMPLETED,
          subtotalAmount: payload.subtotalAmount,
          discountAmount: payload.discountAmount,
          totalAmount: payload.totalAmount,
          syncedAt: new Date(),
          createdAt: new Date(payload.createdAt),
          items: {
            create: payload.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              discountAmount: item.discountAmount,
              totalAmount: item.totalAmount
            }))
          },
          payments: {
            create: payload.payments.map((payment) => ({
              method: payment.method as never,
              amount: payment.amount,
              reference: payment.reference
            }))
          }
        }
      });

      for (const item of payload.items) {
        await tx.stockBalance.upsert({
          where: {
            storeId_productId: {
              storeId: payload.storeId,
              productId: item.productId
            }
          },
          update: {
            quantity: {
              decrement: item.quantity
            }
          },
          create: {
            storeId: payload.storeId,
            productId: item.productId,
            quantity: -item.quantity
          }
        });

        await tx.stockMovement.create({
          data: {
            storeId: payload.storeId,
            productId: item.productId,
            quantity: -item.quantity,
            reason: `Venda sincronizada ${payload.saleId}`,
            type: MovementType.OUT
          }
        });
      }
    }

    await upsertSyncAuditRecord(
      tx,
      operationId,
      payload.storeId,
      SyncEntity.sale,
      SyncOperationType.CREATE_SALE,
      rawPayload as Prisma.InputJsonValue,
      SyncStatus.SYNCED
    );
  });
}

async function processOpenCashSession(operationId: string, rawPayload: unknown) {
  const payload = cashSessionOpenPayloadSchema.parse(rawPayload);

  await ensureOperationalContext({
    organizationId: payload.organizationId,
    storeId: payload.storeId,
    operatorId: payload.operatorId,
    operatorName: payload.operatorName,
    operatorEmail: payload.operatorEmail
  });

  await prisma.$transaction(async (tx) => {
    await upsertSyncAuditRecord(
      tx,
      operationId,
      payload.storeId,
      SyncEntity.cash_session,
      SyncOperationType.OPEN_CASH_SESSION,
      rawPayload as Prisma.InputJsonValue,
      SyncStatus.PROCESSING
    );

    await tx.cashSession.upsert({
      where: {
        id: payload.cashSessionId
      },
      update: {
        storeId: payload.storeId,
        openedById: payload.operatorId,
        openedAt: new Date(payload.openedAt),
        openingAmount: payload.openingAmount,
        status: "OPEN"
      },
      create: {
        id: payload.cashSessionId,
        storeId: payload.storeId,
        openedById: payload.operatorId,
        openedAt: new Date(payload.openedAt),
        openingAmount: payload.openingAmount,
        status: "OPEN"
      }
    });

    await upsertSyncAuditRecord(
      tx,
      operationId,
      payload.storeId,
      SyncEntity.cash_session,
      SyncOperationType.OPEN_CASH_SESSION,
      rawPayload as Prisma.InputJsonValue,
      SyncStatus.SYNCED
    );
  });
}

async function processCloseCashSession(operationId: string, rawPayload: unknown) {
  const payload = cashSessionClosePayloadSchema.parse(rawPayload);

  await ensureOperationalContext({
    organizationId: payload.organizationId,
    storeId: payload.storeId,
    operatorId: payload.operatorId,
    operatorName: payload.operatorName,
    operatorEmail: payload.operatorEmail
  });

  await prisma.$transaction(async (tx) => {
    await upsertSyncAuditRecord(
      tx,
      operationId,
      payload.storeId,
      SyncEntity.cash_session,
      SyncOperationType.CLOSE_CASH_SESSION,
      rawPayload as Prisma.InputJsonValue,
      SyncStatus.PROCESSING
    );

    const existing = await tx.cashSession.findUnique({
      where: {
        id: payload.cashSessionId
      }
    });

    if (existing) {
      await tx.cashSession.update({
        where: {
          id: payload.cashSessionId
        },
        data: {
          closedAt: new Date(payload.closedAt),
          closingAmount: payload.closingAmount,
          status: "CLOSED"
        }
      });
    } else {
      await tx.cashSession.create({
        data: {
          id: payload.cashSessionId,
          storeId: payload.storeId,
          openedById: payload.operatorId,
          openedAt: new Date(payload.closedAt),
          closedAt: new Date(payload.closedAt),
          openingAmount: 0,
          closingAmount: payload.closingAmount,
          status: "CLOSED"
        }
      });
    }

    await upsertSyncAuditRecord(
      tx,
      operationId,
      payload.storeId,
      SyncEntity.cash_session,
      SyncOperationType.CLOSE_CASH_SESSION,
      rawPayload as Prisma.InputJsonValue,
      SyncStatus.SYNCED
    );
  });
}

export async function syncRoutes(app: FastifyInstance) {
  app.post("/sync/push", async (request) => {
    const body = z
      .object({
        organizationId: z.string(),
        storeId: z.string(),
        operations: z.array(syncOperationSchema)
      })
      .parse(request.body);

    await ensureOperationalContext({
      organizationId: body.organizationId,
      storeId: body.storeId
    });

    const processedIds: string[] = [];
    const conflicts: SyncConflict[] = [];

    for (const operation of body.operations) {
      try {
        if (operation.operation === "UPSERT_PRODUCT") {
          const payload = z
            .object({
              organizationId: z.string(),
              id: z.string(),
              sku: z.string(),
              barcode: z.string().optional().nullable(),
              name: z.string(),
              description: z.string().optional().nullable(),
              unit: z.string(),
              costPrice: z.number(),
              salePrice: z.number(),
              minStock: z.number(),
              ncm: z.string().optional().nullable(),
              cfop: z.string().optional().nullable(),
              version: z.number()
            })
            .parse(operation.payload);

          const remote = await prisma.product.findUnique({
            where: {
              id: payload.id
            }
          });

          if (remote && remote.version > payload.version) {
            conflicts.push({
              queueId: operation.id,
              entity: "product",
              localVersion: payload.version,
              remoteVersion: remote.version,
              reason: "Produto alterado na nuvem com versão mais recente."
            });
            continue;
          }

          await prisma.product.upsert({
            where: {
              id: payload.id
            },
            update: {
              sku: payload.sku,
              barcode: payload.barcode,
              name: payload.name,
              description: payload.description,
              unit: payload.unit,
              costPrice: payload.costPrice,
              salePrice: payload.salePrice,
              minStock: payload.minStock,
              ncm: payload.ncm,
              cfop: payload.cfop,
              version: payload.version + 1
            },
            create: {
              id: payload.id,
              organizationId: payload.organizationId,
              sku: payload.sku,
              barcode: payload.barcode,
              name: payload.name,
              description: payload.description,
              unit: payload.unit,
              costPrice: payload.costPrice,
              salePrice: payload.salePrice,
              minStock: payload.minStock,
              ncm: payload.ncm,
              cfop: payload.cfop,
              version: payload.version
            }
          });

          processedIds.push(operation.id);
          continue;
        }

        if (operation.operation === "UPSERT_STOCK") {
          const payload = z
            .object({
              productId: z.string(),
              quantity: z.number()
            })
            .parse(operation.payload);

          await prisma.stockBalance.upsert({
            where: {
              storeId_productId: {
                storeId: body.storeId,
                productId: payload.productId
              }
            },
            update: {
              quantity: payload.quantity
            },
            create: {
              storeId: body.storeId,
              productId: payload.productId,
              quantity: payload.quantity
            }
          });

          processedIds.push(operation.id);
          continue;
        }

        if (operation.operation === "CREATE_SALE") {
          await processCreateSale(operation.id, operation.payload);
          processedIds.push(operation.id);
          continue;
        }

        if (operation.operation === "OPEN_CASH_SESSION") {
          await processOpenCashSession(operation.id, operation.payload);
          processedIds.push(operation.id);
          continue;
        }

        if (operation.operation === "CLOSE_CASH_SESSION") {
          await processCloseCashSession(operation.id, operation.payload);
          processedIds.push(operation.id);
        }
      } catch (error) {
        conflicts.push({
          queueId: operation.id,
          entity: operation.entity,
          localVersion: 0,
          remoteVersion: 0,
          reason: error instanceof Error ? error.message : "Falha ao processar operação de sync."
        });
      }
    }

    return {
      processedIds,
      conflicts,
      nextRetryAt: conflicts.length ? new Date(Date.now() + 30000).toISOString() : null
    };
  });

  app.get("/sync/pull", async (request) => {
    const query = z
      .object({
        organizationId: z.string(),
        storeId: z.string(),
        cursor: z.string().optional()
      })
      .parse(request.query);

    await ensureOperationalContext({
      organizationId: query.organizationId,
      storeId: query.storeId
    });

    const since = query.cursor ? new Date(query.cursor) : new Date(0);
    const nextCursor = new Date().toISOString();

    const [products, stock] = await Promise.all([
      prisma.product.findMany({
        where: {
          organizationId: query.organizationId,
          updatedAt: {
            gt: since
          }
        },
        include: {
          stockBalances: {
            where: {
              storeId: query.storeId
            }
          }
        }
      }),
      prisma.stockBalance.findMany({
        where: {
          storeId: query.storeId,
          updatedAt: {
            gt: since
          }
        }
      })
    ]);

    await prisma.syncCursor.upsert({
      where: {
        id: `${query.organizationId}:${query.storeId}:desktop`
      },
      update: {
        cursor: nextCursor
      },
      create: {
        id: `${query.organizationId}:${query.storeId}:desktop`,
        organizationId: query.organizationId,
        storeId: query.storeId,
        scope: "desktop",
        cursor: nextCursor
      }
    });

    return {
      cursor: nextCursor,
      products: products.map(mapProduct),
      stock: stock.map((item) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
        updatedAt: item.updatedAt.toISOString()
      }))
    };
  });
}
