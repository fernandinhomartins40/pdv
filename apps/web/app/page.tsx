import Link from "next/link";
import { ArrowRight, Building2, CloudCog, Receipt, ShieldCheck, ShoppingBasket, Store } from "lucide-react";

const highlights = [
  {
    title: "Vendas sem parar",
    description: "O PDV continua operando mesmo sem internet e sincroniza assim que a conexao volta."
  },
  {
    title: "Gestao centralizada",
    description: "Produtos, estoque, caixa, usuarios, lojas e PDVs no mesmo backoffice."
  },
  {
    title: "Escala sem improviso",
    description: "Estrutura preparada para multiempresa, varias lojas e varios caixas por operacao."
  }
];

const features = [
  {
    icon: Building2,
    label: "Multiempresa e multiunidade",
    detail: "Controle filiais, franquias e grupos comerciais com isolamento por tenant."
  },
  {
    icon: Store,
    label: "Mais de um PDV por usuario",
    detail: "Um mesmo operador ou gestor pode trocar de contexto entre lojas e terminais."
  },
  {
    icon: CloudCog,
    label: "Cloud + desktop",
    detail: "Painel web para gestao e aplicativo desktop para operacao de caixa offline-first."
  },
  {
    icon: ShieldCheck,
    label: "Autenticacao e contexto",
    detail: "Login, sessao, troca de empresa, loja e PDV com base preparada para escalar com seguranca."
  },
  {
    icon: Receipt,
    label: "Fluxo de venda de varejo",
    detail: "Catalogo, estoque, XML, pagamentos, caixa e consolidacao operacional no mesmo produto."
  },
  {
    icon: ShoppingBasket,
    label: "Operacao orientada a resultado",
    detail: "Menos ruptura, mais controle de estoque e visao clara do que acontece na ponta."
  }
];

const results = [
  { value: "99,9%", label: "continuidade operacional com sync assincrono" },
  { value: "1 painel", label: "para governar lojas, caixas e equipes" },
  { value: "0 planilhas", label: "para controlar estoque e contexto de operacao" }
];

export default function LandingPage() {
  return (
    <main className="landing-shell">
      <header className="landing-nav">
        <div className="landing-brand">
          <span className="landing-brand-mark">R</span>
          <div>
            <strong>Revendeo</strong>
            <span>SaaS de operacao comercial</span>
          </div>
        </div>
        <nav className="landing-nav-links">
          <a href="#produto">Produto</a>
          <a href="#beneficios">Beneficios</a>
          <a href="#cta-final">Acessar</a>
        </nav>
        <Link href="/login" className="landing-button nav">
          Entrar
        </Link>
      </header>

      <section className="landing-hero" id="produto">
        <div className="landing-copy">
          <span className="landing-kicker">PDV desktop + painel cloud para varejo</span>
          <h1>Venda na loja. Controle tudo na nuvem. Escale para varios PDVs sem perder o controle.</h1>
          <p>
            Revendeo foi desenhado para empresas que precisam operar no caixa com rapidez e, ao mesmo tempo, manter
            produtos, estoque, usuarios, lojas e resultados sob governanca central.
          </p>
          <div className="landing-actions">
            <Link href="/login" className="landing-button primary">
              Entrar no painel
              <ArrowRight size={18} />
            </Link>
            <Link href="/registro" className="landing-button secondary">
              Criar ambiente
            </Link>
          </div>
          <div className="landing-proof">
            <span>Offline-first</span>
            <span>Multiempresa</span>
            <span>Multi-PDV</span>
            <span>Painel cloud</span>
          </div>
        </div>

        <div className="landing-panel">
          <div className="hero-card hero-card-large">
            <strong>O que o produto resolve</strong>
            <div className="hero-grid">
              <div>
                <span>Gestao</span>
                <strong>Lojas e equipes</strong>
              </div>
              <div>
                <span>Operacao</span>
                <strong>Caixa com continuidade</strong>
              </div>
              <div>
                <span>Controle</span>
                <strong>Estoque e XML</strong>
              </div>
              <div>
                <span>Escala</span>
                <strong>Mais caixas sem retrabalho</strong>
              </div>
            </div>
          </div>

          <div className="hero-card hero-card-stack">
            <div>
              <span className="muted-note">Fluxo comercial</span>
              <strong>Conta -&gt; Empresa -&gt; Loja -&gt; PDV -&gt; Venda</strong>
            </div>
            <div className="hero-chip-row">
              <span className="hero-chip">Sync bidirecional</span>
              <span className="hero-chip">Contexto por tenant</span>
              <span className="hero-chip">Acesso web e desktop</span>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-results">
        {results.map((result) => (
          <article key={result.value} className="landing-result-card">
            <strong>{result.value}</strong>
            <span>{result.label}</span>
          </article>
        ))}
      </section>

      <section className="landing-strip">
        {highlights.map((item) => (
          <article key={item.title} className="landing-highlight">
            <strong>{item.title}</strong>
            <p>{item.description}</p>
          </article>
        ))}
      </section>

      <section className="landing-features" id="beneficios">
        <div className="landing-section-head">
          <span className="landing-kicker">Por que escolher</span>
          <h2>Um produto pensado para vender melhor e operar com menos atrito.</h2>
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

        <div className="landing-cta-card" id="cta-final">
          <div>
            <span className="landing-kicker">Comece agora</span>
            <h3>Acesse sua conta ou crie seu ambiente comercial em poucos minutos.</h3>
          </div>
          <div className="landing-actions">
            <Link href="/login" className="landing-button primary">
              Ir para login
            </Link>
            <Link href="/registro" className="landing-button secondary dark">
              Criar conta
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
