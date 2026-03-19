"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type AuthMode = "login" | "register" | "forgot" | "reset" | "verify";

interface AuthFormProps {
  mode: AuthMode;
  token?: string;
}

function getApiBase() {
  return process.env.NEXT_PUBLIC_API_URL ?? "/v1";
}

export function AuthForm({ mode, token }: AuthFormProps) {
  const router = useRouter();
  const apiBase = useMemo(() => getApiBase(), []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setPreviewUrl(null);

    const form = new FormData(event.currentTarget);

    try {
      let endpoint = "";
      let payload: Record<string, unknown> = {};

      if (mode === "login") {
        endpoint = "/auth/login";
        payload = {
          email: String(form.get("email") ?? ""),
          password: String(form.get("password") ?? "")
        };
      }

      if (mode === "register") {
        endpoint = "/auth/register";
        payload = {
          name: String(form.get("name") ?? ""),
          email: String(form.get("email") ?? ""),
          password: String(form.get("password") ?? ""),
          organizationName: String(form.get("organizationName") ?? ""),
          storeName: String(form.get("storeName") ?? ""),
          terminalName: String(form.get("terminalName") ?? "")
        };
      }

      if (mode === "forgot") {
        endpoint = "/auth/password/forgot";
        payload = {
          email: String(form.get("email") ?? "")
        };
      }

      if (mode === "reset") {
        endpoint = "/auth/password/reset";
        payload = {
          token,
          password: String(form.get("password") ?? "")
        };
      }

      if (mode === "verify") {
        endpoint = "/auth/verify-email/confirm";
        payload = {
          token
        };
      }

      const response = await fetch(`${apiBase}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
        verification?: { url?: string };
        reset?: { url?: string };
      };

      if (!response.ok) {
        throw new Error(data.message || "Não foi possível concluir a operação.");
      }

      if (mode === "login" || mode === "register") {
        if (data.verification?.url) {
          setPreviewUrl(data.verification.url);
        }

        router.push("/dashboard");
        router.refresh();
        return;
      }

      if (mode === "forgot") {
        setSuccess("Se o e-mail existir, enviamos as instruções de redefinição.");
        setPreviewUrl(data.reset?.url ?? null);
        return;
      }

      if (mode === "reset") {
        setSuccess("Senha redefinida. Você já pode entrar.");
        router.push("/login");
        return;
      }

      if (mode === "verify") {
        setSuccess("E-mail confirmado com sucesso.");
        router.push("/dashboard");
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Falha inesperada.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {mode === "register" ? (
        <>
          <label className="auth-field">
            <span>Seu nome</span>
            <input name="name" placeholder="Fernanda Martins" required />
          </label>
          <label className="auth-field">
            <span>E-mail</span>
            <input name="email" type="email" placeholder="voce@empresa.com.br" required />
          </label>
          <label className="auth-field">
            <span>Senha</span>
            <input name="password" type="password" minLength={8} placeholder="Mínimo de 8 caracteres" required />
          </label>
          <label className="auth-field">
            <span>Empresa</span>
            <input name="organizationName" placeholder="Revendeo Matriz" required />
          </label>
          <label className="auth-field">
            <span>Primeira loja</span>
            <input name="storeName" placeholder="Loja Centro" required />
          </label>
          <label className="auth-field">
            <span>Primeiro PDV</span>
            <input name="terminalName" placeholder="Caixa 01" required />
          </label>
        </>
      ) : null}

      {mode === "login" ? (
        <>
          <label className="auth-field">
            <span>E-mail</span>
            <input name="email" type="email" placeholder="voce@empresa.com.br" required />
          </label>
          <label className="auth-field">
            <span>Senha</span>
            <input name="password" type="password" minLength={8} placeholder="Sua senha" required />
          </label>
        </>
      ) : null}

      {mode === "forgot" ? (
        <label className="auth-field">
          <span>E-mail</span>
          <input name="email" type="email" placeholder="voce@empresa.com.br" required />
        </label>
      ) : null}

      {mode === "reset" ? (
        <label className="auth-field">
          <span>Nova senha</span>
          <input name="password" type="password" minLength={8} placeholder="Crie uma nova senha" required />
        </label>
      ) : null}

      {error ? <div className="auth-message error">{error}</div> : null}
      {success ? <div className="auth-message success">{success}</div> : null}
      {previewUrl ? (
        <div className="auth-message info">
          Link gerado:{" "}
          <a href={previewUrl} target="_blank" rel="noreferrer">
            {previewUrl}
          </a>
        </div>
      ) : null}

      <button type="submit" className="auth-submit" disabled={loading}>
        {loading ? "Processando..." : mode === "login" ? "Entrar" : null}
        {!loading && mode === "register" ? "Criar conta e ambiente" : null}
        {!loading && mode === "forgot" ? "Enviar instrucoes" : null}
        {!loading && mode === "reset" ? "Salvar nova senha" : null}
        {!loading && mode === "verify" ? "Confirmar e-mail" : null}
      </button>

      {mode === "login" ? (
        <div className="auth-links">
          <Link href="/esqueci-a-senha">Esqueci minha senha</Link>
          <Link href="/registro">Criar conta</Link>
        </div>
      ) : null}

      {mode === "register" ? (
        <div className="auth-links">
          <Link href="/login">Já tenho conta</Link>
        </div>
      ) : null}
    </form>
  );
}
