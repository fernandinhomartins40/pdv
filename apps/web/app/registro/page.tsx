import Link from "next/link";
import { AuthForm } from "../../components/auth-form";

export default function RegisterPage() {
  return (
    <main className="auth-shell">
      <section className="auth-aside">
        <span className="landing-kicker">Onboarding</span>
        <h1>Crie sua conta e saia com empresa, loja e primeiro PDV prontos.</h1>
        <p>Esse fluxo ja provisiona o ambiente base para o painel web e para o desktop sincronizado com a mesma identidade visual.</p>
        <div className="auth-preview-grid">
          <article className="auth-preview-card dark">
            <strong>Provisionamento direto</strong>
            <span>Conta, empresa, loja e terminal entram no ar sem parecerem etapas de produtos diferentes.</span>
          </article>
          <article className="auth-preview-card">
            <strong>Paleta unificada</strong>
            <span>Azul, violeta, magenta, branco e grafite passam a conduzir a jornada de ponta a ponta.</span>
          </article>
        </div>
        <div className="auth-proof-list">
          <span>Conta + loja + PDV</span>
          <span>Setup inicial</span>
          <span>Desktop conectado</span>
        </div>
        <div className="auth-aside-links">
          <Link href="/">Conhecer produto</Link>
          <Link href="/login">Ja tenho conta</Link>
        </div>
      </section>
      <section className="auth-card">
        <h2>Criar ambiente</h2>
        <p className="auth-intro">Preencha os dados base e entre em um sistema que ja nasce com a mesma linguagem da operacao.</p>
        <AuthForm mode="register" />
      </section>
    </main>
  );
}
