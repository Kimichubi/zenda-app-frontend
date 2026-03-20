"use client";

import { addDays, format, startOfWeek, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Check, Clock, MessageCircle } from "lucide-react";
import { Button, Badge, Card, CardContent, useToast } from "@/components/ui";
import { formatTime, getStatusLabel, cn } from "@/utils";
import { useResendNotification } from "@/hooks";
import type { Appointment } from "@/types";

interface WeekCalendarProps {
  appointments: Appointment[];
  currentDate: string;
  onConfirm: (appointmentId: string) => void;
  onNavigate: (direction: "prev" | "next") => void;
}

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
> = {
  scheduled: "secondary",
  confirmed: "success",
  completed: "default",
  cancelled: "destructive",
  no_show: "warning",
};

export function WeekCalendar({
  appointments,
  currentDate,
  onConfirm,
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
    <div className="space-y-6">
      <Card className="border-none bg-transparent shadow-none">
        <CardContent className="p-0">
          <div className="mb-6">
            <h2 className="text-xl font-bold tracking-tight capitalize">
              {format(weekStart, "MMMM yyyy", { locale: ptBR })}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {days.map((day) => {
              const isToday = isSameDay(day, new Date());
              const dayAppointments = getAppointmentsForDay(day);
              
              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "flex flex-col rounded-2xl border transition-all duration-300",
                    isToday 
                      ? "border-primary/30 bg-primary/5 shadow-sm" 
                      : "border-border/50 bg-card/50"
                  )}
                >
                  <div className={cn(
                    "p-3 text-center border-b",
                    isToday ? "border-primary/20" : "border-border/50"
                  )}>
                    <p className={cn(
                      "text-[10px] font-bold uppercase tracking-widest",
                      isToday ? "text-primary" : "text-muted-foreground"
                    )}>
                      {format(day, "EEE", { locale: ptBR })}
                    </p>
                    <p className={cn(
                      "text-xl font-extrabold mt-1",
                      isToday ? "text-primary" : "text-foreground"
                    )}>
                      {format(day, "dd")}
                    </p>
                  </div>

                  <div className="flex-1 p-2 space-y-2 min-h-[200px]">
                    {dayAppointments.length === 0 ? (
                      <div className="h-full flex items-center justify-center opacity-20 py-8">
                        <Clock className="h-8 w-8 text-muted-foreground" />
                      </div>
                    ) : (
                      dayAppointments.map((apt) => (
                        <div
                          key={apt.id}
                          className="group relative rounded-xl border border-border/50 bg-card p-3 shadow-sm hover:border-primary/30 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                {formatTime(apt.startTime)}
                              </span>
                              <Badge 
                                variant={statusVariant[apt.status.toLowerCase()] || "default"}
                                className="text-[9px] px-1.5 h-4 font-bold uppercase"
                              >
                                {getStatusLabel(apt.status)}
                              </Badge>
                            </div>
                            
                            <div>
                              <p className="text-xs font-bold leading-tight group-hover:text-primary transition-colors">
                                {apt.clientName}
                              </p>
                              <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                                {apt.serviceName}
                              </p>
                            </div>

                            <div className="flex gap-1 mt-1">
                              {apt.status.toLowerCase() === "scheduled" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onConfirm(apt.id)}
                                  className="flex-1 h-7 text-[10px] font-bold gap-1 border-primary/20 hover:bg-primary hover:text-primary-foreground"
                                >
                                  <Check className="h-3 w-3" />
                                  Confirmar
                                </Button>
                              )}
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleResendNotification(apt.id)}
                                className="h-7 w-7 text-emerald-600 hover:bg-emerald-50"
                                title="Reenviar WhatsApp"
                                disabled={resendNotification.isPending}
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}