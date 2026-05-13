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
    services: { id: string; name: string; price: number; duration: number }[];
    products: { id: string; name: string; price: number; stock: number }[];
    _count?: { staff: number; products: number; reviews: number; appointments: number };
}

export interface ReviewAdminItem {
    id: string;
    rating: number;
    comment: string | null;
    serviceRating: number | null;
    professionalRating: number | null;
    isPublic: boolean;
    reply: string | null;
    replyAt: string | null;
    createdAt: string;
    client: { name: string };
    business: { name: string };
    appointment: { service: { name: string } | null } | null;
}

export interface ChatSessionAdminItem {
    id: string;
    phoneNumber: string;
    clientId: string | null;
    businessId: string | null;
    state: string;
    lastMessageAt: string;
    createdAt: string;
    _count: { logs: number };
}

export interface ChatLogAdminItem {
    id: string;
    sessionId: string;
    incoming: string;
    outgoing: string;
    intent: string;
    confidence: number;
    metadata: any;
    createdAt: string;
}

export interface FeatureFlag {
    id: string;
    key: string;
    name: string;
    enabled: boolean;
    plan: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface SupportTicket {
    id: string;
    businessId: string | null;
    userId: string | null;
    subject: string;
    description: string;
    status: string;
    priority: string;
    assigneeId: string | null;
    internalNotes: string | null;
    createdAt: string;
    updatedAt: string;
}

export const adminService = {
    listUsers: (search?: string) => {
        const query = search ? `?search=${encodeURIComponent(search)}` : "";
        return api.get<User[]>(`/admin/users${query}`);
    },

    getUserDetail: (id: string) =>
        api.get<UserDetail>(`/admin/users/${encodeURIComponent(id)}/detail`),

    updateUserRole: (id: string, role: string) =>
        api.patch<User>(`/admin/users/${encodeURIComponent(id)}/role`, { role }),

    updateUserPlan: (id: string, plan: string) =>
        api.patch<User>(`/admin/users/${encodeURIComponent(id)}/plan`, { plan }),

    deleteUser: (id: string) =>
        api.delete<{ success: boolean }>(`/admin/users/${encodeURIComponent(id)}`),

    resetPassword: (id: string, password: string) =>
        api.post<{ success: boolean }>(`/admin/users/${encodeURIComponent(id)}/reset-password`, { password }),

    getStats: () => api.get<AdminStats>("/admin/stats"),

    impersonate: (userId: string) =>
        api.post<{ accessToken: string; refreshToken: string; user: { id: string; name: string; email: string; role: string; plan: string } }>(`/admin/impersonate/${encodeURIComponent(userId)}`),

    // Business management
    listBusinesses: () => api.get<any[]>("/admin/businesses"),

    getBusiness: (id: string) => api.get<BusinessDetail>(`/admin/businesses/${encodeURIComponent(id)}`),

    getBusinessAppointments: (id: string) => api.get<any[]>(`/admin/businesses/${encodeURIComponent(id)}/appointments`),

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

    // Reviews
    listReviews: (params?: { search?: string; businessId?: string; page?: number; limit?: number }) => {
        const qs = new URLSearchParams();
        if (params?.search) qs.set("search", params.search);
        if (params?.businessId) qs.set("businessId", params.businessId);
        if (params?.page) qs.set("page", String(params.page));
        if (params?.limit) qs.set("limit", String(params.limit));
        return api.get<{ data: ReviewAdminItem[]; total: number; page: number; limit: number }>(`/admin/reviews?${qs.toString()}`);
    },

    toggleReviewPublic: (id: string) =>
        api.patch<{ success: boolean; isPublic: boolean }>(`/admin/reviews/${encodeURIComponent(id)}/toggle-public`, {}),

    replyReview: (id: string, reply: string) =>
        api.post<{ success: boolean; review: ReviewAdminItem }>(`/admin/reviews/${encodeURIComponent(id)}/reply`, { reply }),

    // Chat monitoring
    listChatSessions: (params?: { search?: string; page?: number; limit?: number }) => {
        const qs = new URLSearchParams();
        if (params?.search) qs.set("search", params.search);
        if (params?.page) qs.set("page", String(params.page));
        if (params?.limit) qs.set("limit", String(params.limit));
        return api.get<{ data: ChatSessionAdminItem[]; total: number; page: number; limit: number }>(`/admin/chat-sessions?${qs.toString()}`);
    },

    getChatLogs: (sessionId: string) =>
        api.get<ChatLogAdminItem[]>(`/admin/chat-sessions/${encodeURIComponent(sessionId)}/logs`),

    getChatStats: () =>
        api.get<{ totalSessions: number; activeSessionsThisMonth: number; totalLogs: number; intentDistribution: { intent: string; count: number }[] }>("/admin/chat-stats"),

    // Finance
    getFinance: (params?: { year?: number; month?: number }) => {
        const qs = new URLSearchParams();
        if (params?.year) qs.set("year", String(params.year));
        if (params?.month) qs.set("month", String(params.month));
        return api.get<any>(`/admin/finance?${qs.toString()}`);
    },

    // Feature flags
    listFeatureFlags: () => api.get<FeatureFlag[]>("/admin/feature-flags"),

    createFeatureFlag: (data: { key: string; name: string; enabled?: boolean; plan?: string }) =>
        api.post<FeatureFlag>("/admin/feature-flags", data),

    updateFeatureFlag: (id: string, data: { name?: string; enabled?: boolean; plan?: string }) =>
        api.patch<FeatureFlag>(`/admin/feature-flags/${encodeURIComponent(id)}`, data),

    deleteFeatureFlag: (id: string) =>
        api.delete<{ success: boolean }>(`/admin/feature-flags/${encodeURIComponent(id)}`),

    // Support tickets
    listSupportTickets: (params?: { status?: string; priority?: string; page?: number; limit?: number }) => {
        const qs = new URLSearchParams();
        if (params?.status) qs.set("status", params.status);
        if (params?.priority) qs.set("priority", params.priority);
        if (params?.page) qs.set("page", String(params.page));
        if (params?.limit) qs.set("limit", String(params.limit));
        return api.get<{ data: SupportTicket[]; total: number; page: number; limit: number }>(`/admin/support-tickets?${qs.toString()}`);
    },

    createSupportTicket: (data: { subject: string; description: string; businessId?: string; userId?: string; priority?: string }) =>
        api.post<SupportTicket>("/admin/support-tickets", data),

    updateSupportTicket: (id: string, data: { status?: string; priority?: string; assigneeId?: string; internalNotes?: string }) =>
        api.patch<SupportTicket>(`/admin/support-tickets/${encodeURIComponent(id)}`, data),
};
