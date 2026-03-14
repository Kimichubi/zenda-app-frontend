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
  const { data: clientsData, isLoading: isLoadingClients } = useClients(1, 100);
  const { data: services, isLoading: isLoadingServices } = useServices();

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

  const clients = clientsData?.data || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">Cliente</label>
        <select
          {...register("clientId")}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">Selecione um cliente</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name} ({client.phone})
            </option>
          ))}
        </select>
        {errors.clientId && (
          <p className="text-sm font-medium text-destructive">{errors.clientId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">Serviço</label>
        <select
          {...register("serviceId")}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">Selecione um serviço</option>
          {services?.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} - {service.duration}min
            </option>
          ))}
        </select>
        {errors.serviceId && (
          <p className="text-sm font-medium text-destructive">{errors.serviceId.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="date"
          label="Data"
          {...register("date")}
          error={errors.date?.message}
        />
        <Input
          type="time"
          label="Horário"
          {...register("startTime")}
          error={errors.startTime?.message}
        />
      </div>

      <Button type="submit" className="w-full" loading={isLoading}>
        Agendar e Notificar por WhatsApp
      </Button>
    </form>
  );
}
