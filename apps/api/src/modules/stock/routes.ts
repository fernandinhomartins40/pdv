import { prisma } from "@pdv/database";
import { MovementType } from "@prisma/client";
import { z } from "zod";
import type { FastifyInstance } from "fastify";
import { mapProduct } from "../../lib/mappers";

export async function stockRoutes(app: FastifyInstance) {
  app.get("/stock/balance", async (request) => {
    const query = z
      .object({
        organizationId: z.string(),
        storeId: z.string(),
        search: z.string().optional()
      })
      .parse(request.query);

    const balances = await prisma.product.findMany({
      where: {
        organizationId: query.organizationId,
        isActive: true,
        OR: query.search
          ? [
              { name: { contains: query.search, mode: "insensitive" } },
              { sku: { contains: query.search, mode: "insensitive" } }
            ]
          : undefined
      },
      include: {
        stockBalances: {
          where: {
            storeId: query.storeId
          }
        }
      }
    });

    return {
      data: balances.map(mapProduct)
    };
  });

  app.get("/stock/alerts", async (request) => {
    const query = z
      .object({
        organizationId: z.string(),
        storeId: z.string()
      })
      .parse(request.query);

    const alerts = await prisma.product.findMany({
      where: {
        organizationId: query.organizationId,
        isActive: true,
        stockBalances: {
          some: {
            storeId: query.storeId
          }
        }
      },
      include: {
        stockBalances: {
          where: {
            storeId: query.storeId
          }
        }
      }
    });

    return {
      data: alerts
        .filter((product) => {
          const current = Number(product.stockBalances[0]?.quantity ?? 0);
          return current <= Number(product.minStock);
        })
        .map((product) => ({
          productId: product.id,
          productName: product.name,
          quantity: Number(product.stockBalances[0]?.quantity ?? 0),
          minStock: Number(product.minStock)
        }))
    };
  });

  app.post("/stock/adjustments", async (request, reply) => {
    const body = z
      .object({
        storeId: z.string(),
        productId: z.string(),
        quantity: z.number(),
        reason: z.string().min(2),
        type: z.nativeEnum(MovementType)
      })
      .parse(request.body);

    const balance = await prisma.stockBalance.upsert({
      where: {
        storeId_productId: {
          storeId: body.storeId,
          productId: body.productId
        }
      },
      update: {
        quantity: {
          increment: body.quantity
        }
      },
      create: {
        storeId: body.storeId,
        productId: body.productId,
        quantity: body.quantity
      }
    });

    await prisma.stockMovement.create({
      data: {
        storeId: body.storeId,
        productId: body.productId,
        quantity: body.quantity,
        reason: body.reason,
        type: body.type
      }
    });

    reply.code(201);
    return {
      productId: body.productId,
      quantity: Number(balance.quantity)
    };
  });
}
