"use client";

import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { formatTime, getStatusLabel, cn } from "@/utils";
import type { Appointment } from "@/types";
import { Clock, User } from "lucide-react";

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
    <Card className="h-full border-border/50 bg-card/30 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold tracking-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted bg-muted/20">
            <p className="text-sm font-medium text-muted-foreground italic">Nenhum atendimento registrado</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="group flex items-center justify-between rounded-xl border border-border/50 bg-card p-4 transition-all hover:bg-accent/50 hover:border-primary/20 hover:shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                    <Clock className="h-3 w-3 opacity-60 mb-0.5" />
                    <span className="text-sm font-bold">{formatTime(apt.startTime)}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold group-hover:text-primary transition-colors">
                        {apt.clientName}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-xs font-medium text-muted-foreground">
                      <div className="w-1 h-1 rounded-full bg-primary/40" />
                      {apt.serviceName}
                    </div>
                  </div>
                </div>
                <Badge 
                  variant={statusVariant[apt.status.toLowerCase()] || "default"} 
                  className="font-bold px-2.5 py-0.5"
                >
                  {getStatusLabel(apt.status)}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
