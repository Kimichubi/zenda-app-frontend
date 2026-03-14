"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input } from "@/components/ui";
import { useClients, useServices } from "@/hooks";
import type { AppointmentFormData } from "@/types";

const appointmentSchema = z.object({
  clientId: z.string().min(1, "Selecione um cliente"),
  serviceId: z.string().min(1, "Selecione um serviço"),
  date: z.string().min(1, "Selecione uma data"),
  startTime: z.string().min(1, "Selecione um horário"),
});

interface AppointmentFormProps {
  onSubmit: (data: AppointmentFormData) => void;
  isLoading?: boolean;
  initialDate?: string;
}

export function AppointmentForm({ onSubmit, isLoading, initialDate }: AppointmentFormProps) {
  const { data: clientsData } = useClients(1, 100);
  const { data: services } = useServices();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      date: initialDate || new Date().toISOString().split("T")[0],
    },
  });

  const handleLocalSubmit = (data: AppointmentFormData) => {
    // Garantir que a data enviada use o meio-dia para evitar problemas de timezone
    // transformando "2026-03-14" em "2026-03-14T12:00:00" antes do backend processar
    const normalizedData = {
      ...data,
      date: `${data.date}T12:00:00`
    };
    onSubmit(normalizedData);
  };

  const clients = clientsData?.data || [];

  return (
    <form onSubmit={handleSubmit(handleLocalSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Cliente</label>
        <select
          {...register("clientId")}
          className="flex h-12 w-full rounded-2xl border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none cursor-pointer hover:border-primary/50 transition-all"
        >
          <option value="">Selecione um cliente</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
        {errors.clientId && (
          <p className="text-xs font-bold text-destructive ml-1">{errors.clientId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Serviço</label>
        <select
          {...register("serviceId")}
          className="flex h-12 w-full rounded-2xl border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none cursor-pointer hover:border-primary/50 transition-all"
        >
          <option value="">Selecione um serviço</option>
          {services?.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} — {service.duration}min
            </option>
          ))}
        </select>
        {errors.serviceId && (
          <p className="text-xs font-bold text-destructive ml-1">{errors.serviceId.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Input
            type="date"
            label="Data"
            {...register("date")}
            error={errors.date?.message}
            className="rounded-2xl h-12"
          />
        </div>
        <div className="space-y-2">
          <Input
            type="time"
            label="Horário"
            {...register("startTime")}
            error={errors.startTime?.message}
            className="rounded-2xl h-12"
          />
        </div>
      </div>

      <Button type="submit" className="w-full h-14 rounded-2xl shadow-xl shadow-primary/20 font-black uppercase tracking-widest text-xs gap-3 mt-4" loading={isLoading}>
        Finalizar Agendamento
      </Button>
    </form>
  );
}
