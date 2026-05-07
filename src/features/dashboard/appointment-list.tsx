"use client";

import { Badge, Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui";
import { formatTime, getStatusLabel, cn } from "@/utils";
import type { Appointment } from "@/types";
import { ChevronRight, MessageCircle, CheckCircle2, XCircle, Calendar } from "lucide-react";
import { useUpdateAppointmentStatus, useResendNotification } from "@/hooks";
import { useToast } from "@/components/ui";

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
  const updateStatus = useUpdateAppointmentStatus();
  const resendNotification = useResendNotification();
  const { showToast } = useToast();

  const handleResendNotification = (id: string) => {
    resendNotification.mutate(id, {
      onSuccess: () => showToast("Lembrete enviado via WhatsApp!", "success"),
      onError: () => showToast("Erro ao enviar WhatsApp", "error"),
    });
  };

  const handleStatusUpdate = (id: string, status: string) => {
    updateStatus.mutate({ id, status }, {
      onSuccess: () => showToast(`Status atualizado para ${getStatusLabel(status)}`, "success"),
    });
  };

  return (
    <Card className="h-full border border-border/40 bg-card/30 backdrop-blur-sm shadow-sm rounded-2xl overflow-hidden flex flex-col">
      <CardHeader className="p-6 pb-4 flex flex-row items-center justify-between border-b border-border/40 bg-muted/20">
        <div className="space-y-1">
          <CardTitle className="text-lg font-bold tracking-tight">{title}</CardTitle>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Gestão de Agenda</p>
        </div>
        <Badge variant="secondary" className="font-bold text-[10px] px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border-none">
          {appointments.length} atendimentos
        </Badge>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        {appointments.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <p className="text-sm font-bold text-foreground">Tudo limpo por aqui!</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-[180px]">Nenhum agendamento foi encontrado para este período.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="group flex items-center justify-between p-5 h-[84px] transition-all duration-300 hover:bg-primary/[0.02]"
              >
                <div className="flex items-center gap-5 h-full min-w-0">
                  <div className="flex flex-col items-center justify-center h-12 w-12 shrink-0 rounded-xl bg-background border border-border/60 shadow-sm transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-primary/5">
                    <span className="text-[11px] font-black text-primary uppercase tracking-tighter">{formatTime(apt.startTime)}</span>
                  </div>
                  <div className="flex flex-col justify-center h-full min-w-0 overflow-hidden">
                    <p className="text-sm font-bold tracking-tight leading-none group-hover:text-primary transition-colors truncate">
                      {apt.clientName}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest leading-none truncate">
                        {apt.serviceName}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 h-full">
                  <Badge 
                    variant={statusVariant[apt.status.toLowerCase()] || "default"} 
                    className="font-black px-2.5 py-1 rounded-full uppercase text-[9px] tracking-[0.1em] shrink-0 shadow-sm"
                  >
                    {getStatusLabel(apt.status)}
                  </Badge>
                  
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 rounded-xl border-border/40 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200"
                      onClick={() => handleResendNotification(apt.id)}
                      title="Reenviar WhatsApp"
                      disabled={resendNotification.isPending}
                    >
                      <MessageCircle className="h-5 w-5" />
                    </Button>
                    {apt.status === "scheduled" && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 rounded-xl border-border/40 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                          onClick={() => handleStatusUpdate(apt.id, "confirmed")}
                          title="Confirmar"
                        >
                          <CheckCircle2 className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 rounded-xl border-border/40 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                          onClick={() => handleStatusUpdate(apt.id, "cancelled")}
                          title="Cancelar"
                        >
                          <XCircle className="h-5 w-5" />
                        </Button>
                      </>
                    )}
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground/20 group-hover:text-primary transition-colors shrink-0" />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}