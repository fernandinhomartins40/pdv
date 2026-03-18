import Link from "next/link";
import { AuthForm } from "../../components/auth-form";

export default function ForgotPasswordPage() {
  return (
    <main className="auth-shell compact">
      <section className="auth-card">
        <h2>Recuperar acesso</h2>
        <p className="auth-intro">Informe seu e-mail para gerar um link de redefinicao.</p>
        <AuthForm mode="forgot" />
        <div className="auth-links standalone">
          <Link href="/login">Voltar para login</Link>
        </div>
      </section>
    </main>
  );
}
