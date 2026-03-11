"use client";

import { addDays, format, startOfWeek, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { formatTime, getStatusLabel } from "@/utils";
import type { Appointment } from "@/types";

interface WeekCalendarProps {
  appointments: Appointment[];
  currentDate: string;
  onConfirm: (appointmentId: string) => void;
  onNavigate: (direction: "prev" | "next") => void;
}

const statusVariant: Record<
  string,
  "default" | "success" | "danger" | "warning" | "info"
> = {
  scheduled: "info",
  confirmed: "success",
  completed: "default",
  cancelled: "danger",
  no_show: "warning",
};

export function WeekCalendar({
  appointments,
  currentDate,
  onConfirm,
  onNavigate,
}: WeekCalendarProps) {
  const current = parseISO(currentDate);
  const weekStart = startOfWeek(current, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getAppointmentsForDay = (day: Date) =>
    appointments.filter((apt) => isSameDay(parseISO(apt.date), day));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {format(weekStart, "dd 'de' MMMM", { locale: ptBR })} -{" "}
          {format(addDays(weekStart, 6), "dd 'de' MMMM, yyyy", {
            locale: ptBR,
          })}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("prev")}
            aria-label="Semana anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("next")}
            aria-label="Próxima semana"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className="min-h-[200px] rounded-lg border border-gray-200 bg-white p-2"
          >
            <div className="mb-2 text-center">
              <p className="text-xs font-medium uppercase text-gray-500">
                {format(day, "EEE", { locale: ptBR })}
              </p>
              <p
                className={`text-sm font-bold ${
                  isSameDay(day, new Date())
                    ? "text-indigo-600"
                    : "text-gray-900"
                }`}
              >
                {format(day, "dd")}
              </p>
            </div>

            <div className="space-y-1">
              {getAppointmentsForDay(day).map((apt) => (
                <div
                  key={apt.id}
                  className="rounded border border-gray-100 bg-gray-50 p-1.5 text-xs"
                >
                  <p className="font-medium text-gray-900">{apt.clientName}</p>
                  <p className="text-gray-500">
                    {formatTime(apt.startTime)} - {apt.serviceName}
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <Badge variant={statusVariant[apt.status] || "default"}>
                      {getStatusLabel(apt.status)}
                    </Badge>
                    {apt.status === "scheduled" && (
                      <button
                        onClick={() => onConfirm(apt.id)}
                        className="rounded bg-green-100 p-0.5 text-green-700 hover:bg-green-200"
                        aria-label="Confirmar presença"
                      >
                        <Check className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
