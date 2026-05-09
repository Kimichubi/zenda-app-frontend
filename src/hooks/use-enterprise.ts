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

export function useRemoveStaff() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: enterpriseService.removeStaff,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["staff"] });
        },
    });
}

export function useUpdateStaffProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { avatarUrl?: string; bio?: string; phone?: string } }) =>
            enterpriseService.updateStaffProfile(id, data),
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

export function useUpdateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<any> }) =>
            enterpriseService.updateProduct(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: enterpriseService.deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
}

export function useLowStockProducts() {
    return useQuery({
        queryKey: ["products", "low-stock"],
        queryFn: () => enterpriseService.getLowStockProducts(),
    });
}

export function useInventoryMovements(productId?: string) {
    return useQuery({
        queryKey: ["inventory", "movements", productId],
        queryFn: () => enterpriseService.getInventoryMovements(productId),
    });
}

export function useRestock() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: enterpriseService.restock,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["inventory"] });
        },
    });
}

export function useCategories() {
    return useQuery({
        queryKey: ["categories"],
        queryFn: () => enterpriseService.listCategories(),
    });
}

export function useCreateCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: enterpriseService.createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: enterpriseService.deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
}

export function useCommissions(startDate?: string, endDate?: string) {
    return useQuery({
        queryKey: ["commissions", startDate, endDate],
        queryFn: () => enterpriseService.listCommissions(startDate, endDate),
    });
}

export function usePayCommissions() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: enterpriseService.payCommissions,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["commissions"] });
        },
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

export function useCheckoutAppointment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ appointmentId, data }: { appointmentId: string; data: Parameters<typeof enterpriseService.checkoutAppointment>[1] }) =>
            enterpriseService.checkoutAppointment(appointmentId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
            queryClient.invalidateQueries({ queryKey: ["payments"] });
        },
    });
}

export function useTipSuggestions(appointmentId: string) {
    return useQuery({
        queryKey: ["tips", appointmentId],
        queryFn: () => enterpriseService.getTipSuggestions(appointmentId),
        enabled: !!appointmentId,
    });
}

export function useAddClientCredit() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ clientId, data }: { clientId: string; data: { amount: number; description: string } }) =>
            enterpriseService.addClientCredit(clientId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["client-credit"] });
        },
    });
}

export function useClientCredit(clientId: string) {
    return useQuery({
        queryKey: ["client-credit", clientId],
        queryFn: () => enterpriseService.getClientCredit(clientId),
        enabled: !!clientId,
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

export function useUpdateLoyalty() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: enterpriseService.updateLoyalty,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["business"] });
        },
    });
}