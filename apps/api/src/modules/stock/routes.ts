import { prisma } from "@pdv/database";
import { MovementType } from "@prisma/client";
import { z } from "zod";
import type { FastifyInstance } from "fastify";
import { mapProduct } from "../../lib/mappers";
import { assertOrganizationAccess, assertStoreAccess } from "../../lib/auth";

export async function stockRoutes(app: FastifyInstance) {
  app.get("/stock/balance", async (request) => {
    const query = z
      .object({
        organizationId: z.string().optional(),
        storeId: z.string().optional(),
        search: z.string().optional()
      })
      .parse(request.query);

    const organizationId = assertOrganizationAccess(request, query.organizationId);
    const storeId = assertStoreAccess(request, organizationId, query.storeId);

    const balances = await prisma.product.findMany({
      where: {
        organizationId,
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
            storeId: storeId ?? undefined
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
        organizationId: z.string().optional(),
        storeId: z.string().optional()
      })
      .parse(request.query);

    const organizationId = assertOrganizationAccess(request, query.organizationId);
    const storeId = assertStoreAccess(request, organizationId, query.storeId);

    const alerts = await prisma.product.findMany({
      where: {
        organizationId,
        isActive: true,
        stockBalances: {
          some: {
            storeId: storeId ?? undefined
          }
        }
      },
      include: {
        stockBalances: {
          where: {
            storeId: storeId ?? undefined
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
        organizationId: z.string().optional(),
        storeId: z.string().optional(),
        productId: z.string(),
        quantity: z.number(),
        reason: z.string().min(2),
        type: z.nativeEnum(MovementType)
      })
      .parse(request.body);

    const organizationId = assertOrganizationAccess(request, body.organizationId);
    const storeId = assertStoreAccess(request, organizationId, body.storeId);

    if (!storeId) {
      return reply.code(400).send({ message: "Selecione uma loja ativa para ajustar estoque." });
    }

    const balance = await prisma.stockBalance.upsert({
      where: {
        storeId_productId: {
          storeId,
          productId: body.productId
        }
      },
      update: {
        quantity: {
          increment: body.quantity
        }
      },
      create: {
        storeId,
        productId: body.productId,
        quantity: body.quantity
      }
    });

    await prisma.stockMovement.create({
      data: {
        storeId,
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
