import { api } from "./api";

export const whatsappService = {
  getStatus: () => api.get<{ status: string }>("/whatsapp/status"),
  connect: () => api.post<{ status: string }>("/whatsapp/connect"),
  getQR: () => api.get<{ qr: string }>("/whatsapp/qr"),
  logout: () => api.delete<{ success: boolean }>("/whatsapp/logout"),
};