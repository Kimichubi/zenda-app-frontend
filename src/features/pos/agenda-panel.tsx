"use client";

import { cn, formatCurrency } from "@/utils";
import { ScrollText, Clock, Circle, CheckCircle2, XCircle, AlertCircle, UserCircle2 } from "lucide-react";
import type { PosAppointment } from "@/services/pos";

interface AgendaPanelProps {
  appointments: PosAppointment[];
  onSelectAppointment: (appointment: PosAppointment) => void;
  selectedAppointmentId?: string;
  onQuickStatusChange: (id: string, status: string) => void;
  isLoading?: boolean;
  className?: string;
}

const statusConfig: Record<string, { icon: React.ComponentType<any>; label: string; color: string }> = {
  SCHEDULED: { icon: Circle, label: "Agendado", color: "text-blue-500 bg-blue-500/10" },
  CONFIRMED: { icon: CheckCircle2, label: "Confirmado", color: "text-green-500 bg-green-500/10" },
  COMPLETED: { icon: CheckCircle2, label: "Concluido", color: "text-emerald-500 bg-emerald-500/10" },
  CANCELLED: { icon: XCircle, label: "Cancelado", color: "text-rose-500 bg-rose-500/10" },
  NO_SHOW: { icon: AlertCircle, label: "Nao compareceu", color: "text-amber-500 bg-amber-500/10" },
};

export function AgendaPanel({ appointments, onSelectAppointment, selectedAppointmentId, onQuickStatusChange, isLoading, className }: AgendaPanelProps) {
  if (isLoading) {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex items-center gap-2">
          <ScrollText className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">Agenda Hoje</span>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted/30 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ScrollText className="h-4 w-4 text-primary" />
          <span className="text-xs font-black uppercase tracking-wider">Agenda Hoje</span>
        </div>
        <span className="text-[10px] font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
          {appointments.length}
        </span>
      </div>

      <div className="space-y-1.5 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
        {appointments.length === 0 ? (
          <div className="text-center py-8 opacity-40">
            <ScrollText className="h-8 w-8 mx-auto mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest">Sem agendamentos</p>
          </div>
        ) : (
          appointments.map((appt) => {
            const status = statusConfig[appt.status] || statusConfig.SCHEDULED;
            const StatusIcon = status.icon;
            const isActive = selectedAppointmentId === appt.id;

            return (
              <button
                key={appt.id}
                onClick={() => onSelectAppointment(appt)}
                className={cn(
                  "w-full p-3 rounded-xl border text-left transition-all duration-200 group",
                  isActive
                    ? "border-primary bg-primary/10 shadow-sm shadow-primary/5"
                    : "border-border/20 bg-card/50 hover:border-primary/20 hover:bg-card"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", status.color)}>
                    <StatusIcon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate">{appt.client.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {appt.startTime}
                      </span>
                      {appt.service && (
                        <span className="text-[10px] text-primary/70 font-medium truncate">{appt.service.name}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {appt.status === "SCHEDULED" && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onQuickStatusChange(appt.id, "CONFIRMED"); }}
                        className="p-1.5 hover:bg-green-500/10 rounded-lg transition-colors text-green-500"
                        title="Confirmar"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {appt.status === "CONFIRMED" && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onQuickStatusChange(appt.id, "COMPLETED"); }}
                        className="p-1.5 hover:bg-emerald-500/10 rounded-lg transition-colors text-emerald-500"
                        title="Concluir"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
