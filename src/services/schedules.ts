import { api } from "./api";
import type { Schedule, BlockedSlot } from "@/types";

export const schedulesService = {
    list: () => api.get<Schedule[]>("/schedules"),

    upsert: (data: {
        weekday: number;
        startTime: string;
        endTime: string;
        slotDuration?: number;
        isActive?: boolean;
        breakStart?: string;
        breakEnd?: string;
        professionalId?: string;
    }) => api.post<Schedule>("/schedules", data),

    listBlockedSlots: (professionalId: string, startDate: string, endDate: string) =>
        api.get<BlockedSlot[]>(
            `/schedules/blocked-slots?professionalId=${encodeURIComponent(professionalId)}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
        ),

    blockSlot: (data: {
        date: string;
        startTime: string;
        endTime: string;
        reason?: string;
        professionalId?: string;
    }) => api.post<BlockedSlot>("/schedules/blocked-slots", data),

    unblockSlot: (id: string) => api.delete<void>(`/schedules/blocked-slots/${id}`),
};
