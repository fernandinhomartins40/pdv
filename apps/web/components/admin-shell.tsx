import type { ReactNode } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";
import { QuickAccess } from "./quick-access";
import type { AuthContext } from "@pdv/types";

export function AdminShell({ children, session }: { children: ReactNode; session: AuthContext }) {
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <main className="admin-main">
        <AdminTopbar session={session} />
        <QuickAccess />
        {children}
      </main>
    </div>
  );
}
