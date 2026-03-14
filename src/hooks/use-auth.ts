"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService, type UpdateProfileData } from "@/services/auth";

export function useUser() {
    return useQuery({
        queryKey: ["user"],
        queryFn: () => authService.me(),
        retry: false,
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateProfileData) => authService.updateProfile(data),
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(["user"], updatedUser);
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
