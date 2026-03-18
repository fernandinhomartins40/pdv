import type { CSSProperties, PropsWithChildren } from "react";
import { palette, radii } from "../styles/tokens";

export interface BadgeProps extends PropsWithChildren {
  accent?: string;
  style?: CSSProperties;
}

export function Badge({ children, accent = palette.backgroundEnd, style }: BadgeProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 34,
        padding: "6px 14px",
        borderRadius: radii.pill,
        background: accent,
        color: "#FFFFFF",
        fontWeight: 800,
        fontSize: 14,
        ...style
      }}
    >
      {children}
    </span>
  );
}
