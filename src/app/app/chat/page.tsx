import { AppHeader } from "@/components/app/app-header";

export default function ChatPage() {
  return (
    <>
      <AppHeader
        title="Chat com IA"
        description="Faça perguntas sobre seus dados em linguagem natural."
      />

      <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-lg font-semibold text-slate-900">
          O chat será habilitado após o upload do primeiro dataset
        </p>
        <p className="mt-3 text-sm text-slate-500">
          Em breve você poderá perguntar coisas como “qual produto vendeu mais?”
          ou “qual região teve melhor resultado?”.
        </p>
      </div>
    </>
  );
}