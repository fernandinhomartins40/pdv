import Link from "next/link";
import { AuthForm } from "../../components/auth-form";

export default async function VerifyEmailPage({
  searchParams
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params.token ?? "";

  return (
    <main className="auth-shell compact">
      <section className="auth-card">
        <h2>Confirmar e-mail</h2>
        <p className="auth-intro">Valide seu e-mail para reforcar a seguranca da conta.</p>
        {token ? <AuthForm mode="verify" token={token} /> : <p className="auth-message error">Token ausente ou invalido.</p>}
        <div className="auth-links standalone">
          <Link href="/dashboard">Ir para o painel</Link>
        </div>
      </section>
    </main>
  );
}
