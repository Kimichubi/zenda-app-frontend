"use client";

import { useState, useMemo } from "react";
import { format, startOfWeek, addDays, isToday, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AgendaCalendar } from "@/features/agenda/agenda-calendar";
import { AppointmentForm } from "@/features/agenda/appointment-form";
import {
  useWeekAppointments,
  useCreateAppointment,
  useUpdateAppointment,
} from "@/hooks";
import { useToast, Button, Modal, Card, CardContent, Badge } from "@/components/ui";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Users,
  CalendarCheck,
  CalendarDays,
} from "lucide-react";
import type { Appointment, AppointmentFormData } from "@/types";
import { cn } from "@/utils";

function AgendaSkeleton() {
  return (
    <div className="rounded-2xl border border-border/20 bg-card overflow-hidden">
      <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-border/20 bg-muted/20">
        <div className="p-3" />
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="py-4 px-2 text-center border-l border-border/10">
            <div className="h-3 w-8 bg-muted rounded mx-auto animate-pulse" />
            <div className="h-7 w-10 bg-muted rounded mx-auto mt-2 animate-pulse" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-[56px_repeat(7,1fr)]">
        <div className="relative h-[768px]">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="absolute right-3" style={{ top: i * 64 }}>
              <div className="h-3 w-10 bg-muted/50 rounded animate-pulse" />
            </div>
          ))}
        </div>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="relative h-[768px] border-l border-border/10">
            {Array.from({ length: 12 }).map((_, j) => (
              <div key={j} className="absolute w-full border-b border-border/5" style={{ top: j * 64 }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

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

  const todayAppointments = useMemo(() => {
    return appointments
      .filter((apt) => isToday(parseISO(apt.date)))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [appointments]);

  const stats = useMemo(() => {
    const todayCount = todayAppointments.length;
    const confirmedCount = todayAppointments.filter((a) => a.status === "confirmed" || a.status === "scheduled").length;
    const nextApt = todayAppointments.find((a) => {
      const aptTime = parseISO(`${a.date}T${a.startTime}`);
      return aptTime >= new Date();
    });
    return { todayCount, confirmedCount, nextApt };
  }, [todayAppointments]);

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
  const weekLabel = `${format(weekStartDate, "dd", { locale: ptBR })} — ${format(weekEndDate, "dd MMM yyyy", { locale: ptBR })}`;
  const isCurrentWeek = isToday(weekStartDate) || isToday(weekEndDate) || (weekStartDate < new Date() && weekEndDate > new Date());

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
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

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center bg-muted/40 border border-border/40 rounded-xl p-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNavigate("prev")}
              className="h-8 w-8 rounded-lg hover:bg-background transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant={isCurrentWeek ? "primary" : "ghost"}
              onClick={handleToday}
              className={cn(
                "px-4 h-8 font-bold text-[10px] uppercase tracking-wider transition-all rounded-lg",
                isCurrentWeek ? "bg-primary text-white" : "hover:bg-background"
              )}
            >
              Hoje
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNavigate("next")}
              className="h-8 w-8 rounded-lg hover:bg-background transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hidden md:inline">
            {weekLabel}
          </span>

          <Button
            onClick={() => {
              setEditingAppointment(null);
              setSelectedSlot(null);
              setIsModalOpen(true);
            }}
            className="h-10 px-5 gap-2 rounded-xl shadow-sm text-xs font-bold uppercase tracking-wider transition-all"
          >
            <Plus className="h-4 w-4" />
            Novo Agendamento
          </Button>
        </div>
      </header>

      {isCurrentWeek && stats.todayCount > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Hoje</p>
                <p className="text-xl font-bold tracking-tight">{stats.todayCount} agendamento{stats.todayCount > 1 ? "s" : ""}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Confirmados</p>
                <p className="text-xl font-bold tracking-tight">{stats.confirmedCount} cliente{stats.confirmedCount !== 1 ? "s" : ""}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                <Clock className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Próximo</p>
                {stats.nextApt ? (
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold truncate">{stats.nextApt.clientName}</p>
                    <Badge variant="outline" className="shrink-0 text-[9px] h-5">{stats.nextApt.startTime}</Badge>
                  </div>
                ) : (
                  <p className="text-sm font-bold text-muted-foreground">Sem mais hoje</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {isLoading ? (
        <AgendaSkeleton />
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
