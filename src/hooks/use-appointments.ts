"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { appointmentsService } from "@/services/appointments";
import type { AppointmentFormData } from "@/types";

export function useAppointments(date?: string) {
    return useQuery({
        queryKey: ["appointments", date],
        queryFn: () => appointmentsService.list(date),
    });
}

export function useWeekAppointments(startDate: string) {
    return useQuery({
        queryKey: ["appointments", "week", startDate],
        queryFn: () => appointmentsService.getByWeek(startDate),
    });
}

export function useCreateAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AppointmentFormData) => appointmentsService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        },
    });
}

export function useUpdateAppointmentStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            appointmentsService.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        },
    });
}

export function useCancelAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => appointmentsService.cancel(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        },
    });
}
