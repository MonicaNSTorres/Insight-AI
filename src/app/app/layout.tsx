import { ReactNode } from "react";
import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app/app-sidebar";

export default async function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="h-screen overflow-hidden bg-[#eef3fb] text-slate-900">
      <div className="flex h-full">
        <AppSidebar />

        <main className="flex-1 overflow-x-auto overflow-y-auto">
          <div className="min-w-300 p-4 md:p-6 xl:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}