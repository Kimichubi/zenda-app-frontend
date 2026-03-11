import { api } from "./api";
import type { Service, TimeSlot, PublicBookingData } from "@/types";

export const bookingService = {
    getServices: (slug: string) =>
        api.get<Service[]>(`/booking/${encodeURIComponent(slug)}/services`),

    getAvailableSlots: (slug: string, date: string, serviceId: string) =>
        api.get<TimeSlot[]>(
            `/booking/${encodeURIComponent(slug)}/slots?date=${encodeURIComponent(date)}&serviceId=${encodeURIComponent(serviceId)}`
        ),

    createBooking: (slug: string, data: PublicBookingData) =>
        api.post<{ message: string }>(
            `/booking/${encodeURIComponent(slug)}`,
            data
        ),
};
