import { api } from "./api";
import type { Client, ClientFormData, ClientFilters, PaginatedResponse } from "@/types";

export const clientsService = {
    list: async (filters: ClientFilters = {}) => {
        const { page = 1, limit = 20, ...rest } = filters;
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...Object.fromEntries(
                Object.entries(rest).filter(([_, v]) => v !== undefined && v !== "")
            ),
        });

        const res = await api.get<Client[] | PaginatedResponse<Client>>(`/clients?${params.toString()}`);
        // Normalize backend responses: some environments return plain Client[]
        if (Array.isArray(res)) {
            return {
                data: res,
                total: res.length,
                page,
                limit,
            } as PaginatedResponse<Client>;
        }
        return res as PaginatedResponse<Client>;
    },

    getById: (id: string) => api.get<Client>(`/clients/${encodeURIComponent(id)}`),

    create: (data: ClientFormData) => {
        const { notes, ...rest } = data as any;
        const payload = notes ? { ...rest, notes } : rest;
        return api.post<Client>("/clients", payload);
    },

    update: (id: string, data: Partial<ClientFormData>) => {
        const { notes, ...rest } = data as any;
        const payload = notes ? { ...rest, notes } : rest;
        return api.patch<Client>(`/clients/${encodeURIComponent(id)}`, payload);
    },

    delete: (id: string) => api.delete<void>(`/clients/${encodeURIComponent(id)}`),

    search: (query: string) =>
        api.get<Client[]>(`/clients/search?q=${encodeURIComponent(query)}`),
};
