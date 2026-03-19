import { Badge, Card, MetricCard } from "@pdv/ui";
import type { DashboardSnapshot } from "@pdv/types";

const categories = ["Venda consolidada", "Operacao do dia", "Estoque critico", "Caixa", "Sync"];

function money(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function DashboardContent({ snapshot }: { snapshot: DashboardSnapshot }) {
  return (
    <section className="content-grid">
      <div className="column">
        <Card className="surface-card">
          <h2 className="section-title">Pedidos Vendidos</h2>
          <div className="metrics-grid">
            {snapshot.soldOrders.map((metric) => (
              <MetricCard
                key={metric.label}
                label={metric.label}
                count={metric.count}
                amount={money(metric.amount)}
                accent={metric.accent}
              />
            ))}
          </div>
        </Card>

        <Card className="surface-card">
          <h2 className="section-title">Leituras Operacionais</h2>
          <div className="accordion-list">
            {categories.map((category, index) => (
              <div key={category} className="accordion-item" style={{ gridTemplateColumns: "1fr auto" }}>
                <strong>{category}</strong>
                <span style={{ color: index % 2 === 0 ? "#8758E2" : "#D42EB5", fontWeight: 900 }}>+</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="column">
        <div className="accent-banner">
          <div>
            <Badge accent="#9F1127" style={{ marginBottom: 10 }}>
              {snapshot.pendingOrders}
            </Badge>
            <strong style={{ fontSize: "1.05rem" }}>Pendencias operacionais para revisar</strong>
          </div>
        </div>

        <Card className="surface-card">
          <h2 className="section-title">Lojas/Pontos</h2>
          <div className="table-list">
            {snapshot.tables.map((table) => (
              <div key={table.label} className="table-item">
                <strong style={{ color: "#8758E2", fontSize: 32 }}>{table.label}</strong>
                <div>
                  <strong style={{ display: "block", color: table.status === "Livres" ? "#2BC174" : "#D42EB5" }}>{table.status}</strong>
                  <span className="muted">Volume monitorado</span>
                </div>
                <strong style={{ color: table.totalAmount > 0 ? "#31C65B" : "#A9A0B8" }}>{money(table.totalAmount)}</strong>
              </div>
            ))}
          </div>
        </Card>

        <Card className="surface-card">
          <h2 className="section-title">Alertas de Estoque</h2>
          <div className="stock-list">
            {snapshot.stockAlerts.map((alert) => (
              <div key={alert.productName} className="stock-item">
                <div>
                  <strong style={{ display: "block" }}>{alert.productName}</strong>
                  <span className="muted">Estoque minimo: {alert.minStock}</span>
                </div>
                <strong style={{ color: alert.quantity <= 0 ? "#EF4F5F" : "#FF7A1A", fontSize: 28 }}>{alert.quantity}</strong>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
