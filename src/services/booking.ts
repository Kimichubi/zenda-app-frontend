import { api } from "./api";
import type { Service, TimeSlot, PublicBookingData } from "@/types";

export interface TodaySlot {
    time: string;
    available: boolean;
    professionalName: string;
}

export const bookingService = {
    getServices: (slug: string) =>
        api.get<Service[]>(`/booking/${encodeURIComponent(slug)}/services`),

    getAvailableSlots: (slug: string, date: string, serviceId: string, professionalId?: string) =>
        api.get<TimeSlot[]>(
            `/booking/${encodeURIComponent(slug)}/slots?date=${encodeURIComponent(date)}&serviceId=${encodeURIComponent(serviceId)}${professionalId ? `&professionalId=${encodeURIComponent(professionalId)}` : ""}`
        ),

    getTodaySlots: (slug: string) =>
        api.get<TodaySlot[]>(`/booking/${encodeURIComponent(slug)}/today`),

    createBooking: (slug: string, data: PublicBookingData) =>
        api.post<{ message: string }>(
            `/booking/${encodeURIComponent(slug)}`,
            data
        ),
};
