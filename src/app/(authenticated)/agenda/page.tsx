"use client";

import { useState } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AgendaCalendar } from "@/features/agenda/agenda-calendar";
import { AppointmentForm } from "@/features/agenda/appointment-form";
import {
  useWeekAppointments,
  useCreateAppointment,
  useUpdateAppointment,
} from "@/hooks";
import { useToast, Button, Modal } from "@/components/ui";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
} from "lucide-react";
import type { Appointment, AppointmentFormData } from "@/types";

export default function AgendaPage() {
  const [currentDate, setCurrentDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    startTime: string;
  } | null>(null);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);

  const weekStart = format(
    startOfWeek(new Date(currentDate + "T00:00:00"), { weekStartsOn: 1 }),
    "yyyy-MM-dd",
  );

  const { data: appointments = [], isLoading } =
    useWeekAppointments(weekStart);
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();
  const { showToast } = useToast();

  const handleSlotClick = (date: string, startTime: string) => {
    setEditingAppointment(null);
    setSelectedSlot({ date, startTime });
    setIsModalOpen(true);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedSlot(null);
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (data: AppointmentFormData) => {
    const options = {
      onSuccess: () => {
        showToast(
          editingAppointment
            ? "Agendamento atualizado!"
            : "Agendamento criado e cliente notificado!",
          "success",
        );
        setIsModalOpen(false);
        setEditingAppointment(null);
        setSelectedSlot(null);
      },
      onError: (err: any) => {
        showToast(
          err?.response?.data?.message || err.message || "Erro na operação",
          "error",
        );
      },
    };

    if (editingAppointment) {
      updateAppointment.mutate(
        { id: editingAppointment.id, data },
        options,
      );
    } else {
      createAppointment.mutate(data, options);
    }
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
    setSelectedSlot(null);
  };

  const weekStartDate = new Date(weekStart + "T00:00:00");
  const weekEndDate = addDays(weekStartDate, 6);
  const weekLabel = `${format(weekStartDate, "dd MMM", { locale: ptBR })} — ${format(weekEndDate, "dd MMM yyyy", { locale: ptBR })}`;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest">
            <CalendarIcon className="h-3 w-3" />
            Gestão de Tempo
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Agenda
          </h1>
          <p className="text-muted-foreground font-medium text-sm">
            Organize sua semana com{" "}
            <span className="text-primary font-semibold">
              precisão absoluta
            </span>
            .
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-muted/40 border border-border/40 rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNavigate("prev")}
              className="h-8 w-8 rounded-md hover:bg-background hover:shadow-sm transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={handleToday}
              className="px-4 h-8 font-bold text-[10px] uppercase tracking-wider hover:bg-background hover:shadow-sm transition-all rounded-md"
            >
              Hoje
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNavigate("next")}
              className="h-8 w-8 rounded-md hover:bg-background hover:shadow-sm transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hidden md:inline">
            {weekLabel}
          </span>

          <Button
            onClick={() => {
              setEditingAppointment(null);
              setSelectedSlot(null);
              setIsModalOpen(true);
            }}
            className="h-10 px-6 gap-2 rounded-lg shadow-sm text-xs font-bold uppercase tracking-wider transition-all"
          >
            <Plus className="h-4 w-4" />
            Novo Agendamento
          </Button>
        </div>
      </header>

      {isLoading ? (
        <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-bold tracking-tight text-muted-foreground animate-pulse">
            Carregando sua agenda...
          </p>
        </div>
      ) : (
        <AgendaCalendar
          appointments={appointments}
          currentDate={currentDate}
          onSlotClick={handleSlotClick}
          onAppointmentClick={handleAppointmentClick}
        />
      )}

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={editingAppointment ? "Editar Agendamento" : "Novo Agendamento"}
        className="max-w-md"
      >
        <div className="p-2">
          <AppointmentForm
            onSubmit={handleFormSubmit}
            isLoading={
              createAppointment.isPending || updateAppointment.isPending
            }
            initialDate={
              selectedSlot?.date ||
              (editingAppointment
                ? typeof editingAppointment.date === "string"
                  ? editingAppointment.date.split("T")[0]
                  : format(editingAppointment.date, "yyyy-MM-dd")
                : currentDate)
            }
            initialData={
              editingAppointment
                ? {
                    clientId: editingAppointment.clientId,
                    serviceId: editingAppointment.serviceId,
                    date:
                      typeof editingAppointment.date === "string"
                        ? editingAppointment.date.split("T")[0]
                        : format(editingAppointment.date, "yyyy-MM-dd"),
                    startTime: editingAppointment.startTime,
                  }
                : selectedSlot
                  ? {
                      date: selectedSlot.date,
                      startTime: selectedSlot.startTime,
                    }
                  : undefined
            }
          />
        </div>
      </Modal>
    </div>
  );
}