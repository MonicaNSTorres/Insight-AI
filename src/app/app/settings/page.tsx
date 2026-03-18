import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app/app-header";
import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/prisma";
import { SettingsForm } from "@/components/settings/settings";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      theme: true,
      language: true,
      notificationsEnabled: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <AppHeader
        title="Configurações"
        description="Gerencie informações da conta e preferências da plataforma."
      />

      <SettingsForm
        user={{
          id: user.id,
          name: user.name ?? "",
          email: user.email ?? "",
          theme: user.theme ?? "light",
          language: user.language ?? "pt-BR",
          notificationsEnabled: user.notificationsEnabled ?? true,
        }}
      />
    </>
  );
}