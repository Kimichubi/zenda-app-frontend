import { api } from "./api";

export const whatsappService = {
  getStatus: () => api.get<{ status: string }>("/whatsapp/status"),
  connect: () => api.post<{ status: string }>("/whatsapp/connect"),
  getQR: () => api.get<{ qr: string }>("/whatsapp/qr"),
  logout: () => api.delete<{ success: boolean }>("/whatsapp/logout"),

  listChatSessions: (limit?: number) =>
    api.get<{ sessions: any[] }>("/whatsapp/chat/sessions" + (limit ? `?limit=${limit}` : "")),

  getChatLogs: (sessionId: string) =>
    api.get<{ logs: any[] }>(`/whatsapp/chat/sessions/${sessionId}/logs`),

  resetChatSession: (sessionId: string) =>
    api.post<void>(`/whatsapp/chat/sessions/${sessionId}/reset`),

  getChatStats: () =>
    api.get<{ totalSessions: number; totalMessages: number; intents: Record<string, number> }>("/whatsapp/chat/stats"),
};