import type { Product as ProductDto, Sale as SaleDto, SalePayment as SalePaymentDto } from "@pdv/types";
import type { Product, Sale, SalePayment } from "@prisma/client";

function toNumber(value: { toString(): string } | string | number | null | undefined) {
  if (value === null || value === undefined) {
    return 0;
  }

  return Number(value.toString());
}

export function mapProduct(product: Product & { stockBalances?: Array<{ quantity: { toString(): string } }> }): ProductDto {
  return {
    id: product.id,
    sku: product.sku,
    barcode: product.barcode,
    name: product.name,
    description: product.description,
    unit: product.unit,
    costPrice: toNumber(product.costPrice),
    salePrice: toNumber(product.salePrice),
    stockQuantity: toNumber(product.stockBalances?.[0]?.quantity),
    minStock: toNumber(product.minStock),
    ncm: product.ncm,
    cfop: product.cfop,
    isActive: product.isActive,
    updatedAt: product.updatedAt.toISOString(),
    version: product.version
  };
}

export function mapSalePayment(payment: SalePayment): SalePaymentDto {
  return {
    id: payment.id,
    method: payment.method,
    amount: toNumber(payment.amount),
    reference: payment.reference
  };
}

export function mapSale(
  sale: Sale & {
    items: Array<{
      id: string;
      productId: string;
      quantity: { toString(): string };
      unitPrice: { toString(): string };
      discountAmount: { toString(): string };
      totalAmount: { toString(): string };
      product: { name: string };
    }>;
    payments: SalePayment[];
  }
): SaleDto {
  return {
    id: sale.id,
    storeId: sale.storeId,
    operatorId: sale.operatorId,
    status: sale.status,
    subtotalAmount: toNumber(sale.subtotalAmount),
    discountAmount: toNumber(sale.discountAmount),
    totalAmount: toNumber(sale.totalAmount),
    items: sale.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      quantity: toNumber(item.quantity),
      unitPrice: toNumber(item.unitPrice),
      discountAmount: toNumber(item.discountAmount),
      totalAmount: toNumber(item.totalAmount)
    })),
    payments: sale.payments.map(mapSalePayment),
    syncedAt: sale.syncedAt?.toISOString() ?? null,
    createdAt: sale.createdAt.toISOString(),
    updatedAt: sale.updatedAt.toISOString(),
    version: sale.version
  };
}
