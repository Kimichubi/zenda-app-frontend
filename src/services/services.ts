import { api } from "./api";
import type { Service, ServiceFilters, PaginatedResponse } from "@/types";

export interface ServiceFormData {
    name: string;
    duration: number;
    price: number;
}

export const servicesService = {
    list: async (filters: ServiceFilters = {}) => {
        const { page = 1, limit = 10, ...rest } = filters;
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...Object.fromEntries(
                Object.entries(rest).filter(([_, v]) => v !== undefined && v !== "")
            ),
        });

        const res = await api.get<Service[] | PaginatedResponse<Service>>(`/services?${params.toString()}`);
        
        if (Array.isArray(res)) {
            return {
                data: res,
                total: res.length,
                page,
                limit,
            } as PaginatedResponse<Service>;
        }
        return res as PaginatedResponse<Service>;
    },
    
    getById: (id: string) =>
        api.get<Service>(`/services/${encodeURIComponent(id)}`),

    create: (data: ServiceFormData) =>
        api.post<Service>("/services", data),

    update: (id: string, data: Partial<ServiceFormData>) =>
        api.patch<Service>(`/services/${encodeURIComponent(id)}`, data),

    delete: (id: string) =>
        api.delete<void>(`/services/${encodeURIComponent(id)}`),
};
