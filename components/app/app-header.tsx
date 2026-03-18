"use client";

import { UserMenu } from "./user-menu";

type AppHeaderProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function AppHeader({
  title,
  description,
  action,
}: AppHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between dark:border-slate-800 dark:bg-slate-900">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-4">
        {action ? <div className="shrink-0">{action}</div> : null}
        <UserMenu />
      </div>
    </header>
  );
}