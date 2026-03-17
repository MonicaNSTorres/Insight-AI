"use client";

import { FormEvent, useState, useTransition } from "react";
import Link from "next/link";
import { Eye, Lock, Mail, PanelLeftClose } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";

const menuItems = [
  "Login",
  "Painel",
  "Conjuntos de Dados",
  "Insights",
  "Chat",
  "Configurações",
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
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="overflow-hidden rounded-[26px] bg-[linear-gradient(180deg,#163b7a_0%,#0f2f63_100%)] p-5 text-white shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <div className="rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold">
              <Image src="/icon.png" alt="logo" width={50} height={60}/>
            </div>
            <button className="rounded-lg bg-white/10 p-2">
              <PanelLeftClose size={16} />
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <div
                key={item}
                className={`rounded-xl px-3 py-2 text-sm ${
                  index === 0
                    ? "bg-blue-500/30 text-white"
                    : "text-blue-100/90"
                }`}
              >
                {item}
              </div>
            ))}
          </nav>

          <div className="mt-10 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-xs text-blue-100">
            Privacy
          </div>
        </aside>

        <section className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-lg md:p-8">
          <div className="mx-auto max-w-md">
            <h1 className="text-3xl font-bold text-slate-900">Login</h1>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-600"
                >
                  E-mail
                </label>

                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4">
                  <Mail size={18} className="text-slate-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="exemplo@email.com"
                    className="h-12 w-full bg-transparent px-3 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-600"
                >
                  Senha
                </label>

                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4">
                  <Lock size={18} className="text-slate-400" />
                  <input
                    id="password"
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
                className="h-12 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Entrando..." : "Entrar"}
              </button>

              <button
                type="button"
                className="w-full text-sm text-slate-500 transition hover:text-blue-600"
              >
                Esqueceu sua senha?
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