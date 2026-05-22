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
  metadataBase: new URL("https://zenda.com.br"),
  title: {
    default: "Zenda — Gestão inteligente para barbearias e salões",
    template: "%s | Zenda",
  },
  description:
    "Organize agendamentos, clientes, pagamentos e sua equipe em um só lugar. Software de gestão para barbearias e salões de beleza.",
  keywords: [
    "gestão de barbearia",
    "software para salão",
    "agendamento online",
    "barbearia",
    "salão de beleza",
    "sistema de agendamento",
    "gestão de clientes",
    "controle financeiro barbearia",
  ],
  authors: [{ name: "Zenda", url: "https://zenda.com.br" }],
  creator: "Zenda",
  openGraph: {
    title: "Zenda — Gestão inteligente para barbearias e salões",
    description:
      "Organize agendamentos, clientes, pagamentos e sua equipe em um só lugar.",
    siteName: "Zenda",
    locale: "pt_BR",
    type: "website",
    url: "https://zenda.com.br",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Zenda — Gestão inteligente para barbearias e salões",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zenda — Gestão inteligente para barbearias e salões",
    description:
      "Organize agendamentos, clientes, pagamentos e sua equipe em um só lugar.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
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
