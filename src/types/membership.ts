export interface ServicePlanLink {
  id: string;
  serviceId: string;
  service: { id: string; name: string; price: number; duration: number };
  usageLimit: number | null;
}

export interface MembershipPlan {
  id: string;
  businessId: string;
  name: string;
  description: string | null;
  monthlyPrice: number;
  billingFrequency: string;
  servicesIncluded: ServicePlanLink[];
  usageLimitsPerPeriod: number | null;
  autoRenewal: boolean;
  extraBenefits: string | null;
  validDays: number | null;
  validStartHour: string | null;
  validEndHour: string | null;
  isActive: boolean;
  minCommitmentMonths: number;
  cancellationRules: string | null;
  trialDays: number;
  maxActiveSubscriptions: number | null;
  _count?: { subscriptions: number };
  subscriptions?: Array<{
    id: string;
    client: { id: string; name: string; phone: string };
    status: string;
    usageCount: number;
    currentPeriodEnd: string;
  }>;
  createdAt: string;
}

export interface MembershipPlanFormData {
  name: string;
  description?: string;
  monthlyPrice: number;
  billingFrequency?: string;
  servicesIncluded?: Array<{ serviceId: string; usageLimit?: number }>;
  usageLimitsPerPeriod?: number;
  autoRenewal?: boolean;
  extraBenefits?: string;
  validDays?: number;
  validStartHour?: string;
  validEndHour?: string;
  isActive?: boolean;
  minCommitmentMonths?: number;
  cancellationRules?: string;
  trialDays?: number;
  maxActiveSubscriptions?: number;
}

export interface ClientSubscription {
  id: string;
  planId: string;
  plan: { id: string; name: string; monthlyPrice: number };
  clientId: string;
  client: { id: string; name: string; phone: string; email?: string };
  status: "ACTIVE" | "PAUSED" | "CANCELLED" | "EXPIRED" | "TRIALING" | "PAST_DUE";
  startDate: string;
  endDate: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  pauseUntil: string | null;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  lastBillingAt: string | null;
  nextBillingAt: string;
  usageCount: number;
  usageLimit: number | null;
  autoRenewal: boolean;
  trialEndsAt: string | null;
  payments?: Array<{
    id: string;
    amount: number;
    status: string;
    paidAt: string | null;
    dueDate: string;
  }>;
  usageHistory?: Array<{
    id: string;
    service?: { name: string };
    usedAt: string;
    description: string | null;
  }>;
  _count?: { usageHistory: number; payments: number };
  createdAt: string;
}

export interface SubscriptionDashboard {
  active: number;
  trialing: number;
  pastDue: number;
  cancelled: number;
  expired: number;
  renewalsThisMonth: number;
  monthlyRevenue: number;
  total: number;
  recentSubscriptions: Array<{
    id: string;
    status: string;
    plan: { name: string; monthlyPrice: number };
    client: { name: string; phone: string };
    createdAt: string;
  }>;
}

export interface PlanReport {
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
}
