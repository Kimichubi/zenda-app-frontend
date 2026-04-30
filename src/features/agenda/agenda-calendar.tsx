"use client";

import { addDays, startOfWeek, isSameDay, parseISO, format } from "date-fns";
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
  { bg: string; border: string; text: string; indicator: string }
> = {
  scheduled: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    indicator: "bg-blue-500",
  },
  confirmed: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    indicator: "bg-emerald-500",
  },
  completed: {
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    text: "text-indigo-700",
    indicator: "bg-indigo-500",
  },
  cancelled: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-700",
    indicator: "bg-rose-500",
  },
  no_show: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    indicator: "bg-amber-500",
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

export function AgendaCalendar({
  appointments,
  currentDate,
  onSlotClick,
  onAppointmentClick,
}: AgendaCalendarProps) {
  const current = parseISO(currentDate);
  const weekStart = startOfWeek(current, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = new Date();

  const getAppointmentsForDay = (day: Date) =>
    appointments.filter((apt) => isSameDay(parseISO(apt.date), day));

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

  return (
    <div className="rounded-2xl border border-border/20 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-border/20 bg-muted/20">
            <div className="p-3" />
            {days.map((day) => {
              const isToday = isSameDay(day, today);
              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "py-4 px-2 text-center border-l border-border/10",
                    isToday && "bg-primary/[0.04]",
                  )}
                >
                  <p
                    className={cn(
                      "text-[10px] font-black uppercase tracking-[0.2em]",
                      isToday ? "text-primary" : "text-slate-400",
                    )}
                  >
                    {format(day, "EEE", { locale: ptBR })}
                  </p>
                  <p
                    className={cn(
                      "text-lg font-black tracking-tighter mt-0.5",
                      isToday ? "text-primary" : "text-slate-900",
                    )}
                  >
                    {format(day, "dd")}
                  </p>
                  {isToday && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mx-auto mt-1" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-[56px_repeat(7,1fr)]">
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
                  <span className="text-[10px] font-bold text-slate-300 -translate-y-2">
                    {String(hour).padStart(2, "0")}:00
                  </span>
                </div>
              ))}
            </div>

            {days.map((day) => {
              const isToday = isSameDay(day, today);
              const dayAppointments = getAppointmentsForDay(day);
              const dayStr = format(day, "yyyy-MM-dd");

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "relative border-l border-border/10",
                    isToday && "bg-primary/[0.02]",
                  )}
                  style={{ height: TOTAL_HEIGHT }}
                >
                  {HOURS.map((hour) => (
                    <div
                      key={hour}
                      className="absolute w-full border-b border-border/5"
                      style={{
                        top: (hour - START_HOUR) * HOUR_HEIGHT,
                      }}
                    />
                  ))}

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

                  {HOURS.map((hour) => (
                    <button
                      key={`slot-${hour}`}
                      className="absolute w-full hover:bg-primary/[0.04] transition-colors cursor-pointer"
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

                  {dayAppointments.map((apt) => {
                    const { top, height } = getAppointmentStyle(apt);
                    const colors =
                      statusColors[apt.status] || statusColors.scheduled;
                    const isCancelled = apt.status === "cancelled";

                    return (
                      <button
                        key={apt.id}
                        className={cn(
                          "absolute left-1 right-1 rounded-xl border px-2 py-1 overflow-hidden z-[1]",
                          "transition-all hover:shadow-lg hover:z-[5] hover:scale-[1.02] cursor-pointer",
                          "focus:outline-none focus:ring-2 focus:ring-primary/30",
                          colors.bg,
                          colors.border,
                        )}
                        style={{ top, height, minHeight: 28 }}
                        onClick={() => onAppointmentClick(apt)}
                      >
                        <div
                          className={cn(
                            "absolute left-0 top-0 bottom-0 w-1 rounded-l-xl",
                            colors.indicator,
                          )}
                        />
                        <div className="ml-2 flex flex-col gap-0.5 text-left">
                          <div className="flex items-center gap-1.5">
                            <p
                              className={cn(
                                "text-[11px] font-black truncate leading-tight",
                                isCancelled
                                  ? "line-through text-rose-400"
                                  : "text-slate-900",
                              )}
                            >
                              {apt.clientName}
                            </p>
                            <span
                              className={cn(
                                "w-1.5 h-1.5 rounded-full flex-shrink-0",
                                colors.indicator,
                              )}
                            />
                          </div>
                          {height >= 40 && (
                            <p
                              className={cn(
                                "text-[9px] font-bold uppercase tracking-wider truncate leading-tight",
                                isCancelled
                                  ? "line-through text-rose-300"
                                  : colors.text,
                              )}
                            >
                              {apt.serviceName}
                            </p>
                          )}
                          {height >= 56 && (
                            <p
                              className={cn(
                                "text-[9px] font-semibold leading-tight",
                                isCancelled
                                  ? "text-rose-300 line-through"
                                  : "text-slate-400",
                              )}
                            >
                              {formatTime(apt.startTime)} -{" "}
                              {formatTime(apt.endTime)}
                            </p>
                          )}
                          {height >= 72 && (
                            <span
                              className={cn(
                                "inline-flex items-center text-[8px] font-black uppercase tracking-wider leading-none mt-0.5",
                                isCancelled
                                  ? "text-rose-400"
                                  : colors.text,
                              )}
                            >
                              {getStatusLabel(apt.status)}
                            </span>
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
    </div>
  );
}