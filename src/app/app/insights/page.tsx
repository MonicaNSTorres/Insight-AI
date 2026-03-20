import Link from "next/link";
import { AppHeader } from "@/components/app/app-header";
import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/auth";

import { analyzeDataset } from "@/src/lib/dataset-analysis";
import { prepareDatasetAnalysis } from "@/src/lib/prepare-analysis";
import { generateDatasetInsights } from "@/src/lib/insight-generator";

import {
  Upload,
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
    if (priority >= 3) return "bg-rose-50 text-rose-700";
    if (priority === 2) return "bg-amber-50 text-amber-700";
    return "bg-blue-50 text-blue-700";
  };

  console.log("DATASET RAW:", dataset?.rawJson);
  console.log("ROWS:", rows);
  console.log("PREPARED:", prepared);
  console.log("ANALYSIS:", analysis);
  console.log("RESULT:", result);

  return (
    <>
      <AppHeader
        title="Insights"
        description="Análises automáticas e visuais geradas a partir dos seus dados."
        action={
          <Link
            href="/app/new"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
          >
            <Upload size={16} />
            Novo dataset
          </Link>
        }
      />

      {result && (
        <section className="mb-8 space-y-6">

          {analysis?.totalValue && (
            <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Total analisado</p>
              <p className="mt-2 text-4xl font-bold text-[#27346b]">
                {analysis.totalValue.toLocaleString("pt-BR")}
              </p>
            </div>
          )}

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

          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">
              Insights automáticos
            </h2>

            <div className="space-y-3">
              {result.insights.map((insight, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700"
                >
                  <p className="font-semibold">{insight.title}</p>
                  <p className="mt-1">{insight.description}</p>
                </div>
              ))}
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
            <h2 className="text-2xl font-bold mb-4">
              Biblioteca de insights
            </h2>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {insightsList.map((insight) => (
                <div
                  key={insight.id}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"
                >
                  <p className="font-semibold">{insight.title}</p>

                  <p className="mt-2 text-sm text-slate-500">
                    {insight.description}
                  </p>

                  <span
                    className={`mt-3 inline-block rounded-full px-3 py-1 text-xs ${priorityStyle(
                      insight.priority
                    )}`}
                  >
                    {priorityLabel(insight.priority)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </section>
      )}
    </>
  );
}