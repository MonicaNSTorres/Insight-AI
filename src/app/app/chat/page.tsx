import Link from "next/link";
import { AppHeader } from "@/components/app/app-header";
import { prisma } from "@/src/lib/prisma";
import { DatasetChat } from "@/components/dataset-chat/dataset-chat";
import { Database, Upload, Sparkles } from "lucide-react";

export default async function ChatPage() {
  const dataset = await prisma.dataset.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <AppHeader
        title="Chat com IA"
        description="Faça perguntas sobre seus dados em linguagem natural."
      />

      {!dataset ? (
        <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm md:p-12">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Database size={28} />
            </div>

            <h2 className="mt-6 text-2xl font-semibold text-slate-900">
              Nenhum dataset disponível para o chat
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              Para começar a conversar com a IA sobre seus dados, envie um
              arquivo CSV ou XLSX.
            </p>

            <div className="mt-8 grid w-full gap-3 md:grid-cols-3">
              {[
                "Qual produto vendeu mais?",
                "Qual região teve melhor resultado?",
                "Qual mês teve maior crescimento?",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-sm text-slate-500"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              <Link
                href="/app/new"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                <Upload size={16} />
                Enviar primeiro dataset
              </Link>

              <span className="inline-flex items-center gap-2 text-sm text-slate-400">
                <Sparkles size={16} />
                O chat será liberado automaticamente após o upload
              </span>
            </div>
          </div>
        </section>
      ) : (
        <section className="space-y-5">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Chat com IA
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Dataset: {dataset.name} · Arquivo: {dataset.fileName}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">
                  {dataset.rowCount} linhas
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                  {dataset.columnCount} colunas
                </span>

                <Link
                  href={`/app/dataset/${dataset.id}/history`}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Ver histórico
                </Link>
              </div>
            </div>
          </div>

          <DatasetChat datasetId={dataset.id} />
        </section>
      )}
    </>
  );
}