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
    refetchInterval: (query) => {
      // Se tivermos um QR code, podemos diminuir a frequência ou manter
      // Se não tivermos (está carregando), mantemos 5s para tentar obter logo
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