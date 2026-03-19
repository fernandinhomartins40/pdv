import Link from "next/link";
import { AuthForm } from "../../components/auth-form";

export default function LoginPage() {
  return (
    <main className="auth-shell">
      <section className="auth-aside">
        <span className="landing-kicker">Entrar</span>
        <h1>Continue de onde sua operacao parou.</h1>
        <p>Use sua conta para acessar empresas, lojas e PDVs vinculados ao seu usuario com a mesma assinatura visual do produto inteiro.</p>
        <div className="auth-preview-grid">
          <article className="auth-preview-card dark">
            <strong>Mesmo contraste</strong>
            <span>Login, painel e PDV agora compartilham grafite profundo, superficies claras e gradiente de marca.</span>
          </article>
          <article className="auth-preview-card">
            <strong>Entrada clara</strong>
            <span>O usuario entende que esta entrando no mesmo sistema, nao em uma tela paralela.</span>
          </article>
        </div>
        <div className="auth-proof-list">
          <span>Cloud + desktop</span>
          <span>Login coerente</span>
          <span>Multiempresa</span>
        </div>
        <div className="auth-aside-links">
          <Link href="/">Voltar para a landing</Link>
          <Link href="/registro">Criar conta</Link>
        </div>
      </section>
      <section className="auth-card">
        <h2>Acessar painel</h2>
        <p className="auth-intro">Entre no mesmo ambiente visual que organiza landing, retaguarda e operacao do caixa.</p>
        <AuthForm mode="login" />
      </section>
    </main>
  );
}
