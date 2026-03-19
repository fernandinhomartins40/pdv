import Link from "next/link";
import { AuthForm } from "../../components/auth-form";

export default function LoginPage() {
  return (
    <main className="auth-shell">
      <section className="auth-aside">
        <span className="landing-kicker">Entrar</span>
        <h1>Continue de onde sua operação parou.</h1>
        <p>Use sua conta para acessar empresas, lojas e PDVs vinculados ao seu usuário.</p>
        <div className="auth-aside-links">
          <Link href="/">Voltar para a landing</Link>
          <Link href="/registro">Criar conta</Link>
        </div>
      </section>
      <section className="auth-card">
        <h2>Acessar painel</h2>
        <AuthForm mode="login" />
      </section>
    </main>
  );
}
