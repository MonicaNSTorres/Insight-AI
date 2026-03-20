import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  Building2,
  CheckCircle2,
  Database,
  LineChart,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Upload inteligente de dados",
    description:
      "Envie CSV e Excel e deixe a plataforma interpretar automaticamente a estrutura das informações.",
  },
  {
    icon: Sparkles,
    title: "Insights automáticos",
    description:
      "Receba KPIs, padrões, tendências e sinais críticos sem depender de dashboards manuais.",
  },
  {
    icon: Bot,
    title: "Perguntas em linguagem natural",
    description:
      "Converse com seus dados como se estivesse falando com um analista sênior apoiado por IA.",
  },
];

const trustItems = [
  "Pronto para operação",
  "Experiência premium",
  "Foco em decisão de negócio",
];

const metrics = [
  { label: "Tempo para insight", value: "< 60s" },
  { label: "Perguntas respondidas", value: "Ilimitadas" },
  { label: "Leitura de dataset", value: "Automática" },
];

const miniCards = [
  { icon: Database, label: "Datasets", value: "Upload e leitura automática" },
  { icon: MessageSquare, label: "Chat com IA", value: "Perguntas livres" },
  { icon: LineChart, label: "Insights", value: "Tempo real" },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111f] text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_32%),radial-gradient(circle_at_85%_18%,rgba(16,185,129,0.10),transparent_24%),linear-gradient(180deg,#0b1220_0%,#0e1728_45%,#f7faff_45%,#f7faff_100%)]" />
      <div className="absolute left-[-120px] top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute right-[-80px] top-32 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <section className="relative mx-auto max-w-[1500px] px-5 py-6 md:px-8 lg:px-10">
        <div className="overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.06] shadow-[0_30px_120px_rgba(2,8,23,0.45)] backdrop-blur-xl">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-4 md:px-8">
            <div className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-900/30">
                <BarChart3 size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-wide text-white">
                  InsightAI
                </p>
                <p className="text-xs text-slate-300">
                  Intelligence for modern companies
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.35)] transition hover:scale-[1.02]"
              >
                Solicitar acesso
                <ArrowRight size={16} />
              </Link>
            </div>
          </header>

          <div className="grid gap-10 px-5 py-8 md:px-8 md:py-10 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:py-12">
            <div className="flex flex-col justify-between">
              <div>
                <div className="mb-6 flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-100">
                    <Sparkles size={14} />
                    SaaS de inteligência analítica com IA
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">
                    <ShieldCheck size={14} />
                    Visual premium para mercado B2B
                  </div>
                </div>

                <h1 className="max-w-3xl text-4xl font-bold leading-[1.02] tracking-[-0.03em] text-white md:text-6xl xl:text-7xl">
                  Transforme planilhas e datasets em{" "}
                  <span className="bg-linear-to-r from-blue-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                    decisões inteligentes
                  </span>{" "}
                  em segundos.
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
                  O InsightAI converte arquivos brutos em dashboards, KPIs,
                  padrões e respostas em linguagem natural. Menos dependência de
                  time técnico, mais velocidade para áreas de negócio.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 to-cyan-500 px-6 py-3.5 text-base font-semibold text-white shadow-[0_18px_45px_rgba(37,99,235,0.35)] transition hover:scale-[1.02]"
                  >
                    Começar agora
                    <ArrowRight size={18} />
                  </Link>

                  <Link
                    href="/login"
                    className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-base font-medium text-white transition hover:bg-white/10"
                  >
                    Entrar na plataforma
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap gap-5">
                  {trustItems.map((item) => (
                    <div
                      key={item}
                      className="inline-flex items-center gap-2 text-sm text-slate-300"
                    >
                      <CheckCircle2 size={16} className="text-emerald-400" />
                      <span className="text-gray-500">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-10 grid gap-4 md:grid-cols-3">
                  {metrics.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(2,8,23,0.08)]"
                    >
                      <p className="text-sm font-medium text-slate-500">{item.label}</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {features.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-[26px] border border-slate-200/70 bg-white p-5 shadow-[0_20px_40px_rgba(15,23,42,0.06)]"
                    >
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-50 to-cyan-50 text-blue-600">
                        <Icon size={22} />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
              <div className="absolute -right-10 bottom-16 h-44 w-44 rounded-full bg-cyan-400/15 blur-3xl" />

              <div className="relative rounded-[34px] border border-white/10 bg-[#0b1424] p-4 shadow-[0_30px_80px_rgba(2,8,23,0.45)] md:p-5">
                <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,#0f1b31_0%,#0b1424_100%)] p-4">
                  <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <div>
                      <p className="text-sm text-slate-400">Workspace ativo</p>
                      <p className="font-semibold text-white">
                        insight-company-dataset.xlsx
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                      <Zap size={14} />
                      Processado com IA
                    </div>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-[220px_1fr]">
                    <aside className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4 text-white">
                      <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-950/30">
                          <BrainCircuit size={18} />
                        </div>
                        <div>
                          <p className="font-semibold">InsightAI</p>
                          <p className="text-xs text-slate-400">
                            Analytics Workspace
                          </p>
                        </div>
                      </div>

                      <nav className="space-y-2 text-sm">
                        {[
                          "Dashboard executivo",
                          "Datasets",
                          "Insights automáticos",
                          "Chat analítico",
                          "Configurações",
                        ].map((item, index) => (
                          <div
                            key={item}
                            className={`rounded-xl px-3 py-2.5 transition ${index === 0
                              ? "bg-linear-to-r from-blue-600/30 to-cyan-500/20 text-white"
                              : "text-slate-300 hover:bg-white/5"
                              }`}
                          >
                            {item}
                          </div>
                        ))}
                      </nav>

                      <div className="mt-5 rounded-2xl border border-white/10 bg-linear-to-br from-blue-600/15 to-cyan-500/10 p-4">
                        <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-cyan-200">
                          <Building2 size={18} />
                        </div>
                        <p className="text-sm font-semibold text-white">
                          Feito para empresas
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-300">
                          Visual profissional, leitura rápida e foco em tomada de
                          decisão.
                        </p>
                      </div>
                    </aside>

                    <div className="space-y-4">
                      <div className="rounded-[24px] border border-white/10 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.10)]">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-600">
                              Dashboard automático
                            </p>
                            <p className="mt-1 text-xl font-semibold text-[#27346b]">
                              Performance comercial consolidada
                            </p>
                          </div>

                          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">
                            Atualizado agora
                          </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                          {[
                            { label: "Receita", value: "R$ 25.102,50", delta: "+12,4%" },
                            { label: "Pedidos", value: "16.635", delta: "+8,1%" },
                            { label: "Ticket Médio", value: "R$ 152,30", delta: "+5,9%" },
                          ].map((item) => (
                            <div
                              key={item.label}
                              className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                            >
                              <p className="text-xs text-slate-500">{item.label}</p>
                              <p className="mt-2 text-xl font-bold text-slate-900">
                                {item.value}
                              </p>
                              <p className="mt-1 text-xs font-semibold text-emerald-600">
                                {item.delta} vs período anterior
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 grid gap-4 lg:grid-cols-[1.45fr_0.8fr]">
                          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <div className="mb-4 flex items-center justify-between">
                              <p className="text-sm font-semibold text-slate-700">
                                Receita por período
                              </p>
                              <p className="text-xs text-slate-400">Últimos 8 ciclos</p>
                            </div>

                            <div className="flex h-48 items-end gap-3">
                              {[18, 36, 32, 48, 44, 66, 82, 74].map((height, i) => (
                                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                                  <div
                                    className="w-full rounded-t-xl bg-linear-to-t from-blue-700 via-blue-500 to-cyan-300 shadow-[0_8px_20px_rgba(37,99,235,0.22)]"
                                    style={{ height: `${height}%` }}
                                  />
                                  <span className="text-[10px] font-medium text-slate-400">
                                    P{i + 1}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <div className="mb-4 flex items-center justify-between">
                              <p className="text-sm font-semibold text-slate-700">
                                Distribuição
                              </p>
                              <p className="text-xs text-slate-400">Categorias</p>
                            </div>

                            <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-full bg-[conic-gradient(#1d4ed8_0_36%,#38bdf8_36%_59%,#22c55e_59%_79%,#cbd5e1_79%_100%)] shadow-inner">
                              <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white">
                                <span className="text-xs text-slate-500">Top share</span>
                                <span className="text-lg font-bold text-slate-900">
                                  36%
                                </span>
                              </div>
                            </div>

                            <div className="mt-4 space-y-2">
                              {[
                                ["Enterprise", "36%"],
                                ["Mid-market", "23%"],
                                ["SMB", "20%"],
                              ].map(([label, value]) => (
                                <div
                                  key={label}
                                  className="flex items-center justify-between text-sm"
                                >
                                  <span className="text-slate-500">{label}</span>
                                  <span className="font-semibold text-slate-900">
                                    {value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-3">
                        {miniCards.map((item) => {
                          const Icon = item.icon;
                          return (
                            <div
                              key={item.label}
                              className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-white shadow-[0_10px_25px_rgba(2,8,23,0.25)] backdrop-blur"
                            >
                              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600/30 to-cyan-500/20 text-cyan-200">
                                <Icon size={18} />
                              </div>
                              <p className="text-sm text-slate-400">{item.label}</p>
                              <p className="mt-1 text-sm font-semibold text-white">
                                {item.value}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      <div className="rounded-[24px] border border-white/10 bg-linear-to-r from-blue-600/15 via-cyan-500/10 to-emerald-500/10 p-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-white">
                              Exemplo de pergunta para IA
                            </p>
                            <p className="mt-1 text-sm text-slate-300">
                              “Qual equipe teve maior tempo médio de resolução e
                              qual tendência apareceu no último período?”
                            </p>
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-cyan-100">
                            Resposta contextual + cálculo automático + explicação clara
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200/70 bg-[#f7faff] px-5 py-8 md:px-8 lg:px-10">
            <div className="grid gap-4 rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Plataforma pronta para uso
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                  Tome decisões com base em dados, sem depender de dashboards ou SQL.
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
                  O InsightAI permite que qualquer área da empresa explore dados com rapidez,
                  clareza e autonomia. Faça perguntas, identifique padrões e gere análises
                  completas em segundos — tudo em uma interface simples e poderosa.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="https://wa.me/5512982805148?text=Olá,%20tenho%20interesse%20no%20InsightAI%20e%20quero%20entender%20como%20funciona."
                  target="_blank"
                  className="rounded-2xl bg-linear-to-r from-green-500 to-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(16,185,129,0.25)] transition hover:scale-[1.02]"
                >
                  Falar com especialista
                </Link>

                <Link
                  href="/login"
                  className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Acessar plataforma
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}