import Link from "next/link";
import { AuthForm } from "../../components/auth-form";

export default function RegisterPage() {
  return (
    <main className="auth-shell">
      <section className="auth-aside">
        <span className="landing-kicker">Onboarding</span>
        <h1>Crie sua conta e saia com empresa, loja e primeiro PDV prontos.</h1>
        <p>Esse fluxo ja provisiona o ambiente base para o painel web e para o desktop sincronizado.</p>
        <div className="auth-aside-links">
          <Link href="/">Conhecer produto</Link>
          <Link href="/login">Ja tenho conta</Link>
        </div>
      </section>
      <section className="auth-card">
        <h2>Criar ambiente</h2>
        <AuthForm mode="register" />
      </section>
    </main>
  );
}
