"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { servicesService, type ServiceFormData } from "@/services/services";

export function useServices() {
    return useQuery({
        queryKey: ["services"],
        queryFn: () => servicesService.list(),
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
