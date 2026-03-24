"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enterpriseService } from "@/services/enterprise";

export function useStaff() {
    return useQuery({
        queryKey: ["staff"],
        queryFn: () => enterpriseService.listStaff(),
    });
}

export function useAddStaff() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: enterpriseService.addStaff,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["staff"] });
        },
    });
}

export function useProducts() {
    return useQuery({
        queryKey: ["products"],
        queryFn: () => enterpriseService.listProducts(),
    });
}

export function useCreateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: enterpriseService.createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
}

export function useCommissions() {
    return useQuery({
        queryKey: ["commissions"],
        queryFn: () => enterpriseService.listCommissions(),
    });
}

export function useCheckout() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: enterpriseService.checkout,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["commissions"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
}

export function useRedeemPoints() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: enterpriseService.redeemPoints,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clients"] });
        },
    });
}
