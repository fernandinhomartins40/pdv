import Link from "next/link";
import { AuthForm } from "../../components/auth-form";

export default async function ResetPasswordPage({
  searchParams
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params.token ?? "";

  return (
    <main className="auth-shell compact">
      <section className="auth-card">
        <h2>Nova senha</h2>
        <p className="auth-intro">Defina uma nova senha para continuar usando o painel.</p>
        {token ? <AuthForm mode="reset" token={token} /> : <p className="auth-message error">Token ausente ou invalido.</p>}
        <div className="auth-links standalone">
          <Link href="/login">Voltar para login</Link>
        </div>
      </section>
    </main>
  );
}
