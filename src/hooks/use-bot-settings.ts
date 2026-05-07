import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";

export interface BotSettings {
  botEnabled: boolean;
  botPrompt: string | null;
  botTone: string;
  botUseEmojis: boolean;
  botMaxSentences: number;
  aiProvider: string;
  aiApiKey: string | null;
  aiModel: string | null;
  appointmentConfirmationTemplate: string | null;
  appointmentReminderTemplate: string | null;
}

export function useBotSettings() {
  return useQuery<BotSettings>({
    queryKey: ["bot-settings"],
    queryFn: async () => {
      const res = await api.get<BotSettings>("/site-settings/bot");
      return res;
    },
  });
}

export function useUpdateBotSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<BotSettings>) => {
      const res = await api.put<BotSettings>("/site-settings/bot", data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bot-settings"] });
    },
  });
}
