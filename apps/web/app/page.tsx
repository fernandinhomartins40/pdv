import Link from "next/link";
import { ArrowRight, Building2, CloudCog, ShieldCheck, ShoppingBasket, Store } from "lucide-react";

const highlights = [
  {
    title: "Multiempresa de verdade",
    description: "Um usuario pode operar varias empresas, lojas e caixas com contexto isolado por tenant."
  },
  {
    title: "PDV desktop offline-first",
    description: "Vende localmente, sincroniza depois e mantem operacao mesmo quando a internet cai."
  },
  {
    title: "Painel cloud unico",
    description: "Produtos, estoque, vendas, caixa e onboarding centralizados no mesmo backoffice."
  }
];

const features = [
  {
    icon: Building2,
    label: "Organizacoes, lojas e PDVs",
    detail: "Estrutura pronta para matriz, filial, franquia e operacao com varios caixas."
  },
  {
    icon: CloudCog,
    label: "Sync bidirecional",
    detail: "Desktop e nuvem trabalham com fila local, cursor e reconciliacao operacional."
  },
  {
    icon: ShieldCheck,
    label: "Autenticacao e sessao",
    detail: "Conta, sessoes persistidas, troca de contexto e recuperacao de senha."
  },
  {
    icon: ShoppingBasket,
    label: "Operacao de varejo",
    detail: "Cadastro, estoque, vendas, XML e fluxo de caixa no mesmo produto."
  }
];

export default function LandingPage() {
  return (
    <main className="landing-shell">
      <section className="landing-hero">
        <div className="landing-copy">
          <span className="landing-kicker">SaaS para operacao comercial e PDV</span>
          <h1>Controle varias lojas e varios caixas sem quebrar a operacao da ponta.</h1>
          <p>
            Revendeo combina painel cloud multiusuario com PDV desktop offline-first, para quem precisa vender na loja e
            governar a operacao inteira em um unico sistema.
          </p>
          <div className="landing-actions">
            <Link href="/registro" className="landing-button primary">
              Criar ambiente
              <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="landing-button secondary">
              Entrar no painel
            </Link>
          </div>
          <div className="landing-proof">
            <span>Multiempresa</span>
            <span>Multi-PDV</span>
            <span>Cloud + Desktop</span>
          </div>
        </div>

        <div className="landing-panel">
          <div className="hero-card hero-card-large">
            <strong>Operacao ativa</strong>
            <div className="hero-grid">
              <div>
                <span>Empresas</span>
                <strong>12</strong>
              </div>
              <div>
                <span>Lojas</span>
                <strong>31</strong>
              </div>
              <div>
                <span>PDVs</span>
                <strong>86</strong>
              </div>
              <div>
                <span>Sync</span>
                <strong>99.94%</strong>
              </div>
            </div>
          </div>

          <div className="hero-card hero-card-stack">
            <div>
              <span className="muted-note">Fluxo recomendado</span>
              <strong>Conta → Empresa → Loja → PDV</strong>
            </div>
            <div className="hero-chip-row">
              <span className="hero-chip">Onboarding guiado</span>
              <span className="hero-chip">Sessao segura</span>
              <span className="hero-chip">Escala por tenant</span>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-strip">
        {highlights.map((item) => (
          <article key={item.title} className="landing-highlight">
            <strong>{item.title}</strong>
            <p>{item.description}</p>
          </article>
        ))}
      </section>

      <section className="landing-features">
        <div className="landing-section-head">
          <span className="landing-kicker">Base de produto</span>
          <h2>O sistema ja nasce pensando em tenant, loja e terminal.</h2>
        </div>

        <div className="feature-grid">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.label} className="feature-card">
                <div className="feature-icon">
                  <Icon size={20} />
                </div>
                <strong>{feature.label}</strong>
                <p>{feature.detail}</p>
              </article>
            );
          })}
        </div>

        <div className="landing-cta-card">
          <div>
            <span className="landing-kicker">Primeiro passo</span>
            <h3>Crie agora sua conta, a primeira loja e o primeiro caixa.</h3>
          </div>
          <Link href="/registro" className="landing-button primary">
            Iniciar onboarding
          </Link>
        </div>
      </section>
    </main>
  );
}
