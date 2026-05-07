"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService, type UserDetail } from "@/services/admin";

export function useAdminUsers(search?: string) {
    return useQuery({
        queryKey: ["admin", "users", search],
        queryFn: () => adminService.listUsers(search),
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

export function useUserDetail(id: string | null) {
    return useQuery({
        queryKey: ["admin", "users", id, "detail"],
        queryFn: () => adminService.getUserDetail(id!),
        enabled: !!id,
    });
}