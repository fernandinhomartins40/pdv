import { Badge, Button, Card } from "@pdv/ui";

interface ModulePageProps {
  title: string;
  description: string;
  stats: Array<{ label: string; value: string; accent: string }>;
  rows: Array<[string, string, string, string]>;
}

export function ModulePage({ title, description, stats, rows }: ModulePageProps) {
  return (
    <section className="module-grid">
      <Card className="surface-card">
        <div style={{ display: "grid", gap: 10 }}>
          <h1 style={{ margin: 0, fontSize: "2rem" }}>{title}</h1>
          <p className="muted" style={{ margin: 0 }}>{description}</p>
        </div>
        <div className="module-toolbar" style={{ marginTop: 24 }}>
          <Button variant="primary" shortcut="Ctrl+N" style={{ width: "auto", minWidth: 220 }}>
            Novo Registro
          </Button>
          <Button variant="secondary" shortcut="Ctrl+F" style={{ width: "auto", minWidth: 220 }}>
            Buscar
          </Button>
          <Button variant="success" shortcut="Ctrl+S" style={{ width: "auto", minWidth: 220 }}>
            Sincronizar
          </Button>
        </div>
      </Card>

      <div className="metrics-grid">
        {stats.map((stat) => (
          <Card key={stat.label} className="surface-card" style={{ flex: 1, minWidth: 210, display: "grid", gap: 10 }}>
            <span className="muted">{stat.label}</span>
            <strong style={{ color: stat.accent, fontSize: "2rem" }}>{stat.value}</strong>
            <Badge accent={stat.accent}>Atualizado em tempo real</Badge>
          </Card>
        ))}
      </div>

      <Card className="surface-card">
        <div className="module-table">
          <div
            className="module-row"
            style={{ background: "linear-gradient(135deg, #101726, #24194e 58%, #d42eb5)", color: "white", fontWeight: 700 }}
          >
            <span>Descrição</span>
            <span>Status</span>
            <span>Valor</span>
            <span>Atalho</span>
          </div>
          {rows.map((row) => (
            <div key={row.join("-")} className="module-row">
              <strong>{row[0]}</strong>
              <span>{row[1]}</span>
              <strong>{row[2]}</strong>
              <span>{row[3]}</span>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
