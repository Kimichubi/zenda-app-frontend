"use client";

import { useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { BookingForm } from "@/features/booking/booking-form";
import {
  useBookingServices,
  useAvailableSlots,
  useCreateBooking,
} from "@/hooks";
import { useToast } from "@/components/ui";
import { usePublicSettings } from "@/hooks/use-site-settings";
import type { PublicBookingData } from "@/types";

function BookingPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const preselectedService = searchParams.get("service") || "";
  const preselectedProfessional = searchParams.get("professional") || "";

  const [selectedService, setSelectedService] = useState(preselectedService);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedProfessional, setSelectedProfessional] = useState(preselectedProfessional);
  const [success, setSuccess] = useState(false);

  const { data: services = [], isLoading: loadingServices } =
    useBookingServices(slug);
  const { data: publicSettings } = usePublicSettings(slug);
  const staff = publicSettings?.staff ?? [];

  const { data: slots = [] } = useAvailableSlots(
    slug,
    selectedDate,
    selectedService,
    selectedProfessional || undefined,
  );
  const createBooking = useCreateBooking(slug);
  const { showToast } = useToast();

  const handleSubmit = (
    data: Omit<PublicBookingData, "clientEmail" | "professionalId"> & { clientEmail?: string },
  ) => {
    const payload: PublicBookingData = {
      ...data,
      professionalId: selectedProfessional || undefined,
    };
    createBooking.mutate(payload, {
      onSuccess: () => {
        setSuccess(true);
        showToast("Agendamento confirmado!", "success");
      },
      onError: () => showToast("Erro ao agendar", "error"),
    });
  };

  if (loadingServices) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-lg space-y-4 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Agendamento confirmado!
          </h1>
          <p className="text-muted-foreground">
            Você receberá uma confirmação em breve.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-lg px-4">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">Agendar horário</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Escolha o serviço, data e horário desejado
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <BookingForm
            services={services}
            slots={slots}
            staff={staff}
            selectedService={selectedService}
            selectedDate={selectedDate}
            selectedProfessional={selectedProfessional}
            onServiceSelect={setSelectedService}
            onDateSelect={setSelectedDate}
            onProfessionalSelect={setSelectedProfessional}
            onSubmit={handleSubmit}
            isLoading={createBooking.isPending}
          />
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    }>
      <BookingPageContent />
    </Suspense>
  );
}
