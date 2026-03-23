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

function getDatasetIdFromPath(pathname: string) {
  const match = pathname.match(/^\/app\/dataset\/([^/]+)/);
  return match?.[1] ?? null;
}

export function AppSidebar() {
  const pathname = usePathname();
  const currentDatasetId = getDatasetIdFromPath(pathname);

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
      href: currentDatasetId
        ? `/app/insights?datasetId=${currentDatasetId}`
        : "/app/insights",
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

  return (
    <aside className="flex h-screen w-68 flex-col overflow-hidden rounded-r-[28px] bg-[linear-gradient(180deg,#173C7C_0%,#102F63_100%)] p-5 text-white shadow-2xl">
      <div className="mb-8 rounded-[22px] bg-white/10 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm">
            <BarChart3 size={20} />
          </div>

          <div>
            <p className="text-[15px] font-semibold leading-none">InsightAI</p>
            <p className="mt-1 text-xs text-blue-100/80">BI com IA</p>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;

          const baseHref = item.href.split("?")[0];

          const active =
            pathname === item.href ||
            (baseHref !== "/app" && pathname.startsWith(baseHref));

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-medium transition ${
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

      <div className="mt-auto space-y-4">
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-semibold">Seus dados protegidos</p>
          <p className="mt-3 text-xs leading-6 text-blue-100/80">
            Ambiente preparado para upload, visualização e análise inteligente de
            datasets.
          </p>
        </div>
      </div>
    </aside>
  );
}