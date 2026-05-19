"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { billingService } from "@/services/billing";

export function useBillingPlans() {
  return useQuery({
    queryKey: ["billing-plans"],
    queryFn: () => billingService.listPlans(),
  });
}

export function useBusinessSubscription() {
  return useQuery({
    queryKey: ["business-subscription"],
    queryFn: () => billingService.getSubscription(),
    refetchInterval: 30_000,
  });
}

export function useInvoices() {
  return useQuery({
    queryKey: ["billing-invoices"],
    queryFn: () => billingService.getInvoices(),
  });
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: (data?: { planId?: string; billingType?: "MONTHLY" | "YEARLY" }) =>
      billingService.createCheckout(data),
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reason?: string) => billingService.cancelSubscription(reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-subscription"] });
    },
  });
}

export function useChangePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { planId: string; billingType?: "MONTHLY" | "YEARLY" }) =>
      billingService.changePlan(data.planId, data.billingType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-subscription"] });
    },
  });
}

export function useAdminBillingStats() {
  return useQuery({
    queryKey: ["admin-billing-stats"],
    queryFn: () => billingService.adminGetStats(),
  });
}

export function useAdminBillingSubscriptions(params?: { status?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["admin-billing-subscriptions", params],
    queryFn: () => billingService.adminListSubscriptions(params),
  });
}

export function useAdminBillingPlans(showAll?: boolean) {
  return useQuery({
    queryKey: ["admin-billing-plans", showAll],
    queryFn: () => billingService.adminListPlans(showAll),
  });
}

export function useAdminCreatePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<import("@/services/billing").BillingPlan>) =>
      billingService.adminCreatePlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-billing-plans"] });
    },
  });
}

export function useAdminUpdatePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<import("@/services/billing").BillingPlan> }) =>
      billingService.adminUpdatePlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-billing-plans"] });
    },
  });
}
