import { AppPageShell } from "../../components/app-page-shell";
import { ModulePage } from "../../components/module-page";

export default function FinanceiroPage() {
  return (
    <AppPageShell>
      <ModulePage
        title="Financeiro"
        description="Contas a pagar, contas a receber, conciliacao e visao consolidada por forma de pagamento."
        stats={[
          { label: "A Receber", value: "R$ 28.430", accent: "#31C65B" },
          { label: "A Pagar", value: "R$ 17.920", accent: "#EF4F5F" },
          { label: "Saldo Projetado", value: "R$ 10.510", accent: "#6B2EFF" }
        ]}
        rows={[
          ["Recebiveis PIX", "Previsto", "R$ 6.200", "Ctrl+P"],
          ["Fornecedores", "Em aberto", "R$ 9.740", "Ctrl+F"],
          ["Conciliacao Cartao", "Parcial", "R$ 12.480", "Ctrl+C"]
        ]}
      />
    </AppPageShell>
  );
}
