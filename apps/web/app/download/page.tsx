import Link from "next/link";
import { ArrowDownToLine, LaptopMinimal, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";

const checks = [
  "Instalador oficial hospedado na infraestrutura da Revendeo",
  "Arquivo substituido automaticamente quando houver nova versao do desktop",
  "Link fixo para distribuir ao cliente sem trocar URL a cada deploy"
];

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-[#f4efe8] px-6 py-8 text-stone-950 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-stone-950/10 bg-white/85 p-6 shadow-ink backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Badge variant="accent" className="w-fit">
              Download oficial
            </Badge>
            <div>
              <h1 className="font-display text-4xl tracking-[-0.04em] md:text-5xl">Baixe o instalador do PDV Revendeo.</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
                Esta pagina centraliza o executavel mais recente do desktop para instalacao em caixas e terminais Windows.
              </p>
            </div>
          </div>

          <Button asChild variant="default" size="lg">
            <Link href="/login">Ir para login</Link>
          </Button>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="overflow-hidden rounded-[2.5rem] border-0 bg-[linear-gradient(135deg,#171411,#3b2418_60%,#d46d44)] text-white shadow-float">
            <CardHeader className="space-y-4">
              <Badge variant="outline" className="w-fit border-white/15 bg-white/10 text-white">
                Instalador Windows
              </Badge>
              <CardTitle className="text-4xl text-white md:text-5xl">Um link fixo para colocar o PDV em operacao.</CardTitle>
              <CardDescription className="max-w-xl text-base leading-7 text-white/80">
                O executavel publicado aqui e atualizado pelo workflow de deploy sempre que houver mudancas relevantes no app desktop
                ou quando ainda nao existir instalador hospedado na VPS.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 sm:flex-row">
              <Button asChild variant="secondary" size="lg">
                <a href="/downloads/revendeo-pdv-installer.exe">
                  <ArrowDownToLine className="size-4" />
                  Baixar instalador
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 hover:text-white">
                <Link href="/">Voltar para a landing</Link>
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-5">
            <Card className="rounded-[2rem] bg-white">
              <CardHeader className="space-y-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-[#f7d7a8]">
                  <LaptopMinimal className="size-5 text-stone-950" />
                </div>
                <CardTitle className="text-2xl">Pensado para distribuicao simples</CardTitle>
                <CardDescription className="text-base leading-7">
                  O arquivo publicado usa um nome estavel, sem precisar reenviar uma URL diferente a cada release.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="rounded-[2rem] bg-white">
              <CardHeader className="space-y-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-[#d9d4ff]">
                  <ShieldCheck className="size-5 text-stone-950" />
                </div>
                <CardTitle className="text-2xl">Fluxo controlado pelo deploy</CardTitle>
                <CardDescription className="text-base leading-7">
                  O job remove o executavel antigo da VPS antes de publicar o novo, mantendo apenas a versao vigente para download.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        <Card className="rounded-[2.25rem] bg-white">
          <CardHeader className="space-y-4">
            <Badge variant="outline" className="w-fit">
              O que este link garante
            </Badge>
            <CardTitle className="text-3xl">Distribuicao previsivel para clientes e equipes de implantacao.</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {checks.map((item) => (
              <div key={item} className="rounded-[1.75rem] border border-stone-950/10 bg-[#faf7f2] p-5">
                <Sparkles className="mb-4 size-5 text-[#d46d44]" />
                <p className="text-sm leading-7 text-stone-700">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
