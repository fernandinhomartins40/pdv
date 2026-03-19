import type { CSSProperties, PropsWithChildren } from "react";
import { palette, radii } from "../styles/tokens";

export interface CardProps extends PropsWithChildren {
  style?: CSSProperties;
  className?: string;
}

export function Card({ children, style, className }: CardProps) {
  return (
    <section
      className={className}
      style={{
        background: palette.panel,
        borderRadius: radii.card,
        border: `1px solid ${palette.border}`,
        boxShadow: palette.shadow,
        padding: 24,
        color: palette.text,
        backdropFilter: "blur(18px)",
        ...style
      }}
    >
      {children}
    </section>
  );
}
