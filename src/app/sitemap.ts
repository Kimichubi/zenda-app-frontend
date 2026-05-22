import type { MetadataRoute } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getPublicSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/site-settings/public-slugs`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getPublicSlugs();

  const businessPages: MetadataRoute.Sitemap = slugs.flatMap((slug) => [
    {
      url: `https://zenda.com.br/${slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `https://zenda.com.br/agendamento/${slug}`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ]);

  return [
    {
      url: "https://zenda.com.br",
      changeFrequency: "monthly",
      priority: 1,
    },
    ...businessPages,
  ];
}
