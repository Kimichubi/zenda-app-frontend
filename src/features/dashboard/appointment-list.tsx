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
    <Card className="h-full border-none bg-card/40 backdrop-blur-xl shadow-2xl shadow-black/5 rounded-[2.5rem] overflow-hidden">
      <CardHeader className="p-10 pb-4 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-black tracking-tighter uppercase italic">{title}</CardTitle>
          <div className="h-1 w-8 bg-primary rounded-full" />
        </div>
        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted px-3 py-1 rounded-full">
          {appointments.length} itens
        </span>
      </CardHeader>
      <CardContent className="p-10 pt-4">
        {appointments.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-border/50 bg-muted/20">
            <p className="text-sm font-bold text-muted-foreground italic uppercase tracking-widest opacity-40">Vazio</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="group flex items-center justify-between rounded-3xl border border-border/30 bg-card/50 p-5 transition-all duration-300 hover:bg-card hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
              >
                <div className="flex items-center gap-5">
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <span className="text-xs font-black uppercase">{formatTime(apt.startTime)}</span>
                  </div>
                  <div>
                    <p className="text-base font-black tracking-tight group-hover:text-primary transition-colors">
                      {apt.clientName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        {apt.serviceName}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge 
                    variant={statusVariant[apt.status.toLowerCase()] || "default"} 
                    className="font-black px-4 py-1.5 rounded-xl uppercase text-[9px] tracking-widest shadow-sm"
                  >
                    {getStatusLabel(apt.status)}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
