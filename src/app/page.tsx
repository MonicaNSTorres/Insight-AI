import Link from "next/link";
import {
  BarChart3,
  Bot,
  Database,
  LineChart,
  MessageSquare,
  Sparkles,
  Upload,
} from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Envie Conjuntos de Dados",
    description: "CSV, Excel e futuras integrações com fontes externas.",
  },
  {
    icon: Sparkles,
    title: "Gere Insights Automáticos",
    description: "KPIs, tendências e sinais relevantes em segundos.",
  },
  {
    icon: Bot,
    title: "Analise com IA",
    description: "Pergunte e obtenha respostas em linguagem natural.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f5f7fd_0%,#eef3fb_100%)] px-5 py-6 text-slate-900">
      <section className="mx-auto max-w-370">
        <div className="overflow-hidden rounded-[34px] border border-white/70 bg-white/70 p-6 shadow-[0_20px_60px_rgba(37,99,235,0.08)] backdrop-blur">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="flex flex-col justify-between">
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 rounded-full text-[15px] font-semibold text-slate-800">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-600 text-white">
                      ✓
                    </span>
                    InsightAI
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href="/login"
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
                    >
                      Criar Conta
                    </Link>
                  </div>
                </div>

                <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-[#222D63] md:text-6xl">
                  Desbloqueie Insights dos Seus Dados
                </h1>

                <p className="mt-5 max-w-md text-[18px] leading-8 text-slate-600">
                  Transforme suas planilhas em dashboards automáticos com IA
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/register"
                    className="rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
                  >
                    Começar
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-base font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                  >
                    Login
                  </Link>
                </div>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {features.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
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
              <div className="rounded-[30px] border border-slate-200 bg-[linear-gradient(180deg,#f5f7ff_0%,#eef3fb_100%)] p-5 shadow-[0_24px_70px_rgba(59,130,246,0.12)]">
                <div className="grid gap-4 md:grid-cols-[220px_1fr]">
                  <aside className="rounded-[24px] bg-[linear-gradient(180deg,#173C7C_0%,#102F63_100%)] p-4 text-white">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                        <BarChart3 size={18} />
                      </div>
                      <p className="font-semibold">InsightAI</p>
                    </div>

                    <nav className="space-y-2 text-sm">
                      {[
                        "Painel",
                        "Conjuntos de Dados",
                        "Insights",
                        "Chat",
                        "Configurações",
                      ].map((item, index) => (
                        <div
                          key={item}
                          className={`rounded-xl px-3 py-2 ${
                            index === 0
                              ? "bg-blue-500/30 text-white"
                              : "text-blue-100/90"
                          }`}
                        >
                          {item}
                        </div>
                      ))}
                    </nav>
                  </aside>

                  <div className="space-y-4">
                    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-xl font-semibold text-[#27346b]">
                          Dashboard automático
                        </p>
                        <div className="rounded-xl bg-slate-50 px-3 py-1 text-xs text-slate-500">
                          sales_data.csv
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        {[
                          { label: "Receita", value: "R$25,102.50" },
                          { label: "Pedidos", value: "16,635" },
                          { label: "Ticket Médio", value: "R$152.30" },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className="rounded-2xl bg-slate-50 p-4"
                          >
                            <p className="text-xs text-slate-500">{item.label}</p>
                            <p className="mt-2 text-1xl font-bold text-slate-900">
                              {item.value}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="mb-4 text-sm font-semibold text-slate-700">
                            Gráfico de Receita
                          </p>
                          <div className="flex h-44 items-end gap-3">
                            {[16, 32, 30, 44, 42, 61, 78, 70].map((height, i) => (
                              <div
                                key={i}
                                className="flex-1 rounded-t-md bg-linear-to-t from-blue-600 to-blue-300"
                                style={{ height: `${height}%` }}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="mb-4 text-sm font-semibold text-slate-700">
                            Categorias
                          </p>
                          <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-[conic-gradient(#2563eb_0_35%,#60a5fa_35%_58%,#f5b184_58%_78%,#8fd2e6_78%_100%)]">
                            <div className="h-20 w-20 rounded-full bg-slate-50" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                      {[
                        { icon: Database, label: "Datasets", value: "Auto" },
                        { icon: MessageSquare, label: "Perguntas IA", value: "Livre" },
                        { icon: LineChart, label: "Insights", value: "Tempo real" },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={item.label}
                            className="rounded-2xl text-1xl border border-slate-200 bg-white p-4 shadow-sm"
                          >
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                              <Icon size={18} />
                            </div>
                            <p className="text-sm text-slate-500">{item.label}</p>
                            <p className="mt-1 font-semibold text-slate-900">
                              {item.value}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}