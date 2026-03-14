import { api } from "./api";
import type { User } from "@/types";

export interface AdminStats {
    totalUsers: number;
    proUsers: number;
    enterpriseUsers: number;
    freeUsers: number;
}

export const adminService = {
    listUsers: () => api.get<User[]>("/admin/users"),
    
    updateUserPlan: (id: string, plan: string) =>
        api.patch<User>(`/admin/users/${encodeURIComponent(id)}/plan`, { plan }),

    getStats: () => api.get<AdminStats>("/admin/stats"),
};
