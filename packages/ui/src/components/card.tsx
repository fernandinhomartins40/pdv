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
        boxShadow: palette.shadow,
        padding: 24,
        color: palette.text,
        ...style
      }}
    >
      {children}
    </section>
  );
}
