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

export interface BusinessDetail {
    id: string;
    name: string;
    slug: string;
    plan: string;
    status: string;
    createdAt: string;
    owner: { id: string; name: string; email: string; phone?: string };
    staff: { id: string; name: string; email: string; role: string; baseCommission: number }[];
    products: { id: string; name: string; price: number; stock: number }[];
    _count?: { staff: number; products: number; reviews: number };
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

    // Business management
    listBusinesses: () => api.get<any[]>("/admin/businesses"),

    getBusiness: (id: string) => api.get<BusinessDetail>(`/admin/businesses/${encodeURIComponent(id)}`),

    createBusiness: (data: { name: string; slug: string; ownerId: string; plan?: string; activateNow?: boolean }) =>
        api.post<any>("/admin/businesses", data),

    updateBusiness: (id: string, data: { name?: string; slug?: string; plan?: string; status?: string; addStaff?: { name: string; email: string; commission?: number } }) =>
        api.patch<any>(`/admin/businesses/${encodeURIComponent(id)}`, data),

    linkUserToBusiness: (businessId: string, userId: string) =>
        api.post<any>(`/admin/businesses/${encodeURIComponent(businessId)}/link-user`, { userId }),

    // Monitoring
    getMonitoring: () => api.get<any>("/admin/monitoring"),

    // Business access / impersonation
    accessBusiness: (businessId: string) =>
        api.post<{ accessToken: string; refreshToken: string; user: { id: string; name: string; email: string; role: string } }>(`/admin/businesses/${encodeURIComponent(businessId)}/access`),

    // Onboarding
    getOnboarding: () => api.get<any[]>("/admin/onboarding"),
};