import { Bell, Building2, CircleHelp, Cloud, LogOut, ShieldCheck, Store, UserCircle2 } from "lucide-react";
import type { AuthContext } from "@pdv/types";
import { logoutAction, switchContextAction } from "../app/actions/auth";

interface AdminTopbarProps {
  session: AuthContext;
}

export function AdminTopbar({ session }: AdminTopbarProps) {
  return (
    <header className="admin-topbar">
      <div className="topbar-brand">
        <strong>Revendeo Cloud</strong>
        <span className="topbar-chip">SaaS multiempresa</span>
        <span className="topbar-chip">
          <CircleHelp size={16} />
          Onboarding ativo
        </span>
      </div>
      <div className="topbar-meta">
        <span className="topbar-chip">
          <ShieldCheck size={16} />
          {session.emailVerified ? "Conta verificada" : "Verificacao pendente"}
        </span>
        <span className="topbar-chip">
          <Cloud size={16} />
          Sessao expira em {new Date(session.session.expiresAt).toLocaleDateString("pt-BR")}
        </span>
        <span className="topbar-chip">
          <UserCircle2 size={16} />
          {session.user.email}
        </span>
        <span className="topbar-chip">
          <Bell size={16} />
          {session.terminals.length} PDV(s) disponivel(is)
        </span>
      </div>

      <form action={switchContextAction} className="context-switcher">
        <label className="context-field">
          <span>
            <Building2 size={14} />
            Empresa
          </span>
          <select name="organizationId" defaultValue={session.activeOrganizationId}>
            {session.organizations.map((organization) => (
              <option key={organization.id} value={organization.id}>
                {organization.name}
              </option>
            ))}
          </select>
        </label>
        <label className="context-field">
          <span>
            <Store size={14} />
            Loja
          </span>
          <select name="storeId" defaultValue={session.activeStoreId ?? ""}>
            {session.stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name} · {store.code}
              </option>
            ))}
          </select>
        </label>
        <label className="context-field">
          <span>PDV</span>
          <select name="terminalId" defaultValue={session.activeTerminalId ?? ""}>
            <option value="">Selecionar depois</option>
            {session.terminals.map((terminal) => (
              <option key={terminal.id} value={terminal.id}>
                {terminal.name}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="topbar-button secondary">
          Trocar contexto
        </button>
      </form>

      <form action={logoutAction} className="topbar-logout">
        <button type="submit" className="topbar-button primary">
          <LogOut size={16} />
          Sair
        </button>
      </form>
    </header>
  );
}
