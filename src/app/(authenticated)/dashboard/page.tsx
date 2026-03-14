"use client";

import { useDashboard } from "@/hooks";
import { DashboardCards } from "@/features/dashboard/dashboard-cards";
import { AppointmentList } from "@/features/dashboard/appointment-list";
import { Skeleton } from "@/components/ui/skeleton"; // I'll create this or just use a placeholder
import { AlertCircle, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Carregando seus dados...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div className="text-center space-y-1">
          <p className="font-bold text-lg">Ops! Algo deu errado.</p>
          <p className="text-sm text-muted-foreground">Não conseguimos carregar os dados do seu dashboard.</p>
        </div>
      </div>
    );
  }

  const {
    todayRevenue = 0,
    todayAppointments = [],
    upcomingAppointments = [],
    noShowClients = [],
  } = data as any;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Visão Geral</h1>
        <p className="text-muted-foreground font-medium mt-1">
          Bem-vindo de volta! Aqui está o resumo das suas atividades.
        </p>
      </header>

      <DashboardCards
        todayRevenue={todayRevenue}
        todayAppointmentsCount={todayAppointments.length}
        upcomingCount={upcomingAppointments.length}
        noShowCount={noShowClients.length}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <AppointmentList
            title="Atendimentos de hoje"
            appointments={data.todayAppointments}
          />
        </div>
        <div className="space-y-4">
          <AppointmentList
            title="Próximos atendimentos"
            appointments={data.upcomingAppointments}
          />
        </div>
      </div>
    </div>
  );
}
