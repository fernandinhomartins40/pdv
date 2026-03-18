"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Boxes,
  Cloud,
  FileSpreadsheet,
  Headset,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Wallet
} from "lucide-react";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/produtos", label: "Produtos", icon: Package },
  { href: "/estoque", label: "Estoque", icon: Boxes },
  { href: "/financeiro", label: "Financeiro", icon: Wallet },
  { href: "/relatorios", label: "Relatórios", icon: BarChart3 },
  { href: "/importacao-xml", label: "Importação XML", icon: FileSpreadsheet },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
  { href: "/suporte", label: "Suporte", icon: Headset }
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">PDV</div>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.href} href={item.href} className={`sidebar-link ${pathname === item.href ? "active" : ""}`} title={item.label}>
            <Icon size={22} strokeWidth={2.1} />
          </Link>
        );
      })}
      <div className="sidebar-link" title="Cloud Sync">
        <Cloud size={22} strokeWidth={2.1} />
      </div>
    </aside>
  );
}
