"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clientsService } from "@/services/clients";
import type { ClientFormData, ClientFilters } from "@/types";

export function useClients(filtersOrPage: ClientFilters | number = { page: 1 }) {
    const filters = typeof filtersOrPage === "number" ? { page: filtersOrPage } : filtersOrPage;
    return useQuery({
        queryKey: ["clients", filters],
        queryFn: () => clientsService.list(filters),
    });
}

export function useClient(id: string) {
    return useQuery({
        queryKey: ["clients", id],
        queryFn: () => clientsService.getById(id),
        enabled: !!id,
    });
}

export function useSearchClients(query: string) {
    return useQuery({
        queryKey: ["clients", "search", query],
        queryFn: () => clientsService.search(query),
        enabled: query.length >= 2,
    });
}

export function useCreateClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ClientFormData) => clientsService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clients"] });
        },
    });
}

export function useUpdateClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<ClientFormData> }) =>
            clientsService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clients"] });
        },
    });
}

export function useDeleteClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => clientsService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clients"] });
        },
    });
}
