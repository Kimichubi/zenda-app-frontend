import { api } from "./api";
import type { PublicSiteData, SiteSettings } from "@/types";

export const siteSettingsService = {
  getPublicSettings: (slug: string) =>
    api.get<PublicSiteData>(`/site-settings/public/${slug}`),

  getSettings: () => api.get<SiteSettings>("/site-settings"),

  updateSettings: (data: Partial<SiteSettings>) =>
    api.put<SiteSettings>("/site-settings", data),
};
