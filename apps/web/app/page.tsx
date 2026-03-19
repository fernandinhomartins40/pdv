import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  Building2,
  CheckCircle2,
  ChevronRight,
  Cloud,
  MonitorSmartphone,
  Receipt,
  ShieldCheck,
  Store,
  Users2,
  WifiOff
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

const proof = [
  { value: "Multiempresa", label: "uma conta pode operar varias lojas e caixas" },
  { value: "Offline-first", label: "o caixa continua vendendo mesmo sem internet" },
  { value: "Cloud + desktop", label: "retaguarda web e operacao de PDV no desktop" }
];

const pillars = [
  {
    icon: Building2,
    title: "Estrutura para quem opera mais de uma unidade",
    description: "Centralize matriz, filial, franquia e equipes sem misturar contexto de operacao."
  },
  {
    icon: WifiOff,
    title: "PDV pronto para o mundo real",
    description: "Venda localmente, sincronize depois e mantenha a loja rodando quando a conexao falha."
  },
  {
    icon: ShieldCheck,
    title: "Acesso por conta, loja e terminal",
    description: "Cada usuario entra no contexto certo para vender, acompanhar ou administrar."
  }
];

const operationalFlow = [
  "Conta e autenticacao centralizadas",
  "Empresa e lojas organizadas por tenant",
  "PDVs vinculados a cada unidade",
  "Equipe, estoque, venda e caixa no mesmo fluxo"
];

const modules = [
  {
    icon: Store,
    eyebrow: "Retaguarda",
    title: "Backoffice para controlar produtos, estoque, XML e financeiro.",
    tone: "bg-[#f7d7a8]"
  },
  {
    icon: MonitorSmartphone,
    eyebrow: "Frente de caixa",
    title: "Aplicativo desktop focado em velocidade, leitura e continuidade operacional.",
    tone: "bg-[#c8e6d4]"
  },
  {
    icon: Cloud,
    eyebrow: "Gestao",
    title: "Painel online para acompanhar a operacao e escalar para varias lojas.",
    tone: "bg-[#d9d4ff]"
  }
];

const onboarding = [
  {
    step: "01",
    title: "Entre na conta",
    description: "Acesse o painel para ativar sua empresa e destravar o ambiente comercial."
  },
  {
    step: "02",
    title: "Estruture a operacao",
    description: "Cadastre a primeira loja, os primeiros usuarios e o primeiro terminal."
  },
  {
    step: "03",
    title: "Conecte o PDV",
    description: "Configure o desktop, sincronize produtos e comece a operar sem improviso."
  }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f5efe6] text-stone-950">
      <section className="relative isolate overflow-hidden border-b border-stone-950/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(231,111,81,0.22),_transparent_28%),radial-gradient(circle_at_80%_15%,_rgba(34,197,94,0.12),_transparent_22%)]" />
        <div className="absolute inset-x-0 top-0 h-[620px] bg-hero-grid bg-[size:42px_42px] opacity-40" />

        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-6 lg:px-8 lg:pb-24">
          <header className="flex items-center justify-between gap-6 rounded-full border border-stone-950/10 bg-white/80 px-5 py-3 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-full bg-stone-950 font-display text-lg text-stone-50">
                R
              </div>
              <div className="flex flex-col">
                <span className="font-display text-lg leading-none">Revendeo</span>
                <span className="text-xs uppercase tracking-[0.24em] text-stone-500">pdv saas multiusuario</span>
              </div>
            </div>

            <nav className="hidden items-center gap-8 text-sm font-medium text-stone-600 md:flex">
              <a href="#produto" className="transition hover:text-stone-950">
                Produto
              </a>
              <a href="#operacao" className="transition hover:text-stone-950">
                Operacao
              </a>
              <a href="#entrada" className="transition hover:text-stone-950">
                Entrada
              </a>
            </nav>

            <Button asChild variant="default" size="sm">
              <Link href="/login">Ir para login</Link>
            </Button>
          </header>

          <div className="grid gap-12 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div className="flex flex-col gap-8">
              <Badge variant="accent" className="w-fit">
                SaaS para quem vende na loja e governa a operacao inteira
              </Badge>

              <div className="space-y-6">
                <h1 className="max-w-4xl font-display text-5xl leading-[0.92] tracking-[-0.04em] text-stone-950 md:text-7xl">
                  Seu varejo nao precisa escolher entre caixa rapido e controle serio.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-stone-700 md:text-xl">
                  Revendeo junta retaguarda cloud, autenticacao, multiempresa e PDV desktop em uma experiencia pensada
                  para quem opera mais de uma loja, mais de um caixa e mais de uma equipe.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="accent" size="lg">
                  <Link href="/login">
                    Entrar agora
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="#produto">
                    Ver como o produto funciona
                    <ChevronRight className="size-4" />
                  </a>
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {proof.map((item) => (
                  <div key={item.value} className="rounded-[1.75rem] border border-stone-950/10 bg-white/70 p-5 shadow-ink">
                    <div className="font-display text-2xl tracking-[-0.04em] text-stone-950">{item.value}</div>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative" id="produto">
              <Card className="overflow-hidden rounded-[2.25rem] border-stone-950 bg-stone-950 text-stone-50 shadow-float">
                <CardHeader className="space-y-5">
                  <Badge variant="outline" className="w-fit border-white/15 bg-white/10 text-stone-50">
                    Visao da operacao
                  </Badge>
                  <div className="space-y-3">
                    <CardTitle className="text-4xl text-stone-50">Uma camada unica entre conta, loja, PDV e venda.</CardTitle>
                    <CardDescription className="max-w-lg text-base leading-7 text-stone-300">
                      Menos gambiarra entre sistemas, menos dependencia de planilha e mais leitura do que acontece em cada
                      caixa.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-5">
                  <div className="rounded-[1.75rem] border border-white/10 bg-[#151515] p-5 font-mono text-xs uppercase tracking-[0.18em] text-stone-300">
                    <div className="flex items-center justify-between border-b border-dashed border-white/10 pb-3">
                      <span>Operacao ao vivo</span>
                      <span className="text-[#f4c27a]">3 lojas sincronizadas</span>
                    </div>
                    <div className="space-y-3 py-4">
                      {operationalFlow.map((line) => (
                        <div key={line} className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 size-4 text-[#f4c27a]" />
                          <span>{line}</span>
                        </div>
                      ))}
                    </div>
                    <div className="grid gap-2 border-t border-dashed border-white/10 pt-4 text-[11px] text-stone-400">
                      <div className="flex justify-between">
                        <span>Loja Centro</span>
                        <span>Caixa 03 ativo</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Loja Norte</span>
                        <span>Sync em dia</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Loja Oeste</span>
                        <span>Equipe validada</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[1.75rem] bg-[#f7d7a8] p-5 text-stone-950">
                      <div className="mb-8 inline-flex rounded-full bg-stone-950/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
                        Fluxo comercial
                      </div>
                      <div className="font-display text-3xl leading-none tracking-[-0.04em]">Conta - Empresa - Loja - PDV</div>
                    </div>
                    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                      <div className="mb-6 inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-300">
                        Recibo de valor
                      </div>
                      <div className="space-y-3 text-sm text-stone-300">
                        <div className="flex items-center gap-3">
                          <Receipt className="size-4 text-[#f4c27a]" />
                          <span>Produtos, estoque e caixa no mesmo ritmo</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Users2 className="size-4 text-[#f4c27a]" />
                          <span>Usuarios com acesso ao contexto certo</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Boxes className="size-4 text-[#f4c27a]" />
                          <span>Mais lojas sem perder governanca</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-stone-950/10 bg-stone-950 text-stone-50" id="operacao">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="space-y-6">
            <Badge variant="outline" className="w-fit border-white/10 bg-white/5 text-stone-50">
              Produto para operacao real
            </Badge>
            <h2 className="font-display text-4xl leading-tight tracking-[-0.04em] md:text-6xl">
              Nao e so um sistema de caixa. E a arquitetura da sua operacao.
            </h2>
            <p className="max-w-xl text-lg leading-8 text-stone-300">
              A proposta da Revendeo e simples: dar velocidade na ponta sem perder controle no topo. O que entra em
              produto, usuario, loja e terminal continua coerente ate a venda.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;

              return (
                <Card
                  key={pillar.title}
                  className={index === 0 ? "md:col-span-2 rounded-[2.25rem] border-white/10 bg-white/[0.03] text-stone-50" : "rounded-[2rem] border-white/10 bg-white/[0.03] text-stone-50"}
                >
                  <CardHeader>
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-white/10">
                      <Icon className="size-5 text-[#f4c27a]" />
                    </div>
                    <CardTitle className="text-2xl text-stone-50">{pillar.title}</CardTitle>
                    <CardDescription className="text-base leading-7 text-stone-300">{pillar.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8" id="entrada">
        <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
          <Card className="overflow-hidden rounded-[2.5rem] border-0 bg-[#e76f51] text-white shadow-float">
            <CardHeader className="space-y-5">
              <Badge variant="outline" className="w-fit border-white/20 bg-white/10 text-white">
                Entrada rapida
              </Badge>
              <CardTitle className="text-4xl text-white md:text-5xl">
                Do primeiro login ao primeiro PDV ativo sem enrolacao.
              </CardTitle>
              <CardDescription className="max-w-md text-base leading-7 text-white/80">
                A landing precisa vender clareza. O produto precisa entregar velocidade de entrada. Os dois estao alinhados
                aqui.
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-4">
            {onboarding.map((item) => (
              <Card key={item.step} className="rounded-[2rem] bg-white">
                <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:p-8">
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-full border border-stone-950/10 bg-[#f4efe8] font-display text-2xl tracking-[-0.04em] text-stone-950">
                    {item.step}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-2xl tracking-[-0.03em] text-stone-950">{item.title}</h3>
                    <p className="max-w-2xl text-base leading-7 text-stone-600">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-8 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon;

            return (
              <div key={module.title} className={`rounded-[2.2rem] p-7 shadow-ink ${module.tone}`}>
                <div className="mb-14 flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-700">{module.eyebrow}</span>
                  <div className="flex size-11 items-center justify-center rounded-full border border-stone-950/10 bg-white/50">
                    <Icon className="size-5 text-stone-950" />
                  </div>
                </div>
                <p className="max-w-sm font-display text-3xl leading-tight tracking-[-0.04em] text-stone-950">{module.title}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-6 pb-16 pt-8 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.75rem] bg-[linear-gradient(135deg,#1b1714,#50301f_55%,#e76f51)] px-8 py-10 text-white shadow-float md:px-12 md:py-14">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="space-y-5">
              <Badge variant="outline" className="w-fit border-white/15 bg-white/10 text-white">
                Pronto para entrar
              </Badge>
              <h2 className="max-w-3xl font-display text-4xl leading-[0.94] tracking-[-0.04em] md:text-6xl">
                Se a operacao e seria, a entrada no sistema tambem precisa ser.
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-white/80">
                Entre no painel e avance para o contexto certo. A landing vende o produto. O login abre a operacao.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Button asChild variant="secondary" size="lg">
                <Link href="/login">Ir para login</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 hover:text-white">
                <Link href="/registro">Criar conta</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
