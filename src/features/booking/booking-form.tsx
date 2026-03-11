"use client";

import { useState } from "react";
import { Button, Input, Card } from "@/components/ui";
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Service Selection */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-gray-900">
          Escolha o serviço
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {services.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => onServiceSelect(service.id)}
              className={cn(
                "rounded-lg border p-4 text-left transition-colors",
                selectedService === service.id
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 hover:border-gray-300",
              )}
            >
              <p className="font-medium text-gray-900">{service.name}</p>
              <p className="text-sm text-gray-500">
                {service.duration}min • {formatCurrency(service.price)}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Date Selection */}
      <div>
        <Input
          type="date"
          label="Data"
          value={selectedDate || ""}
          onChange={(e) => onDateSelect(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
        />
      </div>

      {/* Time Slots */}
      {slots.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-semibold text-gray-900">
            Horários disponíveis
          </h3>
          <div className="flex flex-wrap gap-2">
            {slots.map((slot) => (
              <button
                key={slot.time}
                type="button"
                disabled={!slot.available}
                onClick={() => setSelectedTime(slot.time)}
                className={cn(
                  "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                  !slot.available &&
                    "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300",
                  slot.available &&
                    selectedTime === slot.time &&
                    "border-indigo-500 bg-indigo-50 text-indigo-700",
                  slot.available &&
                    selectedTime !== slot.time &&
                    "border-gray-200 text-gray-700 hover:border-gray-300",
                )}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Client Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Seus dados</h3>
        <Input
          placeholder="Seu nome"
          label="Nome"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
        />
        <Input
          placeholder="Seu telefone"
          label="Telefone"
          value={clientPhone}
          onChange={(e) => setClientPhone(e.target.value)}
          required
        />
        <Input
          placeholder="Seu email (opcional)"
          label="Email"
          type="email"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full" loading={isLoading}>
        Confirmar agendamento
      </Button>
    </form>
  );
}
