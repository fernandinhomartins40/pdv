import { Bell, CircleHelp, Cloud, Cog, ShieldCheck, UserCircle2 } from "lucide-react";

export function AdminTopbar() {
  return (
    <header className="admin-topbar">
      <div className="topbar-brand">
        <strong>SIGE Lite</strong>
        <span className="topbar-chip">Versão Cloud</span>
        <span className="topbar-chip">
          <CircleHelp size={16} />
          Central de Ajuda
        </span>
      </div>
      <div className="topbar-meta">
        <span className="topbar-chip">
          <ShieldCheck size={16} />
          Sistema Atualizado
        </span>
        <span className="topbar-chip">
          <Cloud size={16} />
          Cloud Sync Ativado
        </span>
        <span className="topbar-chip">
          <UserCircle2 size={16} />
          financeiro@loja.com
        </span>
        <span className="topbar-chip">
          <Bell size={16} />
          Notificações
        </span>
        <span className="topbar-chip">
          <Cog size={16} />
          Configurações
        </span>
      </div>
    </header>
  );
}
