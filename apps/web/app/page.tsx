import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  Cloud,
  MonitorSmartphone,
  ShieldCheck,
  Store,
  WifiOff
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

const proof = [
  { value: "Multiempresa", label: "uma conta distribui contexto para matriz, filial e franquia sem ruido visual" },
  { value: "Offline-first", label: "o desktop continua vendendo com a mesma linguagem da retaguarda" },
  { value: "Cloud + PDV", label: "landing, login e operacao compartilham a mesma base cromatica e hierarquia" }
];

const pillars = [
  {
    icon: Building2,
    title: "Estrutura para multiplas lojas sem perder leitura",
    description: "Conta, empresa, loja, terminal e operador aparecem como partes da mesma arquitetura visual."
  },
  {
    icon: WifiOff,
    title: "Desktop pronto para operacao real",
    description: "A mesma assinatura da plataforma chega ao caixa com contraste, velocidade e foco no fluxo."
  },
  {
    icon: ShieldCheck,
    title: "Acesso com contexto e coerencia",
    description: "Login, permissoes e jornada operacional falam a mesma linguagem em vez de parecerem produtos diferentes."
  }
];

const operationalFlow = [
  "Conta e autenticacao centralizadas",
  "Empresa, loja e PDV com contexto claro",
  "Produtos, estoque e venda no mesmo compasso",
  "Sincronizacao continua sem perder legibilidade"
];

const modules = [
  {
    icon: Cloud,
    eyebrow: "Retaguarda cloud",
    title: "Paineis e modulos administrativos em superficies claras com gradientes de marca.",
    tone:
      "border border-transparent bg-[linear-gradient(135deg,#1ea7ff,#8758e2_58%,#d42eb5)] text-white shadow-float"
  },
  {
    icon: MonitorSmartphone,
    eyebrow: "Login e entrada",
    title: "Acesso com cartao branco, detalhes premium e contraponto escuro para passar consistencia.",
    tone:
      "border border-[#101726]/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(242,246,251,0.98))] text-[#111827] shadow-ink"
  },
  {
    icon: Store,
    eyebrow: "Desktop operacional",
    title: "PDV com superficies solidas, destaques em azul e magenta e comandos que continuam rapidos.",
    tone:
      "border border-white/10 bg-[linear-gradient(145deg,#101726,#24194e_58%,#6a237e)] text-white shadow-float"
  }
];

const onboarding = [
  {
    step: "01",
    title: "Entre no ambiente",
    description: "O login ja prepara o usuario para a mesma identidade visual do painel e do PDV."
  },
  {
    step: "02",
    title: "Estruture a operacao",
    description: "Empresa, primeira loja, usuarios e primeiro terminal entram em um fluxo com hierarquia clara."
  },
  {
    step: "03",
    title: "Ligue o desktop",
    description: "O app local herda a mesma paleta, os mesmos acentos e a mesma sensacao de produto unico."
  }
];

const moments = [
  { label: "Landing", value: "hero leve com bloco escuro e acentos liquidos" },
  { label: "Login", value: "entrada premium em branco, prata e grafite" },
  { label: "Desktop", value: "caixa focado com os mesmos gradientes da marca" }
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
                <span className="text-xs uppercase tracking-[0.24em] text-[#667085]">pdv saas multiusuario</span>
              </div>
            </div>

            <nav className="hidden items-center gap-8 text-sm font-medium text-[#667085] md:flex">
              <a href="#produto" className="transition hover:text-[#111827]">
                Produto
              </a>
              <a href="#operacao" className="transition hover:text-[#111827]">
                Operacao
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
                Sistema unico do primeiro clique ao primeiro fechamento de caixa
              </Badge>

              <div className="space-y-6">
                <h1 className="max-w-4xl font-display text-5xl leading-[0.92] tracking-[-0.05em] text-[#111827] md:text-7xl">
                  Uma identidade so para landing, login e desktop.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-[#667085] md:text-xl">
                  A nova direcao visual parte da paleta das referencias: azul claro, violeta, magenta, branco e
                  grafite. O resultado e uma experiencia mais premium, mais coesa e com menos sensacao de telas
                  desconectadas.
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
                    Ver como o produto se conecta
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

            <div className="relative min-h-[660px]" id="produto">
              <div className="pointer-events-none absolute left-2 top-3 h-[320px] w-[330px] rounded-full border-[18px] border-[#1ea7ff] border-b-[#d42eb5] border-l-transparent border-r-[#8758e2] opacity-90" />
              <div className="pointer-events-none absolute left-[255px] top-[58px] size-16 rounded-full bg-white/82 blur-xl" />
              <div className="pointer-events-none absolute right-12 top-[280px] size-20 rounded-full bg-[#d42eb5]/16 blur-2xl" />

              <Card className="relative z-10 ml-auto mt-12 max-w-[430px] overflow-hidden rounded-[2.6rem] border-white/60 bg-white/76 shadow-float backdrop-blur-xl">
                <CardHeader className="space-y-5">
                  <Badge variant="outline" className="w-fit border-[#101726]/8 bg-white/70 text-[#111827]">
                    Conceito visual aplicado
                  </Badge>
                  <div className="space-y-3">
                    <CardTitle className="text-4xl text-[#111827]">
                      A mesma assinatura premium aparece em todas as entradas do produto.
                    </CardTitle>
                    <CardDescription className="max-w-lg text-base leading-7 text-[#667085]">
                      O contraste entre branco, prata e blocos escuros organiza o fluxo, enquanto o gradiente de marca
                      costura tudo do marketing ate a operacao.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="rounded-[2rem] bg-[linear-gradient(145deg,#101726,#24194e_58%,#6a237e)] p-5 text-white shadow-float">
                    <div className="flex items-center justify-between border-b border-dashed border-white/12 pb-3">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Fluxo unificado</span>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-[#6cc8ff]">
                        web + auth + desktop
                      </span>
                    </div>
                    <div className="space-y-3 py-4 text-sm text-white/84">
                      {operationalFlow.map((line) => (
                        <div key={line} className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 size-4 text-[#6cc8ff]" />
                          <span>{line}</span>
                        </div>
                      ))}
                    </div>
                    <div className="grid gap-2 border-t border-dashed border-white/12 pt-4 text-[11px] uppercase tracking-[0.16em] text-white/56">
                      <div className="flex justify-between">
                        <span>Landing</span>
                        <span>mesma marca</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Login</span>
                        <span>mesmo contraste</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Desktop</span>
                        <span>mesmo gradiente</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-[1.02fr_0.98fr]">
                    <div className="rounded-[2rem] bg-[linear-gradient(135deg,#1ea7ff,#8758e2_58%,#d42eb5)] p-5 text-white shadow-ink">
                      <div className="mb-7 inline-flex rounded-full bg-white/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]">
                        Paleta base
                      </div>
                      <p className="max-w-xs font-display text-3xl leading-tight tracking-[-0.04em]">
                        Ciano, violeta, magenta, branco, prata e grafite.
                      </p>
                    </div>

                    <div className="grid gap-4">
                      <div className="rounded-[1.8rem] border border-[#101726]/8 bg-[linear-gradient(180deg,#ffffff,#edf2f8)] p-5 text-[#111827] shadow-ink">
                        <div className="mb-5 inline-flex rounded-full bg-[#101726]/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
                          Superficie silver
                        </div>
                        <p className="text-sm leading-6 text-[#667085]">
                          Cartoes, formularios e areas de leitura ficam leves e legiveis.
                        </p>
                      </div>
                      <div className="rounded-[1.8rem] bg-[#101216] p-5 text-white shadow-float">
                        <div className="mb-5 inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
                          Contraste grafite
                        </div>
                        <p className="text-sm leading-6 text-white/74">
                          Blocos escuros entram como apoio visual para highlights e status criticos.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="relative z-10 mt-6 grid gap-4 sm:grid-cols-3">
                {moments.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.8rem] border border-[#101726]/8 bg-white/80 p-5 shadow-ink backdrop-blur"
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#667085]">
                      {item.label}
                    </span>
                    <p className="mt-3 text-sm leading-6 text-[#111827]">{item.value}</p>
                  </div>
                ))}
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
              Produto para operacao real
            </Badge>
            <h2 className="font-display text-4xl leading-tight tracking-[-0.04em] md:text-6xl">
              Nao e so trocar cor. E dar uma gramatica unica para a plataforma inteira.
            </h2>
            <p className="max-w-xl text-lg leading-8 text-white/74">
              A interface passa a parecer uma familia de produtos: hero claro, paineis premium, contrastes escuros e
              acentos liquidos em azul, roxo e magenta.
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
                      ? "rounded-[2.25rem] border-white/10 bg-white/[0.05] text-white md:col-span-2"
                      : "rounded-[2rem] border-white/10 bg-white/[0.05] text-white"
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
                Entrada coerente
              </Badge>
              <CardTitle className="text-4xl text-white md:text-5xl">
                O mesmo design conduz a jornada do marketing ate o primeiro PDV ativo.
              </CardTitle>
              <CardDescription className="max-w-md text-base leading-7 text-white/74">
                A entrada deixa de parecer uma troca abrupta entre produtos diferentes e passa a funcionar como um mesmo
                sistema com etapas claras.
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
                Sistema unificado
              </Badge>
              <h2 className="max-w-3xl font-display text-4xl leading-[0.94] tracking-[-0.04em] md:text-6xl">
                O produto inteiro agora parte da mesma paleta e da mesma direcao visual.
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-white/78">
                Landing vende com a mesma energia que o login recebe e que o desktop executa. Isso reduz ruido e aumenta
                percepcao de produto solido.
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
