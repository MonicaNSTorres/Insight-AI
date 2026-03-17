import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { auth } from "@/src/auth";
import { AppHeader } from "@/components/app/app-header";

const metrics = [
  {
    label: "Datasets",
    value: "0",
    change: "Nenhum dataset enviado",
  },
  {
    label: "Insights gerados",
    value: "0",
    change: "Sem análises ainda",
  },
  {
    label: "Perguntas feitas",
    value: "0",
    change: "Chat ainda não utilizado",
  },
  {
    label: "Dashboards",
    value: "0",
    change: "Aguardando primeiro upload",
  },
];

export default async function DashboardPage() {
  const session = await auth();

  return (
    <>
      <AppHeader
        title={`Olá, ${session?.user?.name ?? "usuário"}`}
        description="Bem-vinda ao InsightAI. Aqui você vai centralizar datasets, dashboards automáticos, insights e perguntas com IA."
        action={
          <Link
            href="/app/new"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Novo Dataset
          </Link>
        }
      />

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((item) => (
          <div
            key={item.label}
            className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">{item.label}</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {item.value}
            </p>
            <p className="mt-2 text-sm text-slate-400">{item.change}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Seus datasets
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Visualize os arquivos enviados e acompanhe a evolução das suas
                análises.
              </p>
            </div>

            <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-3">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Buscar dataset..."
                className="w-full bg-transparent px-2 text-sm outline-none placeholder:text-slate-400 md:w-56"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="grid grid-cols-4 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <span>Nome</span>
              <span>Linhas</span>
              <span>Upload</span>
              <span className="text-right">Ações</span>
            </div>

            <div className="flex min-h-[220px] flex-col items-center justify-center px-6 py-10 text-center">
              <div className="rounded-2xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
                Nenhum dataset encontrado
              </div>
              <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">
                Envie seu primeiro CSV ou Excel para começar a gerar dashboards,
                KPIs e análises com inteligência artificial.
              </p>

              <Link
                href="/app/new"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Plus size={18} />
                Enviar primeiro dataset
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Próximos passos
            </h2>

            <div className="mt-5 space-y-4">
              {[
                "Enviar um dataset CSV ou XLSX",
                "Gerar dashboard automático",
                "Receber insights iniciais",
                "Explorar dados com perguntas em linguagem natural",
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Status do workspace
            </h2>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Conta</p>
                <p className="mt-1 font-semibold text-slate-900">Ativa</p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Plano</p>
                <p className="mt-1 font-semibold text-slate-900">MVP / Local</p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Banco</p>
                <p className="mt-1 font-semibold text-slate-900">
                  Prisma + Neon
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}