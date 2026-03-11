import { api } from "./api";
import type { Appointment, AppointmentFormData } from "@/types";

export const appointmentsService = {
    list: (date?: string) => {
        const params = date ? `?date=${encodeURIComponent(date)}` : "";
        return api.get<Appointment[]>(`/appointments${params}`);
    },

    getByWeek: (startDate: string) =>
        api.get<Appointment[]>(
            `/appointments/week?start=${encodeURIComponent(startDate)}`
        ),

    getById: (id: string) =>
        api.get<Appointment>(`/appointments/${encodeURIComponent(id)}`),

    create: (data: AppointmentFormData) =>
        api.post<Appointment>("/appointments", data),

    update: (id: string, data: Partial<AppointmentFormData>) =>
        api.put<Appointment>(`/appointments/${encodeURIComponent(id)}`, data),

    updateStatus: (id: string, status: string) =>
        api.patch<Appointment>(`/appointments/${encodeURIComponent(id)}/status`, {
            status,
        }),

    cancel: (id: string) =>
        api.patch<Appointment>(`/appointments/${encodeURIComponent(id)}/status`, {
            status: "cancelled",
        }),
};
