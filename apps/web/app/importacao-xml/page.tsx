import { ModulePage } from "../../components/module-page";

export default function ImportacaoXmlPage() {
  return (
    <ModulePage
      title="Importação XML"
      description="Parser de NF-e com extração de nome, GTIN, NCM, CFOP, preço de custo, preço de venda e quantidade."
      stats={[
        { label: "XMLs Importados", value: "142", accent: "#6B2EFF" },
        { label: "Produtos Criados", value: "418", accent: "#31C65B" },
        { label: "Pendências", value: "03", accent: "#FF7A1A" }
      ]}
      rows={[
        ["NF-e 352603...", "Processada", "38 itens", "Ctrl+I"],
        ["NF-e 352604...", "Aguardando revisão", "12 itens", "Ctrl+R"],
        ["NF-e 352605...", "Erro de GTIN", "07 itens", "Ctrl+E"]
      ]}
    />
  );
}
