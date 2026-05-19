"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { billingService } from "@/services/billing";

export function useBusinessSubscription() {
  return useQuery({
    queryKey: ["business-subscription"],
    queryFn: () => billingService.getSubscription(),
  });
}

export function useInvoices() {
  return useQuery({
    queryKey: ["billing-invoices"],
    queryFn: () => billingService.getInvoices(),
  });
}

export function useGenerateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => billingService.generateInvoice(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing-invoices"] });
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

export function useAdminBillingSubscriptions() {
  return useQuery({
    queryKey: ["admin-billing-subscriptions"],
    queryFn: () => billingService.adminListSubscriptions(),
  });
}
