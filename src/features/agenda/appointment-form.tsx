"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input } from "@/components/ui";
import { useClients, useServices } from "@/hooks";
import type { AppointmentFormData } from "@/types";
import { User, Scissors, Calendar, Clock, ChevronDown } from "lucide-react";
import { cn } from "@/utils";

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
  initialData?: Partial<AppointmentFormData>;
}

export function AppointmentForm({ onSubmit, isLoading, initialDate, initialData }: AppointmentFormProps) {
  const { data: clientsData } = useClients({ page: 1, limit: 100 });
  const { data: servicesData } = useServices({ page: 1, limit: 100 });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      clientId: initialData?.clientId || "",
      serviceId: initialData?.serviceId || "",
      date: initialData?.date?.split("T")[0] || initialDate || new Date().toISOString().split("T")[0],
      startTime: initialData?.startTime || "",
    },
  });

  const handleLocalSubmit = (data: AppointmentFormData) => {
    const normalizedData = {
      ...data,
      date: `${data.date}T12:00:00`
    };
    onSubmit(normalizedData);
  };

  const clients = clientsData?.data || [];
  const services = servicesData?.data || [];

  return (
    <form onSubmit={handleSubmit(handleLocalSubmit)} className="space-y-8 py-2">
      {/* Client Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <User className="h-3.5 w-3.5 text-primary" />
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Cliente</label>
        </div>
        <div className="relative group">
          <select
            {...register("clientId")}
            className={cn(
              "flex h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-900 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 appearance-none cursor-pointer hover:border-primary/30 transition-all",
              errors.clientId && "border-rose-200 bg-rose-50"
            )}
          >
            <option value="" className="text-slate-400">Selecione o cliente...</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id} className="text-slate-900 bg-white">
                {client.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
        </div>
        {errors.clientId && (
          <p className="text-[10px] font-black text-rose-500 uppercase tracking-wider ml-1">{errors.clientId.message}</p>
        )}
      </div>

      {/* Service Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Scissors className="h-3.5 w-3.5 text-primary" />
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Serviço</label>
        </div>
        <div className="relative group">
          <select
            {...register("serviceId")}
            className={cn(
              "flex h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-900 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 appearance-none cursor-pointer hover:border-primary/30 transition-all",
              errors.serviceId && "border-rose-200 bg-rose-50"
            )}
          >
            <option value="" className="text-slate-400">Qual o procedimento?</option>
            {services.map((service) => (
              <option key={service.id} value={service.id} className="text-slate-900 bg-white">
                {service.name} — R$ {service.price.toFixed(2)}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
        </div>
        {errors.serviceId && (
          <p className="text-[10px] font-black text-rose-500 uppercase tracking-wider ml-1">{errors.serviceId.message}</p>
        )}
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Data</label>
          </div>
          <Input
            type="date"
            {...register("date")}
            error={errors.date?.message}
            className="rounded-2xl h-14 bg-white border-slate-200 font-bold text-slate-900 focus:bg-white transition-all shadow-none"
          />
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Horário</label>
          </div>
          <Input
            type="time"
            {...register("startTime")}
            error={errors.startTime?.message}
            className="rounded-2xl h-14 bg-white border-slate-200 font-bold text-slate-900 focus:bg-white transition-all shadow-none"
          />
        </div>
      </div>

      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full h-16 rounded-[1.5rem] shadow-2xl shadow-primary/20 font-black uppercase tracking-[0.2em] text-[10px] gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]" 
          loading={isLoading}
        >
          {initialData ? "Atualizar Agendamento" : "Confirmar Agendamento"}
        </Button>
      </div>
    </form>
  );
}
