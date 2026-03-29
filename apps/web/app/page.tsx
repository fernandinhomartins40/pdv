import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  Building2,
  Check,
  ChevronRight,
  CreditCard,
  Facebook,
  Globe2,
  Headset,
  Instagram,
  LayoutGrid,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Play,
  ShieldCheck,
  Shirt,
  ShoppingBasket,
  Smartphone,
  Store,
  UtensilsCrossed,
  Wrench,
  Youtube,
  Zap,
  TrendingUp,
  Users,
  Monitor,
  CloudLightning,
  Layers
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const segments = [
  {
    icon: Shirt,
    title: "Roupas e Calçados",
    description: "Coleção, grade, caixa e venda consultiva no mesmo fluxo.",
    gradient: "linear-gradient(135deg, #6b5cff, #9e8cff)",
    color: "#6b5cff"
  },
  {
    icon: ShoppingBasket,
    title: "Supermercados",
    description: "Operação de alto giro com leitura comercial por loja e turno.",
    gradient: "linear-gradient(135deg, #16d5b0, #5eecd5)",
    color: "#16d5b0"
  },
  {
    icon: Wrench,
    title: "Auto Peças e Oficinas",
    description: "Itens técnicos, consulta rápida e atendimento de balcão com contexto.",
    gradient: "linear-gradient(135deg, #ffbe45, #ffd98a)",
    color: "#ffbe45"
  },
  {
    icon: UtensilsCrossed,
    title: "Bares e Restaurantes",
    description: "Comandas, recebimento e fechamento conectados a uma retaguarda só.",
    gradient: "linear-gradient(135deg, #ff6b8a, #ff9eb5)",
    color: "#ff6b8a"
  },
  {
    icon: Boxes,
    title: "Distribuidores",
    description: "Estoque, tabela comercial e expansão com governança mais simples.",
    gradient: "linear-gradient(135deg, #6b5cff, #16d5b0)",
    color: "#6b5cff"
  },
  {
    icon: Smartphone,
    title: "Força de Vendas",
    description: "Painel, equipe externa e decisão comercial lendo a mesma operação.",
    gradient: "linear-gradient(135deg, #ffbe45, #ff6b8a)",
    color: "#ffbe45"
  }
];

const capabilities = [
  {
    icon: CreditCard,
    title: "Controle de vendas",
    desc: "Caixa, recebimento, ticket médio e histórico por unidade.",
    color: "#16d5b0"
  },
  {
    icon: Boxes,
    title: "Reposição ágil",
    desc: "Entrada, saída e saldo por loja sem depender de planilha.",
    color: "#6b5cff"
  },
  {
    icon: BarChart3,
    title: "Fluxo financeiro",
    desc: "Receita, despesas e conferências no mesmo painel.",
    color: "#ffbe45"
  },
  {
    icon: Building2,
    title: "Multiempresa",
    desc: "Uma conta central com lojas e equipes em contexto certo.",
    color: "#16d5b0"
  },
  {
    icon: Users,
    title: "Cadastro por vendedor",
    desc: "Permissão, trilha operacional e leitura por usuário.",
    color: "#6b5cff"
  },
  {
    icon: Monitor,
    title: "Monitor de indicadores",
    desc: "Visão comercial e operacional com decisão em tempo real.",
    color: "#ffbe45"
  },
  {
    icon: Layers,
    title: "Fiscal simplificado",
    desc: "XML, documentos e rotina de conferência sem ruído.",
    color: "#16d5b0"
  },
  {
    icon: CloudLightning,
    title: "Retaguarda central",
    desc: "Produto, preço e estoque organizados para crescer.",
    color: "#6b5cff"
  }
];

const metrics = [
  { value: "272+", label: "clientes ativos", color: "#16d5b0" },
  { value: "1.091+", label: "usuários na plataforma", color: "#6b5cff" },
  { value: "30", label: "regiões atendidas", color: "#ffbe45" },
  { value: "6+", label: "ecossistemas conectados", color: "#16d5b0" }
];

const differentials = [
  {
    icon: Headset,
    title: "Suporte rápido e humano",
    description: "Time próximo da operação, com resposta direta e linguagem de negócio.",
    color: "#6b5cff"
  },
  {
    icon: Globe2,
    title: "Evolução constante",
    description: "Plataforma viva, com entregas orientadas pelo que acontece na loja.",
    color: "#16d5b0"
  },
  {
    icon: LayoutGrid,
    title: "Interfaces simples",
    description: "Leitura visual limpa para vender, consultar e fechar caixa com rapidez.",
    color: "#ffbe45"
  },
  {
    icon: ShieldCheck,
    title: "Segurança do desenho",
    description: "Conta, empresa, loja e terminal organizados para operar com contexto.",
    color: "#6b5cff"
  }
];

const footerGroups = [
  {
    title: "Contato",
    items: ["(64) 3532-2005", "WhatsApp comercial", "comercial@revendeo.com.br"]
  },
  {
    title: "Unidades",
    items: ["Goiás do Iguaçu - PR", "Castanhal - PR", "Maringá - PR"]
  },
  {
    title: "Endereço",
    items: ["Edifício 07", "Av. José Nardin, 366", "Sala 02"]
  }
];

/* ------------------------------------------------------------------ */
/*  LANDING PAGE                                                       */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden" style={{ backgroundColor: '#f5f7fc' }}>
      {/* ============ NAVBAR ============ */}
      <nav className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-5 rounded-full border border-white/20 bg-white/70 py-2.5 pl-3 pr-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl">
            <div className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-[#0c2c4e] to-[#16d5b0] text-sm font-black text-white">
              R
            </div>
            <div className="leading-none">
              <div className="font-display text-lg font-bold tracking-tight text-[#0a1930]">Revendeo</div>
            </div>
          </div>

          <div className="hidden items-center gap-1 rounded-full border border-white/20 bg-white/70 px-2 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl lg:flex">
            {["Soluções", "Plataforma", "Empresa", "Diferenciais"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}
                className="rounded-full px-4 py-2 text-sm font-medium text-[#3a4a64] transition-all duration-200 hover:bg-[#6b5cff]/10 hover:text-[#6b5cff]"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-full px-5 py-2.5 text-sm font-semibold text-[#3a4a64] transition hover:text-[#6b5cff] sm:block"
            >
              Entrar
            </Link>
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 rounded-full bg-[#0a1930] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(10,25,48,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(10,25,48,0.4)]"
            >
              Começar grátis
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden pb-8 pt-28 lg:pb-0 lg:pt-32">
        {/* Background */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#060e1a_0%,#0b1e36_40%,#0f2a4a_70%,#081828_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_30%,rgba(22,213,176,0.12),transparent),radial-gradient(ellipse_60%_50%_at_80%_20%,rgba(107,92,255,0.15),transparent),radial-gradient(ellipse_40%_40%_at_60%_80%,rgba(255,190,69,0.08),transparent)]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            {/* Left — Copy */}
            <div className="space-y-8 text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#16d5b0]/30 bg-[#16d5b0]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#16d5b0]">
                <span className="size-1.5 animate-pulse rounded-full bg-[#16d5b0]" />
                Software comercial completo
              </div>

              <h1 className="font-display text-[clamp(2.8rem,5.5vw,5.4rem)] leading-[0.9] tracking-[-0.04em]">
                Seu negócio
                <br />
                merece um sistema
                <br />
                <span className="bg-gradient-to-r from-[#16d5b0] via-[#6b5cff] to-[#ffbe45] bg-clip-text text-transparent">
                  que acompanha.
                </span>
              </h1>

              <p className="max-w-lg text-lg leading-relaxed text-white/60">
                Ferramentas para vender, controlar estoque, gerenciar financeiro e acompanhar a operação — tudo em um
                ecossistema integrado.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/registro"
                  className="group relative inline-flex h-14 items-center gap-2 overflow-hidden rounded-full bg-[#16d5b0] pl-7 pr-5 text-sm font-bold text-[#062030] shadow-[0_0_40px_rgba(22,213,176,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_60px_rgba(22,213,176,0.45)]"
                >
                  Demonstração gratuita
                  <span className="grid size-8 place-items-center rounded-full bg-[#062030]/10 transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowRight className="size-4" />
                  </span>
                </Link>
                <Link
                  href="/download"
                  className="inline-flex h-14 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-white/25 hover:bg-white/10"
                >
                  Baixar instalador
                </Link>
              </div>

              {/* Social proof strip */}
              <div className="flex flex-wrap items-center gap-6 border-t border-white/10 pt-8">
                {[
                  ["272+", "empresas"],
                  ["1.091+", "usuários"],
                  ["30", "regiões"]
                ].map(([val, lab]) => (
                  <div key={lab} className="flex items-baseline gap-2">
                    <span className="font-display text-2xl font-bold text-white">{val}</span>
                    <span className="text-sm text-white/40">{lab}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Visual Dashboard */}
            <div className="relative z-10 hidden lg:block">
              <div className="relative">
                {/* Glow */}
                <div className="absolute -inset-12 rounded-[3rem] bg-gradient-to-br from-[#16d5b0]/20 via-[#6b5cff]/15 to-[#ffbe45]/10 blur-3xl" />

                {/* Main card */}
                <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#101f38]/95 to-[#0a1628]/95 p-1 shadow-[0_40px_100px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                  <div className="rounded-[1.75rem] bg-gradient-to-b from-[#f8faff] to-[#eef3ff] p-5">
                    {/* Top bar */}
                    <div className="flex items-center justify-between rounded-2xl bg-white px-5 py-3 shadow-sm">
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8895b0]">
                          Dashboard Revendeo
                        </div>
                        <div className="mt-0.5 font-display text-lg font-bold tracking-tight text-[#0f2240]">
                          Operação em tempo real
                        </div>
                      </div>
                      <div className="flex items-center gap-2 rounded-full bg-[#e8faf4] px-3 py-1.5 text-xs font-semibold text-[#0d8f6e]">
                        <span className="size-1.5 animate-pulse rounded-full bg-[#16d5b0]" />
                        Online
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {[
                        ["R$ 18,4 mil", "Vendas do dia", "#16d5b0"],
                        ["287", "Tickets", "#6b5cff"],
                        ["98%", "Estoque ok", "#ffbe45"]
                      ].map(([val, lab, col]) => (
                        <div key={lab} className="rounded-2xl bg-white p-4 shadow-sm">
                          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#8895b0]">{lab}</div>
                          <div className="mt-2 font-display text-xl font-bold" style={{ color: col as string }}>
                            {val}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Chart placeholder + flow */}
                    <div className="mt-4 grid grid-cols-[1.3fr_0.7fr] gap-3">
                      <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-[#8895b0]">
                          Desempenho semanal
                        </div>
                        <div className="mt-4 flex items-end gap-2" style={{ height: 80 }}>
                          {[35, 52, 44, 68, 58, 78, 64].map((h, i) => (
                            <div
                              key={i}
                              className="flex-1 rounded-t-lg transition-all duration-500"
                              style={{
                                height: `${h}%`,
                                background:
                                  i === 5
                                    ? "linear-gradient(to top, #16d5b0, #5eecd5)"
                                    : `rgba(107, 92, 255, ${0.12 + i * 0.04})`
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="rounded-2xl bg-gradient-to-b from-[#0e1f3a] to-[#081424] p-4 text-white shadow-sm">
                        <div className="text-[10px] uppercase tracking-wider text-white/40">Fluxo</div>
                        <div className="mt-3 space-y-2">
                          {["Caixa aberto", "Sincronizado", "Retaguarda ok"].map((item, i) => (
                            <div
                              key={item}
                              className={`rounded-xl px-3 py-2 text-xs font-medium ${i === 1 ? "bg-gradient-to-r from-[#16d5b0]/30 to-[#6b5cff]/30 text-white" : "bg-white/8 text-white/60"}`}
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating pill — top right */}
                <div className="absolute -right-4 -top-3 z-20 rounded-2xl border border-white/10 bg-[#0e1d36]/90 px-4 py-3 shadow-xl backdrop-blur-md">
                  <div className="text-[10px] uppercase tracking-wider text-white/40">Faturamento</div>
                  <div className="mt-1 font-display text-lg font-bold text-[#16d5b0]">R$ 93.540</div>
                </div>

                {/* Floating pill — bottom left */}
                <div className="absolute -bottom-2 -left-4 z-20 flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0e1d36]/90 px-4 py-3 shadow-xl backdrop-blur-md">
                  <div className="grid size-8 place-items-center rounded-full bg-[#6b5cff]/20">
                    <TrendingUp className="size-4 text-[#6b5cff]" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">+31%</div>
                    <div className="text-[10px] text-white/40">este mês</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Curved bottom transition */}
          <div className="absolute inset-x-0 -bottom-px" style={{ lineHeight: 0 }}>
            <svg viewBox="0 0 1440 120" fill="none" className="block w-full" style={{ height: 120 }} preserveAspectRatio="none">
              <path d="M0 120h1440V60C1200 100 960 20 720 50S240 100 0 60z" fill="#f5f7fc" />
            </svg>
          </div>
        </div>
      </section>

      {/* ============ SEGMENTS — BENTO GRID ============ */}
      <section className="relative px-6 pb-24 pt-20" id="solucoes">
        <div className="mx-auto max-w-7xl">
          {/* Section header — left-aligned, editorial style */}
          <div className="mb-16 grid items-end gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <span className="inline-block rounded-full bg-[#6b5cff]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#6b5cff]">
                Soluções por segmento
              </span>
              <h2 className="mt-5 font-display text-[clamp(2.2rem,4vw,3.6rem)] leading-[1] tracking-tight text-[#0a1930]">
                Cada negócio tem seu ritmo.
                <br />
                <span className="text-[#6b5cff]">Seu sistema também.</span>
              </h2>
            </div>
            <p className="max-w-md text-base leading-relaxed text-[#6b7a94] lg:text-right">
              Estrutura, acessos e rotina operacional ajustados para cada segmento — sem perder velocidade nem leitura de
              negócio.
            </p>
          </div>

          {/* Bento grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {segments.map((seg, i) => {
              const Icon = seg.icon;
              const isLarge = i === 0 || i === 3;
              return (
                <article
                  key={seg.title}
                  className={`group relative overflow-hidden rounded-3xl border border-[#e4e8f2] bg-white p-7 shadow-[0_2px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] ${isLarge ? "md:col-span-2 lg:col-span-1" : ""}`}
                >
                  {/* Accent line top */}
                  <div className="absolute inset-x-0 top-0 h-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: seg.gradient }} />
                  <div className="mb-5 inline-flex size-12 items-center justify-center rounded-2xl text-white shadow-lg" style={{ background: seg.gradient }}>
                    <Icon className="size-5" />
                  </div>
                  <h3 className="font-display text-xl font-bold tracking-tight text-[#0a1930]">{seg.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#6b7a94]">{seg.description}</p>
                  <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-[#6b5cff] opacity-0 transition-all duration-300 group-hover:opacity-100">
                    Saiba mais <ChevronRight className="size-4" />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ PLATFORM FEATURES — DARK IMMERSIVE ============ */}
      <section className="relative overflow-hidden" id="plataforma">
        {/* Background */}
        <div className="absolute inset-0 bg-[linear-gradient(145deg,#061427_0%,#0b2040_50%,#0d2a4e_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_70%_20%,rgba(107,92,255,0.12),transparent),radial-gradient(ellipse_40%_40%_at_20%_80%,rgba(22,213,176,0.08),transparent)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }}
        />

        <div className="relative px-6 py-24 lg:py-32">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-16 max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/60">
                <Zap className="size-3 text-[#ffbe45]" />
                Funcionalidades
              </span>
              <h2 className="mt-6 font-display text-[clamp(2.2rem,4vw,3.6rem)] leading-[1] tracking-tight text-white">
                Tudo o que sua
                <br />
                empresa precisa.{" "}
                <span className="bg-gradient-to-r from-[#ffbe45] to-[#ff8a45] bg-clip-text text-transparent">
                  Em um só lugar.
                </span>
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-white/50">
                Um ecossistema pensado para integrar vendas, estoque, retaguarda, financeiro e leitura gerencial com
                clareza operacional.
              </p>
            </div>

            {/* Features grid — 2 rows x 4 cols */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {capabilities.map((cap, i) => {
                const Icon = cap.icon;
                return (
                  <article
                    key={cap.title}
                    className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.06]"
                  >
                    <div
                      className="mb-4 inline-flex size-10 items-center justify-center rounded-xl"
                      style={{ background: `${cap.color}20`, color: cap.color }}
                    >
                      <Icon className="size-5" />
                    </div>
                    <h3 className="font-display text-base font-bold tracking-tight text-white">{cap.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/45">{cap.desc}</p>
                    {i === 0 && (
                      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#16d5b0] to-[#6b5cff]"
                          style={{ width: "76%" }}
                        />
                      </div>
                    )}
                    {/* Hover glow */}
                    <div
                      className="absolute -right-6 -top-6 size-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: cap.color }}
                    />
                  </article>
                );
              })}
            </div>

            {/* Bottom CTA row inside dark section */}
            <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
              <div className="flex flex-wrap gap-3">
                {["Vendas", "Estoque", "Financeiro", "Fiscal", "Retaguarda", "Integrações"].map((tab, i) => (
                  <span
                    key={tab}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                      i === 0
                        ? "bg-[#6b5cff] text-white shadow-[0_0_20px_rgba(107,92,255,0.3)]"
                        : "bg-white/5 text-white/50 hover:bg-white/8 hover:text-white/70"
                    }`}
                  >
                    {tab}
                  </span>
                ))}
              </div>
              <a
                href="#rodape"
                className="inline-flex items-center gap-2 rounded-full border border-[#16d5b0]/30 bg-[#16d5b0]/10 px-6 py-3 text-sm font-semibold text-[#16d5b0] transition-all duration-200 hover:bg-[#16d5b0]/20"
              >
                Falar com especialista <ArrowRight className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PRESENCE / METRICS — Staggered Layout ============ */}
      <section className="relative overflow-hidden px-6 py-24 lg:py-32" id="empresa">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-start gap-16 lg:grid-cols-[0.55fr_0.45fr]">
            {/* Left — editorial copy + metrics */}
            <div>
              <span className="inline-block rounded-full bg-[#16d5b0]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#16d5b0]">
                Nossa presença
              </span>
              <h2 className="mt-5 font-display text-[clamp(2.2rem,4vw,3.6rem)] leading-[1] tracking-tight text-[#0a1930]">
                Presente no Brasil
                <br />
                <span className="text-[#6b5cff]">e no Paraguai.</span>
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-[#6b7a94]">
                Solução feita para empresas que precisam de tecnologia, suporte humano e operação contínua.
              </p>

              {/* Metrics — staggered 2-col layout */}
              <div className="mt-12 grid grid-cols-2 gap-4">
                {metrics.map((m, i) => (
                  <div
                    key={m.label}
                    className={`rounded-3xl border border-[#e4e8f2] bg-white p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] ${i % 2 !== 0 ? "translate-y-6" : ""}`}
                  >
                    <div className="font-display text-[2.5rem] font-bold leading-none" style={{ color: m.color }}>
                      {m.value}
                    </div>
                    <p className="mt-3 text-sm text-[#6b7a94]">{m.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#e8faf4] px-5 py-2.5 text-sm font-semibold text-[#0d8f6e]">
                <span className="size-2 animate-pulse rounded-full bg-[#16d5b0]" />
                Suporte humano e implantação guiada
              </div>
            </div>

            {/* Right — immersive card */}
            <div className="relative mt-6 lg:mt-12">
              <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-[#dce7f9] to-[#eff4ff] opacity-50 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-[#d4ddf0] p-2 shadow-xl" style={{ background: 'linear-gradient(180deg, #e2ecfc, #f0f5ff)' }}>
                <div className="relative overflow-hidden rounded-[1.6rem] px-8 py-12 text-white" style={{ background: 'linear-gradient(145deg, #0e2744, #1a4a7a)' }}>
                  {/* Decorative orbs */}
                  <div className="absolute right-0 top-0 size-32 translate-x-1/4 rounded-full bg-[#16d5b0] opacity-[0.08] blur-3xl" />
                  <div className="absolute bottom-0 left-0 size-24 -translate-x-1/4 rounded-full bg-[#6b5cff] opacity-[0.08] blur-3xl" />

                  <div className="relative">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">
                      Conheça a operação
                    </div>
                    <h3 className="mt-4 max-w-sm font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.05] tracking-tight">
                      Uma estrutura comercial pronta para vender e escalar.
                    </h3>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55">
                      Painel web, loja, estoque, financeiro e mobilidade conectados dentro do mesmo desenho operacional.
                    </p>
                    <button className="mt-8 inline-flex size-14 items-center justify-center rounded-full bg-[#16d5b0] text-[#062030] shadow-[0_0_30px_rgba(22,213,176,0.4)] transition-all duration-300 hover:shadow-[0_0_50px_rgba(22,213,176,0.55)]">
                      <Play className="size-5 fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MOBILITY — Full-width Split ============ */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.2)]" style={{ background: 'linear-gradient(145deg, #07152a, #0c2444 50%, #143c68)' }}>
            <div className="grid lg:grid-cols-2">
              {/* Left copy */}
              <div className="flex flex-col justify-center p-10 text-white lg:p-14">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/60">
                  <Smartphone className="size-3" />
                  Mobilidade
                </span>
                <h2 className="mt-6 font-display text-[clamp(2rem,3.5vw,3.2rem)] leading-[1.02] tracking-tight">
                  Sua empresa
                  <br />
                  <span className="bg-gradient-to-r from-[#16d5b0] to-[#6b5cff] bg-clip-text text-transparent">
                    na palma da mão.
                  </span>
                </h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-white/50">
                  Consulte desempenho, acompanhe indicadores e tome decisões melhores mesmo longe do caixa.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/download"
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-[#16d5b0] px-6 text-sm font-bold text-[#062030] shadow-[0_0_30px_rgba(22,213,176,0.25)] transition hover:-translate-y-0.5"
                  >
                    Saiba mais <ArrowRight className="size-4" />
                  </Link>
                  <span className="inline-flex h-12 items-center rounded-full border border-white/10 px-5 text-sm text-white/50">
                    Android e iOS
                  </span>
                </div>
              </div>

              {/* Right — feature showcase */}
              <div className="flex flex-col justify-center gap-5 p-10 lg:p-14">
                {/* App preview card */}
                <div className="rounded-2xl border border-white/8 p-5" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))' }}>
                  <div className="flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-xl" style={{ background: 'linear-gradient(135deg, #16d5b0, #6b5cff)' }}>
                      <Smartphone className="size-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Painel Mobile</div>
                      <div className="text-xs text-white/40">Resumo em tempo real</div>
                    </div>
                  </div>
                </div>

                {/* Feature items */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { label: "Vendas por loja", value: "R$ 18,4k", color: "#16d5b0" },
                    { label: "Fechamento", value: "98% ok", color: "#6b5cff" },
                    { label: "Alertas ativos", value: "3 novos", color: "#ffbe45" },
                    { label: "Estoque", value: "Synced", color: "#16d5b0" }
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-white/6 bg-white/[0.04] p-4">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-white/35">{item.label}</div>
                      <div className="mt-2 font-display text-lg font-bold" style={{ color: item.color }}>{item.value}</div>
                    </div>
                  ))}
                </div>

                {/* Status bar */}
                <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.04] px-5 py-3">
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <span className="size-2 animate-pulse rounded-full bg-[#16d5b0]" />
                    Operação conectada
                  </div>
                  <div className="rounded-full bg-[#16d5b0]/15 px-3 py-1 text-xs font-semibold text-[#16d5b0]">
                    Online
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ DIFFERENTIALS — Cards + Showcase ============ */}
      <section className="relative px-6 pb-24" id="diferenciais">
        <div className="mx-auto max-w-7xl">
          {/* Header — right-aligned for variety */}
          <div className="mb-16 flex flex-col items-end text-right">
            <span className="inline-block rounded-full bg-[#ffbe45]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#d49a2e]">
              Diferenciais
            </span>
            <h2 className="mt-5 max-w-xl font-display text-[clamp(2.2rem,4vw,3.6rem)] leading-[1] tracking-tight text-[#0a1930]">
              Detalhes que fazem
              <br />a <span className="text-[#6b5cff]">diferença.</span>
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left — 2x2 cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              {differentials.map((d) => {
                const Icon = d.icon;
                return (
                  <article
                    key={d.title}
                    className="group rounded-3xl border border-[#e4e8f2] bg-white p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
                  >
                    <div
                      className="mb-4 inline-flex size-11 items-center justify-center rounded-2xl"
                      style={{ background: `${d.color}15`, color: d.color }}
                    >
                      <Icon className="size-5" />
                    </div>
                    <h3 className="font-display text-lg font-bold tracking-tight text-[#0a1930]">{d.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#6b7a94]">{d.description}</p>
                  </article>
                );
              })}
            </div>

            {/* Right — showcase card */}
            <div className="relative overflow-hidden rounded-[2.5rem] p-8 text-white shadow-xl" style={{ background: 'linear-gradient(145deg, #0e1f38, #132e52 50%, #1b4068)' }}>
              {/* Glow */}
              <div className="absolute right-0 top-0 size-32 translate-x-1/4 -translate-y-1/4 rounded-full bg-[#16d5b0] opacity-[0.08] blur-3xl" />
              <div className="absolute bottom-0 left-0 size-24 -translate-x-1/4 translate-y-1/4 rounded-full bg-[#6b5cff] opacity-[0.08] blur-3xl" />

              <div className="relative flex min-h-[380px] flex-col justify-between">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/60">
                    Operação ao vivo
                  </span>
                  <h3 className="mt-5 max-w-xs font-display text-[1.8rem] leading-[1.08] tracking-tight text-white">
                    Time, suporte e plataforma no mesmo ritmo.
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/65">
                    Uma base forte para vender mais, operar com contexto certo e expandir sem perder padrão.
                  </p>
                </div>

                {/* Icon stack */}
                <div className="absolute right-2 top-8 grid gap-3">
                  {[
                    { bg: "#6b5cff", icon: Store },
                    { bg: "#ffbe45", icon: CreditCard },
                    { bg: "#16d5b0", icon: Building2 },
                    { bg: "#6b5cff", icon: BarChart3 }
                  ].map(({ bg, icon: Ic }, idx) => (
                    <div
                      key={idx}
                      className="flex size-11 items-center justify-center rounded-xl shadow-lg"
                      style={{ background: `${bg}25`, color: bg }}
                    >
                      <Ic className="size-4" />
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-white/8 bg-white/5 px-5 py-4">
                  <div className="text-[10px] uppercase tracking-widest text-white/35">Resumo</div>
                  <div className="mt-2 text-sm text-white/60">
                    Suporte, acesso e leitura comercial centralizados em uma só experiência.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[2.5rem] px-8 py-16 text-center text-white shadow-2xl sm:px-14 sm:py-20" style={{ background: 'linear-gradient(145deg, #0a1930 0%, #0e2444 50%, #163c68 100%)' }}>
            {/* Glow orbs */}
            <div className="absolute left-0 top-0 size-48 -translate-x-1/4 -translate-y-1/4 rounded-full bg-[#6b5cff] opacity-[0.1] blur-3xl" />
            <div className="absolute bottom-0 right-0 size-40 translate-x-1/4 translate-y-1/4 rounded-full bg-[#16d5b0] opacity-[0.08] blur-3xl" />
            <div className="absolute right-1/3 top-1/2 size-24 rounded-full bg-[#ffbe45] opacity-[0.05] blur-3xl" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/60">
                Comece hoje mesmo
              </span>
              <h2 className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2.2rem,4vw,3.8rem)] leading-[1] tracking-tight">
                Pronto para ter{" "}
                <span className="text-[#ffbe45]">
                  controle total
                </span>{" "}
                do seu negócio?
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/50">
                Organize vendas, estoque, retaguarda e mobilidade em uma plataforma desenhada para operar com clareza.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/registro"
                  className="inline-flex h-14 items-center gap-2 rounded-full bg-[#16d5b0] px-8 text-sm font-bold text-[#062030] shadow-[0_0_40px_rgba(22,213,176,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_60px_rgba(22,213,176,0.45)]"
                >
                  Demonstração gratuita <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex h-14 items-center rounded-full border border-white/15 bg-white/5 px-8 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Entrar agora
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/40">
                <span className="flex items-center gap-2">
                  <Check className="size-4 text-[#16d5b0]" />
                  Sem cartão de crédito
                </span>
                <span className="flex items-center gap-2">
                  <Check className="size-4 text-[#16d5b0]" />
                  Suporte humano
                </span>
                <span className="flex items-center gap-2">
                  <Check className="size-4 text-[#16d5b0]" />
                  Implantação guiada
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-[#e4e8f2] bg-white" id="rodape">
        <div className="mx-auto max-w-7xl px-6 py-20">
          {/* Top — Brand */}
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
            <div className="max-w-md">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-[#0c2c4e] to-[#16d5b0] text-sm font-black text-white">
                  R
                </div>
                <div>
                  <div className="font-display text-lg font-bold tracking-tight text-[#0a1930]">Revendeo</div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-[#8895b0]">software comercial</div>
                </div>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-[#6b7a94]">
                Solução comercial com painel web, PDV e mobilidade para empresas que precisam crescer com leitura,
                suporte e operação mais consistente.
              </p>
              <div className="mt-6 flex gap-2">
                {[
                  { icon: Instagram, label: "Instagram" },
                  { icon: Facebook, label: "Facebook" },
                  { icon: Linkedin, label: "LinkedIn" },
                  { icon: Youtube, label: "YouTube" }
                ].map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="grid size-10 place-items-center rounded-xl border border-[#e4e8f2] text-[#8895b0] transition-all duration-200 hover:border-[#6b5cff]/30 hover:text-[#6b5cff]"
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Contact card */}
            <div className="flex flex-col gap-5 lg:items-end">
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8895b0]">Fale conosco</div>
              <div className="space-y-3 text-sm text-[#6b7a94]">
                <div className="flex items-center gap-3">
                  <div className="grid size-9 place-items-center rounded-xl bg-[#16d5b0]/10">
                    <Phone className="size-4 text-[#16d5b0]" />
                  </div>
                  <span>(64) 3532-2005</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="grid size-9 place-items-center rounded-xl bg-[#ffbe45]/10">
                    <Mail className="size-4 text-[#ffbe45]" />
                  </div>
                  <span>comercial@revendeo.com.br</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="grid size-9 place-items-center rounded-xl bg-[#6b5cff]/10">
                    <MapPin className="size-4 text-[#6b5cff]" />
                  </div>
                  <span>Maringá - PR</span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle — Footer groups */}
          <div className="mt-14 grid gap-10 border-t border-[#e4e8f2] pt-12 sm:grid-cols-3">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8895b0]">
                  {group.title}
                </div>
                <div className="mt-5 grid gap-3 text-sm leading-relaxed text-[#6b7a94]">
                  {group.items.map((item) => (
                    <div key={item}>{item}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col gap-4 border-t border-[#e4e8f2] pt-8 text-sm text-[#8895b0] sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 Revendeo. Todos os direitos reservados.</span>
            <div className="flex gap-5">
              <Link href="/login" className="transition hover:text-[#6b5cff]">
                Login
              </Link>
              <Link href="/registro" className="transition hover:text-[#6b5cff]">
                Criar conta
              </Link>
              <Link href="/download" className="transition hover:text-[#6b5cff]">
                Download
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
