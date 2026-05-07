"use client";

import { useState, useEffect, useMemo } from "react";
import { addDays, startOfWeek, isSameDay, parseISO, format, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn, formatTime, getStatusLabel } from "@/utils";
import type { Appointment, AppointmentStatus } from "@/types";

const HOUR_HEIGHT = 64;
const START_HOUR = 8;
const END_HOUR = 20;
const HOURS = Array.from(
  { length: END_HOUR - START_HOUR },
  (_, i) => START_HOUR + i,
);
const TOTAL_HEIGHT = (END_HOUR - START_HOUR) * HOUR_HEIGHT;

const statusColors: Record<
  AppointmentStatus,
  { bg: string; border: string; text: string; indicator: string; darkBg: string }
> = {
  scheduled: {
    bg: "bg-blue-50 dark:bg-blue-500/10",
    border: "border-blue-200 dark:border-blue-500/20",
    text: "text-blue-700 dark:text-blue-400",
    indicator: "bg-blue-500",
    darkBg: "dark:bg-blue-500/10",
  },
  confirmed: {
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    border: "border-emerald-200 dark:border-emerald-500/20",
    text: "text-emerald-700 dark:text-emerald-400",
    indicator: "bg-emerald-500",
    darkBg: "dark:bg-emerald-500/10",
  },
  completed: {
    bg: "bg-indigo-50 dark:bg-indigo-500/10",
    border: "border-indigo-200 dark:border-indigo-500/20",
    text: "text-indigo-700 dark:text-indigo-400",
    indicator: "bg-indigo-500",
    darkBg: "dark:bg-indigo-500/10",
  },
  cancelled: {
    bg: "bg-rose-50 dark:bg-rose-500/10",
    border: "border-rose-200 dark:border-rose-500/20",
    text: "text-rose-700 dark:text-rose-400",
    indicator: "bg-rose-500",
    darkBg: "dark:bg-rose-500/10",
  },
  no_show: {
    bg: "bg-amber-50 dark:bg-amber-500/10",
    border: "border-amber-200 dark:border-amber-500/20",
    text: "text-amber-700 dark:text-amber-400",
    indicator: "bg-amber-500",
    darkBg: "dark:bg-amber-500/10",
  },
};

interface AgendaCalendarProps {
  appointments: Appointment[];
  currentDate: string;
  onSlotClick: (date: string, startTime: string) => void;
  onAppointmentClick: (appointment: Appointment) => void;
}

function parseTimeToMinutes(time: string): number {
  const parts = time.split(":");
  return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
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
  "bg-violet-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-pink-500",
  "bg-indigo-500",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export function AgendaCalendar({
  appointments,
  currentDate,
  onSlotClick,
  onAppointmentClick,
}: AgendaCalendarProps) {
  const [now, setNow] = useState(new Date());
  const current = parseISO(currentDate);
  const weekStart = startOfWeek(current, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = new Date();

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const currentTimePosition = useMemo(() => {
    if (!isToday(current)) return null;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    if (currentHour < START_HOUR || currentHour >= END_HOUR) return null;
    return ((currentHour - START_HOUR) * 60 + currentMinute) / 60 * HOUR_HEIGHT;
  }, [now, current]);

  const getAppointmentsForDay = (day: Date) =>
    appointments
      .filter((apt) => isSameDay(parseISO(apt.date), day))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const getAppointmentStyle = (apt: Appointment) => {
    const start = parseTimeToMinutes(apt.startTime);
    const end = apt.endTime
      ? parseTimeToMinutes(apt.endTime)
      : start + 60;
    const top = Math.max(
      0,
      ((start - START_HOUR * 60) / 60) * HOUR_HEIGHT,
    );
    const rawHeight = ((end - start) / 60) * HOUR_HEIGHT;
    const height = Math.max(rawHeight, 28);
    const maxHeight = TOTAL_HEIGHT - top;
    return { top, height: Math.min(height, maxHeight) };
  };

  const weekHasAppointments = appointments.length > 0;

  return (
    <div className="rounded-2xl border border-border/20 bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header */}
          <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-border/20 bg-muted/20">
            <div className="p-3" />
            {days.map((day) => {
              const dayIsToday = isSameDay(day, today);
              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "py-3 px-2 text-center border-l border-border/10",
                    dayIsToday && "bg-primary/[0.04] dark:bg-primary/5",
                  )}
                >
                  <p
                    className={cn(
                      "text-[10px] font-black uppercase tracking-[0.2em]",
                      dayIsToday ? "text-primary" : "text-muted-foreground/60",
                    )}
                  >
                    {format(day, "EEE", { locale: ptBR })}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-0.5">
                    <p
                      className={cn(
                        "text-lg font-black tracking-tighter",
                        dayIsToday ? "text-primary" : "text-foreground",
                      )}
                    >
                      {format(day, "dd")}
                    </p>
                  </div>
                  {dayIsToday && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mx-auto mt-1" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Time Grid */}
          <div className="grid grid-cols-[56px_repeat(7,1fr)]">
            {/* Time Labels */}
            <div className="relative" style={{ height: TOTAL_HEIGHT }}>
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="absolute right-3 flex items-start justify-end"
                  style={{
                    top: (hour - START_HOUR) * HOUR_HEIGHT,
                    height: HOUR_HEIGHT,
                  }}
                >
                  <span className="text-[10px] font-bold text-muted-foreground/40 -translate-y-2">
                    {String(hour).padStart(2, "0")}:00
                  </span>
                </div>
              ))}
            </div>

            {/* Day Columns */}
            {days.map((day) => {
              const dayIsToday = isSameDay(day, today);
              const dayAppointments = getAppointmentsForDay(day);
              const dayStr = format(day, "yyyy-MM-dd");

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "relative border-l border-border/10",
                    dayIsToday && "bg-primary/[0.02] dark:bg-primary/[0.03]",
                  )}
                  style={{ height: TOTAL_HEIGHT }}
                >
                  {/* Hour Lines */}
                  {HOURS.map((hour) => (
                    <div
                      key={hour}
                      className="absolute w-full border-b border-border/5"
                      style={{
                        top: (hour - START_HOUR) * HOUR_HEIGHT,
                      }}
                    />
                  ))}

                  {/* Half Hour Lines */}
                  {HOURS.map((hour) => (
                    <div
                      key={`half-${hour}`}
                      className="absolute w-full border-b border-dashed border-border/[0.03]"
                      style={{
                        top:
                          (hour - START_HOUR) * HOUR_HEIGHT +
                          HOUR_HEIGHT / 2,
                      }}
                    />
                  ))}

                  {/* Clickable Slots */}
                  {HOURS.map((hour) => (
                    <button
                      key={`slot-${hour}`}
                      className="absolute w-full hover:bg-primary/[0.04] dark:hover:bg-primary/5 transition-colors cursor-pointer rounded-sm"
                      style={{
                        top: (hour - START_HOUR) * HOUR_HEIGHT,
                        height: HOUR_HEIGHT,
                      }}
                      onClick={() =>
                        onSlotClick(
                          dayStr,
                          `${String(hour).padStart(2, "0")}:00`,
                        )
                      }
                      aria-label={`Agendar ${dayStr} às ${String(hour).padStart(2, "0")}:00`}
                    />
                  ))}

                  {/* Current Time Indicator */}
                  {dayIsToday && currentTimePosition !== null && (
                    <div
                      className="absolute left-0 right-0 z-10 pointer-events-none"
                      style={{ top: currentTimePosition }}
                    >
                      <div className="flex items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary -ml-1.5 ring-2 ring-background" />
                        <div className="flex-1 h-0.5 bg-primary/60" />
                      </div>
                    </div>
                  )}

                  {/* Appointments */}
                  {dayAppointments.map((apt) => {
                    const { top, height } = getAppointmentStyle(apt);
                    const colors = statusColors[apt.status] || statusColors.scheduled;
                    const isCancelled = apt.status === "cancelled";
                    const initials = getInitials(apt.clientName);
                    const avatarColor = getAvatarColor(apt.clientName);

                    return (
                      <button
                        key={apt.id}
                        className={cn(
                          "absolute left-1 right-1 rounded-lg border px-2 py-1.5 overflow-hidden z-[1] text-left",
                          "transition-all duration-200 hover:shadow-md hover:z-[5] hover:scale-[1.02] cursor-pointer",
                          "focus:outline-none focus:ring-2 focus:ring-primary/30",
                          "group",
                          colors.bg,
                          colors.border,
                        )}
                        style={{ top, height, minHeight: 28 }}
                        onClick={() => onAppointmentClick(apt)}
                      >
                        {/* Status Indicator Bar */}
                        <div
                          className={cn(
                            "absolute left-0 top-0 bottom-0 w-1",
                            colors.indicator,
                          )}
                        />

                        <div className="ml-2 flex flex-col gap-0.5">
                          {/* Client Name + Avatar */}
                          <div className="flex items-center gap-1.5">
                            <div className={cn(
                              "w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold text-white shrink-0",
                              avatarColor,
                            )}>
                              {initials.charAt(0)}
                            </div>
                            <p
                              className={cn(
                                "text-[11px] font-bold truncate leading-tight",
                                isCancelled
                                  ? "line-through text-muted-foreground/50"
                                  : "text-foreground",
                              )}
                            >
                              {apt.clientName}
                            </p>
                          </div>

                          {/* Service Name */}
                          {height >= 36 && (
                            <p
                              className={cn(
                                "text-[9px] font-medium truncate leading-tight",
                                isCancelled
                                  ? "line-through text-muted-foreground/40"
                                  : "text-muted-foreground",
                              )}
                            >
                              {apt.serviceName}
                            </p>
                          )}

                          {/* Time */}
                          {height >= 50 && (
                            <p
                              className={cn(
                                "text-[9px] font-semibold leading-tight",
                                isCancelled
                                  ? "text-muted-foreground/40"
                                  : "text-muted-foreground/60",
                              )}
                            >
                              {formatTime(apt.startTime)} -{" "}
                              {apt.endTime ? formatTime(apt.endTime) : "--:--"}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {!weekHasAppointments && (
        <div className="border-t border-border/10 bg-muted/10 p-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center">
              <svg className="h-6 w-6 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
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
    </div>
  );
}
