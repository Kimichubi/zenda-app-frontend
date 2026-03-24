"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { servicesService, type ServiceFormData } from "@/services/services";
import type { ServiceFilters } from "@/types";

export function useServices(filters: ServiceFilters = { page: 1, limit: 10 }) {
    return useQuery({
        queryKey: ["services", filters],
        queryFn: () => servicesService.list(filters),
    });
}

export function useCreateService() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ServiceFormData) => servicesService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services"] });
        },
    });
}

export function useUpdateService() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<ServiceFormData> }) =>
            servicesService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services"] });
        },
    });
}

export function useDeleteService() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => servicesService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services"] });
        },
    });
}
