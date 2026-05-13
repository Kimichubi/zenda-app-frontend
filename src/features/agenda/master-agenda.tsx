"use client";

import { useState, useMemo, useEffect } from "react";
import { useWeekAppointments, useStaff, useCreateAppointment, useUpdateAppointment } from "@/hooks";
import { AppointmentForm } from "@/features/agenda/appointment-form";
import { cn, formatCurrency, formatTime, getStatusLabel, getAvatarUrl } from "@/utils";
import { Button, Card, CardContent, Modal, useToast } from "@/components/ui";
import { ChevronLeft, ChevronRight, Clock, User, Scissors, Calendar as CalendarIcon, Filter, Plus } from "lucide-react";
import { addDays, startOfWeek, format, isSameDay, parseISO, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Appointment, AppointmentFormData, AppointmentStatus } from "@/types";

const START_HOUR = 8;
const END_HOUR = 20;
const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);
const HOUR_HEIGHT = 64;
const TOTAL_HEIGHT = (END_HOUR - START_HOUR) * HOUR_HEIGHT;

const statusColors: Record<
  AppointmentStatus,
  { bg: string; border: string; text: string; indicator: string }
> = {
  scheduled: {
    bg: "bg-blue-50 dark:bg-blue-500/10",
    border: "border-blue-200 dark:border-blue-500/20",
    text: "text-blue-700 dark:text-blue-400",
    indicator: "bg-blue-500",
  },
  confirmed: {
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    border: "border-emerald-200 dark:border-emerald-500/20",
    text: "text-emerald-700 dark:text-emerald-400",
    indicator: "bg-emerald-500",
  },
  completed: {
    bg: "bg-zinc-100 dark:bg-zinc-800/30",
    border: "border-zinc-200 dark:border-zinc-700/50",
    text: "text-zinc-700 dark:text-zinc-300",
    indicator: "bg-zinc-600 dark:bg-zinc-400",
  },
  cancelled: {
    bg: "bg-rose-50 dark:bg-rose-500/10",
    border: "border-rose-200 dark:border-rose-500/20",
    text: "text-rose-700 dark:text-rose-400",
    indicator: "bg-rose-500",
  },
  no_show: {
    bg: "bg-amber-50 dark:bg-amber-500/10",
    border: "border-amber-200 dark:border-amber-500/20",
    text: "text-amber-700 dark:text-amber-400",
    indicator: "bg-amber-500",
  },
};

function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const avatarColors = [
  "bg-zinc-500", "bg-blue-500", "bg-emerald-500", "bg-amber-500",
  "bg-rose-500", "bg-cyan-500", "bg-pink-500", "bg-zinc-500",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

interface MasterAgendaProps {
  initialDate?: Date;
}

export function MasterAgenda({ initialDate = new Date() }: MasterAgendaProps) {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [view, setView] = useState<"day" | "week">("week");
  const [selectedProfessionals, setSelectedProfessionals] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; startTime: string; professionalId?: string } | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [now, setNow] = useState(new Date());

  const { data: staff = [] } = useStaff();
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDates = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const weekStartStr = format(currentDate, "yyyy-MM-dd");
  const { data: weekAppointments = [], isLoading } = useWeekAppointments(weekStartStr);
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();
  const { showToast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredStaff = selectedProfessionals.length > 0
    ? staff.filter((s) => selectedProfessionals.includes(s.id))
    : staff;

  const toggleProfessional = (id: string) => {
    setSelectedProfessionals((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const navigate = (direction: "prev" | "next") => {
    const days = view === "week" ? 7 : 1;
    setCurrentDate((prev) => addDays(prev, direction === "next" ? days : -days));
  };

  const getAppointmentsForDay = (day: Date) =>
    weekAppointments.filter((apt) => isSameDay(parseISO(apt.date), day));

  const getAppointmentsForProAndDay = (proId: string, day: Date) =>
    weekAppointments.filter((apt) => apt.professionalId === proId && isSameDay(parseISO(apt.date), day));

  const getAppointmentStyle = (apt: Appointment) => {
    const start = parseTimeToMinutes(apt.startTime);
    const end = apt.endTime ? parseTimeToMinutes(apt.endTime) : start + 60;
    const top = Math.max(0, ((start - START_HOUR * 60) / 60) * HOUR_HEIGHT);
    const rawHeight = ((end - start) / 60) * HOUR_HEIGHT;
    const height = Math.max(rawHeight, 28);
    const maxHeight = TOTAL_HEIGHT - top;
    return { top, height: Math.min(height, maxHeight) };
  };

  const currentTimePosition = useMemo(() => {
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    if (currentHour < START_HOUR || currentHour >= END_HOUR) return null;
    return ((currentHour - START_HOUR) * 60 + currentMinute) / 60 * HOUR_HEIGHT;
  }, [now]);

  const handleSlotClick = (date: string, startTime: string, professionalId?: string) => {
    setEditingAppointment(null);
    setSelectedSlot({ date, startTime, professionalId });
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
          editingAppointment ? "Agendamento atualizado!" : "Agendamento criado!",
          "success"
        );
        setIsModalOpen(false);
        setEditingAppointment(null);
        setSelectedSlot(null);
      },
      onError: (err: any) => {
        showToast(err?.response?.data?.message || err.message || "Erro na operação", "error");
      },
    };

    if (editingAppointment) {
      updateAppointment.mutate({ id: editingAppointment.id, data }, options);
    } else {
      createAppointment.mutate(data, options);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
    setSelectedSlot(null);
  };

  const columnCount = view === "week" ? 7 : filteredStaff.length;
  const showCurrentTime = view === "day" ? isToday(currentDate) : false;

  const renderAppointmentCard = (apt: Appointment, showProBadge: boolean) => {
    const { top, height } = getAppointmentStyle(apt);
    const colors = statusColors[apt.status] || statusColors.scheduled;
    const isCancelled = apt.status === "cancelled";
    const initials = getInitials(apt.clientName);
    const avatarColor = getAvatarColor(apt.clientName);
    const pro = staff.find((s) => s.id === apt.professionalId);

    return (
      <button
        key={apt.id}
        className={cn(
          "absolute left-1 right-1 rounded-lg border px-2 py-1 overflow-hidden z-[1] text-left",
          "transition-all duration-200 hover:shadow-md hover:z-[5] hover:scale-[1.02] cursor-pointer",
          "focus:outline-none focus:ring-2 focus:ring-primary/30 group",
          colors.bg,
          colors.border,
        )}
        style={{ top, height, minHeight: 28 }}
        onClick={() => handleAppointmentClick(apt)}
        title={`${apt.clientName} — ${apt.serviceName} (${formatTime(apt.startTime)}${apt.endTime ? ` - ${formatTime(apt.endTime)}` : ""})`}
      >
        <div className={cn("absolute left-0 top-0 bottom-0 w-1", colors.indicator)} />
        <div className="ml-2 flex flex-col gap-0.5 min-w-0">
          {/* Pro badge (week view only) */}
          {showProBadge && pro && (
            <div className="flex items-center gap-1 mb-0.5">
              {pro.avatarPath ? (
                <img src={getAvatarUrl(pro.avatarPath) ?? undefined} alt={pro.name} className="h-3 w-3 rounded-full object-cover" />
              ) : (
                <div className={cn("h-3 w-3 rounded-full flex items-center justify-center text-[6px] font-bold text-white", getAvatarColor(pro.name))}>
                  {pro.name.charAt(0)}
                </div>
              )}
              <span className="text-[8px] font-bold text-muted-foreground truncate">{pro.name}</span>
            </div>
          )}

          {/* Client */}
          <div className="flex items-center gap-1.5 min-w-0">
            <div className={cn("w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold text-white shrink-0", avatarColor)}>
              {initials.charAt(0)}
            </div>
            <p className={cn("text-[11px] font-bold truncate leading-tight", isCancelled ? "line-through text-muted-foreground/50" : "text-foreground")}>
              {apt.clientName}
            </p>
          </div>

          {/* Service */}
          {height >= 36 && (
            <p className={cn("text-[9px] font-medium truncate leading-tight flex items-center gap-1", isCancelled ? "line-through text-muted-foreground/40" : "text-muted-foreground")}>
              <Scissors className="h-2.5 w-2.5 shrink-0" />
              {apt.serviceName}
            </p>
          )}

          {/* Time */}
          {height >= 50 && (
            <p className={cn("text-[9px] font-semibold leading-tight flex items-center gap-1", isCancelled ? "text-muted-foreground/40" : "text-muted-foreground/60")}>
              <Clock className="h-2.5 w-2.5 shrink-0" />
              {formatTime(apt.startTime)} — {apt.endTime ? formatTime(apt.endTime) : "--:--"}
            </p>
          )}
        </div>
      </button>
    );
  };

  const today = new Date();
  const hasAppointments = weekAppointments.length > 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Agenda Master</h2>
          <p className="text-sm text-muted-foreground font-medium">
            Visualize todos os profissionais e agendamentos em um só lugar
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-muted/50 rounded-xl p-1">
            <Button
              variant={view === "day" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-lg text-xs font-bold"
              onClick={() => setView("day")}
            >
              Dia
            </Button>
            <Button
              variant={view === "week" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-lg text-xs font-bold"
              onClick={() => setView("week")}
            >
              Semana
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl" onClick={() => navigate("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-4 py-2 bg-muted/50 rounded-xl text-sm font-bold min-w-[180px] text-center">
              {view === "week"
                ? `${format(weekDates[0], "dd MMM", { locale: ptBR })} — ${format(weekDates[6], "dd MMM", { locale: ptBR })}`
                : format(currentDate, "dd 'de' MMMM", { locale: ptBR })}
            </div>
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl" onClick={() => navigate("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={() => {
              setEditingAppointment(null);
              setSelectedSlot(null);
              setIsModalOpen(true);
            }}
            className="h-9 px-4 gap-2 rounded-xl shadow-sm text-xs font-bold uppercase tracking-wider transition-all"
          >
            <Plus className="h-4 w-4" />
            Novo
          </Button>
        </div>
      </div>

      {/* Professional Filters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
        {staff.map((member) => {
          const isSelected = selectedProfessionals.length === 0 || selectedProfessionals.includes(member.id);
          return (
            <button
              key={member.id}
              onClick={() => toggleProfessional(member.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all whitespace-nowrap",
                isSelected
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-muted/30 border-border/30 text-muted-foreground opacity-60"
              )}
            >
              {member.avatarPath ? (
                <img src={getAvatarUrl(member.avatarPath) ?? undefined} alt={member.name} className="h-5 w-5 rounded-full object-cover" />
              ) : (
                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-bold">
                  {member.name.charAt(0)}
                </div>
              )}
              {member.name}
            </button>
          );
        })}
      </div>

      {/* Calendar Grid */}
      <Card className="border-border/40 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header Row */}
              <div className="grid border-b border-border/40" style={{ gridTemplateColumns: `56px repeat(${columnCount}, 1fr)` }}>
                <div className="p-3 text-xs font-black text-muted-foreground uppercase tracking-widest border-r border-border/40">
                  Horário
                </div>
                {view === "week"
                  ? weekDates.map((date) => {
                      const dayIsToday = isSameDay(date, today);
                      return (
                        <div key={date.toISOString()} className={cn("p-3 text-center border-r border-border/40 last:border-r-0", dayIsToday && "bg-primary/[0.04]")}>
                          <p className={cn("text-[10px] font-black uppercase tracking-[0.2em]", dayIsToday ? "text-primary" : "text-muted-foreground/60")}>
                            {format(date, "EEE", { locale: ptBR })}
                          </p>
                          <p className={cn("text-lg font-black mt-0.5", dayIsToday ? "text-primary" : "text-foreground")}>
                            {format(date, "dd")}
                          </p>
                          {dayIsToday && <div className="w-1.5 h-1.5 rounded-full bg-primary mx-auto mt-1" />}
                        </div>
                      );
                    })
                  : filteredStaff.map((member) => (
                      <div key={member.id} className="p-3 text-center border-r border-border/40 last:border-r-0">
                        {member.avatarPath ? (
                          <img src={getAvatarUrl(member.avatarPath) ?? undefined} alt={member.name} className="h-8 w-8 rounded-full object-cover mx-auto mb-1" />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs mx-auto mb-1">
                            {member.name.charAt(0)}
                          </div>
                        )}
                        <p className="text-xs font-bold">{member.name}</p>
                      </div>
                    ))}
              </div>

              {/* Time Grid */}
              <div className="grid" style={{ gridTemplateColumns: `56px repeat(${columnCount}, 1fr)` }}>
                {/* Time Labels */}
                <div className="relative border-r border-border/40" style={{ height: TOTAL_HEIGHT }}>
                  {HOURS.map((hour) => (
                    <div
                      key={hour}
                      className="absolute right-3 flex items-start justify-end"
                      style={{ top: (hour - START_HOUR) * HOUR_HEIGHT, height: HOUR_HEIGHT }}
                    >
                      <span className="text-[10px] font-bold text-muted-foreground/40 -translate-y-2">
                        {String(hour).padStart(2, "0")}:00
                      </span>
                    </div>
                  ))}
                </div>

                {/* Columns */}
                {view === "week"
                  ? weekDates.map((date) => {
                      const dayIsToday = isSameDay(date, today);
                      const dayStr = format(date, "yyyy-MM-dd");
                      const dayAppointments = getAppointmentsForDay(date).filter(
                        (apt) => !selectedProfessionals.length || selectedProfessionals.includes(apt.professionalId || "")
                      );
                      return (
                        <div
                          key={date.toISOString()}
                          className={cn("relative border-r border-border/20 last:border-r-0", dayIsToday && "bg-primary/[0.02] dark:bg-primary/[0.03]")}
                          style={{ height: TOTAL_HEIGHT }}
                        >
                          {/* Hour lines */}
                          {HOURS.map((hour) => (
                            <div key={hour} className="absolute w-full border-b border-border/5" style={{ top: (hour - START_HOUR) * HOUR_HEIGHT }} />
                          ))}
                          {/* Half hour lines */}
                          {HOURS.map((hour) => (
                            <div key={`half-${hour}`} className="absolute w-full border-b border-dashed border-border/[0.03]" style={{ top: (hour - START_HOUR) * HOUR_HEIGHT + HOUR_HEIGHT / 2 }} />
                          ))}
                          {/* Clickable slots */}
                          {HOURS.map((hour) => (
                            <button
                              key={`slot-${hour}`}
                              className="absolute w-full hover:bg-primary/[0.04] dark:hover:bg-primary/5 transition-colors cursor-pointer rounded-sm"
                              style={{ top: (hour - START_HOUR) * HOUR_HEIGHT, height: HOUR_HEIGHT }}
                              onClick={() => handleSlotClick(dayStr, `${String(hour).padStart(2, "0")}:00`)}
                              aria-label={`Agendar ${dayStr} às ${String(hour).padStart(2, "0")}:00`}
                            />
                          ))}
                          {/* Current time indicator */}
                          {dayIsToday && currentTimePosition !== null && (
                            <div className="absolute left-0 right-0 z-10 pointer-events-none" style={{ top: currentTimePosition }}>
                              <div className="flex items-center">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary -ml-1.5 ring-2 ring-background" />
                                <div className="flex-1 h-0.5 bg-primary/60" />
                              </div>
                            </div>
                          )}
                          {/* Appointments */}
                          {dayAppointments.map((apt) => renderAppointmentCard(apt, true))}
                        </div>
                      );
                    })
                  : filteredStaff.map((member) => {
                      const dayStr = format(currentDate, "yyyy-MM-dd");
                      const dayAppointments = getAppointmentsForProAndDay(member.id, currentDate);
                      return (
                        <div
                          key={member.id}
                          className="relative border-r border-border/20 last:border-r-0"
                          style={{ height: TOTAL_HEIGHT }}
                        >
                          {/* Hour lines */}
                          {HOURS.map((hour) => (
                            <div key={hour} className="absolute w-full border-b border-border/5" style={{ top: (hour - START_HOUR) * HOUR_HEIGHT }} />
                          ))}
                          {/* Half hour lines */}
                          {HOURS.map((hour) => (
                            <div key={`half-${hour}`} className="absolute w-full border-b border-dashed border-border/[0.03]" style={{ top: (hour - START_HOUR) * HOUR_HEIGHT + HOUR_HEIGHT / 2 }} />
                          ))}
                          {/* Clickable slots */}
                          {HOURS.map((hour) => (
                            <button
                              key={`slot-${hour}`}
                              className="absolute w-full hover:bg-primary/[0.04] dark:hover:bg-primary/5 transition-colors cursor-pointer rounded-sm"
                              style={{ top: (hour - START_HOUR) * HOUR_HEIGHT, height: HOUR_HEIGHT }}
                              onClick={() => handleSlotClick(dayStr, `${String(hour).padStart(2, "0")}:00`, member.id)}
                              aria-label={`Agendar ${dayStr} às ${String(hour).padStart(2, "0")}:00 com ${member.name}`}
                            />
                          ))}
                          {/* Appointments */}
                          {dayAppointments.map((apt) => renderAppointmentCard(apt, false))}
                        </div>
                      );
                    })}
              </div>
            </div>
          </div>

          {/* Empty State */}
          {!isLoading && !hasAppointments && (
            <div className="border-t border-border/10 bg-muted/10 p-12 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center">
                  <CalendarIcon className="h-6 w-6 text-muted-foreground/40" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Nenhum agendamento esta semana</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Clique em qualquer horário na grade para criar um novo agendamento
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={editingAppointment ? "Editar Agendamento" : "Novo Agendamento"}
        className="max-w-md"
      >
        <div className="p-2">
          <AppointmentForm
            onSubmit={handleFormSubmit}
            isLoading={createAppointment.isPending || updateAppointment.isPending}
            initialDate={
              selectedSlot?.date ||
              (editingAppointment
                ? typeof editingAppointment.date === "string"
                  ? editingAppointment.date.split("T")[0]
                  : format(editingAppointment.date, "yyyy-MM-dd")
                : format(currentDate, "yyyy-MM-dd"))
            }
            initialData={
              editingAppointment
                ? {
                    clientId: editingAppointment.clientId,
                    serviceId: editingAppointment.serviceId,
                    date: typeof editingAppointment.date === "string"
                      ? editingAppointment.date.split("T")[0]
                      : format(editingAppointment.date, "yyyy-MM-dd"),
                    startTime: editingAppointment.startTime,
                    professionalId: editingAppointment.professionalId,
                  }
                : selectedSlot
                  ? {
                      date: selectedSlot.date,
                      startTime: selectedSlot.startTime,
                      professionalId: selectedSlot.professionalId,
                    }
                  : undefined
            }
            professionalId={selectedSlot?.professionalId || editingAppointment?.professionalId || undefined}
          />
        </div>
      </Modal>
    </div>
  );
}
