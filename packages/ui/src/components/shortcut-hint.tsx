import type { CSSProperties } from "react";

export function ShortcutHint({ label, style }: { label: string; style?: CSSProperties }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 34,
        padding: "4px 8px",
        borderRadius: 999,
        border: "1px solid rgba(255, 255, 255, 0.2)",
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        ...style
      }}
    >
      {label}
    </span>
  );
}
