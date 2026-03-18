import { notFound } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  Layers3,
  Trophy,
  Sparkles,
} from "lucide-react";
import { prisma } from "@/src/lib/prisma";
import { AppHeader } from "@/components/app/app-header";
import { analyzeDataset } from "@/src/lib/dataset-analysis";
import { generateDatasetInsights } from "@/src/lib/insight-generator";
import { DatasetChat } from "@/components/dataset-chat/dataset-chat";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 2,
  }).format(value);
}

export default async function DatasetPage({ params }: PageProps) {
  const { id: datasetId } = await params;

  const dataset = await prisma.dataset.findUnique({
    where: { id: datasetId },
    include: {
      columns: true,
    },
  });

  if (!dataset) {
    notFound();
  }

  const rows = Array.isArray(dataset.rawJson)
    ? (dataset.rawJson as Record<string, unknown>[])
    : [];

  const metricCandidates = dataset.columns
    .filter((column) => column.semanticRole === "metric")
    .map((column) => column.name);

  const dimensionCandidates = dataset.columns
    .filter((column) => column.semanticRole === "dimension")
    .map((column) => column.name);

  const temporalCandidates = dataset.columns
    .filter((column) => column.semanticRole === "temporal")
    .map((column) => column.name);

  const analysis = analyzeDataset({
    rows,
    metricCandidates,
    dimensionCandidates,
    temporalCandidates,
  });

  const insights = generateDatasetInsights(analysis);

  const previewRows = rows.slice(0, 5);

  const kpiCards = [
    {
      title: "Métrica principal",
      value: analysis.metricColumn ?? "Não detectada",
      subtitle: "Coluna usada para cálculos automáticos",
      icon: Layers3,
    },
    {
      title: "Valor total",
      value: formatNumber(analysis.totalValue),
      subtitle: analysis.metricColumn
        ? `Soma de ${analysis.metricColumn}`
        : "Sem métrica válida",
      icon: BarChart3,
    },
    {
      title: "Melhor categoria",
      value: analysis.bestCategory ?? "Não detectada",
      subtitle: analysis.bestCategory
        ? `${formatNumber(analysis.bestCategoryValue)}`
        : "Sem dimensão válida",
      icon: Trophy,
    },
    {
      title: "Dimensão temporal",
      value: analysis.temporalColumn ?? "Não detectada",
      subtitle: "Base para evolução no tempo",
      icon: CalendarDays,
    },
  ];

  const hasTimelineData =
    analysis.timelineChart.length > 1 &&
    analysis.timelineChart.some((item) => item.value > 0);

  return (
    <>
      <AppHeader
        title={dataset.name}
        description={`Arquivo: ${dataset.fileName} · ${dataset.rowCount} linhas · ${dataset.columnCount} colunas`}
      />

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-500">
                    {card.title}
                  </p>
                  <p className="mt-3 truncate text-2xl font-bold text-slate-900">
                    {card.value}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    {card.subtitle}
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

      <section className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Insights automáticos
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Principais observações geradas automaticamente a partir do dataset.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {insights.map((insight, index) => (
            <div
              key={`${insight.title}-${index}`}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <p className="text-sm font-semibold text-slate-900">
                {insight.title}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {insight.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-slate-900">
              Estrutura detectada
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Colunas identificadas automaticamente no upload.
            </p>
          </div>

          <div className="space-y-3">
            {dataset.columns.map((column) => (
              <div
                key={column.id}
                className="rounded-2xl border border-slate-200 p-4"
              >
                <p className="font-semibold text-slate-900">{column.name}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                    tipo: {column.detectedType}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                    papel: {column.semanticRole || "não definido"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-slate-900">
                Distribuição por categoria
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Top agrupamentos da métrica principal.
              </p>
            </div>

            {analysis.categoryChart.length ? (
              <div className="space-y-4">
                {analysis.categoryChart.map((item) => {
                  const maxValue = analysis.categoryChart[0]?.value || 1;
                  const width = `${Math.max((item.value / maxValue) * 100, 12)}%`;

                  return (
                    <div key={item.label} className="space-y-2">
                      <div className="flex items-center justify-between gap-4 text-sm">
                        <span
                          className="max-w-[70%] truncate font-medium text-slate-700"
                          title={item.label}
                        >
                          {item.label}
                        </span>
                        <span className="shrink-0 text-slate-500">
                          {formatNumber(item.value)}
                        </span>
                      </div>

                      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-3 rounded-full bg-linear-to-r from-blue-500 to-blue-300 transition-all"
                          style={{ width }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">
                Não foi possível gerar o gráfico por categoria com as colunas detectadas.
              </div>
            )}
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-slate-900">
                Evolução temporal
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Soma da métrica principal ao longo do tempo.
              </p>
            </div>

            {hasTimelineData ? (
              <div className="overflow-x-auto">
                <div className="min-w-[720px]">
                  <div className="flex h-64 items-end gap-4 rounded-2xl bg-slate-50 p-4">
                    {analysis.timelineChart.map((item) => {
                      const maxValue =
                        Math.max(...analysis.timelineChart.map((i) => i.value)) || 1;

                      const ratio = item.value / maxValue;
                      const height = `${Math.max(ratio * 100, 14)}%`;

                      return (
                        <div
                          key={item.label}
                          className="flex h-full min-w-[48px] flex-1 flex-col items-center gap-3"
                        >
                          <div className="flex h-full w-full items-end">
                            <div
                              className="w-full rounded-t-xl bg-gradient-to-t from-blue-600 to-blue-300"
                              style={{ height }}
                              title={`${item.label}: ${formatNumber(item.value)}`}
                            />
                          </div>

                          <span
                            className="max-w-[72px] truncate text-center text-xs text-slate-500"
                            title={item.label}
                          >
                            {item.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">
                Não foi possível gerar uma evolução temporal relevante com as colunas detectadas.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-slate-900">
            Pré-visualização do dataset
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Primeiras linhas importadas para conferência rápida.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-2xl border border-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {dataset.columns.map((column) => (
                  <th
                    key={column.id}
                    className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {column.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.length ? (
                previewRows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {dataset.columns.map((column) => (
                      <td
                        key={column.id}
                        className="border-b border-slate-100 px-4 py-3 text-sm text-slate-700"
                      >
                        {String(row[column.name] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={dataset.columns.length}
                    className="px-4 py-8 text-center text-sm text-slate-500"
                  >
                    Nenhuma linha disponível para pré-visualização.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-slate-900">
            Chat com IA sobre os dados
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Faça perguntas em linguagem natural sobre o seu dataset.
          </p>
        </div>

        <DatasetChat datasetId={datasetId} />
      </section>
    </>
  );
}