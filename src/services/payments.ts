import { api } from "./api";
import type { Payment } from "@/types";

export const paymentsService = {
    list: () => api.get<Payment[]>("/payments"),

    getById: (id: string) =>
        api.get<Payment>(`/payments/${encodeURIComponent(id)}`),

    generatePix: (appointmentId: string) =>
        api.post<Payment>("/payments/pix", { appointmentId }),

    markAsPaid: (id: string) =>
        api.patch<Payment>(`/payments/${encodeURIComponent(id)}/paid`),

    cancel: (id: string) =>
        api.patch<Payment>(`/payments/${encodeURIComponent(id)}/cancel`),
};
