"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentsService } from "@/services/payments";

export function usePayments() {
    return useQuery({
        queryKey: ["payments"],
        queryFn: () => paymentsService.list(),
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
