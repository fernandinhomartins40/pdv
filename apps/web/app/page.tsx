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
  { value: "Cloud + desktop", label: "retaguarda web e operação de PDV no desktop" }
];

const pillars = [
  {
    icon: Building2,
    title: "Estrutura para quem opera mais de uma unidade",
    description: "Centralize matriz, filial, franquia e equipes sem misturar contexto de operação."
  },
  {
    icon: WifiOff,
    title: "PDV pronto para o mundo real",
    description: "Venda localmente, sincronize depois e mantenha a loja rodando quando a conexão falha."
  },
  {
    icon: ShieldCheck,
    title: "Acesso por conta, loja e terminal",
    description: "Cada usuário entra no contexto certo para vender, acompanhar ou administrar."
  }
];

const operationalFlow = [
  "Conta e autenticação centralizadas",
  "Empresa e lojas organizadas por tenant",
  "PDVs vinculados a cada unidade",
  "Equipe, estoque, venda e caixa no mesmo fluxo"
];

const modules = [
  {
    icon: Store,
    eyebrow: "Retaguarda",
    title: "Backoffice para controlar produtos, estoque, XML e financeiro.",
    tone:
      "border border-transparent bg-[linear-gradient(135deg,#1ea7ff,#8758e2_58%,#d42eb5)] text-white shadow-float"
  },
  {
    icon: MonitorSmartphone,
    eyebrow: "Frente de caixa",
    title: "Aplicativo desktop focado em velocidade, leitura e continuidade operacional.",
    tone:
      "border border-[#101726]/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(242,246,251,0.98))] text-[#111827] shadow-ink"
  },
  {
    icon: Cloud,
    eyebrow: "Gestão",
    title: "Painel online para acompanhar a operação e escalar para várias lojas.",
    tone:
      "border border-white/10 bg-[linear-gradient(145deg,#101726,#24194e_58%,#6a237e)] text-white shadow-float"
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
    title: "Estruture a operação",
    description: "Cadastre a primeira loja, os primeiros usuários e o primeiro terminal."
  },
  {
    step: "03",
    title: "Conecte o PDV",
    description: "Configure o desktop, sincronize produtos e comece a operar sem improviso."
  }
];

export default function LandingPage() {
  return (
    <main
      className="min-h-screen text-[#111827]"
      style={{
        background:
          "radial-gradient(circle at 8% 0%, rgba(30,167,255,0.18), transparent 22%), radial-gradient(circle at 88% 8%, rgba(135,88,226,0.18), transparent 24%), radial-gradient(circle at 68% 82%, rgba(212,46,181,0.12), transparent 18%), linear-gradient(180deg, #f5f8fc, #ecf2f8)"
      }}
    >
      <section className="relative isolate overflow-hidden border-b border-[#101726]/8">
        <div className="absolute inset-x-0 top-0 h-[640px] bg-hero-grid bg-[size:42px_42px] opacity-40" />
        <div className="absolute inset-x-0 top-[-120px] mx-auto h-[420px] max-w-5xl rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.9),_transparent_68%)] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-6 lg:px-8 lg:pb-28">
          <header className="flex items-center justify-between gap-6 rounded-full border border-[#101726]/8 bg-white/72 px-5 py-3 shadow-ink backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1ea7ff,#8758e2_58%,#d42eb5)] font-display text-lg text-white">
                R
              </div>
              <div className="flex flex-col">
                <span className="font-display text-lg leading-none">Revendeo</span>
                <span className="text-xs uppercase tracking-[0.24em] text-[#667085]">pdv saas multiusuário</span>
              </div>
            </div>

            <nav className="hidden items-center gap-8 text-sm font-medium text-[#667085] md:flex">
              <a href="#produto" className="transition hover:text-[#111827]">
                Produto
              </a>
              <a href="#operacao" className="transition hover:text-[#111827]">
                Operação
              </a>
              <a href="#entrada" className="transition hover:text-[#111827]">
                Entrada
              </a>
            </nav>

            <Button asChild variant="accent" size="sm">
              <Link href="/login">Ir para login</Link>
            </Button>
          </header>

          <div className="grid gap-12 pt-14 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
            <div className="flex flex-col gap-8">
              <Badge variant="accent" className="w-fit border-0">
                SaaS para quem vende na loja e governa a operação inteira
              </Badge>

              <div className="space-y-6">
                <h1 className="max-w-4xl font-display text-5xl leading-[0.92] tracking-[-0.05em] text-[#111827] md:text-7xl">
                  Seu varejo não precisa escolher entre caixa rápido e controle sério.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-[#667085] md:text-xl">
                  Revendeo junta retaguarda cloud, autenticação, multiempresa e PDV desktop em uma experiência pensada
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
                <Button asChild variant="secondary" size="lg">
                  <a href="#produto">
                    Ver como o produto funciona
                    <ChevronRight className="size-4" />
                  </a>
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {proof.map((item) => (
                  <div
                    key={item.value}
                    className="rounded-[1.9rem] border border-[#101726]/8 bg-white/78 p-5 shadow-ink backdrop-blur-xl"
                  >
                    <div className="mb-4 h-1.5 w-16 rounded-full bg-[linear-gradient(135deg,#1ea7ff,#8758e2_58%,#d42eb5)]" />
                    <div className="font-display text-2xl tracking-[-0.04em] text-[#111827]">{item.value}</div>
                    <p className="mt-2 text-sm leading-6 text-[#667085]">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative pt-8" id="produto">
              <div className="pointer-events-none absolute left-2 top-6 h-[240px] w-[260px] rounded-full border-[16px] border-[#1ea7ff] border-b-[#d42eb5] border-l-transparent border-r-[#8758e2] opacity-85" />
              <div className="pointer-events-none absolute right-6 top-[220px] size-24 rounded-full bg-[#d42eb5]/16 blur-2xl" />

              <div className="relative z-10 rounded-[2.6rem] border border-white/60 bg-white/78 p-4 shadow-float backdrop-blur-xl md:p-5">
                <div className="mb-4 flex flex-col gap-4 border-b border-[#101726]/8 pb-4">
                  <div className="space-y-3">
                    <Badge variant="outline" className="w-fit border-[#101726]/8 bg-white/70 text-[#111827]">
                      Visão da operação
                    </Badge>
                    <p className="max-w-2xl text-sm leading-6 text-[#667085]">
                      Conta, lojas, terminais e vendas organizados em um fluxo único para retaguarda e PDV, com leitura
                      clara do que está acontecendo em cada unidade.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[1.4rem] border border-[#101726]/8 bg-white/82 px-4 py-3">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#667085]">Conta</span>
                      <strong className="mt-2 block text-base text-[#111827]">Gestão centralizada</strong>
                    </div>
                    <div className="rounded-[1.4rem] border border-[#101726]/8 bg-white/82 px-4 py-3">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#667085]">Lojas</span>
                      <strong className="mt-2 block text-base text-[#111827]">Tenant por unidade</strong>
                    </div>
                    <div className="rounded-[1.4rem] border border-[#101726]/8 bg-white/82 px-4 py-3">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#667085]">PDV</span>
                      <strong className="mt-2 block text-base text-[#111827]">Operação sincronizada</strong>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-[2.2rem] bg-[linear-gradient(145deg,#101726,#24194e_58%,#6a237e)] p-5 text-white shadow-float">
                    <div className="mb-4 flex items-center justify-between gap-3 rounded-[1.35rem] bg-white/8 px-4 py-4">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Operação ao vivo</span>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-[#6cc8ff]">
                        3 lojas sincronizadas
                      </span>
                    </div>
                    <div className="space-y-3 text-sm text-white/84">
                      {operationalFlow.map((line) => (
                        <div key={line} className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 size-4 text-[#6cc8ff]" />
                          <span>{line}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-3">
                      <div className="rounded-[1.2rem] border border-white/10 bg-white/8 px-3 py-3">
                        <span className="block text-[11px] uppercase tracking-[0.16em] text-white/56">Loja Centro</span>
                        <strong className="mt-2 block text-sm">Caixa 03 ativo</strong>
                      </div>
                      <div className="rounded-[1.2rem] border border-white/10 bg-white/8 px-3 py-3">
                        <span className="block text-[11px] uppercase tracking-[0.16em] text-white/56">Loja Norte</span>
                        <strong className="mt-2 block text-sm">Sync em dia</strong>
                      </div>
                      <div className="rounded-[1.2rem] border border-white/10 bg-white/8 px-3 py-3">
                        <span className="block text-[11px] uppercase tracking-[0.16em] text-white/56">Loja Oeste</span>
                        <strong className="mt-2 block text-sm">Equipe validada</strong>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="rounded-[2rem] border border-[#101726]/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(241,246,252,0.98))] p-5 text-[#111827] shadow-ink">
                      <div className="mb-5 inline-flex rounded-full bg-[#101726] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                        Fluxo comercial
                      </div>
                      <div className="grid gap-3">
                        <div className="rounded-[1.25rem] bg-[#101726]/5 px-4 py-3 text-sm font-semibold text-[#111827]">
                          Conta
                        </div>
                        <div className="rounded-[1.25rem] bg-[#101726]/5 px-4 py-3 text-sm font-semibold text-[#111827]">
                          Empresa
                        </div>
                        <div className="rounded-[1.25rem] bg-[#101726]/5 px-4 py-3 text-sm font-semibold text-[#111827]">
                          Loja
                        </div>
                        <div className="rounded-[1.25rem] bg-[linear-gradient(135deg,#1ea7ff,#8758e2_58%,#d42eb5)] px-4 py-3 text-sm font-semibold text-white">
                          PDV em operação
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[2rem] border border-[#101726]/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(241,246,252,0.98))] p-5 text-[#111827] shadow-ink">
                      <div className="mb-5 inline-flex rounded-full bg-[#101726] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                        Recibo de valor
                      </div>
                      <div className="space-y-3 text-sm text-[#667085]">
                        <div className="flex items-center gap-3">
                          <Receipt className="size-4 text-[#8758e2]" />
                          <span>Produtos, estoque e caixa no mesmo ritmo</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Users2 className="size-4 text-[#8758e2]" />
                          <span>Usuários com acesso ao contexto certo</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Boxes className="size-4 text-[#8758e2]" />
                          <span>Mais lojas sem perder governanca</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="border-b border-white/10 text-white"
        id="operacao"
        style={{
          background:
            "radial-gradient(circle at top right, rgba(108,200,255,0.16), transparent 24%), linear-gradient(145deg, #0b111f, #22184a 56%, #5b1c6f)"
        }}
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="space-y-6">
            <Badge variant="outline" className="w-fit border-white/10 bg-white/[0.08] text-white">
              Produto para operação real
            </Badge>
            <h2 className="font-display text-4xl leading-tight tracking-[-0.04em] md:text-6xl">
              Não é só um sistema de caixa. É a arquitetura da sua operação.
            </h2>
            <p className="max-w-xl text-lg leading-8 text-white/74">
              A proposta da Revendeo é simples: dar velocidade na ponta sem perder controle no topo. O que entra em
              produto, usuário, loja e terminal continua coerente até a venda.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;

              return (
                <Card
                  key={pillar.title}
                  className={
                    index === 0
                      ? "rounded-[2.25rem] !border-white/10 !bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] text-white shadow-none backdrop-blur-xl md:col-span-2"
                      : "rounded-[2rem] !border-white/10 !bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] text-white shadow-none backdrop-blur-xl"
                  }
                >
                  <CardHeader>
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1ea7ff,#8758e2_55%,#d42eb5)]">
                      <Icon className="size-5 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-white">{pillar.title}</CardTitle>
                    <CardDescription className="text-base leading-7 text-white/72">{pillar.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8" id="entrada">
        <div className="grid gap-6 lg:grid-cols-[0.84fr_1.16fr]">
          <Card className="overflow-hidden rounded-[2.5rem] border-0 bg-[linear-gradient(145deg,#101726,#23194d_56%,#d42eb5)] text-white shadow-float">
            <CardHeader className="space-y-5">
              <Badge variant="outline" className="w-fit border-white/14 bg-white/10 text-white">
                Entrada rápida
              </Badge>
              <CardTitle className="text-4xl text-white md:text-5xl">
                Do primeiro login ao primeiro PDV ativo sem enrolação.
              </CardTitle>
              <CardDescription className="max-w-md text-base leading-7 text-white/74">
                A landing precisa vender clareza. O produto precisa entregar velocidade de entrada. Os dois estão alinhados
                aqui.
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-4">
            {onboarding.map((item) => (
              <Card key={item.step} className="rounded-[2rem] bg-white/90 backdrop-blur-xl">
                <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:p-8">
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1ea7ff,#8758e2_58%,#d42eb5)] font-display text-2xl tracking-[-0.04em] text-white shadow-ink">
                    {item.step}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-2xl tracking-[-0.03em] text-[#111827]">{item.title}</h3>
                    <p className="max-w-2xl text-base leading-7 text-[#667085]">{item.description}</p>
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
              <div key={module.title} className={`rounded-[2.25rem] p-7 ${module.tone}`}>
                <div className="mb-14 flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-72">{module.eyebrow}</span>
                  <div className="flex size-11 items-center justify-center rounded-full border border-white/12 bg-white/10">
                    <Icon className="size-5" />
                  </div>
                </div>
                <p className="max-w-sm font-display text-3xl leading-tight tracking-[-0.04em]">{module.title}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-6 pb-16 pt-8 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.8rem] border border-white/10 bg-[linear-gradient(135deg,#101726,#1c1f46_48%,#6e257f_76%,#d42eb5)] px-8 py-10 text-white shadow-float md:px-12 md:py-14">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="space-y-5">
              <Badge variant="outline" className="w-fit border-white/15 bg-white/10 text-white">
                Pronto para entrar
              </Badge>
              <h2 className="max-w-3xl font-display text-4xl leading-[0.94] tracking-[-0.04em] md:text-6xl">
                Se a operação é séria, a entrada no sistema também precisa ser.
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-white/78">
                Entre no painel e avance para o contexto certo. A landing vende o produto. O login abre a operação.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Button asChild variant="accent" size="lg">
                <Link href="/login">
                  Ir para login
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/registro">Criar conta</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
