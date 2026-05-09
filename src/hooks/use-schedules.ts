"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { schedulesService } from "@/services/schedules";

export function useSchedules() {
    return useQuery({
        queryKey: ["schedules"],
        queryFn: () => schedulesService.list(),
    });
}

export function useUpsertSchedule() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: schedulesService.upsert,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
        },
    });
}

export function useBlockedSlots(professionalId: string, startDate: string, endDate: string) {
    return useQuery({
        queryKey: ["blocked-slots", professionalId, startDate, endDate],
        queryFn: () => schedulesService.listBlockedSlots(professionalId, startDate, endDate),
        enabled: !!professionalId && !!startDate && !!endDate,
    });
}

export function useBlockSlot() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: schedulesService.blockSlot,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blocked-slots"] });
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
        },
    });
}

export function useUnblockSlot() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: schedulesService.unblockSlot,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blocked-slots"] });
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
        },
    });
}
