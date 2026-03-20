import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { whatsappService } from "@/services/whatsapp";

export const useWhatsappStatus = () => {
  return useQuery({
    queryKey: ["whatsapp", "status"],
    queryFn: () => whatsappService.getStatus(),
    refetchInterval: 5000, // Checa o status a cada 5 segundos
  });
};

export const useWhatsappQR = (enabled: boolean) => {
  return useQuery({
    queryKey: ["whatsapp", "qr"],
    queryFn: () => whatsappService.getQR(),
    enabled: enabled,
    refetchInterval: 10000, // Atualiza o QR a cada 10 segundos se necessário
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