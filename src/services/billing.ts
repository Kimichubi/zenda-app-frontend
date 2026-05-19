import { api } from "./api";

export interface BusinessSubscription {
  id: string;
  businessId: string;
  plan: "PRO" | "ENTERPRISE";
  status: string;
  abacateCustomerId: string | null;
  abacateSubscriptionId: string | null;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  lastBillingAt: string | null;
  nextBillingAt: string | null;
  trialEndsAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  invoices: BusinessInvoice[];
  business?: {
    id: string;
    name: string;
    slug: string;
    plan: string;
    status: string;
  };
}

export interface BusinessInvoice {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string | null;
  abacateId: string | null;
  pixCode: string | null;
  pixQrCode: string | null;
  invoiceUrl: string | null;
  paidAt: string | null;
  dueDate: string;
  createdAt: string;
}

export interface AdminBillingStats {
  total: number;
  active: number;
  trialing: number;
  cancelled: number;
  pastDue: number;
  monthlyRevenue: number;
}

export const billingService = {
  getSubscription: () =>
    api.get<BusinessSubscription>("/billing/subscription"),

  getInvoices: () =>
    api.get<BusinessInvoice[]>("/billing/invoices"),

  generateInvoice: () =>
    api.post<BusinessInvoice>("/billing/generate-invoice"),

  cancelSubscription: () =>
    api.post<{ success: boolean }>("/billing/cancel"),

  adminListSubscriptions: () =>
    api.get<BusinessSubscription[]>("/admin/billing/subscriptions"),

  adminGetStats: () =>
    api.get<AdminBillingStats>("/admin/billing/stats"),
};
