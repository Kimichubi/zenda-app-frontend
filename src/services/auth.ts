import { api } from "./api";
import type {
    AuthResponse,
    LoginCredentials,
    SignupData,
    User,
} from "@/types";

export interface ValidateResponse {
    valid: boolean;
    userId: string;
    plan: string;
    role?: string;
    needsOnboarding: boolean;
    businessId?: string | null;
    businessName?: string | null;
    businessStatus?: string | null;
    suspended?: boolean;
}

export interface UpdateProfileData {
    name?: string;
    phone?: string;
    businessName?: string;
    slug?: string;
}

export const authService = {
    login: (data: LoginCredentials) =>
        api.post<AuthResponse | { requires2FA: boolean; email: string; message: string }>("/auth/login", data),

    adminLogin: (data: { email: string; password: string }) =>
        api.post<AuthResponse>("/auth/admin/login", data),

    verifyLoginCode: (data: { email: string; code: string }) =>
        api.post<AuthResponse | { valid: boolean; message: string }>("/auth/verify-login-code", data),

    signup: (data: SignupData) =>
        api.post<AuthResponse>("/auth/signup", data),

    forgotPassword: (email: string) =>
        api.post<{ message: string }>("/auth/forgot-password", { email }),

    validateToken: () => api.get<ValidateResponse>("/auth/validate"),

    refreshToken: () => api.post<AuthResponse>("/auth/refresh"),

    me: () => api.get<User>("/users/me"),

    updateProfile: (data: UpdateProfileData) =>
        api.patch<User>("/users/me", data),

    completeOnboarding: () =>
        api.patch<{ success: boolean; plan: string }>("/auth/complete-onboarding"),

    logout: () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("zenda_token");
            localStorage.removeItem("zenda_refresh_token");
        }
    },
};