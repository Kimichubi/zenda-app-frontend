import type { Metadata } from "next";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zenda — Gestão inteligente para barbearias e salões",
  description: "Organize agendamentos, clientes, pagamentos e sua equipe em um só lugar.",
  openGraph: {
    title: "Zenda — Gestão inteligente para barbearias e salões",
    description: "Organize agendamentos, clientes, pagamentos e sua equipe em um só lugar.",
    siteName: "Zenda",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} antialiased min-h-screen bg-background text-foreground selection:bg-primary/30`}
      >
        <Providers>
          <div className="animate-fade-in">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
