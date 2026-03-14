import { api } from "./api";
import type { Service } from "@/types";

export interface ServiceFormData {
    name: string;
    duration: number;
    price: number;
}

export const servicesService = {
    list: () => api.get<Service[]>("/services"),
    
    getById: (id: string) =>
        api.get<Service>(`/services/${encodeURIComponent(id)}`),

    create: (data: ServiceFormData) =>
        api.post<Service>("/services", data),

    update: (id: string, data: Partial<ServiceFormData>) =>
        api.patch<Service>(`/services/${encodeURIComponent(id)}`, data),

    delete: (id: string) =>
        api.delete<void>(`/services/${encodeURIComponent(id)}`),
};
