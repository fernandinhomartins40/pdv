import { AppPageShell } from "../../components/app-page-shell";
import { ModulePage } from "../../components/module-page";

export default function RelatóriosPage() {
  return (
    <AppPageShell>
      <ModulePage
        title="Relatórios"
        description="Consolidação por período, operador, forma de pagamento e comportamento de vendas com exportação analítica."
        stats={[
          { label: "Ticket Médio", value: "R$ 68,20", accent: "#6B2EFF" },
          { label: "Margem Bruta", value: "32,4%", accent: "#31C65B" },
          { label: "PIX no Mês", value: "R$ 12.480", accent: "#00B6C9" }
        ]}
        rows={[
          ["Vendas por Período", "Disponível", "31 dias", "Ctrl+1"],
          ["Pagamentos por Método", "Disponível", "12 métodos", "Ctrl+2"],
          ["Curva ABC Produtos", "Em geração", "Último sync", "Ctrl+3"]
        ]}
      />
    </AppPageShell>
  );
}
