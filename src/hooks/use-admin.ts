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

export function useAdminBusinesses(search?: string, status?: string, plan?: string) {
    return useQuery({
        queryKey: ["admin", "businesses", search, status, plan],
        queryFn: () => adminService.listBusinesses(),
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

export function useUpdateUserRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, role }: { id: string; role: string }) =>
            adminService.updateUserRole(id, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
        },
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => adminService.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
        },
    });
}

export function useResetPassword() {
    return useMutation({
        mutationFn: ({ id, password }: { id: string; password: string }) =>
            adminService.resetPassword(id, password),
    });
}

export function useUserDetail(id: string | null) {
    return useQuery({
        queryKey: ["admin", "users", id, "detail"],
        queryFn: () => adminService.getUserDetail(id!),
        enabled: !!id,
    });
}

export function useAdminMonitoring() {
    return useQuery({
        queryKey: ["admin", "monitoring"],
        queryFn: () => adminService.getMonitoring(),
    });
}

export function useAdminReviews(params?: { search?: string; businessId?: string; page?: number; limit?: number }) {
    return useQuery({
        queryKey: ["admin", "reviews", params],
        queryFn: () => adminService.listReviews(params),
    });
}

export function useToggleReviewPublic() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => adminService.toggleReviewPublic(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
        },
    });
}

export function useReplyReview() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, reply }: { id: string; reply: string }) => adminService.replyReview(id, reply),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
        },
    });
}

export function useAdminChatSessions(params?: { search?: string; page?: number; limit?: number }) {
    return useQuery({
        queryKey: ["admin", "chat-sessions", params],
        queryFn: () => adminService.listChatSessions(params),
    });
}

export function useChatLogs(sessionId: string | null) {
    return useQuery({
        queryKey: ["admin", "chat-sessions", sessionId, "logs"],
        queryFn: () => adminService.getChatLogs(sessionId!),
        enabled: !!sessionId,
    });
}

export function useChatStats() {
    return useQuery({
        queryKey: ["admin", "chat-stats"],
        queryFn: () => adminService.getChatStats(),
    });
}

export function useAdminFinance(params?: { year?: number; month?: number }) {
    return useQuery({
        queryKey: ["admin", "finance", params],
        queryFn: () => adminService.getFinance(params),
    });
}

export function useFeatureFlags() {
    return useQuery({
        queryKey: ["admin", "feature-flags"],
        queryFn: () => adminService.listFeatureFlags(),
    });
}

export function useCreateFeatureFlag() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminService.createFeatureFlag,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "feature-flags"] }),
    });
}

export function useUpdateFeatureFlag() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { name?: string; enabled?: boolean; plan?: string } }) =>
            adminService.updateFeatureFlag(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "feature-flags"] }),
    });
}

export function useDeleteFeatureFlag() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => adminService.deleteFeatureFlag(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "feature-flags"] }),
    });
}

export function useSupportTickets(params?: { status?: string; priority?: string; page?: number; limit?: number }) {
    return useQuery({
        queryKey: ["admin", "support-tickets", params],
        queryFn: () => adminService.listSupportTickets(params),
    });
}

export function useCreateSupportTicket() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminService.createSupportTicket,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "support-tickets"] }),
    });
}

export function useUpdateSupportTicket() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { status?: string; priority?: string; assigneeId?: string; internalNotes?: string } }) =>
            adminService.updateSupportTicket(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "support-tickets"] }),
    });
}
