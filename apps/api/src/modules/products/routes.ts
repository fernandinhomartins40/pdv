import { prisma } from "@pdv/database";
import { z } from "zod";
import type { FastifyInstance } from "fastify";
import { mapProduct } from "../../lib/mappers";

const createProductSchema = z.object({
  organizationId: z.string(),
  sku: z.string().min(1),
  barcode: z.string().optional().nullable(),
  name: z.string().min(2),
  description: z.string().optional().nullable(),
  unit: z.string().default("UN"),
  costPrice: z.number().nonnegative(),
  salePrice: z.number().nonnegative(),
  minStock: z.number().nonnegative().default(0),
  ncm: z.string().optional().nullable(),
  cfop: z.string().optional().nullable(),
  isActive: z.boolean().default(true)
});

export async function productRoutes(app: FastifyInstance) {
  app.get("/products", async (request) => {
    const query = z
      .object({
        organizationId: z.string(),
        storeId: z.string().optional(),
        search: z.string().optional()
      })
      .parse(request.query);

    const products = await prisma.product.findMany({
      where: {
        organizationId: query.organizationId,
        isActive: true,
        OR: query.search
          ? [
              { name: { contains: query.search, mode: "insensitive" } },
              { sku: { contains: query.search, mode: "insensitive" } },
              { barcode: { contains: query.search, mode: "insensitive" } }
            ]
          : undefined
      },
      include: {
        stockBalances: query.storeId
          ? {
              where: {
                storeId: query.storeId
              }
            }
          : {
              take: 1
            }
      },
      orderBy: {
        name: "asc"
      }
    });

    return {
      data: products.map(mapProduct)
    };
  });

  app.get("/products/:id", async (request, reply) => {
    const params = z.object({ id: z.string() }).parse(request.params);
    const query = z.object({ storeId: z.string().optional() }).parse(request.query);

    const product = await prisma.product.findUnique({
      where: {
        id: params.id
      },
      include: {
        stockBalances: query.storeId
          ? {
              where: {
                storeId: query.storeId
              }
            }
          : {
              take: 1
            }
      }
    });

    if (!product) {
      return reply.code(404).send({ message: "Produto não encontrado." });
    }

    return mapProduct(product);
  });

  app.post("/products", async (request, reply) => {
    const body = createProductSchema.parse(request.body);

    const product = await prisma.product.create({
      data: {
        organizationId: body.organizationId,
        sku: body.sku,
        barcode: body.barcode,
        name: body.name,
        description: body.description,
        unit: body.unit,
        costPrice: body.costPrice,
        salePrice: body.salePrice,
        minStock: body.minStock,
        ncm: body.ncm,
        cfop: body.cfop,
        isActive: body.isActive
      }
    });

    reply.code(201);
    return mapProduct(product);
  });

  app.put("/products/:id", async (request, reply) => {
    const params = z.object({ id: z.string() }).parse(request.params);
    const body = createProductSchema.partial().extend({ organizationId: z.string() }).parse(request.body);

    const current = await prisma.product.findUnique({
      where: { id: params.id }
    });

    if (!current) {
      return reply.code(404).send({ message: "Produto não encontrado." });
    }

    const updated = await prisma.product.update({
      where: {
        id: params.id
      },
      data: {
        ...body,
        version: current.version + 1
      }
    });

    return mapProduct(updated);
  });

  app.delete("/products/:id", async (request, reply) => {
    const params = z.object({ id: z.string() }).parse(request.params);

    await prisma.product.update({
      where: {
        id: params.id
      },
      data: {
        isActive: false
      }
    });

    reply.code(204);
    return null;
  });
}
