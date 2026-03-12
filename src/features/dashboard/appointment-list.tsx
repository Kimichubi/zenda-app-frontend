"use client";

import { Card, Badge } from "@/components/ui";
import { formatTime, getStatusLabel } from "@/utils";
import type { Appointment } from "@/types";

interface AppointmentListProps {
  appointments?: Appointment[];
  title: string;
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

export function AppointmentList({
  appointments = [],
  title,
}: AppointmentListProps) {
  return (
    <Card title={title}>
      {appointments.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhum atendimento</p>
      ) : (
        <div className="space-y-3">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-indigo-600">
                  {formatTime(apt.startTime)}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {apt.clientName}
                  </p>
                  <p className="text-xs text-gray-500">{apt.serviceName}</p>
                </div>
              </div>
              <Badge variant={statusVariant[apt.status] || "default"}>
                {getStatusLabel(apt.status)}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
