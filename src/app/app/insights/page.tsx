import { AppHeader } from "@/components/app/app-header";

export default function InsightsPage() {
  return (
    <>
      <AppHeader
        title="Insights"
        description="Aqui ficarão os insights automáticos gerados a partir dos datasets enviados."
      />

      <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-lg font-semibold text-slate-900">
          Nenhum insight gerado ainda
        </p>
        <p className="mt-3 text-sm text-slate-500">
          Envie um dataset para começar a receber análises automáticas.
        </p>
      </div>
    </>
  );
}