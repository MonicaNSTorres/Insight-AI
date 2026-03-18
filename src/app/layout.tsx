import type { Metadata } from "next";
import "./globals.css";
import { Asap } from "next/font/google";
import { AuthSessionProvider } from "@/components/providers/session-provider";

const asap = Asap({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "InsightAI",
  description: "Plataforma de BI com Inteligência Artificial",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={asap.className}>
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}