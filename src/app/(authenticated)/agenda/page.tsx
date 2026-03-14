"use client";

import { useState } from "react";
import { format, startOfWeek, addDays, parseISO } from "date-fns";
import { WeekCalendar } from "@/features/agenda/week-calendar";
import { AppointmentForm } from "@/features/agenda/appointment-form";
import { useWeekAppointments, useUpdateAppointmentStatus, useCreateAppointment } from "@/hooks";
import { useToast, Button, Modal } from "@/components/ui";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Loader2, Plus, Sparkles } from "lucide-react";
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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.4em]">
            <CalendarIcon className="h-3 w-3" />
            Time Management
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic">Agenda</h1>
          <p className="text-muted-foreground font-medium text-lg">
            Organize sua semana com <span className="text-foreground font-bold italic underline decoration-primary decoration-2 underline-offset-4">precisão absoluta</span>.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-muted/50 border border-border/50 rounded-2xl p-1.5 shadow-inner">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNavigate("prev")}
              className="h-10 w-10 rounded-xl hover:bg-background hover:shadow-sm transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              onClick={handleToday} 
              className="px-6 font-bold text-xs uppercase tracking-widest hover:bg-background hover:shadow-sm transition-all rounded-xl"
            >
              Hoje
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNavigate("next")}
              className="h-10 w-10 rounded-xl hover:bg-background hover:shadow-sm transition-all"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          
          <Button onClick={() => setIsModalOpen(true)} className="h-14 px-8 gap-3 rounded-2xl shadow-xl shadow-primary/20 text-sm font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="h-5 w-5" />
            Novo Agendamento
          </Button>
        </div>
      </header>

      {isLoading ? (
        <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-bold tracking-tight text-muted-foreground animate-pulse">Carregando sua agenda...</p>
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
        className="max-w-md"
      >
        <div className="p-2">
          <AppointmentForm 
            onSubmit={handleCreateAppointment}
            isLoading={createAppointment.isPending}
            initialDate={currentDate}
          />
        </div>
      </Modal>
    </div>
  );
}
