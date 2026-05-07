"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input } from "@/components/ui";
import { useClients, useServices } from "@/hooks";
import type { AppointmentFormData } from "@/types";
import { User, Scissors, Calendar, Clock, ChevronDown, DollarSign, Timer } from "lucide-react";
import { cn, formatCurrency } from "@/utils";

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

const QUICK_TIMES = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

export function AppointmentForm({ onSubmit, isLoading, initialDate, initialData }: AppointmentFormProps) {
  const { data: clientsData } = useClients({ page: 1, limit: 100 });
  const { data: servicesData } = useServices({ page: 1, limit: 100 });
  const [searchClient, setSearchClient] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
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

  const selectedServiceId = watch("serviceId");
  const selectedClientId = watch("clientId");
  const selectedTime = watch("startTime");

  const clients = clientsData?.data || [];
  const services = servicesData?.data || [];

  const selectedService = useMemo(
    () => services.find((s) => s.id === selectedServiceId),
    [services, selectedServiceId]
  );

  const selectedClient = useMemo(
    () => clients.find((c) => c.id === selectedClientId),
    [clients, selectedClientId]
  );

  const filteredClients = useMemo(() => {
    if (!searchClient) return clients;
    return clients.filter((c) =>
      c.name.toLowerCase().includes(searchClient.toLowerCase()) ||
      c.phone.includes(searchClient)
    );
  }, [clients, searchClient]);

  const handleLocalSubmit = (data: AppointmentFormData) => {
    const normalizedData = {
      ...data,
      date: `${data.date}T12:00:00`
    };
    onSubmit(normalizedData);
  };

  const handleQuickTime = (time: string) => {
    setValue("startTime", time, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(handleLocalSubmit)} className="space-y-6 py-2">
      {/* Client Selection */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <User className="h-3.5 w-3.5 text-primary" />
          <label className="text-xs font-semibold text-muted-foreground">Cliente</label>
        </div>
        <div className="relative">
          <input
            type="text"
            value={selectedClient ? selectedClient.name : searchClient}
            onChange={(e) => {
              setSearchClient(e.target.value);
              if (selectedClient) {
                setValue("clientId", "", { shouldValidate: true });
              }
              setShowClientDropdown(true);
            }}
            onFocus={() => setShowClientDropdown(true)}
            onBlur={() => setTimeout(() => setShowClientDropdown(false), 200)}
            placeholder="Buscar cliente..."
            className={cn(
              "flex h-12 w-full rounded-xl border border-border/40 bg-muted/20 px-4 py-2 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 hover:border-primary/30 transition-all",
              errors.clientId && "border-rose-200 bg-rose-50/50 dark:bg-rose-500/5"
            )}
          />
          <input type="hidden" {...register("clientId")} />
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 pointer-events-none" />

          {showClientDropdown && filteredClients.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-card border border-border/40 rounded-xl shadow-lg max-h-48 overflow-y-auto">
              {filteredClients.map((client) => (
                <button
                  key={client.id}
                  type="button"
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-muted/50 transition-colors flex items-center gap-3"
                  onMouseDown={() => {
                    setValue("clientId", client.id, { shouldValidate: true });
                    setSearchClient("");
                    setShowClientDropdown(false);
                  }}
                >
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{client.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{client.phone}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        {errors.clientId && (
          <p className="text-xs text-rose-500 ml-1">{errors.clientId.message}</p>
        )}
      </div>

      {/* Service Selection */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <Scissors className="h-3.5 w-3.5 text-primary" />
          <label className="text-xs font-semibold text-muted-foreground">Serviço</label>
        </div>
        <div className="relative group">
          <select
            {...register("serviceId")}
            className={cn(
              "flex h-12 w-full rounded-xl border border-border/40 bg-muted/20 px-4 py-2 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 appearance-none cursor-pointer hover:border-primary/30 transition-all pr-10",
              errors.serviceId && "border-rose-200 bg-rose-50/50 dark:bg-rose-500/5"
            )}
          >
            <option value="" className="text-muted-foreground bg-card">Selecione o serviço...</option>
            {services.map((service) => (
              <option key={service.id} value={service.id} className="text-foreground bg-card">
                {service.name} — {formatCurrency(service.price)}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 pointer-events-none group-focus-within:rotate-180 transition-transform" />
        </div>
        {errors.serviceId && (
          <p className="text-xs text-rose-500 ml-1">{errors.serviceId.message}</p>
        )}

        {/* Service Info Card */}
        {selectedService && (
          <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 border border-border/30">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Scissors className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{selectedService.name}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {formatCurrency(selectedService.price)}
                </span>
                <span className="flex items-center gap-1">
                  <Timer className="h-3 w-3" />
                  {selectedService.duration} min
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Date */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          <label className="text-xs font-semibold text-muted-foreground">Data</label>
        </div>
        <Input
          type="date"
          {...register("date")}
          error={errors.date?.message}
          className="rounded-xl h-12 bg-muted/20 border-border/40 font-medium focus:bg-card transition-all shadow-none"
        />
      </div>

      {/* Time */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Clock className="h-3.5 w-3.5 text-primary" />
          <label className="text-xs font-semibold text-muted-foreground">Horário</label>
        </div>

        {/* Quick Time Slots */}
        <div className="grid grid-cols-4 gap-2">
          {QUICK_TIMES.map((time) => (
            <button
              key={time}
              type="button"
              onClick={() => handleQuickTime(time)}
              className={cn(
                "h-10 rounded-lg text-xs font-bold transition-all border",
                selectedTime === time
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-muted/20 border-border/30 text-muted-foreground hover:border-primary/30 hover:text-primary"
              )}
            >
              {time}
            </button>
          ))}
        </div>

        {/* Custom Time Input */}
        <Input
          type="time"
          {...register("startTime")}
          error={errors.startTime?.message}
          className="rounded-xl h-12 bg-muted/20 border-border/40 font-medium focus:bg-card transition-all shadow-none"
          placeholder="Ou escolha um horário personalizado"
        />
      </div>

      {/* Submit */}
      <div className="pt-2">
        <Button
          type="submit"
          className="w-full h-14 rounded-xl shadow-lg shadow-primary/10 font-bold text-sm gap-2 transition-all hover:shadow-xl hover:shadow-primary/20"
          loading={isLoading}
        >
          {initialData ? "Atualizar Agendamento" : "Confirmar Agendamento"}
        </Button>
      </div>
    </form>
  );
}
