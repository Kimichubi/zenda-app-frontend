"use client";

import { useEffect, useState } from "react";
import { useAdminStats, useAdminMonitoring } from "@/hooks/use-admin";
import { Card, CardContent, Badge } from "@/components/ui";
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  UserPlus,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/utils";

export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: monitoring, isLoading: monitoringLoading } = useAdminMonitoring();

  if (statsLoading || monitoringLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const revenueChange = monitoring && monitoring.revenueLastMonth > 0
    ? ((monitoring.revenueThisMonth - monitoring.revenueLastMonth) / monitoring.revenueLastMonth) * 100
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Visao geral da plataforma</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Negocios Ativos"
          value={monitoring?.activeBusinesses ?? 0}
          sub={`de ${monitoring?.totalBusinesses ?? 0} total`}
          icon={Building2}
          color="zinc"
        />
        <MetricCard
          label="Receita (mes)"
          value={formatCurrency(monitoring?.revenueThisMonth ?? 0)}
          sub={
            <span className={cn("flex items-center gap-1", revenueChange >= 0 ? "text-emerald-500" : "text-red-500")}>
              {revenueChange >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(revenueChange).toFixed(1)}% vs mes anterior
            </span>
          }
          icon={DollarSign}
          color="emerald"
        />
        <MetricCard
          label="Agendamentos (mes)"
          value={monitoring?.appointmentsThisMonth ?? 0}
          sub={`${monitoring?.totalAppointments ?? 0} total`}
          icon={Calendar}
          color="amber"
        />
        <MetricCard
          label="Total Usuarios"
          value={monitoring?.totalUsers ?? 0}
          sub={`${monitoring?.usersWithBusiness ?? 0} com negocio`}
          icon={Users}
          color="blue"
        />
      </div>

      {/* Plan Distribution + Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50 bg-card rounded-xl overflow-hidden">
          <div className="border-b border-border/40 px-6 py-4">
            <h3 className="text-sm font-bold">Distribuicao de Planos</h3>
          </div>
          <CardContent className="p-6 space-y-4">
            {monitoring?.planDistribution && Object.entries(monitoring.planDistribution).map(([plan, count]) => {
              const c = count as number;
              const pct = monitoring.totalBusinesses > 0 ? (c / monitoring.totalBusinesses) * 100 : 0;
              return (
                <div key={plan} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{plan}</span>
                    <span className="text-muted-foreground">{c} ({Math.round(pct)}%)</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        plan === "PRO" ? "bg-emerald-500" : "bg-foreground",
                      )}
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card rounded-xl overflow-hidden">
          <div className="border-b border-border/40 px-6 py-4">
            <h3 className="text-sm font-bold">Status dos Negocios</h3>
          </div>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4">
              <StatusCard label="Ativos" value={monitoring?.activeBusinesses ?? 0} color="emerald" />
              <StatusCard label="Pendentes" value={monitoring?.pendingBusinesses ?? 0} color="amber" />
              <StatusCard label="Suspensos" value={monitoring?.suspendedBusinesses ?? 0} color="red" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-border/50 bg-card rounded-xl overflow-hidden">
        <div className="border-b border-border/40 px-6 py-4 flex items-center justify-between">
          <h3 className="text-sm font-bold">Atividade Recente</h3>
          <Badge variant="outline" className="text-[10px] text-muted-foreground">Ultimos 10 agendamentos</Badge>
        </div>
        <CardContent className="p-0">
          <div className="divide-y divide-border/40">
            {monitoring?.recentActivity?.map((activity: any) => (
              <div key={activity.id} className="flex items-center gap-4 px-6 py-3 hover:bg-muted/30 transition-colors">
                <div className="h-8 w-8 rounded-lg bg-foreground/10 flex items-center justify-center shrink-0">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{activity.description}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{formatDate(activity.date)}</p>
                </div>
              </div>
            ))}
            {(!monitoring?.recentActivity || monitoring.recentActivity.length === 0) && (
              <div className="px-6 py-8 text-center text-sm text-muted-foreground">Nenhuma atividade recente.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ label, value, sub, icon: Icon, color }: {
  label: string;
  value: string | number;
  sub: string | React.ReactNode;
  icon: React.ElementType;
  color: "zinc" | "emerald" | "amber" | "blue";
}) {
  const colors = {
    zinc: "bg-foreground/10 text-foreground",
    emerald: "bg-emerald-500/10 text-emerald-500",
    amber: "bg-amber-500/10 text-amber-500",
    blue: "bg-blue-500/10 text-blue-500",
  };

  return (
    <Card className="border-border/50 bg-card rounded-xl">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
          <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center", colors[color])}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <p className="text-2xl font-bold">{value}</p>
        <div className="mt-1 text-[11px] font-medium text-muted-foreground">{sub}</div>
      </CardContent>
    </Card>
  );
}

function StatusCard({ label, value, color }: { label: string; value: number; color: "emerald" | "amber" | "red" }) {
  const colors = {
    emerald: "border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/5 text-emerald-700 dark:text-emerald-400",
    amber: "border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/5 text-amber-700 dark:text-amber-400",
    red: "border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5 text-red-700 dark:text-red-400",
  };

  return (
    <div className={cn("rounded-xl border p-4 text-center", colors[color])}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-[11px] font-medium mt-1">{label}</p>
    </div>
  );
}
