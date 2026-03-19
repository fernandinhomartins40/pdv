import type { SaleStep } from "@pdv/types";
import { saleSteps } from "@pdv/types";
import { palette } from "../styles/tokens";

export function Stepper({ activeStep }: { activeStep: SaleStep }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        flexWrap: "wrap",
        gap: "clamp(16px, 2.4vw, 36px)",
        rowGap: 10,
        maxWidth: "100%",
        color: palette.text
      }}
    >
      {saleSteps.map((step) => {
        const active = step.id === activeStep;
        return (
          <div key={step.id} style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700, minWidth: 0 }}>
            <span
              style={{
                width: 18,
                height: 18,
                flex: "0 0 auto",
                borderRadius: 999,
                border: `2px solid ${active ? palette.primary : palette.border}`,
                background: active ? palette.gradientBrand : "rgba(255, 255, 255, 0.74)",
                boxShadow: active ? "0 0 0 6px rgba(30, 167, 255, 0.14)" : "none"
              }}
            />
            <span
              style={{
                opacity: active ? 1 : 0.76,
                fontSize: "clamp(0.92rem, 1.1vw, 1.08rem)",
                whiteSpace: "nowrap"
              }}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
