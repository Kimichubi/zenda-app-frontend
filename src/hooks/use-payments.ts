"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentsService } from "@/services/payments";
import type { PaymentFilters } from "@/types";

export function usePayments(filters: PaymentFilters = { page: 1, limit: 10 }) {
    return useQuery({
        queryKey: ["payments", filters],
        queryFn: () => paymentsService.list(filters),
    });
}

export function useGeneratePix() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (appointmentId: string) => paymentsService.generatePix(appointmentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payments"] });
        },
    });
}

export function useMarkPaid() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => paymentsService.markAsPaid(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payments"] });
        },
    });
}

export function useCancelPayment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => paymentsService.cancel(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payments"] });
        },
    });
}
