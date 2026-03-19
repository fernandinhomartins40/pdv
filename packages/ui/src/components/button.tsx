import type { CSSProperties, PropsWithChildren } from "react";
import { palette, radii } from "../styles/tokens";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "cash"
  | "pix"
  | "credit"
  | "debit"
  | "ghost"
  | "danger";

const backgroundByVariant: Record<ButtonVariant, string> = {
  primary: palette.gradientBrand,
  secondary: "rgba(255, 255, 255, 0.82)",
  success: "linear-gradient(135deg, rgba(43, 193, 116, 0.98), rgba(18, 137, 93, 0.98))",
  cash: palette.cash,
  pix: palette.pix,
  credit: palette.credit,
  debit: "linear-gradient(135deg, var(--color-accent-violet), var(--color-accent-magenta))",
  ghost: "rgba(255, 255, 255, 0.52)",
  danger: "rgba(235, 91, 116, 0.14)"
};

const textByVariant: Record<ButtonVariant, string> = {
  primary: "#FFFFFF",
  secondary: palette.text,
  success: "#FFFFFF",
  cash: "#FFFFFF",
  pix: "#FFFFFF",
  credit: "#FFFFFF",
  debit: "#FFFFFF",
  ghost: palette.text,
  danger: palette.danger
};

export interface ButtonProps extends PropsWithChildren {
  variant?: ButtonVariant;
  shortcut?: string;
  style?: CSSProperties;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function Button({
  children,
  variant = "primary",
  shortcut,
  style,
  className,
  onClick,
  disabled,
  type = "button"
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        width: "100%",
        padding: "16px 18px",
        borderRadius: radii.button,
        border:
          variant === "ghost" || variant === "secondary" || variant === "danger"
            ? `1px solid ${palette.border}`
            : "none",
        background: backgroundByVariant[variant],
        color: textByVariant[variant],
        fontWeight: 700,
        letterSpacing: "-0.01em",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        boxShadow:
          variant === "ghost" || variant === "danger"
            ? "none"
            : "0 16px 42px rgba(38, 70, 115, 0.16)",
        backdropFilter: variant === "secondary" || variant === "ghost" ? "blur(16px)" : undefined,
        transition: "transform 140ms ease, box-shadow 140ms ease, opacity 140ms ease",
        ...style
      }}
    >
      <span>{children}</span>
      {shortcut ? (
        <span style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.92 }}>
          {shortcut}
        </span>
      ) : null}
    </button>
  );
}
