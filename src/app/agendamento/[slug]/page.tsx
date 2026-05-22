import type { Metadata } from "next";
import type { PublicSiteData } from "@/types";
import { BookingClientPage } from "./booking-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getPublicSettings(slug: string): Promise<PublicSiteData | null> {
  try {
    const res = await fetch(`${API_URL}/site-settings/public/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPublicSettings(slug);

  if (!data) {
    return {
      title: "Agendamento",
      robots: { index: false, follow: false },
    };
  }

  const { barber } = data;
  const title = `Agendar em ${barber.businessName}`;
  const description = `Escolha o servico, data e horario para agendar em ${barber.businessName}. Rapido e facil.`;
  const url = `https://zenda.com.br/agendamento/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Zenda",
      locale: "pt_BR",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default function BookingPage() {
  return <BookingClientPage />;
}
