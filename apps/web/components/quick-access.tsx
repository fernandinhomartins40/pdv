import Link from "next/link";

const links = [
  { href: "/pedidos", overline: "Acessar", label: "Pedidos Foods" },
  { href: "/produtos", overline: "Acessar", label: "Produtos" },
  { href: "/estoque", overline: "Acessar", label: "Estoque" },
  { href: "/financeiro", overline: "Contas", label: "A Receber" },
  { href: "/financeiro", overline: "Contas", label: "A Pagar" }
];

export function QuickAccess() {
  return (
    <nav className="quick-access">
      {links.map((link) => (
        <Link key={link.label} href={link.href}>
          <span className="muted" style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>
            {link.overline}
          </span>
          <strong>{link.label}</strong>
        </Link>
      ))}
    </nav>
  );
}
