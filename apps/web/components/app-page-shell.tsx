import type { ReactNode } from "react";
import { requireSession } from "../lib/auth";
import { AdminShell } from "./admin-shell";

export async function AppPageShell({ children }: { children: ReactNode }) {
  const session = await requireSession();

  return <AdminShell session={session}>{children}</AdminShell>;
}
