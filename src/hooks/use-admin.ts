"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin";

export function useAdminUsers() {
    return useQuery({
        queryKey: ["admin", "users"],
        queryFn: () => adminService.listUsers(),
    });
}

export function useAdminStats() {
    return useQuery({
        queryKey: ["admin", "stats"],
        queryFn: () => adminService.getStats(),
    });
}

export function useUpdateUserPlan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, plan }: { id: string; plan: string }) =>
            adminService.updateUserPlan(id, plan),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
        },
    });
}
