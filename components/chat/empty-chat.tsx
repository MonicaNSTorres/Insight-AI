"use client";

import { FaDatabase, FaUpload, FaChartLine } from "react-icons/fa";
import Link from "next/link";

export function EmptyChat() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[28px] border border-slate-200 bg-white p-12 text-center shadow-sm">
      
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <FaDatabase size={26} />
      </div>

      <h2 className="mt-6 text-xl font-semibold text-slate-900">
        Nenhum dataset disponível
      </h2>

      <p className="mt-3 max-w-md text-sm text-slate-500">
        Para começar a usar o chat com IA, você precisa enviar um dataset.
        Após o upload, você poderá fazer perguntas como:
      </p>

      <div className="mt-6 flex flex-col gap-2 text-sm text-slate-600">
        <span className="rounded-full bg-slate-100 px-4 py-2">
          Qual produto vendeu mais?
        </span>
        <span className="rounded-full bg-slate-100 px-4 py-2">
          Qual região teve melhor resultado?
        </span>
        <span className="rounded-full bg-slate-100 px-4 py-2">
          Como evoluíram as vendas ao longo do tempo?
        </span>
      </div>

      <Link
        href="/app/new"
        className="mt-8 flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
      >
        <FaUpload />
        Enviar dataset
      </Link>

      <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
        <FaChartLine />
        Insights automáticos após upload
      </div>
    </div>
  );
}