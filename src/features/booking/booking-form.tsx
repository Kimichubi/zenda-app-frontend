"use client";

import { useState } from "react";
import { Button, Input, Card, CardContent } from "@/components/ui";
import { formatCurrency } from "@/utils";
import type { Service, TimeSlot } from "@/types";
import { cn } from "@/utils";

interface BookingFormProps {
  services: Service[];
  slots: TimeSlot[];
  selectedService?: string;
  selectedDate?: string;
  onServiceSelect: (serviceId: string) => void;
  onDateSelect: (date: string) => void;
  onSubmit: (data: {
    serviceId: string;
    date: string;
    startTime: string;
    clientName: string;
    clientPhone: string;
    clientEmail: string;
  }) => void;
  isLoading?: boolean;
}

export function BookingForm({
  services,
  slots,
  selectedService,
  selectedDate,
  onServiceSelect,
  onDateSelect,
  onSubmit,
  isLoading,
}: BookingFormProps) {
  const [selectedTime, setSelectedTime] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedTime) return;
    onSubmit({
      serviceId: selectedService,
      date: selectedDate,
      startTime: selectedTime,
      clientName,
      clientPhone,
      clientEmail,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Service Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">
          Escolha o serviço
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {services.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => onServiceSelect(service.id)}
              className="group text-left focus:outline-none"
            >
              <Card className={cn(
                "h-full transition-all duration-200 hover:border-primary/50",
                selectedService === service.id
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "bg-card hover:bg-accent/50"
              )}>
                <CardContent className="p-4">
                  <p className={cn(
                    "font-semibold transition-colors",
                    selectedService === service.id ? "text-primary" : "text-foreground"
                  )}>{service.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {service.duration}min • {formatCurrency(service.price)}
                  </p>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </div>

      {/* Date & Time Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold tracking-tight">Data</h3>
          <Input
            type="date"
            value={selectedDate || ""}
            onChange={(e) => onDateSelect(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full"
          />
        </div>

        {selectedDate && slots.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight">Horários</h3>
            <div className="grid grid-cols-3 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  disabled={!slot.available}
                  onClick={() => setSelectedTime(slot.time)}
                  className={cn(
                    "rounded-md border px-3 py-2 text-sm font-medium transition-all duration-200",
                    !slot.available &&
                      "cursor-not-allowed opacity-30 bg-muted",
                    slot.available &&
                      selectedTime === slot.time &&
                      "border-primary bg-primary text-primary-foreground shadow-sm",
                    slot.available &&
                      selectedTime !== slot.time &&
                      "border-input bg-background hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Client Info */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="text-lg font-semibold tracking-tight">Seus dados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Seu nome completo"
            label="Nome"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
          />
          <Input
            placeholder="(00) 00000-0000"
            label="Telefone"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            required
          />
        </div>
        <Input
          placeholder="seu@email.com"
          label="Email (opcional)"
          type="email"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full h-12 text-base font-semibold" loading={isLoading}>
        Confirmar agendamento
      </Button>
    </form>
  );
}
