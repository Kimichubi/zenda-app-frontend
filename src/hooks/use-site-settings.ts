import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { siteSettingsService } from "@/services/site-settings";
import type { SiteSettings } from "@/types";

export const usePublicSettings = (slug: string) => {
  return useQuery({
    queryKey: ["site-settings", "public", slug],
    queryFn: () => siteSettingsService.getPublicSettings(slug),
    enabled: !!slug,
  });
};

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: () => siteSettingsService.getSettings(),
  });
};

export const useUpdateSiteSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SiteSettings>) =>
      siteSettingsService.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    },
  });
};
