"use client";

import { useState } from "react";
import { format, startOfWeek } from "date-fns";
import { addDays } from "date-fns";
import { WeekCalendar } from "@/features/agenda/week-calendar";
import { useWeekAppointments, useUpdateAppointmentStatus } from "@/hooks";
import { useToast } from "@/components/ui";

export default function AgendaPage() {
  const [currentDate, setCurrentDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );

  const weekStart = format(
    startOfWeek(new Date(currentDate + "T00:00:00"), { weekStartsOn: 1 }),
    "yyyy-MM-dd",
  );

  const { data: appointments = [], isLoading } = useWeekAppointments(weekStart);
  const updateStatus = useUpdateAppointmentStatus();
  const { showToast } = useToast();

  const handleConfirm = (appointmentId: string) => {
    updateStatus.mutate(
      { id: appointmentId, status: "confirmed" },
      {
        onSuccess: () => showToast("Presença confirmada!", "success"),
        onError: () => showToast("Erro ao confirmar", "error"),
      },
    );
  };

  const handleNavigate = (direction: "prev" | "next") => {
    const current = new Date(currentDate + "T00:00:00");
    const newDate =
      direction === "prev" ? addDays(current, -7) : addDays(current, 7);
    setCurrentDate(format(newDate, "yyyy-MM-dd"));
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-gray-500">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
      <WeekCalendar
        appointments={appointments}
        currentDate={currentDate}
        onConfirm={handleConfirm}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
