import { api } from "./api";
import type {
    AuthResponse,
    LoginCredentials,
    SignupData,
} from "@/types";

export const authService = {
    login: (data: LoginCredentials) =>
        api.post<AuthResponse>("/auth/login", data),

    signup: (data: SignupData) =>
        api.post<AuthResponse>("/auth/signup", data),

    forgotPassword: (email: string) =>
        api.post<{ message: string }>("/auth/forgot-password", { email }),

    me: () => api.get<AuthResponse["user"]>("/users/me"),

    logout: () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("zenda_token");
        }
    },
};
