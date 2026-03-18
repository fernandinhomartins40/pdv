import { prisma } from "@pdv/database";
import { MovementType, Prisma } from "@prisma/client";
import { z } from "zod";
import type { FastifyInstance } from "fastify";
import { parseNfeProducts } from "../../lib/xml-parser";

export async function xmlRoutes(app: FastifyInstance) {
  app.post("/xml/import", async (request, reply) => {
    const body = z
      .object({
        organizationId: z.string(),
        storeId: z.string(),
        xml: z.string().min(32)
      })
      .parse(request.body);

    const parsed = parseNfeProducts(body.xml);

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.nfeImport.upsert({
        where: {
          organizationId_xmlKey: {
            organizationId: body.organizationId,
            xmlKey: parsed.accessKey
          }
        },
        update: {
          supplierName: parsed.supplierName,
          rawPayload: { xml: body.xml }
        },
        create: {
          organizationId: body.organizationId,
          xmlKey: parsed.accessKey,
          supplierName: parsed.supplierName,
          rawPayload: { xml: body.xml }
        }
      });

      for (const item of parsed.products) {
        const normalizedSku = (item.gtin || item.name)
          .toUpperCase()
          .replace(/[^A-Z0-9]+/g, "-")
          .slice(0, 32);

        const product = await tx.product.upsert({
          where: {
            organizationId_sku: {
              organizationId: body.organizationId,
              sku: normalizedSku
            }
          },
          update: {
            barcode: item.gtin,
            name: item.name,
            costPrice: item.costPrice,
            salePrice: item.salePrice,
            ncm: item.ncm,
            cfop: item.cfop
          },
          create: {
            organizationId: body.organizationId,
            sku: normalizedSku,
            barcode: item.gtin,
            name: item.name,
            costPrice: item.costPrice,
            salePrice: item.salePrice,
            ncm: item.ncm,
            cfop: item.cfop
          }
        });

        await tx.stockBalance.upsert({
          where: {
            storeId_productId: {
              storeId: body.storeId,
              productId: product.id
            }
          },
          update: {
            quantity: {
              increment: item.quantity
            }
          },
          create: {
            storeId: body.storeId,
            productId: product.id,
            quantity: item.quantity
          }
        });

        await tx.stockMovement.create({
          data: {
            storeId: body.storeId,
            productId: product.id,
            quantity: item.quantity,
            reason: `Importacao XML ${parsed.accessKey}`,
            type: MovementType.IN
          }
        });
      }
    });

    reply.code(201);
    return parsed;
  });
}
