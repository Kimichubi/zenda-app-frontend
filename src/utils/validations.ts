import { z } from "zod";

export function isValidCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, "");
  if (cleaned.length !== 11 || /^(\d)\1{10}$/.test(cleaned)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cleaned[i]) * (10 - i);
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(cleaned[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cleaned[i]) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(cleaned[10])) return false;

  return true;
}

export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length !== 11) return false;
  const ddd = parseInt(cleaned.substring(0, 2));
  if (ddd < 11 || ddd > 99) return false;
  const firstDigit = parseInt(cleaned[2]);
  return firstDigit === 9;
}

export function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, "");
  if (cleaned.length !== 11) return cpf;
  return `${cleaned.substring(0, 3)}.${cleaned.substring(3, 6)}.${cleaned.substring(6, 9)}-${cleaned.substring(9)}`;
}

export const loginSchema = z.object({
    email: z.string().min(1, "Email inválido").email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const signupSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().min(1, "Email inválido").email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    phone: z.string().min(10, "Telefone deve ter DDD + número (11 dígitos)")
      .refine((v) => isValidPhone(v), { message: "Formato inválido. Use (XX) XXXXX-XXXX" }),
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

export const resetPasswordSchema = z.object({
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirme sua senha"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não conferem",
    path: ["confirmPassword"],
});

export const verifyCodeSchema = z.object({
    code: z.string().length(6, "Código deve ter 6 dígitos"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ClientFormDataSchema = z.infer<typeof clientSchema>;
export type AppointmentFormDataSchema = z.infer<typeof appointmentSchema>;
export type PublicBookingFormDataSchema = z.infer<typeof publicBookingSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type VerifyCodeFormData = z.infer<typeof verifyCodeSchema>;
