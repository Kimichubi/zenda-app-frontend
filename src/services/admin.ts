import { api } from "./api";
import type { User } from "@/types";

export interface AdminStats {
    totalUsers: number;
    proUsers: number;
    enterpriseUsers: number;
    onboardingUsers: number;
    totalAppointments: number;
    totalRevenue: number;
    totalClients: number;
    newThisMonth: number;
    recentUsers: {
        id: string;
        name: string;
        email: string;
        businessName: string;
        plan: string;
        createdAt: string;
    }[];
}

export interface UserDetail {
    id: string;
    name: string;
    email: string;
    businessName: string;
    role: string;
    plan: string;
    createdAt: string;
    stats: {
        totalAppointments: number;
        totalRevenue: number;
        totalClients: number;
        totalServices: number;
    };
}

export const adminService = {
    listUsers: (search?: string) => {
        const query = search ? `?search=${encodeURIComponent(search)}` : "";
        return api.get<User[]>(`/admin/users${query}`);
    },

    getUserDetail: (id: string) =>
        api.get<UserDetail>(`/admin/users/${encodeURIComponent(id)}/detail`),
    
    updateUserPlan: (id: string, plan: string) =>
        api.patch<User>(`/admin/users/${encodeURIComponent(id)}/plan`, { plan }),

    getStats: () => api.get<AdminStats>("/admin/stats"),

    impersonate: (userId: string) =>
        api.post<{ accessToken: string; refreshToken: string; user: { id: string; name: string; email: string; role: string; plan: string } }>(`/admin/impersonate/${encodeURIComponent(userId)}`),
};