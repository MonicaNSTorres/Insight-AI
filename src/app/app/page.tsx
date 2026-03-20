import Link from "next/link";
import {
  Plus,
  Search,
  ArrowRight,
  Database,
  BarChart3,
  Columns3,
  MessageSquare,
  Sparkles,
  Clock3,
  Files,
} from "lucide-react";
import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/prisma";
import { AppHeader } from "@/components/app/app-header";
import { DatasetRowActions } from "@/components/app/data-row-action";

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
  }).format(new Date(value));
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const datasets = await prisma.dataset.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          columns: true,
          insights: true,
          conversations: true,
        },
      },
    },
  });

  const totalDatasets = datasets.length;
  const totalRows = datasets.reduce((acc, item) => acc + item.rowCount, 0);
  const totalColumns = datasets.reduce((acc, item) => acc + item.columnCount, 0);
  const totalQuestions = datasets.reduce(
    (acc, item) => acc + item._count.conversations,
    0
  );
  const totalInsights = datasets.reduce(
    (acc, item) => acc + item._count.insights,
    0
  );

  const latestDataset = datasets[0] ?? null;

  const mostQueriedDataset = [...datasets].sort(
    (a, b) => b._count.conversations - a._count.conversations
  )[0] ?? null;

  const metrics = [
    {
      label: "Datasets enviados",
      value: formatNumber(totalDatasets),
      helper:
        totalDatasets > 0
          ? "Bases disponíveis para análise"
          : "Nenhuma base enviada ainda",
      icon: Database,
    },
    {
      label: "Linhas processadas",
      value: formatNumber(totalRows),
      helper:
        totalRows > 0
          ? "Registros importados nas análises"
          : "Aguardando importação de registros",
      icon: BarChart3,
    },
    {
      label: "Colunas detectadas",
      value: formatNumber(totalColumns),
      helper:
        totalColumns > 0
          ? "Estrutura identificada automaticamente"
          : "Sem estrutura detectada ainda",
      icon: Columns3,
    },
    {
      label: "Interações com IA",
      value: formatNumber(totalQuestions),
      helper:
        totalQuestions > 0
          ? "Perguntas realizadas nos datasets"
          : "Nenhuma pergunta feita até agora",
      icon: MessageSquare,
    },
  ];

  const activityItems = [
    latestDataset
      ? {
        title: "Último dataset enviado",
        description: latestDataset.name,
        meta: `${formatDate(latestDataset.createdAt)} · ${latestDataset.rowCount} linhas`,
        href: `/app/dataset/${latestDataset.id}`,
        icon: Files,
      }
      : null,
    mostQueriedDataset
      ? {
        title: "Dataset mais consultado",
        description: mostQueriedDataset.name,
        meta: `${mostQueriedDataset._count.conversations} perguntas registradas`,
        href: `/app/dataset/${mostQueriedDataset.id}`,
        icon: Sparkles,
      }
      : null,
    {
      title: "Insights disponíveis",
      description: `${formatNumber(totalInsights)} insights gerados`,
      meta: "Observações automáticas já calculadas",
      href: "/app/insights",
      icon: Clock3,
    },
  ].filter(Boolean) as Array<{
    title: string;
    description: string;
    meta: string;
    href: string;
    icon: typeof Files;
  }>;

  return (
    <>
      <AppHeader
        title="Painel"
        description="Visão geral dos seus datasets, métricas e atividade recente."
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

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-500">{item.label}</p>
                  <p className="mt-3 text-4xl font-bold leading-none text-[#27346b]">
                    {item.value}
                  </p>
                  <p className="mt-3 text-sm font-medium text-slate-500">
                    {item.helper}
                  </p>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-[32px] font-bold text-[#27346b]">Seus datasets</h2>
              <p className="mt-1 text-sm text-slate-500">
                Bases mais recentes para exploração, insights e perguntas com IA.
              </p>
            </div>

            <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-3">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                disabled
                placeholder="Buscar..."
                className="w-40 bg-transparent px-2 text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50">
            {datasets.length ? (
              datasets.map((dataset) => (
                <div
                  key={dataset.id}
                  className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 last:border-b-0"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">
                      {dataset.name}
                    </p>
                    <p className="mt-1 truncate text-sm text-slate-500">
                      {dataset.fileName}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      {dataset.rowCount} linhas · {dataset.columnCount} colunas ·{" "}
                      {dataset._count.conversations} perguntas ·{" "}
                      {formatDate(dataset.createdAt)}
                    </p>
                  </div>

                  <DatasetRowActions
                    datasetId={dataset.id}
                    datasetName={dataset.name}
                  />
                </div>
              ))
            ) : (
              <div className="px-6 py-10 text-center text-sm text-slate-500">
                Nenhum dataset encontrado.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Resumo</h2>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Datasets</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {formatNumber(totalDatasets)}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Linhas processadas</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {formatNumber(totalRows)}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Insights gerados</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {formatNumber(totalInsights)}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Último upload</p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {latestDataset
                    ? formatDate(latestDataset.createdAt)
                    : "Ainda não há uploads"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Atividade recente
            </h2>

            <div className="mt-5 space-y-4">
              {activityItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={`${item.title}-${item.href}`}
                    href={item.href}
                    className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <Icon size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900">
                          {item.title}
                        </p>
                        <p className="mt-1 truncate text-sm text-slate-700">
                          {item.description}
                        </p>
                        <p className="mt-2 text-xs text-slate-400">{item.meta}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}