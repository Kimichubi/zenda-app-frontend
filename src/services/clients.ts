import { api } from "./api";
import type { Client, ClientFormData, PaginatedResponse } from "@/types";

export const clientsService = {
    list: (page = 1, limit = 20) =>
        api.get<PaginatedResponse<Client>>(`/clients?page=${page}&limit=${limit}`),

    getById: (id: string) => api.get<Client>(`/clients/${encodeURIComponent(id)}`),

    create: (data: ClientFormData) => api.post<Client>("/clients", data),

    update: (id: string, data: Partial<ClientFormData>) =>
        api.put<Client>(`/clients/${encodeURIComponent(id)}`, data),

    delete: (id: string) => api.delete<void>(`/clients/${encodeURIComponent(id)}`),

    search: (query: string) =>
        api.get<Client[]>(`/clients/search?q=${encodeURIComponent(query)}`),
};
