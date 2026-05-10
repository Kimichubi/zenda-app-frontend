"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { posService, PosAppointment, PosClient, PosProfessional, PosService, PosDailySummary } from "@/services/pos";

export function usePosAppointments() {
  return useQuery({
    queryKey: ["pos", "appointments", "today"],
    queryFn: () => posService.getTodayAppointments(),
    refetchInterval: 30000,
  });
}

export function usePosAppointment(id: string) {
  return useQuery({
    queryKey: ["pos", "appointments", id],
    queryFn: () => posService.getAppointment(id),
    enabled: !!id,
  });
}

export function useSearchPosClients(query: string) {
  return useQuery({
    queryKey: ["pos", "clients", "search", query],
    queryFn: () => posService.searchClients(query),
    enabled: query.length >= 2,
  });
}

export function useCreateWalkInClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: posService.createWalkInClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pos", "clients"] });
    },
  });
}

export function usePosProfessionals() {
  return useQuery({
    queryKey: ["pos", "professionals"],
    queryFn: () => posService.listProfessionals(),
  });
}

export function usePosServices() {
  return useQuery({
    queryKey: ["pos", "services"],
    queryFn: () => posService.listServices(),
  });
}

export function useCreatePosAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: posService.createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pos", "appointments", "today"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

export function usePosCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof posService.checkoutAppointment>[1] }) =>
      posService.checkoutAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pos", "appointments", "today"] });
      queryClient.invalidateQueries({ queryKey: ["pos", "daily-summary"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}

export function usePosUpdateStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      posService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pos", "appointments"] });
      queryClient.invalidateQueries({ queryKey: ["pos", "daily-summary"] });
    },
  });
}

export function usePosDailySummary() {
  return useQuery({
    queryKey: ["pos", "daily-summary"],
    queryFn: () => posService.getDailySummary(),
    refetchInterval: 60000,
  });
}
