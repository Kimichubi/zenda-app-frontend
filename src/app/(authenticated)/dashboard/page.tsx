"use client";

import { useDashboard } from "@/hooks";
import { DashboardCards } from "@/features/dashboard/dashboard-cards";
import { AppointmentList } from "@/features/dashboard/appointment-list";
import { AlertCircle, Loader2, Sparkles } from "lucide-react";
import type { DashboardData } from "@/types";

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-bold tracking-tight text-muted-foreground animate-pulse">Sincronizando dados...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive shadow-xl shadow-destructive/5">
          <AlertCircle className="h-8 w-8" />
        </div>
        <div className="text-center space-y-2">
          <p className="font-black text-2xl tracking-tighter uppercase italic">Erro de Conexão</p>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">Não conseguimos carregar suas métricas no momento. Tente atualizar a página.</p>
        </div>
      </div>
    );
  }

  const {
    todayRevenue = 0,
    todayAppointments = [],
    upcomingAppointments = [],
    noShowClients = [],
  } = data as DashboardData;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="flex items-end justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest">
            <Sparkles className="h-3 w-3 fill-primary" />
            Insights em Tempo Real
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Visão Geral</h1>
          <p className="text-muted-foreground font-medium text-sm">
            Sua performance de hoje está <span className="text-primary font-semibold">acima da média</span>.
          </p>
        </div>
      </header>

      <DashboardCards
        todayRevenue={todayRevenue}
        todayAppointmentsCount={todayAppointments.length}
        upcomingCount={upcomingAppointments.length}
        noShowCount={noShowClients.length}
      />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-start">
        <AppointmentList
          title="Hoje"
          appointments={data.todayAppointments}
        />
        <AppointmentList
          title="Próximos"
          appointments={data.upcomingAppointments}
        />
      </div>
    </div>
  );
}
