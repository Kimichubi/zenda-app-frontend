"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import type { LoginCredentials, SignupData } from "@/types";

export function useUser() {
    return useQuery({
        queryKey: ["user"],
        queryFn: () => authService.me(),
        retry: false,
    });
}

export function useLogin() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: LoginCredentials) => authService.login(data),
        onSuccess: (response) => {
            localStorage.setItem("zenda_token", response.accessToken);
            queryClient.setQueryData(["user"], response.user);
            router.push("/dashboard");
        },
    });
}

export function useSignup() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SignupData) => authService.signup(data),
        onSuccess: (response) => {
            localStorage.setItem("zenda_token", response.accessToken);
            queryClient.setQueryData(["user"], response.user);
            router.push("/dashboard");
        },
    });
}

export function useForgotPassword() {
    return useMutation({
        mutationFn: (email: string) => authService.forgotPassword(email),
    });
}

export function useLogout() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return () => {
        authService.logout();
        queryClient.clear();
        router.push("/login");
    };
}
