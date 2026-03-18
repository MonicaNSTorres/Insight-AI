"use client";

import { useEffect, useState } from "react";
import { Moon, Bell, Languages, User2 } from "lucide-react";

type SettingsFormProps = {
  user: {
    id: string;
    name: string;
    email: string;
    theme: "light" | "dark";
    language: "pt-BR" | "en-US" | "es-ES";
    notificationsEnabled: boolean;
  };
};

export function SettingsForm({ user }: SettingsFormProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [theme, setTheme] = useState<"light" | "dark">(user.theme);
  const [language, setLanguage] = useState<"pt-BR" | "en-US" | "es-ES">(
    user.language
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    user.notificationsEnabled
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function applyTheme(mode: "light" | "dark") {
    const html = document.documentElement;

    if (mode === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          theme,
          language,
          notificationsEnabled,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar preferências.");
      }

      setMessage("Configurações salvas com sucesso.");
    } catch {
      setMessage("Não foi possível salvar as alterações.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-3xl font-bold text-[#27346b] dark:text-white">
          Configurações
        </h2>

        <div className="mt-6 rounded-[24px] border border-slate-200 p-6 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400">
              <User2 size={20} />
            </div>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              Perfil
            </h3>
          </div>

          <div className="mt-5 grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
          Preferências
        </h3>

        <div className="mt-6 space-y-5">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-slate-500 dark:text-slate-300" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Notificações
              </span>
            </div>

            <button
              type="button"
              onClick={() => setNotificationsEnabled((prev) => !prev)}
              className={`h-7 w-12 rounded-full p-1 transition ${
                notificationsEnabled ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white transition ${
                  notificationsEnabled ? "ml-auto" : "ml-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Moon size={18} className="text-slate-500 dark:text-slate-300" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Tema escuro
              </span>
            </div>

            <button
              type="button"
              onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
              className={`h-7 w-12 rounded-full p-1 transition ${
                theme === "dark" ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white transition ${
                  theme === "dark" ? "ml-auto" : "ml-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Languages
                size={18}
                className="text-slate-500 dark:text-slate-300"
              />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Idioma
              </span>
            </div>

            <select
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value as "pt-BR" | "en-US" | "es-ES")
              }
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="pt-BR">Português (BR)</option>
              <option value="en-US">English (US)</option>
              <option value="es-ES">Español (ES)</option>
            </select>
          </div>
        </div>

        <p className="mt-5 text-xs leading-6 text-slate-500 dark:text-slate-400">
          O idioma será salvo como preferência da conta. Para traduzir toda a
          plataforma, você ainda precisa conectar essa opção aos textos da interface.
        </p>

        {message ? (
          <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={saving}
          className="mt-8 h-12 w-full rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>
    </form>
  );
}