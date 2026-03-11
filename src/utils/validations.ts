import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().min(1, "Email inválido").email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const signupSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().min(1, "Email inválido").email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    phone: z.string().min(10, "Telefone inválido"),
    businessName: z.string().min(2, "Nome do negócio deve ter pelo menos 2 caracteres"),
});

export const clientSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    phone: z.string().min(10, "Telefone inválido"),
    email: z.string().email("Email inválido").or(z.literal("")),
    notes: z.string().default(""),
});

export const appointmentSchema = z.object({
    clientId: z.string().min(1, "Selecione um cliente"),
    serviceId: z.string().min(1, "Selecione um serviço"),
    date: z.string().min(1, "Selecione uma data"),
    startTime: z.string().min(1, "Selecione um horário"),
});

export const publicBookingSchema = z.object({
    serviceId: z.string().min(1, "Selecione um serviço"),
    date: z.string().min(1, "Selecione uma data"),
    startTime: z.string().min(1, "Selecione um horário"),
    clientName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    clientPhone: z.string().min(10, "Telefone inválido"),
    clientEmail: z.string().email("Email inválido").or(z.literal("")),
});

export const forgotPasswordSchema = z.object({
    email: z.string().min(1, "Email inválido").email("Email inválido"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ClientFormDataSchema = z.infer<typeof clientSchema>;
export type AppointmentFormDataSchema = z.infer<typeof appointmentSchema>;
export type PublicBookingFormDataSchema = z.infer<typeof publicBookingSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
