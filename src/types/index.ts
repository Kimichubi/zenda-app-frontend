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
    createdAt: string;
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
export type PaymentStatus = "pending" | "paid" | "overdue" | "cancelled";

export interface Payment {
    id: string;
    appointmentId: string;
    clientName: string;
    amount: number;
    status: PaymentStatus;
    pixCode: string | null;
    paidAt: string | null;
    createdAt: string;
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
