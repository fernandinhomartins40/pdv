import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../app/globals.css";
import { AdminShell } from "../components/admin-shell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "PDV Cloud",
  description: "Painel administrativo do ecossistema de PDV"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.variable}>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
