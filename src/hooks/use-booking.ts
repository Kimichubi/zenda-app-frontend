"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { bookingService } from "@/services/booking";
import type { PublicBookingData } from "@/types";

export function useBookingServices(slug: string) {
    return useQuery({
        queryKey: ["booking", slug, "services"],
        queryFn: () => bookingService.getServices(slug),
        enabled: !!slug,
    });
}

export function useTodaySlots(slug: string) {
    return useQuery({
        queryKey: ["booking", slug, "today"],
        queryFn: () => bookingService.getTodaySlots(slug),
        enabled: !!slug,
        refetchInterval: 60000,
    });
}

export function useAvailableSlots(slug: string, date: string, serviceId: string, professionalId?: string) {
    return useQuery({
        queryKey: ["booking", slug, "slots", date, serviceId, professionalId],
        queryFn: () => bookingService.getAvailableSlots(slug, date, serviceId, professionalId),
        enabled: !!slug && !!date && !!serviceId,
    });
}

export function useCreateBooking(slug: string) {
    return useMutation({
        mutationFn: (data: PublicBookingData) => bookingService.createBooking(slug, data),
    });
}
