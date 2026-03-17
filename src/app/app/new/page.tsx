import { Upload, FileSpreadsheet, Sparkles } from "lucide-react";
import { AppHeader } from "@/components/app/app-header";

export default function NewDatasetPage() {
  return (
    <>
      <AppHeader
        title="Envie Conjunto de Dados"
        description="Faça upload de um arquivo CSV ou XLSX para o InsightAI analisar automaticamente sua estrutura."
      />

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="rounded-[24px] border-2 border-dashed border-blue-200 bg-blue-50/40 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
              <Upload size={28} />
            </div>

            <h2 className="mt-5 text-2xl font-semibold text-slate-900">
              Arraste e solte seu arquivo aqui
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
              O InsightAI aceita arquivos CSV e Excel para leitura, detecção de
              colunas, métricas, dimensões e geração de dashboard automático.
            </p>

            <div className="mt-6">
              <button className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700">
                Selecionar arquivo
              </button>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Formatos aceitos: .csv, .xlsx
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <FileSpreadsheet size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Arquivo selecionado
                </h2>
                <p className="text-sm text-slate-500">
                  Nenhum arquivo carregado ainda
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Status</p>
              <p className="mt-2 font-semibold text-slate-900">
                Aguardando upload
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Sparkles size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  O que acontece após o upload
                </h2>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {[
                "Detecção automática da estrutura das colunas",
                "Identificação de métricas e dimensões",
                "Criação do dashboard inicial",
                "Geração de insights automáticos",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}