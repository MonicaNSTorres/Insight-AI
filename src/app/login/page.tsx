"use client";

import { FormEvent, useState, useTransition } from "react";
import Link from "next/link";
import { Eye, Lock, Mail, FileText, CheckSquare, MessageCircle, Settings } from "lucide-react";
import { signIn } from "next-auth/react";

const menuItems = [
  { label: "Painel", icon: FileText },
  { label: "Conjuntos de Dados", icon: CheckSquare },
  { label: "Insights", icon: CheckSquare },
  { label: "Chat", icon: MessageCircle },
  { label: "Configurações", icon: Settings },
];

export default function LoginPage() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    startTransition(async () => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        redirectTo: "/app",
      });

      if (result?.error) {
        setError("E-mail ou senha inválidos.");
        return;
      }

      window.location.href = "/app";
    });
  }

  return (
    <main className="min-h-screen bg-[#eef3fb] px-4 py-8 text-slate-900">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[250px_1fr]">
        <aside className="overflow-hidden rounded-[26px] bg-[linear-gradient(180deg,#173C7C_0%,#102F63_100%)] p-5 text-white shadow-xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
              <CheckSquare size={18} />
            </div>
            <p className="font-semibold">InsightAI</p>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-blue-100/90"
                >
                  <Icon size={15} />
                  {item.label}
                </div>
              );
            })}
          </nav>

          <div className="mt-auto pt-10 text-xs text-blue-100/80">Prinecy</div>
        </aside>

        <section className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-lg md:p-8">
          <div className="mx-auto max-w-md">
            <h1 className="text-4xl font-bold text-[#27346b]">Login</h1>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Email
                </label>

                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4">
                  <Mail size={18} className="text-slate-400" />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="exemplo@email.com"
                    className="h-12 w-full bg-transparent px-3 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Senha
                </label>

                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4">
                  <Lock size={18} className="text-slate-400" />
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="h-12 w-full bg-transparent px-3 outline-none placeholder:text-slate-400"
                  />
                  <Eye size={18} className="text-slate-400" />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-500">
                <input type="checkbox" className="rounded border-slate-300" />
                Lembre de mim
              </label>

              {error ? (
                <p className="text-sm font-medium text-red-500">{error}</p>
              ) : null}

              <button
                type="submit"
                disabled={isPending}
                className="h-12 w-full rounded-xl bg-blue-600 text-base font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 disabled:opacity-60"
              >
                {isPending ? "Entrando..." : "Entrar"}
              </button>

              <button
                type="button"
                className="w-full text-sm text-slate-500 transition hover:text-blue-600"
              >
                Esqueçã sua senha?
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              Não tem uma conta?{" "}
              <Link
                href="/register"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Criar Conta
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}