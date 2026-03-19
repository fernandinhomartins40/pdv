import { prisma } from "@pdv/database";
import { AppPageShell } from "../../components/app-page-shell";
import { ModulePage } from "../../components/module-page";
import { requireSession } from "../../lib/auth";

function money(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function ProdutosPage() {
  const session = await requireSession();

  const [products, activeCount, missingBarcode] = await Promise.all([
    prisma.product.findMany({
      where: {
        organizationId: session.activeOrganizationId,
        isActive: true
      },
      orderBy: {
        updatedAt: "desc"
      },
      take: 3
    }),
    prisma.product.count({
      where: {
        organizationId: session.activeOrganizationId,
        isActive: true
      }
    }),
    prisma.product.count({
      where: {
        organizationId: session.activeOrganizationId,
        isActive: true,
        OR: [{ barcode: null }, { barcode: "" }]
      }
    })
  ]);

  const averagePrice =
    products.length > 0 ? products.reduce((total, product) => total + Number(product.salePrice), 0) / products.length : 0;

  return (
    <AppPageShell>
      <ModulePage
        title="Produtos"
        description="Cadastro manual, preços, GTIN, NCM, CFOP e publicação sincronizada entre nuvem e PDV local."
        stats={[
          { label: "Produtos Ativos", value: String(activeCount), accent: "#6B2EFF" },
          { label: "Preço Médio", value: money(averagePrice), accent: "#00B6C9" },
          { label: "Sem GTIN", value: String(missingBarcode), accent: "#FF7A1A" }
        ]}
        rows={products.map((product) => [
          product.name,
          product.isActive ? "Ativo" : "Inativo",
          money(Number(product.salePrice)),
          product.sku
        ])}
      />
    </AppPageShell>
  );
}
