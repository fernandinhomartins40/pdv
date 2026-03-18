import { palette } from "../styles/tokens";

export function StatusDot({ online }: { online: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        width: 12,
        height: 12,
        borderRadius: 999,
        background: online ? palette.cash : palette.offline,
        boxShadow: online ? "0 0 0 6px rgba(59, 181, 74, 0.2)" : "none"
      }}
    />
  );
}
