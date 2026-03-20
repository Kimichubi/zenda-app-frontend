import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

export function formatCurrency(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
}

export function formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 11) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
}

export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("pt-BR");
}

export function formatTime(timeString: string): string {
    return timeString.slice(0, 5);
}

export function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
        scheduled: "Agendado",
        confirmed: "Confirmado",
        completed: "Concluído",
        cancelled: "Cancelado",
        no_show: "Não compareceu",
        pending: "Pendente",
        paid: "Pago",
        overdue: "Atrasado",
    };
    return labels[status.toLowerCase()] || status;
}

