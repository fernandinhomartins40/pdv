import { AppPageShell } from "../../components/app-page-shell";
import { ModulePage } from "../../components/module-page";

export default function RelatoriosPage() {
  return (
    <AppPageShell>
      <ModulePage
        title="Relatorios"
        description="Consolidacao por periodo, operador, forma de pagamento e comportamento de vendas com exportacao analitica."
        stats={[
          { label: "Ticket Medio", value: "R$ 68,20", accent: "#6B2EFF" },
          { label: "Margem Bruta", value: "32,4%", accent: "#31C65B" },
          { label: "PIX no Mes", value: "R$ 12.480", accent: "#00B6C9" }
        ]}
        rows={[
          ["Vendas por Periodo", "Disponivel", "31 dias", "Ctrl+1"],
          ["Pagamentos por Metodo", "Disponivel", "12 metodos", "Ctrl+2"],
          ["Curva ABC Produtos", "Em geracao", "Ultimo sync", "Ctrl+3"]
        ]}
      />
    </AppPageShell>
  );
}
