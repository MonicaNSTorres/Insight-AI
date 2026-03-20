import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app/app-header";
import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/prisma";
import { SettingsForm } from "@/components/settings/settings";

type Theme = "light" | "dark";
type Language = "pt-BR" | "en-US" | "es-ES";

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

  const theme: Theme = user.theme === "dark" ? "dark" : "light";

  const language: Language =
    user.language === "en-US"
      ? "en-US"
      : user.language === "es-ES"
      ? "es-ES"
      : "pt-BR";

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
          theme,
          language,
          notificationsEnabled: user.notificationsEnabled ?? true,
        }}
      />
    </>
  );
}