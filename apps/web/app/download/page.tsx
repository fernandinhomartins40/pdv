import Link from "next/link";
import { ArrowDownToLine, LaptopMinimal, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";

const checks = [
  "Instalador oficial hospedado na infraestrutura da Revendeo",
  "Arquivo substituído automaticamente quando houver nova versão do desktop",
  "Link fixo para distribuir ao cliente sem trocar URL a cada deploy"
];

export default function DownloadPage() {
  return (
    <main
      className="min-h-screen px-6 py-8 text-[#111827] lg:px-8"
      style={{
        background:
          "radial-gradient(circle at 8% 0%, rgba(30,167,255,0.18), transparent 22%), radial-gradient(circle at 88% 8%, rgba(135,88,226,0.18), transparent 24%), radial-gradient(circle at 72% 82%, rgba(212,46,181,0.12), transparent 18%), linear-gradient(180deg, #f5f8fc, #ecf2f8)"
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-[#101726]/8 bg-white/82 p-6 shadow-ink backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Badge variant="accent" className="w-fit">
              Download oficial
            </Badge>
            <div>
              <h1 className="font-display text-4xl tracking-[-0.04em] md:text-5xl">Baixe o instalador do PDV Revendeo.</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[#667085]">
                Esta página centraliza o executável mais recente do desktop para instalação em caixas e terminais Windows.
              </p>
            </div>
          </div>

          <Button asChild variant="default" size="lg">
            <Link href="/login">Ir para login</Link>
          </Button>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="overflow-hidden rounded-[2.5rem] border-0 bg-[linear-gradient(145deg,#101726,#23194d_58%,#d42eb5)] text-white shadow-float">
            <CardHeader className="space-y-4">
              <Badge variant="outline" className="w-fit border-white/15 bg-white/10 text-white">
                Instalador Windows
              </Badge>
              <CardTitle className="text-4xl text-white md:text-5xl">Um link fixo para colocar o PDV em operação.</CardTitle>
              <CardDescription className="max-w-xl text-base leading-7 text-white/80">
                O executável publicado aqui é atualizado pelo workflow de deploy sempre que houver mudanças relevantes no app desktop
                ou quando ainda não existir instalador hospedado na VPS.
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
                <div className="flex size-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1ea7ff,#8758e2_58%,#d42eb5)]">
                  <LaptopMinimal className="size-5 text-white" />
                </div>
                <CardTitle className="text-2xl">Pensado para distribuição simples</CardTitle>
                <CardDescription className="text-base leading-7">
                  O arquivo publicado usa um nome estável, sem precisar reenviar uma URL diferente a cada release.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="rounded-[2rem] bg-white">
              <CardHeader className="space-y-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-[#eef4fb]">
                  <ShieldCheck className="size-5 text-[#8758e2]" />
                </div>
                <CardTitle className="text-2xl">Fluxo controlado pelo deploy</CardTitle>
                <CardDescription className="text-base leading-7">
                  O job remove o executável antigo da VPS antes de publicar o novo, mantendo apenas a versão vigente para download.
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
            <CardTitle className="text-3xl">Distribuição previsível para clientes e equipes de implantação.</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {checks.map((item) => (
              <div key={item} className="rounded-[1.75rem] border border-[#101726]/8 bg-[linear-gradient(180deg,#ffffff,#f3f7fc)] p-5">
                <Sparkles className="mb-4 size-5 text-[#d42eb5]" />
                <p className="text-sm leading-7 text-[#667085]">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
