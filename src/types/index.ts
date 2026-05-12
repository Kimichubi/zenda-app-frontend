// ============================================
// Zenda - Type definitions
// ============================================

// --- Auth ---
export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    bio?: string | null;
    instagramUrl?: string | null;
    businessName?: string | null;
    slug?: string | null;
    pixKey?: string | null;
    role: "OWNER" | "MANAGER" | "PROFESSIONAL" | "PLATFORM_ADMIN";
    plan: "ONBOARDING" | "PRO" | "ENTERPRISE";
    isImpersonating?: boolean;
    impersonatedBusinessId?: string | null;
    impersonatedBusinessName?: string | null;
    createdAt: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupData {
    name: string;
    email: string;
    password: string;
    phone: string;
    businessName?: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken?: string;
}

// --- Client ---
export interface Client {
    id: string;
    name: string;
    phone: string;
    email: string;
    notes: string;
    status: "ACTIVE" | "INACTIVE";
    createdAt: string;
}

export interface ClientFilters {
    search?: string;
    status?: "ACTIVE" | "INACTIVE";
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}

export interface ClientFormData {
    name: string;
    phone: string;
    email: string;
    notes: string;
}

// --- Service ---
export interface Service {
    id: string;
    name: string;
    duration: number; // in minutes
    price: number;
    createdAt?: string;
}

export interface ServiceFilters {
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
}

// --- Appointment ---
export type AppointmentStatus =
    | "scheduled"
    | "confirmed"
    | "completed"
    | "cancelled"
    | "no_show";

export interface Appointment {
    id: string;
    clientId: string;
    clientName: string;
    professionalId?: string;
    professionalName?: string;
    serviceId: string;
    serviceName: string;
    date: string;
    startTime: string;
    endTime: string;
    status: AppointmentStatus;
    price: number;
}

export interface AppointmentFormData {
    clientId: string;
    serviceId: string;
    date: string;
    startTime: string;
    professionalId?: string;
}

// --- Payment ---
export type PaymentStatus = "pending" | "paid" | "overdue" | "cancelled" | "failed";

export interface Payment {
    id: string;
    appointmentId: string;
    clientName: string;
    serviceName?: string;
    amount: number;
    status: PaymentStatus;
    pixCode: string | null;
    reason: string | null;
    paidAt: string | null;
    createdAt: string;
}

export interface PaymentFilters {
    search?: string;
    status?: PaymentStatus | "all";
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
    page?: number;
    limit?: number;
}

// --- Dashboard ---
export interface DashboardData {
    todayAppointments: Appointment[];
    upcomingAppointments: Appointment[];
    todayRevenue: number;
    noShowClients: Appointment[];
}

// --- Public Booking ---
export interface PublicBookingData {
    serviceId: string;
    date: string;
    startTime: string;
    clientName: string;
    clientPhone: string;
    clientEmail?: string;
    professionalId?: string;
}

export interface TimeSlot {
    time: string;
    available: boolean;
}

// --- Schedule ---
export interface Schedule {
    id: string;
    businessId: string;
    professionalId: string;
    weekday: number;
    startTime: string;
    endTime: string;
    slotDuration: number;
    isActive: boolean;
    breakStart: string | null;
    breakEnd: string | null;
}

export interface BlockedSlot {
    id: string;
    professionalId: string;
    date: string;
    startTime: string;
    endTime: string;
    reason: string;
}

// --- Site Settings ---
export interface SiteSettings {
    id: string;
    businessId: string;
    themeColor: string;
    heroTitle: string;
    heroSubtitle: string;
    aboutText: string;
    logoUrl: string | null;
    instagramUrl: string | null;
    facebookUrl: string | null;
    whatsappUrl: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Schedule {
    id: string;
    professionalId: string;
    weekday: number;
    startTime: string;
    endTime: string;
}

export interface ServiceProfessionalPricing {
    professionalId: string;
    customPrice: number | null;
    customDuration: number | null;
}

export interface PublicSiteData {
    barber: {
        id: string;
        name: string;
        businessName: string;
        phone: string;
    };
    settings: SiteSettings;
    services: (Service & { professionalPricing?: ServiceProfessionalPricing[] })[];
    schedules: Schedule[];
    staff: {
        id: string;
        name: string;
        role: string;
        avatarPath: string | null;
        bio: string | null;
        phone: string;
        instagramUrl: string | null;
    }[];
    products: {
        id: string;
        name: string;
        price: number;
        sku?: string;
    }[];
}

// --- API ---
export interface ApiError {
    message: string;
    statusCode: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}
