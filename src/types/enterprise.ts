// ============================================
// Zenda Enterprise - Type definitions
// ============================================

import { User, Client, Service, Appointment, Payment } from "./index";

export interface Business {
    id: string;
    name: string;
    slug: string;
    pixKey?: string;
    ownerId: string;
    createdAt: string;
}

export interface StaffMember {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "MANAGER" | "PROFESSIONAL";
    baseCommission: number;
}

export interface Product {
    id: string;
    name: string;
    sku?: string;
    price: number;
    costPrice?: number;
    stock: number;
    minStock: number;
}

export interface Sale {
    id: string;
    totalAmount: number;
    paymentMethod: string;
    sellerId: string;
    customerId?: string;
    loyaltyPoints: number;
    createdAt: string;
    items: SaleItem[];
}

export interface SaleItem {
    id: string;
    productId: string;
    productName?: string;
    quantity: number;
    price: number;
}

export interface Commission {
    id: string;
    userId: string;
    amount: number;
    percentage: number;
    status: "PENDING" | "PAID" | "CANCELLED";
    appointmentId?: string;
    saleId?: string;
    paidAt?: string;
    createdAt: string;
    appointment?: Appointment;
    sale?: Sale;
}

export interface LoyaltyConfig {
    pointsPerReal: number;
    minRedeemPoints: number;
    active: boolean;
}
