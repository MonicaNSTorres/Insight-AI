import { AppHeader } from "@/components/app/app-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function DatasetDetailsLoading() {
  return (
    <>
      <AppHeader
        title="Carregando dataset..."
        description="Preparando métricas, insights e estrutura detectada."
      />

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="mt-4 h-8 w-40" />
                <Skeleton className="mt-3 h-4 w-44" />
              </div>

              <Skeleton className="h-11 w-11 rounded-2xl bg-blue-100" />
            </div>
          </div>
        ))}
      </section>

      <section className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <Skeleton className="h-11 w-11 rounded-2xl bg-blue-100" />

          <div>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="mt-2 h-4 w-72" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <Skeleton className="h-4 w-28" />
              <Skeleton className="mt-4 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-5/6" />
              <Skeleton className="mt-2 h-4 w-4/6" />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="mt-2 h-4 w-72" />

          <div className="mt-5 space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 p-4"
              >
                <Skeleton className="h-5 w-40" />
                <div className="mt-3 flex gap-2">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-28 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <Skeleton className="h-6 w-52" />
            <Skeleton className="mt-2 h-4 w-56" />

            <div className="mt-5 space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-16" />
                  </div>

                  <Skeleton className="h-3 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="mt-2 h-4 w-56" />

            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <div className="flex h-64 items-end gap-4">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex h-full min-w-12 flex-1 flex-col items-center justify-end gap-3"
                  >
                    <Skeleton
                      className={`w-full rounded-t-xl ${
                        index % 2 === 0 ? "h-24" : "h-40"
                      }`}
                    />
                    <Skeleton className="h-3 w-10" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <Skeleton className="h-6 w-56" />
        <Skeleton className="mt-2 h-4 w-72" />

        <div className="mt-5 overflow-x-auto">
          <div className="min-w-full rounded-2xl border border-slate-200">
            <div className="grid grid-cols-5 gap-0 border-b border-slate-200 bg-slate-50">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="px-4 py-3">
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>

            {Array.from({ length: 5 }).map((_, row) => (
              <div
                key={row}
                className="grid grid-cols-5 gap-0 border-b border-slate-100 last:border-b-0"
              >
                {Array.from({ length: 5 }).map((_, col) => (
                  <div key={col} className="px-4 py-3">
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />

        <div className="mt-5 rounded-[28px] bg-[#05070C] p-5 shadow-[0_24px_60px_rgba(2,6,23,0.28)]">
          <div className="space-y-5">
            <div className="flex justify-start">
              <div className="w-[78%] rounded-[22px] border border-white/6 bg-[#171A22] px-5 py-4">
                <Skeleton className="h-4 w-4/5 bg-slate-700" />
                <Skeleton className="mt-2 h-4 w-3/5 bg-slate-700" />
              </div>
            </div>

            <div className="flex justify-end">
              <div className="w-[62%] rounded-[22px] bg-[#05A36B] px-5 py-4">
                <Skeleton className="h-4 w-3/4 bg-emerald-400/40" />
              </div>
            </div>

            <div className="flex justify-start">
              <div className="w-[72%] rounded-[22px] border border-white/6 bg-[#171A22] px-5 py-4">
                <Skeleton className="h-4 w-full bg-slate-700" />
                <Skeleton className="mt-2 h-4 w-5/6 bg-slate-700" />
                <Skeleton className="mt-2 h-4 w-3/5 bg-slate-700" />
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <Skeleton className="h-14 flex-1 rounded-[18px] bg-slate-800" />
            <Skeleton className="h-14 w-14 rounded-[18px] bg-blue-500/60" />
          </div>
        </div>
      </section>
    </>
  );
}