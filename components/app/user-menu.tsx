"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, User2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export function UserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const name = session?.user?.name || "Usuário";
  const email = session?.user?.email || "";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400">
          <User2 size={18} />
        </div>

        <div className="text-left">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {email}
          </p>
        </div>

        <ChevronDown size={16} className="text-slate-400" />
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-3 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      ) : null}
    </div>
  );
}