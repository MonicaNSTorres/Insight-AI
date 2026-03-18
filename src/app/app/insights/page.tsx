import Link from "next/link";
import { AppHeader } from "@/components/app/app-header";
import { prisma } from "@/src/lib/prisma";
import {
  Lightbulb,
  Sparkles,
  TrendingUp,
  Upload,
  Database,
  ArrowRight,
  MessageSquare,
} from "lucide-react";

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
  }).format(new Date(value));
}

export default async function InsightsPage() {
  const insights = await prisma.insight.findMany({
    orderBy: {
      createdAt: "desc",
    },
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

  const totalInsights = insights.length;
  const datasetsWithInsights = new Set(insights.map((item) => item.dataset.id)).size;
  const highPriorityCount = insights.filter((item) => item.priority >= 3).length;

  const priorityLabel = (priority: number) => {
    if (priority >= 3) return "Alta prioridade";
    if (priority === 2) return "Média prioridade";
    return "Baixa prioridade";
  };

  const priorityStyle = (priority: number) => {
    if (priority >= 3) {
      return "bg-rose-50 text-rose-700";
    }

    if (priority === 2) {
      return "bg-amber-50 text-amber-700";
    }

    return "bg-blue-50 text-blue-700";
  };

  return (
    <>
      <AppHeader
        title="Insights"
        description="Visualize os insights automáticos gerados a partir dos datasets enviados."
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

      {totalInsights > 0 ? (
        <section className="space-y-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Insights disponíveis
                  </p>
                  <p className="mt-3 text-3xl font-bold text-[#27346b]">
                    {formatNumber(totalInsights)}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    Observações geradas automaticamente
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Lightbulb size={20} />
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Datasets analisados
                  </p>
                  <p className="mt-3 text-3xl font-bold text-[#27346b]">
                    {formatNumber(datasetsWithInsights)}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    Bases com sinais automáticos detectados
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Database size={20} />
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Alta prioridade
                  </p>
                  <p className="mt-3 text-3xl font-bold text-[#27346b]">
                    {formatNumber(highPriorityCount)}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    Pontos que merecem atenção imediata
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <TrendingUp size={20} />
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Análise inteligente
                  </p>
                  <p className="mt-3 text-3xl font-bold text-[#27346b]">
                    Ativa
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    Insights conectados ao dashboard e ao chat
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Sparkles size={20} />
                </div>
              </div>
            </div>
          </div>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#27346b]">
                  Biblioteca de insights
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Observações automáticas geradas a partir da estrutura, métricas e padrões encontrados nos datasets.
                </p>
              </div>

              <Link
                href="/app/chat"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <MessageSquare size={16} />
                Ir para o chat
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {insight.title}
                      </p>
                      <p className="mt-2 truncate text-xs text-slate-500">
                        Dataset: {insight.dataset.name}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${priorityStyle(
                        insight.priority
                      )}`}
                    >
                      {priorityLabel(insight.priority)}
                    </span>
                  </div>

                  <p className="mt-4 line-clamp-4 text-sm leading-6 text-slate-600">
                    {insight.description}
                  </p>

                  <div className="mt-5 space-y-2 text-xs text-slate-400">
                    <p className="truncate">{insight.dataset.fileName}</p>
                    <p>
                      {formatDate(insight.dataset.createdAt)} ·{" "}
                      {insight.dataset._count.conversations} perguntas registradas
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <Link
                      href={`/app/dataset/${insight.dataset.id}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
                    >
                      Abrir dataset
                      <ArrowRight size={14} />
                    </Link>

                    <Link
                      href={`/app/dataset/${insight.dataset.id}/history`}
                      className="text-xs font-medium text-slate-500 transition hover:text-slate-700"
                    >
                      Ver histórico
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>
      ) : (
        <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm md:p-12">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Lightbulb size={28} />
            </div>

            <h2 className="mt-6 text-2xl font-semibold text-slate-900">
              Nenhum insight gerado ainda
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              Envie um dataset para começar a receber observações automáticas,
              padrões relevantes, destaques por categoria e sinais encontrados
              pela análise inteligente do InsightAI.
            </p>

            <div className="mt-8 grid w-full gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
                <p className="text-sm font-semibold text-slate-900">
                  Destaques automáticos
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Identifique automaticamente categorias, períodos e sinais relevantes.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
                <p className="text-sm font-semibold text-slate-900">
                  Leitura mais rápida
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Receba interpretações iniciais sem depender de análise manual.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
                <p className="text-sm font-semibold text-slate-900">
                  Base para decisões
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Use os insights como ponto de partida para explorar os dados com IA.
                </p>
              </div>
            </div>

            <Link
              href="/app/new"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
            >
              <Upload size={16} />
              Enviar primeiro dataset
            </Link>
          </div>
        </section>
      )}
    </>
  );
}