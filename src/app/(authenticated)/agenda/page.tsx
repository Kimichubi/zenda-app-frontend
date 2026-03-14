"use client";

import { useState } from "react";
import { format, startOfWeek, addDays, parseISO } from "date-fns";
import { WeekCalendar } from "@/features/agenda/week-calendar";
import { AppointmentForm } from "@/features/agenda/appointment-form";
import { useWeekAppointments, useUpdateAppointmentStatus, useCreateAppointment } from "@/hooks";
import { useToast, Button, Modal } from "@/components/ui";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Loader2, Plus } from "lucide-react";
import type { AppointmentFormData } from "@/types";

export default function AgendaPage() {
  const [currentDate, setCurrentDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const weekStart = format(
    startOfWeek(new Date(currentDate + "T00:00:00"), { weekStartsOn: 1 }),
    "yyyy-MM-dd",
  );

  const { data: appointments = [], isLoading } = useWeekAppointments(weekStart);
  const updateStatus = useUpdateAppointmentStatus();
  const createAppointment = useCreateAppointment();
  const { showToast } = useToast();

  const handleConfirm = (appointmentId: string) => {
    updateStatus.mutate(
      { id: appointmentId, status: "CONFIRMED" },
      {
        onSuccess: () => showToast("Presença confirmada!", "success"),
        onError: () => showToast("Erro ao confirmar", "error"),
      },
    );
  };

  const handleCreateAppointment = (data: AppointmentFormData) => {
    createAppointment.mutate(data, {
      onSuccess: () => {
        showToast("Agendamento criado e cliente notificado!", "success");
        setIsModalOpen(false);
      },
      onError: (err) => {
        showToast(err instanceof Error ? err.message : "Erro ao criar agendamento", "error");
      },
    });
  };

  const handleNavigate = (direction: "prev" | "next") => {
    const current = new Date(currentDate + "T00:00:00");
    const newDate =
      direction === "prev" ? addDays(current, -7) : addDays(current, 7);
    setCurrentDate(format(newDate, "yyyy-MM-dd"));
  };

  const handleToday = () => {
    setCurrentDate(format(new Date(), "yyyy-MM-dd"));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Gerencie seus atendimentos semanais
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setIsModalOpen(true)} className="gap-2 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" />
            Novo Agendamento
          </Button>
          <div className="h-8 w-px bg-border mx-1" />
          <Button variant="outline" onClick={handleToday} className="font-semibold">Hoje</Button>
          <div className="flex items-center bg-card border rounded-lg p-1 shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNavigate("prev")}
              className="h-8 w-8 rounded-md"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNavigate("next")}
              className="h-8 w-8 rounded-md"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Carregando sua agenda...</p>
        </div>
      ) : (
        <WeekCalendar
          appointments={appointments}
          currentDate={currentDate}
          onConfirm={handleConfirm}
          onNavigate={handleNavigate}
        />
      )}

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Agendamento"
      >
        <AppointmentForm 
          onSubmit={handleCreateAppointment}
          isLoading={createAppointment.isPending}
          initialDate={currentDate}
        />
      </Modal>
    </div>
  );
}
