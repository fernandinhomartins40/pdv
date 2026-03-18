import { AppPageShell } from "../../components/app-page-shell";
import { ModulePage } from "../../components/module-page";

export default function ImportacaoXmlPage() {
  return (
    <AppPageShell>
      <ModulePage
        title="Importacao XML"
        description="Parser de NF-e com extracao de nome, GTIN, NCM, CFOP, preco de custo, preco de venda e quantidade."
        stats={[
          { label: "XMLs Importados", value: "142", accent: "#6B2EFF" },
          { label: "Produtos Criados", value: "418", accent: "#31C65B" },
          { label: "Pendencias", value: "03", accent: "#FF7A1A" }
        ]}
        rows={[
          ["NF-e 352603...", "Processada", "38 itens", "Ctrl+I"],
          ["NF-e 352604...", "Aguardando revisao", "12 itens", "Ctrl+R"],
          ["NF-e 352605...", "Erro de GTIN", "07 itens", "Ctrl+E"]
        ]}
      />
    </AppPageShell>
  );
}
