import { AppHeader } from "@/components/app/app-header";

export default function SettingsPage() {
  return (
    <>
      <AppHeader
        title="Configurações"
        description="Gerencie informações da conta e preferências iniciais da plataforma."
      />

      <section className="grid gap-6 xl:grid-cols-[1fr_0.75fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Informações da conta
          </h2>

          <div className="mt-6 grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Nome
              </label>
              <input
                type="text"
                placeholder="Seu nome"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                E-mail
              </label>
              <input
                type="email"
                placeholder="exemplo@email.com"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Senha
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none"
              />
            </div>

            <button className="mt-2 h-12 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700">
              Salvar alterações
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Notificações
            </h2>

            <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-200 p-4">
              <div>
                <p className="font-medium text-slate-900">E-mails do sistema</p>
                <p className="mt-1 text-sm text-slate-500">
                  Receber alertas e atualizações da plataforma
                </p>
              </div>

              <button className="h-7 w-12 rounded-full bg-blue-600 p-1">
                <div className="ml-auto h-5 w-5 rounded-full bg-white" />
              </button>
            </div>
          </div>

          <div className="rounded-[28px] border border-red-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Zona de perigo
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Ações sensíveis da conta devem ficar concentradas aqui em versões
              futuras do produto.
            </p>

            <button className="mt-5 rounded-xl bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100">
              Excluir conta
            </button>
          </div>
        </div>
      </section>
    </>
  );
}