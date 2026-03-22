import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Boxes,
  Building2,
  Check,
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
  Youtube
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
};

type Segment = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type PlatformFeature = {
  title: string;
  description: string;
};

type PresenceMetric = {
  value: string;
  label: string;
  tone: string;
};

type Differential = {
  icon: LucideIcon;
  title: string;
  description: string;
  tone: string;
};

type FooterGroup = {
  title: string;
  items: string[];
};

const navItems: NavItem[] = [
  { label: "Solucoes", href: "#solucoes" },
  { label: "Produtos", href: "#plataforma" },
  { label: "Empresa", href: "#presenca" },
  { label: "Blog", href: "#diferenciais" },
  { label: "Contato", href: "#rodape" }
];

const segments: Segment[] = [
  {
    icon: Shirt,
    title: "Roupas e Calcados",
    description: "Colecao, grade, caixa e venda consultiva no mesmo fluxo."
  },
  {
    icon: ShoppingBasket,
    title: "Supermercados",
    description: "Operacao de alto giro com leitura comercial por loja e turno."
  },
  {
    icon: Wrench,
    title: "Auto Pecas e Oficinas",
    description: "Itens tecnicos, consulta rapida e atendimento de balcao com contexto."
  },
  {
    icon: UtensilsCrossed,
    title: "Bares e Restaurantes",
    description: "Comandas, recebimento e fechamento conectados a uma retaguarda so."
  },
  {
    icon: Boxes,
    title: "Distribuidores",
    description: "Estoque, tabela comercial e expansao com governanca mais simples."
  },
  {
    icon: Smartphone,
    title: "Forca de Vendas",
    description: "Painel, equipe externa e decisao comercial lendo a mesma operacao."
  }
];

const platformTabs = ["Vendas", "Estoque", "Financeiro", "Fiscal", "Retaguarda", "Integracoes"];

const platformFeatures: PlatformFeature[] = [
  { title: "Controle de vendas", description: "Caixa, recebimento, ticket medio e historico por unidade." },
  { title: "Reposicao com agilidade", description: "Entrada, saida e saldo por loja sem depender de planilha." },
  { title: "Fluxo financeiro", description: "Receita, despesas e conferencias no mesmo painel." },
  { title: "Multiempresa", description: "Uma conta central com lojas e equipes em contexto certo." },
  { title: "Cadastro por vendedor", description: "Permissao, trilha operacional e leitura por usuario." },
  { title: "Monitor de indicadores", description: "Visao comercial e operacional com decisao em tempo real." },
  { title: "Fiscal simplificado", description: "XML, documentos e rotina de conferencia sem ruido." },
  { title: "Retaguarda central", description: "Produto, preco e estoque organizados para crescer." },
  { title: "Integracoes essenciais", description: "PDV, painel web e mobilidade sincronizados." }
];

const presenceMetrics: PresenceMetric[] = [
  { value: "1+", label: "ano de operacao solida", tone: "text-[#7b61ff]" },
  { value: "272+", label: "clientes", tone: "text-[#16d5b0]" },
  { value: "1.091+", label: "usuarios ativos", tone: "text-[#ffbe45]" },
  { value: "6+", label: "ecossistemas conectados", tone: "text-[#7b61ff]" },
  { value: "30", label: "regioes atendidas", tone: "text-[#16d5b0]" },
  { value: "1", label: "painel para operar tudo", tone: "text-[#ffbe45]" }
];

const differentials: Differential[] = [
  {
    icon: Headset,
    title: "Suporte rapido e humano",
    description: "Time proximo da operacao, com resposta direta e linguagem de negocio.",
    tone: "text-[#8a6dff]"
  },
  {
    icon: Globe2,
    title: "Evolucao constante",
    description: "Plataforma viva, com entregas orientadas pelo que acontece na loja.",
    tone: "text-[#16d5b0]"
  },
  {
    icon: LayoutGrid,
    title: "Interfaces simples e faceis",
    description: "Leitura visual limpa para vender, consultar e fechar caixa com rapidez.",
    tone: "text-[#ffbe45]"
  },
  {
    icon: ShieldCheck,
    title: "Seguranca do desenho",
    description: "Conta, empresa, loja e terminal organizados para operar com contexto.",
    tone: "text-[#9e8cff]"
  }
];

const footerGroups: FooterGroup[] = [
  {
    title: "Contato",
    items: ["(64) 3532-2005", "WhatsApp comercial", "comercial@revendeo.com.br"]
  },
  {
    title: "Unidades",
    items: ["Goias do Iguacu - PR", "Castanhal - PR", "Maringa - PR"]
  },
  {
    title: "Endereco",
    items: ["Edificio 07", "Av. Jose Nardin, 366", "Sala 02"]
  }
];

const heroBackground = {
  backgroundImage: `
    radial-gradient(circle at 12% 16%, rgba(20, 212, 178, 0.14), transparent 22%),
    radial-gradient(circle at 76% 18%, rgba(123, 97, 255, 0.18), transparent 28%),
    linear-gradient(180deg, rgba(255,255,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(115deg, #061427 0%, #081d34 46%, #08192a 100%)
  `,
  backgroundSize: "auto, auto, 44px 44px, 44px 44px, auto"
};

const dotGridBackground = {
  backgroundImage: "radial-gradient(rgba(125, 141, 185, 0.18) 1px, transparent 1px)",
  backgroundSize: "18px 18px"
};

function SectionTag({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] ${
        dark ? "bg-white/8 text-white/70 ring-1 ring-white/12" : "bg-[#eef0ff] text-[#7a69ff] ring-1 ring-[#dfe4ff]"
      }`}
    >
      {children}
    </span>
  );
}

function SegmentCard({ icon: Icon, title, description }: Segment) {
  return (
    <article className="rounded-[1.8rem] border border-[#e7e9f4] bg-white p-6 shadow-[0_20px_45px_rgba(9,24,45,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(9,24,45,0.12)]">
      <div className="flex size-11 items-center justify-center rounded-2xl bg-[#f3efff] text-[#6b5cff] ring-1 ring-[#ddd7ff]">
        <Icon className="size-5" />
      </div>
      <h3 className="mt-5 font-display text-[1.28rem] tracking-[-0.04em] text-[#0a1930]">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[#6b7286]">{description}</p>
    </article>
  );
}

function DifferentialCard({ icon: Icon, title, description, tone }: Differential) {
  return (
    <article className="rounded-[1.8rem] border border-[#e8eaf4] bg-white p-6 shadow-[0_18px_46px_rgba(9,24,45,0.08)]">
      <div className={`flex size-11 items-center justify-center rounded-2xl bg-[#f8f9ff] ${tone} ring-1 ring-[#eceefe]`}>
        <Icon className="size-5" />
      </div>
      <h3 className="mt-5 font-display text-[1.24rem] tracking-[-0.04em] text-[#0a1930]">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[#6b7286]">{description}</p>
    </article>
  );
}

function FloatingPill({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <div
      className={`absolute rounded-full border border-white/12 bg-[#0c1f39]/88 px-4 py-2 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(4,10,20,0.3)] backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
}

function HeroVisual() {
  const orderQueue = ["Mesa 04 - pronto", "Loja Centro - fechamento", "Reposicao Norte"];
  const summaryCards = [
    ["R$ 18,4 mil", "text-[#16d5b0]"],
    ["287 tickets", "text-[#6b5cff]"],
    ["98% estoque ok", "text-[#ffbe45]"]
  ] as const;
  const progressCards = [
    ["Produtos", "76%", "bg-[#16d5b0]"],
    ["Recebimentos", "58%", "bg-[#6b5cff]"],
    ["Reposicao", "43%", "bg-[#ffbe45]"]
  ] as const;
  const flowSteps = [
    "Conta principal conectada",
    "Loja Centro selecionada",
    "Caixa aberto e sincronizado",
    "Retaguarda com leitura ao vivo"
  ];

  return (
    <div className="relative flex min-h-[420px] items-center justify-center lg:min-h-[520px]">
      <div className="absolute left-10 top-12 size-32 rounded-full bg-[#18d6b4]/14 blur-3xl" />
      <div className="absolute right-10 top-10 size-36 rounded-full bg-[#6b5cff]/16 blur-3xl" />

      <div className="relative z-10 w-full max-w-[43rem] px-2 sm:px-4">
        <FloatingPill className="left-4 top-0 hidden sm:block">R$ 93.540</FloatingPill>
        <FloatingPill className="right-4 top-3 bg-[#173467]/90">+ 531 itens</FloatingPill>

        <div className="relative mt-12 overflow-hidden rounded-[2.5rem] border border-white/10 bg-[linear-gradient(155deg,rgba(16,35,63,0.98),rgba(7,18,33,0.98))] p-4 shadow-[0_36px_90px_rgba(2,7,15,0.46)] sm:p-5">
          <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_72%)]" />

          <div className="relative rounded-[1.9rem] border border-white/45 bg-[linear-gradient(180deg,#fdfdff,#eef3ff_48%,#dce5f8)] p-4 shadow-[inset_0_0_0_1px_rgba(10,25,48,0.08)] sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#7a86a5]">Revendeo dashboard</div>
                <div className="mt-1 font-display text-[1.35rem] tracking-[-0.05em] text-[#11203d]">Operacao em tempo real</div>
              </div>
              <div className="rounded-full bg-[#0f2550] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/72">
                Loja Centro online
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.14fr_0.86fr]">
            <div className="rounded-[1.6rem] bg-white p-4 shadow-[inset_0_0_0_1px_rgba(10,25,48,0.06)]">
              <div className="grid gap-4 md:grid-cols-[1.16fr_0.84fr]">
                <div className="rounded-[1.35rem] bg-[#f4f7ff] p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7f88a4]">Pedidos do dia</div>
                  <div className="mt-4 space-y-3">
                    {orderQueue.map((item) => (
                      <div
                        key={item}
                        className="rounded-[1.1rem] bg-white px-4 py-3 text-sm font-medium text-[#20304b] shadow-[inset_0_0_0_1px_rgba(10,25,48,0.06)]"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.35rem] bg-[#eef1ff] p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7f88a4]">Resumo</div>
                  <div className="mt-4 grid gap-3">
                    {summaryCards.map(([item, tone]) => (
                      <div key={item} className="rounded-[1.1rem] bg-white px-4 py-3 shadow-[inset_0_0_0_1px_rgba(10,25,48,0.05)]">
                        <div className="text-[10px] uppercase tracking-[0.18em] text-[#8790aa]">Indicador</div>
                        <div className={`mt-2 text-sm font-semibold ${tone}`}>{item}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {progressCards.map(([label, width, tone]) => (
                  <div key={label} className="rounded-[1.15rem] bg-[#f6f8ff] px-4 py-3">
                    <div className="text-[11px] text-[#76819e]">{label}</div>
                    <div className="mt-3 h-2 rounded-full bg-[#d9e1f4]">
                      <div className={`h-full rounded-full ${tone}`} style={{ width }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.7rem] bg-[linear-gradient(180deg,#102653,#081325)] p-5 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/46">Fluxo operacional</div>
                  <div className="mt-2 text-lg font-semibold">Retaguarda sincronizada</div>
                </div>
                <div className="rounded-full bg-white/8 px-3 py-1 text-[11px] font-semibold text-white/70">Ao vivo</div>
              </div>

              <div className="mt-5 space-y-3">
                {flowSteps.map((item, index) => (
                  <div
                    key={item}
                    className={`rounded-[1.15rem] px-4 py-3 text-sm ${
                      index === 2
                        ? "bg-[linear-gradient(135deg,rgba(22,213,176,0.34),rgba(107,92,255,0.32))] text-white"
                        : "bg-white/7 text-white/74"
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[1.25rem] border border-white/8 bg-white/6 px-4 py-4">
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/44">Agilidade operacional</div>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <div>
                    <div className="text-2xl font-semibold text-[#16d5b0]">2x</div>
                    <div className="mt-1 text-sm text-white/62">mais velocidade no fechamento</div>
                  </div>
                  <div className="h-16 w-24 rounded-[1rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.02))] p-3">
                    <div className="flex h-full items-end gap-2">
                      {[36, 58, 74].map((height, index) => (
                        <div
                          key={height}
                          className={`w-full rounded-full ${index === 0 ? "bg-[#16d5b0]/85" : index === 1 ? "bg-[#6b5cff]/85" : "bg-[#ffbe45]/85"}`}
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-5 right-5 hidden rounded-[1.4rem] border border-white/10 bg-[linear-gradient(135deg,rgba(22,213,176,0.2),rgba(107,92,255,0.24))] px-5 py-4 text-white shadow-[0_18px_40px_rgba(2,8,18,0.26)] sm:block">
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/56">Status do caixa</div>
            <div className="mt-2 text-lg font-semibold">Venda liberada</div>
            <div className="mt-1 text-sm text-white/70">Caixa aberto e sincronizado</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="bg-[#f6f7fb] text-[#09182d]">
      <section className="relative overflow-hidden" style={heroBackground}>
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-5 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between gap-5 rounded-full bg-white px-5 py-3 text-[#0a1830] shadow-[0_18px_40px_rgba(4,12,24,0.16)]">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-full bg-[linear-gradient(135deg,#0c2c4e,#17d8b5)] text-sm font-black text-white">
                R
              </div>
              <div className="leading-none">
                <div className="font-display text-xl tracking-[-0.05em]">Revendeo</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-[#55708f]">software comercial</div>
              </div>
            </div>

            <nav className="hidden items-center gap-7 text-sm text-[#2a3a52] lg:flex">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} className="transition hover:text-[#6b5cff]">
                  {item.label}
                </a>
              ))}
            </nav>

            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#16d5b0] px-5 text-sm font-semibold text-[#06243b] shadow-[0_14px_26px_rgba(22,213,176,0.24)] transition hover:-translate-y-0.5"
            >
              Abrir sistema
            </Link>
          </header>

          <div className="grid gap-14 pb-4 pt-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div className="max-w-xl space-y-7 text-white">
              <div className="space-y-5">
                <h1 className="font-display text-[clamp(3rem,6vw,5.1rem)] leading-[0.92] tracking-[-0.07em]">
                  Sistema completo
                  <br />
                  para o seu negocio
                  <br />
                  evoluir com <span className="text-[#ffbe45]">controle.</span>
                </h1>
                <p className="max-w-lg text-base leading-8 text-white/72 sm:text-lg">
                  Ferramentas para vender bem, fechar com seguranca e acompanhar a operacao com mais clareza em caixa,
                  retaguarda, estoque e mobilidade.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/registro"
                  className="inline-flex h-14 items-center justify-center rounded-full bg-[#16d5b0] px-7 text-sm font-semibold text-[#05233c] shadow-[0_20px_40px_rgba(22,213,176,0.24)] transition hover:-translate-y-0.5"
                >
                  Quero uma demonstracao gratuita
                </Link>
                <a
                  href="#plataforma"
                  className="inline-flex h-14 items-center justify-center rounded-full bg-[#6b5cff] px-7 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(107,92,255,0.24)] transition hover:-translate-y-0.5"
                >
                  Falar com especialista
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-white/68">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-[#16d5b0]" />
                  + 400 empresas
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-[#6b5cff]" />
                  multiempresa
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-[#ffbe45]" />
                  operacao online
                </div>
              </div>
            </div>

            <HeroVisual />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-[#e8ebf3]" id="solucoes">
        <div className="absolute inset-0 opacity-80" style={dotGridBackground} />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="flex justify-center">
              <SectionTag>Solucoes por segmento</SectionTag>
            </div>
            <h2 className="mt-6 font-display text-[clamp(2.2rem,4vw,3.8rem)] leading-[1.02] tracking-[-0.05em] text-[#0a1830]">
              Seu negocio nao e padrao. <span className="text-[#6b5cff]">Seu sistema tambem nao deveria ser.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[#697389] sm:text-lg">
              Estrutura, acessos e rotina operacional ajustados para cada segmento, sem perder velocidade nem leitura de
              negocio.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            {segments.map((segment) => (
              <SegmentCard key={segment.title} {...segment} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6 lg:px-8" id="plataforma">
        <div className="mx-auto max-w-5xl rounded-[2.6rem] bg-[linear-gradient(145deg,#061a30,#0b2746_58%,#11385a)] px-6 py-10 text-white shadow-[0_36px_90px_rgba(8,24,46,0.24)] sm:px-10 sm:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <div className="flex justify-center">
              <SectionTag dark>Funcionalidades</SectionTag>
            </div>
            <h2 className="mt-6 font-display text-[clamp(2.1rem,4vw,3.3rem)] leading-[1.04] tracking-[-0.05em]">
              Tudo que sua empresa precisa em um so lugar
            </h2>
            <p className="mt-5 text-base leading-8 text-white/68 sm:text-lg">
              Um ecossistema pensado para integrar vendas, estoque, retaguarda, financeiro e leitura gerencial.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {platformTabs.map((tab, index) => (
              <span
                key={tab}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  index === 0 ? "bg-[#6b5cff] text-white" : "bg-white/7 text-white/72 ring-1 ring-white/10"
                }`}
              >
                {tab}
              </span>
            ))}
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {platformFeatures.map((feature, index) => (
              <article key={feature.title} className="rounded-[1.35rem] bg-white/6 px-5 py-5 ring-1 ring-white/8">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-[#ffbe45]/18 text-[#ffbe45]">
                    <Check className="size-4" />
                  </div>
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-7 text-white/68">{feature.description}</p>
                {index === 0 ? (
                  <div className="mt-4 h-1.5 w-full rounded-full bg-white/8">
                    <div className="h-full w-[76%] rounded-full bg-[#6b5cff]" />
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-24 sm:px-6 lg:px-8" id="presenca">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-4xl text-center">
            <div className="flex justify-center">
              <SectionTag>Nossa presenca</SectionTag>
            </div>
            <h2 className="mt-6 font-display text-[clamp(2.1rem,4vw,3.4rem)] leading-[1.03] tracking-[-0.05em] text-[#0a1830]">
              Presente em todo o Brasil <span className="text-[#6b5cff]">e no Paraguai</span>
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[#697389] sm:text-lg">
              Solucao feita para empresas que precisam de tecnologia, suporte humano e operacao continua.
            </p>
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div className="grid gap-4 sm:grid-cols-2">
              {presenceMetrics.map((metric) => (
                <article key={metric.label} className="rounded-[1.6rem] border border-[#e6e9f2] bg-[#fbfcff] p-5 shadow-[0_18px_40px_rgba(9,24,45,0.06)]">
                  <div className={`font-display text-[2.35rem] tracking-[-0.05em] ${metric.tone}`}>{metric.value}</div>
                  <p className="mt-2 text-sm leading-7 text-[#697389]">{metric.label}</p>
                </article>
              ))}

              <div className="sm:col-span-2 inline-flex w-fit items-center gap-2 rounded-full bg-[#f2f8f4] px-4 py-2 text-sm text-[#2f6a54] ring-1 ring-[#d7eadf]">
                <span className="size-2.5 rounded-full bg-[#18b97a]" />
                Suporte humano e implantacao guiada
              </div>
            </div>

            <div className="rounded-[2.1rem] border border-[#dfe4ef] bg-[linear-gradient(145deg,#d7e4f9,#edf4ff_52%,#d9e6fa)] p-5 shadow-[0_24px_60px_rgba(9,24,45,0.12)]">
              <div className="relative overflow-hidden rounded-[1.7rem] bg-[linear-gradient(135deg,#0c2442,#365a8f)] px-6 py-10 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.12),transparent_26%),radial-gradient(circle_at_80%_72%,rgba(22,213,176,0.2),transparent_24%)]" />
                <div className="relative">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-white/60">Conheca a operacao</div>
                  <h3 className="mt-3 max-w-md font-display text-[clamp(2rem,3vw,3rem)] leading-[1.04] tracking-[-0.05em]">
                    Uma estrutura comercial pronta para vender e escalar.
                  </h3>
                  <p className="mt-4 max-w-lg text-sm leading-7 text-white/74">
                    Painel web, loja, estoque, financeiro e mobilidade conectados dentro do mesmo desenho operacional.
                  </p>
                  <button className="mt-8 inline-flex size-16 items-center justify-center rounded-full bg-[#16d5b0] text-[#06243b] shadow-[0_18px_40px_rgba(22,213,176,0.3)]">
                    <Play className="size-6 fill-current" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.4rem] bg-[linear-gradient(145deg,#071a2f,#0b2746_58%,#11385a)] shadow-[0_34px_88px_rgba(7,24,46,0.24)]">
          <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="p-8 text-white sm:p-10 lg:p-12">
              <SectionTag dark>Mobilidade</SectionTag>
              <h2 className="mt-6 font-display text-[clamp(2.3rem,4vw,3.8rem)] leading-[1.02] tracking-[-0.05em]">
                Sua empresa na palma da mao.
              </h2>
              <p className="mt-5 max-w-md text-base leading-8 text-white/70 sm:text-lg">
                Consulte desempenho, acompanhe indicadores e tome decisoes melhores mesmo longe do caixa.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/download"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[#16d5b0] px-6 text-sm font-semibold text-[#06243b]"
                >
                  Saiba mais
                </Link>
                <span className="inline-flex h-12 items-center rounded-full px-5 text-sm text-white/64 ring-1 ring-white/10">
                  Android e iOS
                </span>
              </div>
            </div>

            <div className="relative min-h-[320px] overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.26),transparent_22%),linear-gradient(135deg,#dce7f7,#f4f8ff_40%,#cedef6)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_28%,rgba(22,213,176,0.18),transparent_24%),radial-gradient(circle_at_68%_76%,rgba(107,92,255,0.14),transparent_20%)]" />
              <div className="absolute right-10 top-10 hidden rounded-full bg-white/78 px-4 py-2 text-sm text-[#113558] shadow-[0_14px_26px_rgba(9,24,45,0.1)] md:block">
                Gestao onde voce estiver
              </div>

              <div className="absolute bottom-4 left-[12%] h-[280px] w-[160px] rounded-[2.4rem] border border-white/60 bg-[linear-gradient(180deg,#102342,#07121f)] p-3 shadow-[0_28px_70px_rgba(5,12,24,0.28)] md:h-[330px] md:w-[190px] md:rotate-6">
                <div className="flex h-full flex-col rounded-[1.9rem] bg-[linear-gradient(180deg,#122846,#0a172a)] p-4 text-white">
                  <div className="mx-auto h-1.5 w-14 rounded-full bg-white/16" />
                  <div className="mt-5 rounded-[1.2rem] bg-[linear-gradient(135deg,rgba(22,213,176,0.24),rgba(107,92,255,0.26))] p-4">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-white/54">Painel mobile</div>
                    <div className="mt-2 text-sm font-semibold">Resumo do dia</div>
                  </div>
                  <div className="mt-4 grid gap-3">
                    {["Vendas por loja", "Fechamento", "Alertas"].map((item) => (
                      <div key={item} className="rounded-[1rem] bg-white/8 px-3 py-3 text-sm text-white/76">
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto rounded-[1.05rem] bg-[#16d5b0] px-3 py-3 text-center text-sm font-semibold text-[#06243b]">
                    Operacao conectada
                  </div>
                </div>
              </div>

              <div className="absolute inset-y-0 right-0 w-[62%] bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0.04))]" />
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8" id="diferenciais">
        <div className="absolute inset-0 opacity-75" style={dotGridBackground} />
        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto max-w-4xl text-center">
            <div className="flex justify-center">
              <SectionTag>Por que nos escolher</SectionTag>
            </div>
            <h2 className="mt-6 font-display text-[clamp(2.1rem,4vw,3.5rem)] leading-[1.03] tracking-[-0.05em] text-[#0a1830]">
              Detalhes que fazem a <span className="text-[#6b5cff]">diferenca</span>
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[#697389] sm:text-lg">
              O valor esta no desenho do processo, na clareza visual e na velocidade para trabalhar melhor.
            </p>
          </div>

          <div className="mt-16 grid gap-6 xl:grid-cols-[1fr_0.94fr]">
            <div className="grid gap-5 md:grid-cols-2">
              {differentials.map((item) => (
                <DifferentialCard key={item.title} {...item} />
              ))}
            </div>

            <div className="relative overflow-hidden rounded-[2.2rem] bg-[linear-gradient(145deg,#0a1c31,#112c4d_58%,#19395f)] p-7 text-white shadow-[0_28px_76px_rgba(8,24,46,0.22)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(255,255,255,0.08),transparent_22%),radial-gradient(circle_at_84%_68%,rgba(22,213,176,0.18),transparent_18%)]" />
              <div className="relative min-h-[360px] rounded-[1.7rem] border border-white/8 bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6">
                <div className="max-w-xs">
                  <SectionTag dark>Operacao ao vivo</SectionTag>
                  <h3 className="mt-5 font-display text-[2.1rem] leading-[1.04] tracking-[-0.05em]">Time, suporte e plataforma no mesmo ritmo.</h3>
                  <p className="mt-4 text-sm leading-7 text-white/68">
                    Uma base forte para vender mais, operar com contexto certo e expandir sem perder padrao.
                  </p>
                </div>

                <div className="absolute right-4 top-8 grid gap-4">
                  {[
                    { bgClass: "bg-[#f6efff]", textClass: "text-[#7e63ff]", icon: Store },
                    { bgClass: "bg-[#fff5df]", textClass: "text-[#ffbe45]", icon: CreditCard },
                    { bgClass: "bg-[#effffc]", textClass: "text-[#16d5b0]", icon: Building2 },
                    { bgClass: "bg-[#f1f4ff]", textClass: "text-[#95a1ff]", icon: BarChart3 }
                  ].map(({ bgClass, textClass, icon: Icon }, index) => (
                    <div
                      key={index}
                      className={`flex size-12 items-center justify-center rounded-2xl shadow-[0_14px_26px_rgba(9,24,45,0.12)] ${bgClass} ${textClass}`}
                    >
                      <Icon className="size-5" />
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-7 left-6 right-6 rounded-[1.3rem] bg-white/8 px-5 py-4 ring-1 ring-white/10">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/44">Resumo</div>
                  <div className="mt-2 text-sm text-white/76">Suporte, acesso e leitura comercial centralizados em uma so experiencia.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-[linear-gradient(145deg,#061a30,#0b2746_58%,#11385a)] px-8 py-12 text-center text-white shadow-[0_34px_88px_rgba(8,24,46,0.24)] sm:px-10">
          <div className="flex justify-center">
            <SectionTag dark>Comece hoje mesmo</SectionTag>
          </div>
          <h2 className="mt-6 font-display text-[clamp(2.2rem,4vw,3.9rem)] leading-[1.02] tracking-[-0.05em]">
            Pronto para ter <span className="text-[#ffbe45]">controle total</span> do seu negocio?
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-white/68 sm:text-lg">
            Organize vendas, estoque, retaguarda e mobilidade em uma plataforma desenhada para operar com clareza.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/registro"
              className="inline-flex h-14 items-center justify-center rounded-full bg-[#16d5b0] px-7 text-sm font-semibold text-[#06243b]"
            >
              Quero uma demonstracao gratuita
            </Link>
            <Link
              href="/login"
              className="inline-flex h-14 items-center justify-center rounded-full bg-white/8 px-7 text-sm font-semibold text-white ring-1 ring-white/10"
            >
              Entrar agora
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm text-white/66">
            <span>+24 horas de leitura comercial</span>
            <span>+4.000 operacoes acompanhadas</span>
            <span>100% suporte humano</span>
          </div>
        </div>
      </section>

      <footer className="bg-[#071a2f] text-white" id="rodape">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-10 border-b border-white/10 pb-10 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-md">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-full bg-[linear-gradient(135deg,#0c2c4e,#17d8b5)] text-sm font-black text-white">
                  R
                </div>
                <div>
                  <div className="font-display text-xl tracking-[-0.05em]">Revendeo</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/42">software comercial</div>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-white/62">
                Solucao comercial com painel web, PDV e mobilidade para empresas que precisam crescer com leitura,
                suporte e operacao mais consistente.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              {footerGroups.map((group) => (
                <div key={group.title}>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42">{group.title}</div>
                  <div className="mt-4 grid gap-3 text-sm text-white/64">
                    {group.items.map((item) => (
                      <div key={item}>{item}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              {[
                { icon: Instagram, label: "Instagram" },
                { icon: Facebook, label: "Facebook" },
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Youtube, label: "YouTube" }
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="flex size-10 items-center justify-center rounded-xl bg-white/8 text-white/72 ring-1 ring-white/10 transition hover:bg-white/12 hover:text-white"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-6 pt-8 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="grid gap-3 text-sm text-white/58">
              <div className="flex items-center gap-3">
                <Phone className="size-4 text-[#16d5b0]" />
                <span>(64) 3532-2005</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="size-4 text-[#ffbe45]" />
                <span>comercial@revendeo.com.br</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="size-4 text-[#6b5cff]" />
                <span>Maringa - PR | Castanhal - PR | Goias do Iguacu - PR</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 text-sm text-white/44 md:flex-row md:items-center md:justify-between">
              <span>(c) 2026 Revendeo. Todos os direitos reservados.</span>
              <div className="flex flex-wrap gap-5 text-white/60">
                <Link href="/login" className="transition hover:text-white">
                  Login
                </Link>
                <Link href="/registro" className="transition hover:text-white">
                  Criar conta
                </Link>
                <Link href="/download" className="transition hover:text-white">
                  Download
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
