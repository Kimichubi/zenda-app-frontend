import { api } from "./api";
import type {
    AuthResponse,
    LoginCredentials,
    SignupData,
    User,
} from "@/types";

export interface UpdateProfileData {
    name?: string;
    phone?: string;
    businessName?: string;
    slug?: string;
}

export const authService = {
    login: (data: LoginCredentials) =>
        api.post<AuthResponse>("/auth/login", data),

    signup: (data: SignupData) =>
        api.post<AuthResponse>("/auth/signup", data),

    forgotPassword: (email: string) =>
        api.post<{ message: string }>("/auth/forgot-password", { email }),

    validateToken: () => api.get<{ valid: boolean; userId: string }>("/auth/validate"),

    refreshToken: () => api.post<AuthResponse>("/auth/refresh"),

    me: () => api.get<User>("/users/me"),

    updateProfile: (data: UpdateProfileData) =>
        api.patch<User>("/users/me", data),

    logout: () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("zenda_token");
            localStorage.removeItem("zenda_refresh_token");
        }
    },
};
