import { ModulePage } from "../../components/module-page";

export default function ProdutosPage() {
  return (
    <ModulePage
      title="Produtos"
      description="Cadastro manual, preços, GTIN, NCM, CFOP e publicação sincronizada entre nuvem e PDV local."
      stats={[
        { label: "Produtos Ativos", value: "1.248", accent: "#6B2EFF" },
        { label: "Preço Médio", value: "R$ 38,40", accent: "#00B6C9" },
        { label: "Sem GTIN", value: "27", accent: "#FF7A1A" }
      ]}
      rows={[
        ["Café Especial 500g", "Ativo", "R$ 28,90", "F2"],
        ["Água Mineral 510ml", "Ativo", "R$ 3,50", "F3"],
        ["Combo Almoço Executivo", "Promoção", "R$ 42,00", "F8"]
      ]}
    />
  );
}
