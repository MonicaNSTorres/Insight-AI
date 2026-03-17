import type { Metadata } from "next";
import "./globals.css";
import { Asap } from "next/font/google";

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${asap.className} antialiased`}
      >{children}</body>
    </html>
  );
}