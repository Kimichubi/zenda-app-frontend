import { api } from "./api";
import { StaffMember, Product, Sale, Commission, LoyaltyConfig } from "@/types/enterprise";

export const enterpriseService = {
    // --- Business ---
    getBusiness: () => api.get<any>("/enterprise/business"),
    updateLoyalty: (data: LoyaltyConfig) => api.patch<void>("/enterprise/loyalty", data),

    // --- Staff ---
    listStaff: () => api.get<StaffMember[]>("/enterprise/staff"),
    
    addStaff: (data: { name: string; email: string; commission: number }) =>
        api.post<StaffMember>("/enterprise/staff", data),

    updateStaffCommission: (id: string, percentage: number) =>
        api.patch<StaffMember>(`/enterprise/staff/${id}/commission`, { percentage }),

    // --- POS & Inventory ---
    listProducts: () => api.get<Product[]>("/enterprise/products"),
    
    createProduct: (data: Omit<Product, "id">) => 
        api.post<Product>("/enterprise/products", data),

    updateProduct: (id: string, data: Partial<Product>) =>
        api.patch<Product>(`/enterprise/products/${id}`, data),

    deleteProduct: (id: string) =>
        api.delete<void>(`/enterprise/products/${id}`),
    
    checkout: (data: { customerId?: string; items: { productId: string; quantity: number }[]; paymentMethod: string }) =>
        api.post<Sale>("/enterprise/checkout", data),

    // --- Commissions ---
    listCommissions: () => api.get<Commission[]>("/enterprise/commissions"),
    
    payCommissions: (commissionIds: string[]) =>
        api.post<void>("/enterprise/commissions/pay", { commissionIds }),

    // --- Loyalty ---
    redeemPoints: (data: { clientId: string; points: number }) =>
        api.post<void>("/enterprise/loyalty/redeem", data),
};
