import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { whatsappService } from "@/services/whatsapp";

export const useWhatsappStatus = () => {
  return useQuery({
    queryKey: ["whatsapp", "status"],
    queryFn: () => whatsappService.getStatus(),
    refetchInterval: 5000,
  });
};

export const useWhatsappQR = (enabled: boolean) => {
  return useQuery({
    queryKey: ["whatsapp", "qr"],
    queryFn: () => whatsappService.getQR(),
    enabled: enabled,
    refetchInterval: (query) => {
      return query.state.data?.qr ? 10000 : 5000;
    },
  });
};

export const useConnectWhatsapp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => whatsappService.connect(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp"] });
    },
  });
};

export const useLogoutWhatsapp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => whatsappService.logout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp"] });
    },
  });
};

export const useChatSessions = (limit?: number) => {
  return useQuery({
    queryKey: ["chat", "sessions", limit],
    queryFn: () => whatsappService.listChatSessions(limit),
  });
};

export const useChatLogs = (sessionId: string) => {
  return useQuery({
    queryKey: ["chat", "logs", sessionId],
    queryFn: () => whatsappService.getChatLogs(sessionId),
    enabled: !!sessionId,
  });
};

export const useChatStats = () => {
  return useQuery({
    queryKey: ["chat", "stats"],
    queryFn: () => whatsappService.getChatStats(),
  });
};

export const useResetChatSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => whatsappService.resetChatSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat"] });
    },
  });
};