"use client";

import { useDashboard } from "@/hooks";
import { DashboardCards } from "@/features/dashboard/dashboard-cards";
import { AppointmentList } from "@/features/dashboard/appointment-list";

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-gray-500">Erro ao carregar dados</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <DashboardCards
        todayRevenue={data.todayRevenue}
        todayAppointmentsCount={data.todayAppointments.length}
        upcomingCount={data.upcomingAppointments.length}
        noShowCount={data.noShowClients.length}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AppointmentList
          title="Atendimentos de hoje"
          appointments={data.todayAppointments}
        />
        <AppointmentList
          title="Próximos atendimentos"
          appointments={data.upcomingAppointments}
        />
      </div>
    </div>
  );
}
