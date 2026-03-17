"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Database,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Sparkles,
} from "lucide-react";

const items = [
  {
    title: "Painel",
    href: "/app",
    icon: LayoutDashboard,
  },
  {
    title: "Conjuntos de Dados",
    href: "/app/new",
    icon: Database,
  },
  {
    title: "Insights",
    href: "/app/insights",
    icon: Sparkles,
  },
  {
    title: "Chat",
    href: "/app/chat",
    icon: MessageSquare,
  },
  {
    title: "Configurações",
    href: "/app/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-65 h-screen flex-col overflow-hidden rounded-r-[28px] bg-[linear-gradient(180deg,#163b7a_0%,#0f2f63_100%)] p-5 text-white shadow-2xl">
      <div className="mb-8 flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-700">
          <BarChart3 size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold">InsightAI</p>
          <p className="text-xs text-blue-100/80">BI com IA</p>
        </div>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/app" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-blue-500/30 text-white shadow-inner"
                  : "text-blue-100/90 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={18} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm font-semibold">Seus dados protegidos</p>
        <p className="mt-2 text-xs leading-5 text-blue-100/80">
          Ambiente preparado para upload, visualização e análise inteligente de
          datasets.
        </p>
      </div>
    </aside>
  );
}