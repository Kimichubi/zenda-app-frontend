import { api } from "./api";

export interface PosAppointment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  price: number;
  notes?: string;
  source: string;
  client: { id: string; name: string; phone: string };
  service: { id: string; name: string; duration: number; price: number } | null;
  professional: { id: string; name: string };
  payment: { id: string; status: string; amount: number; pixCode: string | null; paidAt?: string } | null;
}

export interface PosClient {
  id: string;
  name: string;
  phone: string;
  email?: string;
  pointsBalance: number;
}

export interface PosProfessional {
  id: string;
  name: string;
  role: string;
  baseCommission: number;
  avatarPath?: string;
}

export interface PosService {
  id: string;
  name: string;
  duration: number;
  price: number;
}

export interface PosDailySummary {
  date: string;
  totalRevenue: number;
  totalPending: number;
  totalProductsSales: number;
  totalSalesCount: number;
  appointments: {
    scheduled: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    noShow: number;
    total: number;
  };
  salesByMethod: { method: string; total: number; count: number }[];
}

export const posService = {
  getTodayAppointments: () =>
    api.get<PosAppointment[]>("/pos/appointments/today"),

  getAppointment: (id: string) =>
    api.get<PosAppointment>(`/pos/appointments/${encodeURIComponent(id)}`),

  searchClients: (q: string) =>
    api.get<PosClient[]>(`/pos/clients/search?q=${encodeURIComponent(q)}`),

  createWalkInClient: (data: { name: string; phone: string; email?: string }) =>
    api.post<PosClient>("/pos/clients/walk-in", data),

  listProfessionals: () =>
    api.get<PosProfessional[]>("/pos/professionals"),

  listServices: () =>
    api.get<PosService[]>("/pos/services"),

  createAppointment: (data: {
    professionalId: string;
    clientId: string;
    serviceId: string;
    price?: number;
    date?: string;
    startTime?: string;
    notes?: string;
  }) =>
    api.post<PosAppointment>("/pos/appointments", data),

  checkoutAppointment: (id: string, data: {
    paymentMethod: string;
    tipAmount?: number;
    tipPercentage?: number;
    useInternalCredit?: boolean;
    splitEnabled?: boolean;
  }) =>
    api.post<any>(`/pos/appointments/${encodeURIComponent(id)}/checkout`, data),

  updateStatus: (id: string, status: string) =>
    api.patch<PosAppointment>(`/pos/appointments/${encodeURIComponent(id)}/status`, { status }),

  getDailySummary: () =>
    api.get<PosDailySummary>("/pos/daily-summary"),
};
