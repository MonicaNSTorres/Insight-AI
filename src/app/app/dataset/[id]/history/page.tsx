import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Clock3,
  MessageSquare,
  Database,
  Sparkles,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/prisma";
import { AppHeader } from "@/components/app/app-header";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatRelativeLabel(total: number) {
  if (total === 1) return "1 pergunta registrada";
  return `${total} perguntas registradas`;
}

function formatConversationContent(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint"
  ) {
    return String(value);
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export default async function DatasetHistoryPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const { id: datasetId } = await params;

  const dataset = await prisma.dataset.findFirst({
    where: {
      id: datasetId,
      userId: session.user.id,
    },
    include: {
      conversations: {
        where: {
          userId: session.user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: {
          conversations: true,
          columns: true,
        },
      },
    },
  });

  if (!dataset) {
    notFound();
  }

  const totalQuestions = dataset.conversations.length;
  const latestConversation = dataset.conversations[0] ?? null;

  return (
    <>
      <AppHeader
        title="Histórico de conversas"
        description={`Dataset: ${dataset.name} · Arquivo: ${dataset.fileName} · ${dataset.rowCount} linhas · ${dataset.columnCount} colunas`}
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/app/dataset/${dataset.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Voltar ao dataset
            </Link>

            <Link
              href="/app/chat"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
            >
              <Sparkles size={16} />
              Abrir chat
            </Link>
          </div>
        }
      />

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Perguntas feitas
              </p>
              <p className="mt-3 text-3xl font-bold text-[#27346b]">
                {totalQuestions}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Interações registradas neste dataset
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <MessageSquare size={20} />
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Última interação
              </p>
              <p className="mt-3 text-xl font-bold text-[#27346b]">
                {latestConversation
                  ? formatDate(latestConversation.createdAt)
                  : "Ainda não houve"}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Data da conversa mais recente
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Clock3 size={20} />
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Dataset analisado
              </p>
              <p className="mt-3 line-clamp-2 text-xl font-bold text-[#27346b]">
                {dataset.name}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Base usada nas conversas com IA
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Database size={20} />
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Estrutura detectada
              </p>
              <p className="mt-3 text-3xl font-bold text-[#27346b]">
                {dataset._count.columns}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Colunas disponíveis para análise
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <CalendarDays size={20} />
            </div>
          </div>
        </div>
      </section>

      {totalQuestions > 0 ? (
        <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[0.72fr_1.28fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#27346b]">Resumo</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Aqui ficam registradas todas as perguntas feitas em linguagem
              natural sobre este dataset, reforçando o fluxo central do
              InsightAI: upload de dados, geração automática de análises,
              insights e exploração conversacional com IA.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Status</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  Histórico ativo
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Volume</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {formatRelativeLabel(totalQuestions)}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Arquivo</p>
                <p className="mt-2 break-all text-lg font-semibold text-slate-900">
                  {dataset.fileName}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#27346b]">
                  Registro das perguntas
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Histórico cronológico das interações realizadas com a IA neste
                  dataset.
                </p>
              </div>

              <Link
                href={`/app/dataset/${dataset.id}`}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Abrir análise
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="space-y-4">
              {dataset.conversations.map((conversation, index) => (
                <div
                  key={conversation.id}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white">
                        <MessageSquare size={16} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Pergunta #{totalQuestions - index}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {formatDate(conversation.createdAt)}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex w-fit rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                      Conversa registrada
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Pergunta
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-800">
                        {formatConversationContent(conversation.question)}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                        Resposta da IA
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                        {formatConversationContent(conversation.answer)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="mt-8 rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm md:p-12">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <MessageSquare size={28} />
            </div>

            <h2 className="mt-6 text-2xl font-semibold text-slate-900">
              Nenhuma pergunta registrada ainda
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              Este dataset já está pronto para exploração, mas o histórico ainda
              está vazio. Faça perguntas em linguagem natural para começar a
              construir o registro de conversas e análises do InsightAI.
            </p>

            <div className="mt-8 grid w-full gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
                <p className="text-sm font-semibold text-slate-900">
                  Perguntas em linguagem natural
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Pergunte como se estivesse falando com um analista de dados.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
                <p className="text-sm font-semibold text-slate-900">
                  Respostas estruturadas
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  A IA interpreta a intenção e responde com base no dataset.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
                <p className="text-sm font-semibold text-slate-900">
                  Memória do dataset
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Cada interação fica registrada para consulta posterior.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/app/dataset/${dataset.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
              >
                <Sparkles size={16} />
                Fazer primeira pergunta
              </Link>

              <Link
                href="/app/chat"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <MessageSquare size={16} />
                Abrir chat geral
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}