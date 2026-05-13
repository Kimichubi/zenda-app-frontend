"use client";

import { useState } from "react";
import { useAdminFinance } from "@/hooks/use-admin";
import { Card, CardContent, Badge } from "@/components/ui";
import { Wallet, TrendingUp, TrendingDown, Calendar, DollarSign, ShoppingCart, Users, Building2, Loader2 } from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/utils";

export default function FinanceiroPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const { data: finance, isLoading } = useAdminFinance({ year, month });

  const months = [
    { value: 1, label: "Janeiro" }, { value: 2, label: "Fevereiro" }, { value: 3, label: "Marco" },
    { value: 4, label: "Abril" }, { value: 5, label: "Maio" }, { value: 6, label: "Junho" },
    { value: 7, label: "Julho" }, { value: 8, label: "Agosto" }, { value: 9, label: "Setembro" },
    { value: 10, label: "Outubro" }, { value: 11, label: "Novembro" }, { value: 12, label: "Dezembro" },
  ];

  const revenueChange = finance && finance.revenueLastMonth > 0
    ? ((finance.revenueThisMonth - finance.revenueLastMonth) / finance.revenueLastMonth) * 100
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Financeiro</h1>
          <p className="text-sm text-muted-foreground mt-1">Receita e metricas da plataforma</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="h-10 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="h-10 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {[now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              label="Receita do Mes"
              value={formatCurrency(finance?.revenueThisMonth ?? 0)}
              sub={
                <span className={cn("flex items-center gap-1 text-[11px] font-medium", revenueChange >= 0 ? "text-emerald-500" : "text-red-500")}>
                  {revenueChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(revenueChange).toFixed(1)}% vs mes anterior
                </span>
              }
              icon={DollarSign}
              color="emerald"
            />
            <MetricCard
              label="Receita Total"
              value={formatCurrency(finance?.totalRevenue ?? 0)}
              sub={`${finance?.paymentsCountThisMonth ?? 0} pagamentos este mes`}
              icon={Wallet}
              color="zinc"
            />
            <MetricCard
              label="Vendas (PDV)"
              value={formatCurrency(finance?.salesThisMonth ?? 0)}
              sub={`${finance?.salesCountThisMonth ?? 0} transacoes`}
              icon={ShoppingCart}
              color="amber"
            />
            <MetricCard
              label="Novos Clientes"
              value={finance?.newClientsThisMonth ?? 0}
              sub={`${finance?.newBusinessesThisMonth ?? 0} novos negocios`}
              icon={Users}
              color="blue"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border/50 bg-card rounded-xl overflow-hidden">
              <div className="border-b border-border/40 px-6 py-4">
                <h3 className="text-sm font-bold">Receita Diaria</h3>
              </div>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {(finance?.dailyRevenue ?? []).map((day: any) => (
                    <div key={day.date} className="flex items-center gap-4">
                      <span className="text-xs text-muted-foreground w-24">{formatDate(day.date)}</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${Math.min((day.amount / (finance?.revenueThisMonth || 1)) * 100 * 30, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium w-20 text-right">{formatCurrency(day.amount)}</span>
                    </div>
                  ))}
                  {(!finance?.dailyRevenue || finance.dailyRevenue.length === 0) && (
                    <p className="text-center text-muted-foreground py-8">Sem dados para este periodo.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card rounded-xl overflow-hidden">
              <div className="border-b border-border/40 px-6 py-4">
                <h3 className="text-sm font-bold">Resumo do Mes</h3>
              </div>
              <CardContent className="p-6 space-y-4">
                <SummaryRow label="Agendamentos" value={String(finance?.appointmentsThisMonth ?? 0)} icon={Calendar} />
                <SummaryRow label="Pagamentos" value={String(finance?.paymentsCountThisMonth ?? 0)} icon={DollarSign} />
                <SummaryRow label="Vendas PDV" value={String(finance?.salesCountThisMonth ?? 0)} icon={ShoppingCart} />
                <SummaryRow label="Novos Negocios" value={String(finance?.newBusinessesThisMonth ?? 0)} icon={Building2} />
                <div className="pt-4 border-t border-border/40">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Receita Total do Mes</span>
                    <span className="text-lg font-bold text-primary">{formatCurrency(finance?.revenueThisMonth ?? 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
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

function SummaryRow({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}
