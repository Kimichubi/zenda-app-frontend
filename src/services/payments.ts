import { api } from "./api";
import type { Payment, PaymentFilters, PaginatedResponse } from "@/types";

export const paymentsService = {
    list: async (filters: PaymentFilters = {}) => {
        const { page = 1, limit = 10, status, ...rest } = filters;
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(status && status !== "all" && { status: status.toUpperCase() }),
            ...Object.fromEntries(
                Object.entries(rest).filter(([_, v]) => v !== undefined && v !== "")
            ),
        });

        const res = await api.get<Payment[] | PaginatedResponse<Payment>>(`/payments?${params.toString()}`);
        
        if (Array.isArray(res)) {
            return {
                data: res,
                total: res.length,
                page,
                limit,
            } as PaginatedResponse<Payment>;
        }
        return res as PaginatedResponse<Payment>;
    },

    getById: (id: string) =>
        api.get<Payment>(`/payments/${encodeURIComponent(id)}`),

    generatePix: (appointmentId: string) =>
        api.post<Payment>("/payments/pix", { appointmentId }),

    markAsPaid: (id: string) =>
        api.patch<Payment>(`/payments/${encodeURIComponent(id)}/paid`),

    cancel: (id: string) =>
        api.patch<Payment>(`/payments/${encodeURIComponent(id)}/cancel`),
};
