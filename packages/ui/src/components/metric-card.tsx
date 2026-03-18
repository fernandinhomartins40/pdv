import { Badge } from "./badge";

export interface MetricCardProps {
  label: string;
  count: number | string;
  amount: string;
  accent: string;
}

export function MetricCard({ label, count, amount, accent }: MetricCardProps) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 140,
        display: "grid",
        gap: 14,
        justifyItems: "center",
        padding: "0 12px"
      }}
    >
      <strong style={{ color: accent, fontSize: 18 }}>{label}</strong>
      <span style={{ fontSize: 60, lineHeight: 1, fontWeight: 800, color: accent }}>{count}</span>
      <Badge accent={accent}>{amount}</Badge>
      <button
        type="button"
        style={{
          border: "none",
          background: "transparent",
          color: accent,
          fontWeight: 700,
          cursor: "pointer"
        }}
      >
        Visualizar
      </button>
    </div>
  );
}
