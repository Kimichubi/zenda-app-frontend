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

    removeStaff: (id: string) =>
        api.delete<void>(`/enterprise/staff/${id}`),

    // --- Categories ---
    listCategories: () => api.get<any[]>("/enterprise/categories"),
    createCategory: (data: { name: string }) =>
        api.post<any>("/enterprise/categories", data),
    updateCategory: (id: string, data: { name: string }) =>
        api.patch<any>(`/enterprise/categories/${id}`, data),
    deleteCategory: (id: string) =>
        api.delete<void>(`/enterprise/categories/${id}`),

    // --- POS & Inventory ---
    listProducts: () => api.get<Product[]>("/enterprise/products"),
    
    createProduct: (data: Omit<Product, "id">) => 
        api.post<Product>("/enterprise/products", data),

    updateProduct: (id: string, data: Partial<Product>) =>
        api.patch<Product>(`/enterprise/products/${id}`, data),

    deleteProduct: (id: string) =>
        api.delete<void>(`/enterprise/products/${id}`),
    
    getInventoryMovements: (productId?: string) => {
        const params = productId ? `?productId=${productId}` : "";
        return api.get<any[]>("/enterprise/inventory/movements" + params);
    },

    getLowStockProducts: () => api.get<Product[]>("/enterprise/inventory/low-stock"),

    restock: (data: { productId: string; quantity: number; reason: string }) =>
        api.post<any>("/enterprise/inventory/restock", data),

    checkout: (data: { customerId?: string; items: { productId: string; quantity: number }[]; paymentMethod: string }) =>
        api.post<Sale>("/enterprise/checkout", data),

    checkoutAppointment: (appointmentId: string, data: {
        tipAmount?: number;
        tipPercentage?: number;
        paymentMethod: string;
        useInternalCredit?: boolean;
        splitEnabled?: boolean;
    }) => api.post<any>(`/enterprise/checkout/appointment/${appointmentId}`, data),

    getTipSuggestions: (appointmentId: string) =>
        api.get<any>(`/enterprise/checkout/appointment/${appointmentId}/tips`),

    addClientCredit: (clientId: string, data: { amount: number; description: string }) =>
        api.post<any>(`/enterprise/clients/${clientId}/credit`, data),

    getClientCredit: (clientId: string) =>
        api.get<any>(`/enterprise/clients/${clientId}/credit`),

    // --- Commissions ---
    listCommissions: (startDate?: string, endDate?: string) => {
        const params = new URLSearchParams();
        if (startDate) params.set("startDate", startDate);
        if (endDate) params.set("endDate", endDate);
        const qs = params.toString();
        return api.get<Commission[]>(`/enterprise/commissions${qs ? `?${qs}` : ""}`);
    },
    
    payCommissions: (commissionIds: string[]) =>
        api.post<void>("/enterprise/commissions/pay", { commissionIds }),

    // --- Loyalty ---
    redeemPoints: (data: { clientId: string; points: number }) =>
        api.post<void>("/enterprise/loyalty/redeem", data),
};