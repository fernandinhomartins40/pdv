import { Badge, Card, MetricCard } from "@pdv/ui";
import type { DashboardSnapshot } from "@pdv/types";

const snapshot: DashboardSnapshot = {
  soldOrders: [
    { label: "Mar 2026", count: 24, amount: 3450.8, accent: "#6B2EFF" },
    { label: "Este Mês", count: 31, amount: 4880.45, accent: "#8A4DFF" },
    { label: "Ontem", count: 9, amount: 780.5, accent: "#FF7A1A" },
    { label: "Hoje", count: 12, amount: 1150.9, accent: "#32C450" }
  ],
  pendingOrders: 2,
  tables: [
    { label: "1", status: "Ocupadas", totalAmount: 25 },
    { label: "2", status: "Ocupadas", totalAmount: 80 },
    { label: "18", status: "Livres", totalAmount: 0 }
  ],
  stockAlerts: [
    { productName: "Farinha Especial 5kg", quantity: -5, minStock: 5 },
    { productName: "Leite Integral 1L", quantity: 0, minStock: 8 },
    { productName: "Café Torrado 500g", quantity: 2, minStock: 10 }
  ]
};

const categories = ["Pizza Gourmet", "Bebidas", "Pastel", "Cafeteria", "Combos"];

function money(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function DashboardContent() {
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
          <h2 className="section-title">Pedidos por Quantidade</h2>
          <div className="accordion-list">
            {categories.map((category, index) => (
              <div key={category} className="accordion-item" style={{ gridTemplateColumns: "1fr auto" }}>
                <strong>{category}</strong>
                <span style={{ color: index % 2 === 0 ? "#8A4DFF" : "#FF7A1A", fontWeight: 900 }}>⌄</span>
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
            <strong style={{ fontSize: "1.05rem" }}>Novos pedidos para confirmar</strong>
          </div>
        </div>

        <Card className="surface-card">
          <h2 className="section-title">Mesas</h2>
          <div className="table-list">
            {snapshot.tables.map((table) => (
              <div key={table.label} className="table-item">
                <strong style={{ color: "#6B2EFF", fontSize: 32 }}>{table.label}</strong>
                <div>
                  <strong style={{ display: "block", color: table.status === "Livres" ? "#32C450" : "#6B2EFF" }}>{table.status}</strong>
                  <span className="muted">Total da mesa</span>
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
                  <span className="muted">Estoque mínimo: {alert.minStock}</span>
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
