"use client";

import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { formatTime, getStatusLabel, cn } from "@/utils";
import type { Appointment } from "@/types";
import { Clock, User, ChevronRight } from "lucide-react";

interface AppointmentListProps {
  appointments?: Appointment[];
  title: string;
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

export function AppointmentList({
  appointments = [],
  title,
}: AppointmentListProps) {
  return (
    <Card className="h-full border border-border/50 bg-card shadow-sm rounded-xl overflow-hidden">
      <CardHeader className="p-6 pb-4 flex flex-row items-center justify-between border-b border-border/40">
        <CardTitle className="text-lg font-bold tracking-tight">{title}</CardTitle>
        <Badge variant="secondary" className="font-semibold text-[10px] px-2 py-0.5 rounded-md">
          {appointments.length} itens
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        {appointments.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center p-6 text-center">
            <p className="text-sm font-medium text-muted-foreground opacity-60">Nenhum agendamento encontrado.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="group flex items-center justify-between p-4 h-[72px] transition-all duration-200 hover:bg-muted/30"
              >
                <div className="flex items-center gap-4 h-full">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary border border-primary/10 transition-colors group-hover:bg-primary group-hover:text-white">
                    <span className="text-[10px] font-bold">{formatTime(apt.startTime)}</span>
                  </div>
                  <div className="flex flex-col justify-center h-full">
                    <p className="text-sm font-semibold tracking-tight leading-tight transition-colors group-hover:text-primary">
                      {apt.clientName}
                    </p>
                    <p className="text-[11px] font-medium text-muted-foreground mt-0.5 leading-none">
                      {apt.serviceName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 h-full">
                  <Badge 
                    variant={statusVariant[apt.status.toLowerCase()] || "default"} 
                    className="font-bold px-2 py-0.5 rounded-md uppercase text-[8px] tracking-wider shrink-0"
                  >
                    {getStatusLabel(apt.status)}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors shrink-0" />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
