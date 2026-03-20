import Link from "next/link";
import { AppHeader } from "@/components/app/app-header";
import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/auth";

import { analyzeDataset } from "@/src/lib/dataset-analysis";
import { prepareDatasetAnalysis } from "@/src/lib/prepare-analysis";
import { generateDatasetInsights } from "@/src/lib/insight-generator";

import {
  Upload,
  Sparkles,
  TrendingUp,
  LayoutGrid,
  Activity,
} from "lucide-react";

import { ChartCard } from "@/components/insights/chart-card";
import { InsightBarChart } from "@/components/insights/bar-chart";
import { InsightLineChart } from "@/components/insights/line-chart";

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
  }).format(new Date(value));
}

export default async function InsightsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const insightsList = await prisma.insight.findMany({
    orderBy: { createdAt: "desc" },
    take: 12,
    include: {
      dataset: {
        select: {
          id: true,
          name: true,
          fileName: true,
          createdAt: true,
          _count: {
            select: {
              conversations: true,
            },
          },
        },
      },
    },
  });

  const dataset = await prisma.dataset.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const rows = (dataset?.rawJson as any[]) || [];

  const prepared = prepareDatasetAnalysis(rows);
  const analysis = prepared ? analyzeDataset(prepared) : null;
  const result = analysis ? generateDatasetInsights(analysis) : null;

  const totalInsights = insightsList.length;
  const datasetsWithInsights = new Set(
    insightsList.map((item) => item.dataset.id)
  ).size;

  const highPriorityCount = insightsList.filter(
    (item) => item.priority >= 3
  ).length;

  const priorityLabel = (priority: number) => {
    if (priority >= 3) return "Alta prioridade";
    if (priority === 2) return "Média prioridade";
    return "Baixa prioridade";
  };

  const priorityStyle = (priority: number) => {
    if (priority >= 3) return "bg-rose-50 text-rose-700 border border-rose-200";
    if (priority === 2) return "bg-amber-50 text-amber-700 border border-amber-200";
    return "bg-blue-50 text-blue-700 border border-blue-200";
  };

  const insightToneStyle = (
    tone?: "highlight" | "trend" | "distribution" | "context"
  ) => {
    if (tone === "highlight") {
      return {
        icon: <Sparkles size={16} />,
        badge: "Destaque",
        className:
          "border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 text-slate-700",
      };
    }

    if (tone === "trend") {
      return {
        icon: <TrendingUp size={16} />,
        badge: "Tendência",
        className:
          "border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 text-slate-700",
      };
    }

    if (tone === "distribution") {
      return {
        icon: <LayoutGrid size={16} />,
        badge: "Distribuição",
        className:
          "border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-cyan-50 text-slate-700",
      };
    }

    return {
      icon: <Activity size={16} />,
      badge: "Contexto",
      className:
        "border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-700",
    };
  };

  return (
    <>
      <AppHeader
        title="Insights"
        description="Análises automáticas e visuais geradas a partir dos seus dados."
        action={
          <Link
            href="/app/new"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
          >
            <Upload size={16} />
            Novo dataset
          </Link>
        }
      />

      {result && analysis && (
        <section className="mb-8 space-y-6">
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-linear-to-r from-slate-900 via-slate-800 to-[#27346b] px-6 py-6 text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
                <Sparkles size={14} />
                InsightAI · análise automática
              </div>

              <div className="mt-4 grid gap-6 xl:grid-cols-[1.4fr_320px] xl:items-end">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                    {result.headline}
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-200 md:text-base">
                    {result.summary}
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                    Total analisado
                  </p>
                  <p className="mt-2 text-4xl font-bold text-white">
                    {formatNumber(analysis.totalValue)}
                  </p>
                  <p className="mt-2 text-sm text-slate-300">
                    Base mais recente processada automaticamente pelo motor de insights.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 p-6 md:grid-cols-3">
              <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Métrica principal</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {analysis.metricColumn === "__count__"
                    ? "Contagem de registros"
                    : analysis.metricColumn}
                </p>
              </div>

              <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Dimensão analisada</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {analysis.dimensionColumn || "Não identificada"}
                </p>
              </div>

              <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Eixo temporal</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {analysis.temporalColumn || "Não identificado"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            {result.charts.category?.length > 0 && (
              <ChartCard title="Distribuição por categoria">
                <InsightBarChart data={result.charts.category} />
              </ChartCard>
            )}

            {result.charts.timeline?.length > 0 && (
              <ChartCard title="Evolução temporal">
                <InsightLineChart data={result.charts.timeline} />
              </ChartCard>
            )}
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Insights automáticos
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Leitura narrativa gerada automaticamente com base nos padrões encontrados no dataset.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                <Sparkles size={14} />
                IA aplicada aos dados
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {result.insights.map((insight, index) => {
                const tone = insightToneStyle(insight.tone);

                return (
                  <div
                    key={index}
                    className={`rounded-[22px] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${tone.className}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700">
                        {tone.icon}
                        {tone.badge}
                      </div>

                      <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-600">
                        P{insight.priority}
                      </span>
                    </div>

                    <p className="mt-4 text-base font-semibold text-slate-900">
                      {insight.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {insight.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {totalInsights > 0 && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Insights disponíveis</p>
              <p className="mt-3 text-3xl font-bold">
                {formatNumber(totalInsights)}
              </p>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Datasets analisados</p>
              <p className="mt-3 text-3xl font-bold">
                {formatNumber(datasetsWithInsights)}
              </p>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Alta prioridade</p>
              <p className="mt-3 text-3xl font-bold">
                {formatNumber(highPriorityCount)}
              </p>
            </div>
          </div>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">
              Biblioteca de insights
            </h2>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {insightsList.map((insight) => (
                <div
                  key={insight.id}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-slate-900">{insight.title}</p>

                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs ${priorityStyle(
                        insight.priority
                      )}`}
                    >
                      {priorityLabel(insight.priority)}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {insight.description}
                  </p>

                  <div className="mt-4 border-t border-slate-200 pt-4 text-xs text-slate-500">
                    <p className="font-medium text-slate-700">
                      {insight.dataset.name}
                    </p>
                    <p className="mt-1">
                      {insight.dataset.fileName} · {formatDate(insight.dataset.createdAt)}
                    </p>
                    <p className="mt-1">
                      {formatNumber(insight.dataset._count.conversations)} interações
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>
      )}
    </>
  );
}