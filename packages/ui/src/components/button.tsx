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
  primary: `linear-gradient(135deg, ${palette.backgroundStart}, ${palette.backgroundEnd})`,
  secondary: "rgba(255, 255, 255, 0.14)",
  success: palette.successDark,
  cash: palette.cash,
  pix: palette.pix,
  credit: palette.credit,
  debit: palette.debit,
  ghost: "transparent",
  danger: palette.danger
};

const textByVariant: Record<ButtonVariant, string> = {
  primary: "#FFFFFF",
  secondary: "#FFFFFF",
  success: "#FFFFFF",
  cash: "#FFFFFF",
  pix: "#FFFFFF",
  credit: "#FFFFFF",
  debit: "#FFFFFF",
  ghost: "#FFFFFF",
  danger: "#FFFFFF"
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
        border: variant === "ghost" ? `1px solid ${palette.border}` : "none",
        background: backgroundByVariant[variant],
        color: textByVariant[variant],
        fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        boxShadow: variant === "ghost" ? "none" : "0 12px 36px rgba(0, 0, 0, 0.16)",
        transition: "transform 140ms ease, box-shadow 140ms ease",
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
