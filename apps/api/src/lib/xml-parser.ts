import { XMLParser } from "fast-xml-parser";
import type { XmlImportedProduct } from "@pdv/types";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  parseTagValue: false,
  trimValues: true
});

function arrayOf<T>(value: T | T[] | undefined): T[] {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function asNumber(value: string | number | undefined, fallback = 0) {
  if (value === undefined) {
    return fallback;
  }

  return Number(String(value).replace(",", ".")) || fallback;
}

export function parseNfeProducts(xml: string): {
  accessKey: string;
  supplierName?: string;
  products: XmlImportedProduct[];
} {
  const parsed = parser.parse(xml);
  const infNFe =
    parsed?.nfeProc?.NFe?.infNFe ??
    parsed?.NFe?.infNFe ??
    parsed?.enviNFe?.NFe?.[0]?.infNFe ??
    parsed?.enviNFe?.NFe?.infNFe;

  if (!infNFe) {
    throw new Error("Estrutura de NF-e nao reconhecida.");
  }

  const items = arrayOf(infNFe.det);
  const accessKey = infNFe.Id ?? parsed?.nfeProc?.protNFe?.infProt?.chNFe ?? "sem-chave";
  const supplierName = infNFe.emit?.xNome;

  const products = items.map((item) => {
    const product = item.prod ?? {};
    const costPrice = asNumber(product.vUnCom);
    return {
      name: product.xProd ?? "Produto sem nome",
      gtin: product.cEAN && product.cEAN !== "SEM GTIN" ? product.cEAN : null,
      ncm: product.NCM ?? null,
      cfop: product.CFOP ?? null,
      costPrice,
      salePrice: Number((costPrice * 1.35).toFixed(2)),
      quantity: asNumber(product.qCom, 1)
    };
  });

  return {
    accessKey,
    supplierName,
    products
  };
}
