import { AppPageShell } from "../../components/app-page-shell";
import { ModulePage } from "../../components/module-page";

export default function PedidosPage() {
  return (
    <AppPageShell>
      <ModulePage
        title="Pedidos"
        description="Fila operacional para acompanhamento de pedidos presenciais, delivery e integracoes com canais externos."
        stats={[
          { label: "Em Aberto", value: "12", accent: "#FF7A1A" },
          { label: "Confirmados", value: "48", accent: "#31C65B" },
          { label: "Tempo Medio", value: "11 min", accent: "#6B2EFF" }
        ]}
        rows={[
          ["Pedido #1042", "Aguardando confirmacao", "R$ 92,10", "F1"],
          ["Pedido #1043", "Em producao", "R$ 54,80", "F2"],
          ["Pedido #1044", "Concluido", "R$ 18,90", "F3"]
        ]}
      />
    </AppPageShell>
  );
}
