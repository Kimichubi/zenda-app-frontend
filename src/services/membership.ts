import { api } from "./api";
import type { MembershipPlan, MembershipPlanFormData, ClientSubscription, SubscriptionDashboard } from "@/types/membership";

export const membershipService = {
  // Plans
  listPlans: (includeInactive = false) =>
    api.get<MembershipPlan[]>(`/membership/plans?includeInactive=${includeInactive}`),

  getPlan: (id: string) =>
    api.get<MembershipPlan>(`/membership/plans/${id}`),

  createPlan: (data: MembershipPlanFormData) =>
    api.post<MembershipPlan>("/membership/plans", data),

  updatePlan: (id: string, data: Partial<MembershipPlanFormData>) =>
    api.patch<MembershipPlan>(`/membership/plans/${id}`, data),

  deletePlan: (id: string) =>
    api.delete<{ success: boolean }>(`/membership/plans/${id}`),

  getPlanReport: () =>
    api.get<{
      totalPlans: number;
      totalActiveSubscriptions: number;
      totalMonthlyRevenue: number;
      monthlyCollected: number;
      overdueSubscriptions: number;
      plans: Array<{
        id: string;
        name: string;
        monthlyPrice: number;
        activeSubscriptions: number;
        totalSubscriptions: number;
        revenue: number;
      }>;
    }>("/membership/plans/report"),

  // Subscriptions
  listSubscriptions: (filters?: {
    status?: string;
    planId?: string;
    clientId?: string;
    overdue?: boolean;
  }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.set("status", filters.status);
    if (filters?.planId) params.set("planId", filters.planId);
    if (filters?.clientId) params.set("clientId", filters.clientId);
    if (filters?.overdue) params.set("overdue", "true");
    return api.get<ClientSubscription[]>(`/membership/subscriptions?${params}`);
  },

  getSubscription: (id: string) =>
    api.get<ClientSubscription>(`/membership/subscriptions/${id}`),

  createSubscription: (data: { planId: string; clientId: string }) =>
    api.post<ClientSubscription>("/membership/subscriptions", data),

  updateSubscription: (id: string, data: {
    status?: string;
    autoRenewal?: boolean;
    cancelReason?: string;
    pauseUntil?: string;
  }) => api.patch<ClientSubscription>(`/membership/subscriptions/${id}`, data),

  recordUsage: (id: string, data: {
    serviceId?: string;
    appointmentId?: string;
    description?: string;
  }) => api.post(`/membership/subscriptions/${id}/usage`, data),

  getDashboard: () =>
    api.get<SubscriptionDashboard>("/membership/subscriptions/dashboard"),
};
