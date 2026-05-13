"use client";

import { addDays, format, startOfWeek, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Edit2, Check, Clock, MessageCircle, Calendar as CalendarIcon } from "lucide-react";
import { Button, useToast } from "@/components/ui";
import { formatTime, getStatusLabel, cn } from "@/utils";
import { useResendNotification } from "@/hooks";
import type { Appointment } from "@/types";

interface WeekCalendarProps {
  appointments: Appointment[];
  currentDate: string;
  onConfirm: (appointmentId: string) => void;
  onEdit: (appointment: Appointment) => void;
  onNavigate: (direction: "prev" | "next") => void;
}

const statusConfig: Record<
  string,
  { label: string; color: string; indicator: string; bg: string }
> = {
  scheduled: { label: "Agendado", color: "text-blue-600", indicator: "bg-blue-500", bg: "bg-blue-50" },
  confirmed: { label: "Confirmado", color: "text-emerald-600", indicator: "bg-emerald-500", bg: "bg-emerald-50" },
  completed: { label: "Finalizado", color: "text-slate-500", indicator: "bg-slate-400", bg: "bg-slate-50" },
  cancelled: { label: "Cancelado", color: "text-rose-600", indicator: "bg-rose-500", bg: "bg-rose-50" },
  no_show: { label: "Faltou", color: "text-amber-600", indicator: "bg-amber-500", bg: "bg-amber-50" },
};

export function WeekCalendar({
  appointments,
  currentDate,
  onConfirm,
  onEdit,
}: WeekCalendarProps) {
  const { showToast } = useToast();
  const resendNotification = useResendNotification();
  const current = parseISO(currentDate);
  const weekStart = startOfWeek(current, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getAppointmentsForDay = (day: Date) =>
    appointments.filter((apt) => isSameDay(parseISO(apt.date), day));

  const handleResendNotification = (id: string) => {
    resendNotification.mutate(id, {
      onSuccess: () => showToast("Lembrete enviado via WhatsApp!", "success"),
      onError: () => showToast("Erro ao enviar WhatsApp", "error"),
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tighter uppercase italic text-slate-900">
          {format(weekStart, "MMMM yyyy", { locale: ptBR })}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-px bg-border/20 rounded-[2.5rem] overflow-hidden border border-border/20">
        {days.map((day) => {
          const isToday = isSameDay(day, new Date());
          const dayAppointments = getAppointmentsForDay(day);
          
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "flex flex-col min-w-0 min-h-[500px] transition-colors",
                isToday ? "bg-primary/[0.02]" : "bg-transparent"
              )}
            >
              {/* Day Header */}
              <div className={cn(
                "p-5 text-center border-b flex flex-col items-center gap-1",
                isToday ? "border-primary/20" : "border-border/10"
              )}>
                <p className={cn(
                  "text-[10px] font-black uppercase tracking-[0.2em]",
                  isToday ? "text-primary" : "text-slate-400"
                )}>
                  {format(day, "EEE", { locale: ptBR })}
                </p>
                <p className={cn(
                  "text-2xl font-black tracking-tighter",
                  isToday ? "text-primary" : "text-slate-900"
                )}>
                  {format(day, "dd")}
                </p>
                {isToday && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1" />}
              </div>

              {/* Day Content */}
              <div className="flex-1 p-3 space-y-3">
                {dayAppointments.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-5 py-12">
                    <CalendarIcon className="h-8 w-8 text-slate-900" />
                  </div>
                ) : (
                  dayAppointments.sort((a,b) => (a.startTime || "").localeCompare(b.startTime || "")).map((apt) => {
                    const status = statusConfig[apt.status.toLowerCase()] || statusConfig.scheduled;
                    
                    return (
                      <div
                        key={apt.id}
                        className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-lg transition-all duration-300 w-full overflow-hidden"
                      >
                        {/* Status Indicator Bar */}
                        <div className={cn("absolute left-0 top-0 bottom-0 w-1.5", status.indicator)} />
                        
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-primary" />
                              {formatTime(apt.startTime)}
                            </span>
                            <span className={cn("text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full", status.bg, status.color)}>
                              {status.label}
                            </span>
                          </div>
                          
                          <div>
                            <p className="text-sm font-black tracking-tight text-slate-900 truncate">
                              {apt.clientName}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate mt-0.5">
                              {apt.serviceName}
                            </p>
                          </div>

                          {/* Action Buttons - Always Visible */}
                          <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
                            {apt.status.toLowerCase() === "scheduled" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onConfirm(apt.id)}
                                className="flex-1 h-8 rounded-xl text-[9px] font-black uppercase tracking-wider gap-1.5 border-slate-100 bg-slate-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all"
                              >
                                <Check className="h-3 w-3" />
                                Ok
                              </Button>
                            )}
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => onEdit(apt)}
                              className="h-8 w-8 rounded-xl bg-slate-50 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-800 dark:hover:bg-zinc-200 hover:text-white dark:hover:text-zinc-900 transition-all"
                              title="Editar"
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleResendNotification(apt.id)}
                              className="h-8 w-8 rounded-xl bg-slate-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all"
                              title="WhatsApp"
                              disabled={resendNotification.isPending}
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
