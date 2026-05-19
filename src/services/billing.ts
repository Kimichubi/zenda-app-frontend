import { api } from "./api";

export interface BillingPlan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  monthlyPrice: number;
  yearlyPrice: number | null;
  features: string[];
  limits: Record<string, unknown>;
  isActive: boolean;
  sortOrder: number;
}

export interface OrganizationSubscription {
  id: string;
  businessId: string;
  planId: string | null;
  plan: BillingPlan | null;
  status: "ACTIVE" | "TRIALING" | "PAST_DUE" | "CANCELLED" | "EXPIRED" | "PAUSED";
  abacateCustomerId: string | null;
  abacateSubscriptionId: string | null;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialStart: string | null;
  trialEnd: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  gracePeriodStart: string | null;
  gracePeriodEnd: string | null;
  autoRenewal: boolean;
  lastBillingAt: string | null;
  nextBillingAt: string | null;
  invoices: BillingInvoice[];
  createdAt: string;
}

export interface BillingInvoice {
  id: string;
  subscriptionId: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: "PENDING" | "PAID" | "OVERDUE" | "CANCELLED" | "REFUNDED" | "FAILED";
  billingType: "MONTHLY" | "YEARLY";
  abacateId: string | null;
  abacateUrl: string | null;
  pixCode: string | null;
  pixQrCode: string | null;
  boletoUrl: string | null;
  dueDate: string;
  paidAt: string | null;
  paidAmount: number | null;
  attempts: number;
  lastAttemptAt: string | null;
  nextAttemptAt: string | null;
  payments: BillingPayment[];
  createdAt: string;
}

export interface BillingPayment {
  id: string;
  invoiceId: string;
  amount: number;
  currency: string;
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  gateway: string | null;
  gatewayPaymentId: string | null;
  gatewayFee: number | null;
  pixCode: string | null;
  pixQrCode: string | null;
  paidAt: string | null;
  failureReason: string | null;
  createdAt: string;
}

export interface CheckoutResponse {
  checkoutUrl: string | null;
  checkout?: {
    id: string;
    url: string;
    status: string;
    expiresAt: string;
    amount: number;
    pixCode?: string;
    pixQrCode?: string;
  };
  plan?: BillingPlan;
  invoice?: BillingInvoice;
  message?: string;
}

export interface AdminBillingStats {
  total: number;
  active: number;
  trialing: number;
  pastDue: number;
  cancelled: number;
  expired: number;
  monthlyRevenue: number;
}

export interface AdminSubscriptionsResponse {
  data: Array<OrganizationSubscription & {
    business: { id: string; name: string; slug: string; plan: string; status: string };
  }>;
  total: number;
  page: number;
  limit: number;
}

export const billingService = {
  listPlans: () =>
    api.get<BillingPlan[]>("/billing/plans"),

  getSubscription: () =>
    api.get<OrganizationSubscription>("/billing/subscription"),

  createCheckout: (data?: { planId?: string; returnUrl?: string; billingType?: "MONTHLY" | "YEARLY" }) =>
    api.post<CheckoutResponse>("/billing/checkout", data ?? {}),

  getInvoices: () =>
    api.get<BillingInvoice[]>("/billing/invoices"),

  getInvoice: (id: string) =>
    api.get<BillingInvoice>(`/billing/invoices/${id}`),

  cancelSubscription: (reason?: string) =>
    api.patch<OrganizationSubscription>("/billing/cancel", reason ? { reason } : {}),

  changePlan: (planId: string, billingType?: "MONTHLY" | "YEARLY") =>
    api.patch<OrganizationSubscription>("/billing/plan", { planId, billingType }),

  adminListSubscriptions: (params?: { status?: string; page?: number; limit?: number }) => {
    const query = params ? "?" + new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null).map(([k, v]) => [k, String(v)]))
    ).toString() : "";
    return api.get<AdminSubscriptionsResponse>(`/admin/billing/subscriptions${query}`);
  },

  adminGetStats: () =>
    api.get<AdminBillingStats>("/admin/billing/stats"),

  adminListPlans: (showAll?: boolean) =>
    api.get<BillingPlan[]>(`/admin/billing/plans${showAll ? "?all=true" : ""}`),

  adminCreatePlan: (data: Partial<BillingPlan>) =>
    api.post<BillingPlan>("/admin/billing/plans", data),

  adminUpdatePlan: (id: string, data: Partial<BillingPlan>) =>
    api.patch<BillingPlan>(`/admin/billing/plans/${id}`, data),
};
