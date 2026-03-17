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
    description: "Importe CSV ou Excel em poucos segundos.",
  },
  {
    icon: Sparkles,
    title: "Gere Insights Automáticos",
    description: "Descubra padrões e tendências sem esforço manual.",
  },
  {
    icon: Bot,
    title: "Análises com IA",
    description: "Converse com seus dados em linguagem natural.",
  },
];

const miniCards = [
  {
    icon: Database,
    label: "Datasets",
    value: "12+",
  },
  {
    icon: BarChart3,
    label: "Dashboards",
    value: "Auto",
  },
  {
    icon: MessageSquare,
    label: "Perguntas IA",
    value: "Livre",
  },
  {
    icon: LineChart,
    label: "Insights",
    value: "Tempo real",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f9fc_0%,#eef3fb_100%)] text-slate-900">
      <section className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-center">
          <div className="mb-4 inline-flex w-fit items-center rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
            InsightAI · BI com IA
          </div>

          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-6xl">
            Desbloqueie insights dos seus dados com dashboards e inteligência
            artificial.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Transforme planilhas em análises automáticas, dashboards visuais e
            respostas inteligentes com IA — sem depender de processos manuais.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
            >
              Começar
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Entrar
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {miniCards.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={20} />
                  </div>
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute -right-10 bottom-10 h-48 w-48 rounded-full bg-cyan-200/40 blur-3xl" />

          <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_rgba(37,99,235,0.12)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">InsightAI</p>
                <p className="text-sm text-slate-500">
                  Plataforma de BI com IA
                </p>
              </div>

              <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                SaaS Premium
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[220px_1fr]">
              <aside className="rounded-2xl bg-[linear-gradient(180deg,#163b7a_0%,#0f2f63_100%)] p-4 text-white shadow-inner">
                <div className="mb-5 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold">
                  Logo
                </div>

                <nav className="space-y-2">
                  {[
                    "Painel",
                    "Conjuntos de Dados",
                    "Insights",
                    "Chat",
                    "Configurações",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className={`rounded-xl px-3 py-2 text-sm ${
                        index === 0
                          ? "bg-blue-500/30 text-white"
                          : "text-blue-100/90"
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </nav>

                <div className="mt-8 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-xs text-blue-100">
                  Privacidade e segurança para seus dados.
                </div>
              </aside>

              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        Dashboard automático
                      </h2>
                      <p className="text-sm text-slate-500">
                        Visualização inicial do dataset
                      </p>
                    </div>

                    <div className="rounded-lg bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                      sales_data.csv
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                      <p className="text-xs text-slate-500">Receita Total</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        R$ 25.102
                      </p>
                      <p className="mt-2 text-xs text-emerald-600">+8,4%</p>
                    </div>

                    <div className="rounded-xl bg-white p-4 shadow-sm">
                      <p className="text-xs text-slate-500">Pedidos</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        16.535
                      </p>
                      <p className="mt-2 text-xs text-sky-600">+12,3%</p>
                    </div>

                    <div className="rounded-xl bg-white p-4 shadow-sm">
                      <p className="text-xs text-slate-500">Conversão</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        3,21%
                      </p>
                      <p className="mt-2 text-xs text-rose-500">-1,2%</p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-800">
                          Gráfico de Receitas
                        </p>
                        <span className="text-xs text-slate-400">últimos meses</span>
                      </div>

                      <div className="flex h-44 items-end gap-3">
                        {[30, 45, 38, 55, 48, 67, 75, 62, 81, 74].map(
                          (height, index) => (
                            <div
                              key={index}
                              className="flex-1 rounded-t-md bg-linear-to-t from-blue-600 to-blue-300"
                              style={{ height: `${height}%` }}
                            />
                          )
                        )}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="mb-4 text-sm font-semibold text-slate-800">
                        Distribuição
                      </p>

                      <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-[conic-gradient(#2563eb_0_40%,#60a5fa_40%_65%,#a5b4fc_65%_82%,#f59e0b_82%_100%)]">
                        <div className="h-20 w-20 rounded-full bg-white" />
                      </div>

                      <div className="mt-4 space-y-2 text-xs text-slate-500">
                        <div className="flex items-center justify-between">
                          <span>Sudeste</span>
                          <span>40%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Sul</span>
                          <span>25%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Nordeste</span>
                          <span>17%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {features.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.title}
                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                      >
                        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <Icon size={20} />
                        </div>
                        <h3 className="text-sm font-semibold text-slate-900">
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
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}