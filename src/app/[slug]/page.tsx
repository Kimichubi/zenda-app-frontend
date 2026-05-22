import type { Metadata } from "next";
import type { PublicSiteData } from "@/types";
import { PublicSiteClient } from "./public-site-client";

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
      title: "Pagina nao encontrada",
      robots: { index: false, follow: false },
    };
  }

  const { barber, settings } = data;
  const title = barber.businessName;
  const description =
    settings?.heroSubtitle ||
    `Agende seu horario em ${barber.businessName}. Servicos profissionais de qualidade.`;
  const url = `https://zenda.com.br/${slug}`;

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
      images: settings?.logoUrl
        ? [{ url: settings.logoUrl, width: 400, height: 400, alt: title }]
        : undefined,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default function PublicSitePage() {
  return <PublicSiteClient />;
}
