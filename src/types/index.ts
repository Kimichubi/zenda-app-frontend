// ============================================
// Zenda - Type definitions
// ============================================

// --- Auth ---
export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    businessName: string;
    slug: string;
    role: "USER" | "ADMIN";
    plan: "FREE" | "PRO" | "ENTERPRISE";
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
    businessName: string;
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
    clientEmail: string;
}

export interface TimeSlot {
    time: string;
    available: boolean;
}

// --- Site Settings ---
export interface SiteSettings {
    id: string;
    userId: string;
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
    userId: string;
    weekday: number;
    startTime: string;
    endTime: string;
}

export interface PublicSiteData {
    barber: {
        id: string;
        name: string;
        businessName: string;
        phone: string;
    };
    settings: SiteSettings;
    services: Service[];
    schedules: Schedule[];
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
