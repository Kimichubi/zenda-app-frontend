"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { BookingForm } from "@/features/booking/booking-form";
import {
  useBookingServices,
  useAvailableSlots,
  useCreateBooking,
} from "@/hooks";
import { useToast } from "@/components/ui";
import type { PublicBookingData } from "@/types";

export default function BookingPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [success, setSuccess] = useState(false);

  const { data: services = [], isLoading: loadingServices } =
    useBookingServices(slug);
  const { data: slots = [] } = useAvailableSlots(
    slug,
    selectedDate,
    selectedService,
  );
  const createBooking = useCreateBooking(slug);
  const { showToast } = useToast();

  const handleSubmit = (
    data: Omit<PublicBookingData, "clientEmail"> & { clientEmail: string },
  ) => {
    createBooking.mutate(data as PublicBookingData, {
      onSuccess: () => {
        setSuccess(true);
        showToast("Agendamento confirmado!", "success");
      },
      onError: () => showToast("Erro ao agendar", "error"),
    });
  };

  if (loadingServices) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-lg space-y-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Agendamento confirmado!
          </h1>
          <p className="text-gray-600">
            Você receberá uma confirmação em breve.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-lg px-4">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Agendar horário</h1>
          <p className="mt-2 text-sm text-gray-600">
            Escolha o serviço, data e horário desejado
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <BookingForm
            services={services}
            slots={slots}
            selectedService={selectedService}
            selectedDate={selectedDate}
            onServiceSelect={setSelectedService}
            onDateSelect={setSelectedDate}
            onSubmit={handleSubmit}
            isLoading={createBooking.isPending}
          />
        </div>
      </div>
    </div>
  );
}
