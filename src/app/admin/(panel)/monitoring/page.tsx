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
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  const revenueGrowth = data?.revenueLastMonth > 0
    ? ((data.revenueThisMonth - data.revenueLastMonth) / data.revenueLastMonth) * 100
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Monitoramento</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Metricas e atividade da plataforma</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Total Negocios" value={data?.totalBusinesses ?? 0} icon={Building2} color="purple" />
        <MetricCard label="Total Usuarios" value={data?.totalUsers ?? 0} icon={Users} color="blue" />
        <MetricCard label="Agendamentos (mes)" value={data?.appointmentsThisMonth ?? 0} icon={Calendar} color="amber" />
        <MetricCard label="Receita (mes)" value={formatCurrency(data?.revenueThisMonth ?? 0)} icon={DollarSign} color="emerald" />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MiniCard label="Ativos" value={data?.activeBusinesses ?? 0} color="emerald" />
        <MiniCard label="Pendentes" value={data?.pendingBusinesses ?? 0} color="amber" />
        <MiniCard label="Suspensos" value={data?.suspendedBusinesses ?? 0} color="red" />
        <MiniCard label="Clientes" value={data?.totalClients ?? 0} color="indigo" />
      </div>

      {/* Revenue Chart (simple bar) */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Receita Mensal</h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-emerald-500 font-bold">
              <TrendingUp className="h-3 w-3" />
              {revenueGrowth >= 0 ? "+" : ""}{revenueGrowth.toFixed(1)}%
            </span>
            <span className="text-slate-400">vs mes anterior</span>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Este mes</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{formatCurrency(data?.revenueThisMonth ?? 0)}</span>
              </div>
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "100%" }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Mes anterior</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{formatCurrency(data?.revenueLastMonth ?? 0)}</span>
              </div>
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full" style={{ width: `${Math.min((data?.revenueLastMonth / Math.max(data?.revenueThisMonth, 1)) * 100, 100)}%` }} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{formatCurrency(data?.totalRevenue ?? 0)}</p>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Receita Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{data?.totalAppointments ?? 0}</p>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Agendamentos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{data?.newBusinessesThisMonth ?? 0}</p>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Novos Negocios (mes)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Distribution */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-4">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Distribuicao de Planos</h3>
        </div>
        <CardContent className="p-6">
          {data?.planDistribution && Object.entries(data.planDistribution).map(([plan, count]: [string, any]) => {
            const total = data.totalBusinesses || 1;
            const pct = (count as number / total) * 100;
            return (
              <div key={plan} className="mb-4 last:mb-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{plan}</span>
                  <span className="text-sm text-slate-500">{count as number} ({Math.round(pct)}%)</span>
                </div>
                <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={cn(
                    "h-full rounded-full transition-all duration-700",
                    plan === "PRO" ? "bg-emerald-500" : "bg-purple-500"
                  )} style={{ width: `${Math.max(pct, 2)}%` }} />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-4">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Atividade Recente na Plataforma</h3>
        </div>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {data?.recentActivity?.map((activity: any) => (
              <div key={activity.id} className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                  <Clock className="h-3.5 w-3.5 text-purple-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 dark:text-slate-300 truncate">{activity.description}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{formatDate(activity.date)}</p>
                </div>
              </div>
            ))}
            {(!data?.recentActivity || data.recentActivity.length === 0) && (
              <div className="px-6 py-8 text-center text-sm text-slate-400">Nenhuma atividade registrada.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: React.ElementType; color: "purple" | "blue" | "amber" | "emerald" }) {
  const colors = {
    purple: "bg-purple-500/10 text-purple-500",
    blue: "bg-blue-500/10 text-blue-500",
    amber: "bg-amber-500/10 text-amber-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
  };

  return (
    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl">
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center", colors[color])}>
            <Icon className="h-4 w-4" />
          </div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase">{label}</p>
        </div>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      </CardContent>
    </Card>
  );
}

function MiniCard({ label, value, color }: { label: string; value: number; color: "emerald" | "amber" | "red" | "indigo" }) {
  const colors = {
    emerald: "border-l-emerald-500",
    amber: "border-l-amber-500",
    red: "border-l-red-500",
    indigo: "border-l-indigo-500",
  };

  return (
    <Card className={cn("border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl border-l-[3px]", colors[color])}>
      <CardContent className="p-4">
        <p className="text-xl font-bold">{value}</p>
        <p className="text-[10px] font-medium text-slate-400 uppercase mt-0.5">{label}</p>
      </CardContent>
    </Card>
  );
}
