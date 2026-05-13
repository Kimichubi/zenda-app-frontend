"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin";
import { useToast, Card, CardContent, Badge } from "@/components/ui";
import {
  BarChart3, Loader2, Building2, Users, Calendar, DollarSign, TrendingUp, Clock,
} from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/utils";

export default function MonitoringPage() {
  const { showToast } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getMonitoring()
      .then(setData)
      .catch(() => showToast("Erro ao carregar dados", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const revenueGrowth = data?.revenueLastMonth > 0
    ? ((data.revenueThisMonth - data.revenueLastMonth) / data.revenueLastMonth) * 100
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Monitoramento</h1>
        <p className="text-sm text-muted-foreground mt-1">Metricas e atividade da plataforma</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Total Negocios" value={data?.totalBusinesses ?? 0} icon={Building2} color="zinc" />
        <MetricCard label="Total Usuarios" value={data?.totalUsers ?? 0} icon={Users} color="blue" />
        <MetricCard label="Agendamentos (mes)" value={data?.appointmentsThisMonth ?? 0} icon={Calendar} color="amber" />
        <MetricCard label="Receita (mes)" value={formatCurrency(data?.revenueThisMonth ?? 0)} icon={DollarSign} color="emerald" />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MiniCard label="Ativos" value={data?.activeBusinesses ?? 0} color="emerald" />
        <MiniCard label="Pendentes" value={data?.pendingBusinesses ?? 0} color="amber" />
        <MiniCard label="Suspensos" value={data?.suspendedBusinesses ?? 0} color="red" />
        <MiniCard label="Clientes" value={data?.totalClients ?? 0} color="zinc" />
      </div>

      {/* Revenue Chart */}
      <Card className="border-border/50 bg-card rounded-xl overflow-hidden">
        <div className="border-b border-border/40 px-6 py-4 flex items-center justify-between">
          <h3 className="text-sm font-bold">Receita Mensal</h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-emerald-500 font-bold">
              <TrendingUp className="h-3 w-3" />
              {revenueGrowth >= 0 ? "+" : ""}{revenueGrowth.toFixed(1)}%
            </span>
            <span className="text-muted-foreground">vs mes anterior</span>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Este mes</span>
                <span className="font-bold">{formatCurrency(data?.revenueThisMonth ?? 0)}</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "100%" }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Mes anterior</span>
                <span className="font-bold">{formatCurrency(data?.revenueLastMonth ?? 0)}</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-muted-foreground/40 rounded-full" style={{ width: `${Math.min((data?.revenueLastMonth / Math.max(data?.revenueThisMonth, 1)) * 100, 100)}%` }} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border/40">
            <div className="text-center">
              <p className="text-2xl font-bold">{formatCurrency(data?.totalRevenue ?? 0)}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-semibold">Receita Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{data?.totalAppointments ?? 0}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-semibold">Total Agendamentos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{data?.newBusinessesThisMonth ?? 0}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-semibold">Novos Negocios (mes)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Distribution */}
      <Card className="border-border/50 bg-card rounded-xl overflow-hidden">
        <div className="border-b border-border/40 px-6 py-4">
          <h3 className="text-sm font-bold">Distribuicao de Planos</h3>
        </div>
        <CardContent className="p-6">
          {data?.planDistribution && Object.entries(data.planDistribution).map(([plan, count]: [string, any]) => {
            const total = data.totalBusinesses || 1;
            const pct = (count as number / total) * 100;
            return (
              <div key={plan} className="mb-4 last:mb-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{plan}</span>
                  <span className="text-sm text-muted-foreground">{count as number} ({Math.round(pct)}%)</span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div className={cn(
                    "h-full rounded-full transition-all duration-700",
                    plan === "PRO" ? "bg-emerald-500" : "bg-foreground"
                  )} style={{ width: `${Math.max(pct, 2)}%` }} />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-border/50 bg-card rounded-xl overflow-hidden">
        <div className="border-b border-border/40 px-6 py-4">
          <h3 className="text-sm font-bold">Atividade Recente na Plataforma</h3>
        </div>
        <CardContent className="p-0">
          <div className="divide-y divide-border/40">
            {data?.recentActivity?.map((activity: any) => (
              <div key={activity.id} className="flex items-center gap-4 px-6 py-3 hover:bg-muted/30 transition-colors">
                <div className="h-8 w-8 rounded-lg bg-foreground/10 flex items-center justify-center shrink-0">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{activity.description}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{formatDate(activity.date)}</p>
                </div>
              </div>
            ))}
            {(!data?.recentActivity || data.recentActivity.length === 0) && (
              <div className="px-6 py-8 text-center text-sm text-muted-foreground">Nenhuma atividade registrada.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: React.ElementType; color: "zinc" | "blue" | "amber" | "emerald" }) {
  const colors = {
    zinc: "bg-foreground/10 text-foreground",
    blue: "bg-blue-500/10 text-blue-500",
    amber: "bg-amber-500/10 text-amber-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
  };

  return (
    <Card className="border-border/50 bg-card rounded-xl">
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center", colors[color])}>
            <Icon className="h-4 w-4" />
          </div>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase">{label}</p>
        </div>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function MiniCard({ label, value, color }: { label: string; value: number; color: "emerald" | "amber" | "red" | "zinc" }) {
  const colors = {
    emerald: "border-l-emerald-500",
    amber: "border-l-amber-500",
    red: "border-l-red-500",
    zinc: "border-l-muted-foreground",
  };

  return (
    <Card className={cn("border-border/50 bg-card rounded-xl border-l-[3px]", colors[color])}>
      <CardContent className="p-4">
        <p className="text-xl font-bold">{value}</p>
        <p className="text-[10px] font-medium text-muted-foreground uppercase mt-0.5">{label}</p>
      </CardContent>
    </Card>
  );
}
