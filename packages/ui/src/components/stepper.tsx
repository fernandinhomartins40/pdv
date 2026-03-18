import type { SaleStep } from "@pdv/types";
import { saleSteps } from "@pdv/types";

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
        color: "#FFFFFF"
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
                border: "2px solid #FFFFFF",
                background: active ? "#FFFFFF" : "transparent"
              }}
            />
            <span style={{ opacity: active ? 1 : 0.85, fontSize: "clamp(0.92rem, 1.1vw, 1.08rem)", whiteSpace: "nowrap" }}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
