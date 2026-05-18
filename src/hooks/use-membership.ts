"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { membershipService } from "@/services/membership";

// --- Plans ---

export function useMembershipPlans(includeInactive = false) {
  return useQuery({
    queryKey: ["membership-plans", includeInactive],
    queryFn: () => membershipService.listPlans(includeInactive),
  });
}

export function useMembershipPlan(id: string) {
  return useQuery({
    queryKey: ["membership-plan", id],
    queryFn: () => membershipService.getPlan(id),
    enabled: !!id,
  });
}

export function useCreateMembershipPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof membershipService.createPlan>[0]) =>
      membershipService.createPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membership-plans"] });
      queryClient.invalidateQueries({ queryKey: ["membership-report"] });
    },
  });
}

export function useUpdateMembershipPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof membershipService.updatePlan>[1] }) =>
      membershipService.updatePlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membership-plans"] });
      queryClient.invalidateQueries({ queryKey: ["membership-plan"] });
      queryClient.invalidateQueries({ queryKey: ["membership-report"] });
    },
  });
}

export function useDeleteMembershipPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => membershipService.deletePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membership-plans"] });
      queryClient.invalidateQueries({ queryKey: ["membership-report"] });
    },
  });
}

export function useMembershipReport() {
  return useQuery({
    queryKey: ["membership-report"],
    queryFn: () => membershipService.getPlanReport(),
  });
}

// --- Subscriptions ---

export function useSubscriptions(filters?: {
  status?: string;
  planId?: string;
  clientId?: string;
  overdue?: boolean;
}) {
  return useQuery({
    queryKey: ["subscriptions", filters],
    queryFn: () => membershipService.listSubscriptions(filters),
  });
}

export function useSubscription(id: string) {
  return useQuery({
    queryKey: ["subscription", id],
    queryFn: () => membershipService.getSubscription(id),
    enabled: !!id,
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { planId: string; clientId: string }) =>
      membershipService.createSubscription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["membership-plans"] });
      queryClient.invalidateQueries({ queryKey: ["subscription-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["membership-report"] });
    },
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof membershipService.updateSubscription>[1] }) =>
      membershipService.updateSubscription(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      queryClient.invalidateQueries({ queryKey: ["subscription-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["membership-report"] });
    },
  });
}

export function useSubscriptionDashboard() {
  return useQuery({
    queryKey: ["subscription-dashboard"],
    queryFn: () => membershipService.getDashboard(),
  });
}
