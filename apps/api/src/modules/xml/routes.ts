import { prisma } from "@pdv/database";
import { MovementType, Prisma } from "@prisma/client";
import { z } from "zod";
import type { FastifyInstance } from "fastify";
import type { XmlImportPreview, XmlImportPreviewItem } from "@pdv/types";
import { parseNfeProducts } from "../../lib/xml-parser";
import { assertOrganizationAccess, assertStoreAccess } from "../../lib/auth";

const xmlBaseSchema = z.object({
  organizationId: z.string().optional(),
  storeId: z.string().optional(),
  xml: z.string().min(32),
  marginPercent: z.number().min(0).max(500).optional()
});

const xmlImportItemSchema = z.object({
  productId: z.string().optional().nullable(),
  sku: z.string().optional().nullable(),
  name: z.string(),
  unit: z.string().optional().nullable(),
  gtin: z.string().optional().nullable(),
  ncm: z.string().optional().nullable(),
  cfop: z.string().optional().nullable(),
  costPrice: z.number().nonnegative(),
  salePrice: z.number().nonnegative(),
  quantity: z.number().positive(),
  matchType: z.enum(["BARCODE", "NAME", "NEW"]).optional()
});

function normalizeSku(value: string) {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

function withMargin(costPrice: number, marginPercent: number) {
  return Number((costPrice * (1 + marginPercent / 100)).toFixed(2));
}

async function buildPreview(organizationId: string, xml: string, marginPercent = 35): Promise<XmlImportPreview> {
  const parsed = parseNfeProducts(xml);
  const gtins = parsed.products.map((item) => item.gtin).filter((value): value is string => Boolean(value));
  const names = [...new Set(parsed.products.map((item) => item.name))];

  const existingProducts =
    gtins.length || names.length
      ? await prisma.product.findMany({
          where: {
            organizationId,
            OR: [
              ...(gtins.length ? [{ barcode: { in: gtins } }] : []),
              ...(names.length ? [{ name: { in: names } }] : [])
            ]
          }
        })
      : [];

  const byBarcode = new Map(existingProducts.filter((item) => item.barcode).map((item) => [item.barcode as string, item]));
  const byName = new Map(existingProducts.map((item) => [item.name, item]));

  const items: XmlImportPreviewItem[] = parsed.products.map((item) => {
    const match = (item.gtin ? byBarcode.get(item.gtin) : undefined) ?? byName.get(item.name);
    const matchType: XmlImportPreviewItem["matchType"] = item.gtin && match?.barcode === item.gtin ? "BARCODE" : match ? "NAME" : "NEW";

    return {
      name: item.name,
      unit: item.unit ?? match?.unit ?? "UN",
      gtin: item.gtin,
      ncm: item.ncm,
      cfop: item.cfop,
      quantity: item.quantity,
      costPrice: item.costPrice,
      salePrice: withMargin(item.costPrice, marginPercent),
      productId: match?.id ?? null,
      sku: match?.sku ?? normalizeSku(item.gtin || item.name),
      productName: match?.name ?? item.name,
      matchType
    };
  });

  return {
    accessKey: parsed.accessKey,
    supplierName: parsed.supplierName,
    marginPercent,
    items
  };
}

export async function xmlRoutes(app: FastifyInstance) {
  app.post("/xml/preview", async (request, reply) => {
    const body = xmlBaseSchema.parse(request.body);
    const organizationId = assertOrganizationAccess(request, body.organizationId);
    const storeId = assertStoreAccess(request, organizationId, body.storeId);

    if (!storeId) {
      return reply.code(400).send({ message: "Selecione uma loja ativa para importar XML." });
    }

    return buildPreview(organizationId, body.xml, body.marginPercent ?? 35);
  });

  app.post("/xml/import", async (request, reply) => {
    const body = xmlBaseSchema
      .extend({
        items: z.array(xmlImportItemSchema).optional()
      })
      .parse(request.body);

    const organizationId = assertOrganizationAccess(request, body.organizationId);
    const storeId = assertStoreAccess(request, organizationId, body.storeId);

    if (!storeId) {
      return reply.code(400).send({ message: "Selecione uma loja ativa para importar XML." });
    }

    const preview = await buildPreview(organizationId, body.xml, body.marginPercent ?? 35);
    const items = body.items?.length ? body.items : preview.items;
    let createdCount = 0;
    let updatedCount = 0;

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.nfeImport.upsert({
        where: {
          organizationId_xmlKey: {
            organizationId,
            xmlKey: preview.accessKey
          }
        },
        update: {
          supplierName: preview.supplierName,
          rawPayload: {
            xml: body.xml,
            marginPercent: preview.marginPercent,
            items
          }
        },
        create: {
          organizationId,
          xmlKey: preview.accessKey,
          supplierName: preview.supplierName,
          rawPayload: {
            xml: body.xml,
            marginPercent: preview.marginPercent,
            items
          }
        }
      });

      for (const item of items) {
        const baseProductData = {
          barcode: item.gtin,
          name: item.name,
          unit: item.unit ?? "UN",
          costPrice: item.costPrice,
          salePrice: item.salePrice,
          ncm: item.ncm,
          cfop: item.cfop
        };

        const product =
          item.productId !== undefined && item.productId !== null
            ? await tx.product.upsert({
                where: {
                  id: item.productId
                },
                update: baseProductData,
                create: {
                  id: item.productId,
                  organizationId,
                  sku: item.sku ? normalizeSku(item.sku) : normalizeSku(item.gtin || item.name),
                  ...baseProductData
                }
              })
            : await tx.product.upsert({
                where: {
                  organizationId_sku: {
                    organizationId,
                    sku: item.sku ? normalizeSku(item.sku) : normalizeSku(item.gtin || item.name)
                  }
                },
                update: baseProductData,
                create: {
                  organizationId,
                  sku: item.sku ? normalizeSku(item.sku) : normalizeSku(item.gtin || item.name),
                  ...baseProductData
                }
              });

        if (item.productId || item.matchType === "BARCODE" || item.matchType === "NAME") {
          updatedCount += 1;
        } else {
          createdCount += 1;
        }

        await tx.stockBalance.upsert({
          where: {
            storeId_productId: {
              storeId,
              productId: product.id
            }
          },
          update: {
            quantity: {
              increment: item.quantity
            }
          },
          create: {
            storeId,
            productId: product.id,
            quantity: item.quantity
          }
        });

        await tx.stockMovement.create({
          data: {
            storeId,
            productId: product.id,
            quantity: item.quantity,
            reason: `Importacao XML ${preview.accessKey}`,
            type: MovementType.IN
          }
        });
      }
    });

    reply.code(201);
    return {
      accessKey: preview.accessKey,
      supplierName: preview.supplierName,
      importedCount: items.length,
      createdCount,
      updatedCount
    };
  });
}
