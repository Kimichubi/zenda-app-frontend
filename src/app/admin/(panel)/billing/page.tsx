"use client";

import { useAdminBillingStats, useAdminBillingSubscriptions } from "@/hooks/use-billing";
import { Card, CardContent, Badge } from "@/components/ui";
import { Loader2, DollarSign, CreditCard, Users, TrendingUp, AlertTriangle, Building2 } from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/utils";

const statusConfig: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Ativo", color: "text-emerald-500 bg-emerald-500/10" },
  TRIALING: { label: "Teste", color: "text-blue-500 bg-blue-500/10" },
  CANCELLED: { label: "Cancelado", color: "text-red-500 bg-red-500/10" },
  PAST_DUE: { label: "Vencido", color: "text-amber-500 bg-amber-500/10" },
  EXPIRED: { label: "Expirado", color: "text-muted-foreground bg-muted" },
};

export default function AdminBillingPage() {
  const { data: stats, isLoading: statsLoading } = useAdminBillingStats();
  const { data: subsResponse, isLoading: subsLoading } = useAdminBillingSubscriptions();

  if (statsLoading || subsLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const subscriptions = subsResponse?.data ?? [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-heading">Faturamento</h1>
        <p className="text-sm text-muted-foreground mt-1">Assinaturas e faturamento dos negocios</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Receita (mes)" value={formatCurrency(stats?.monthlyRevenue ?? 0)} sub="faturado este mes" icon={DollarSign} color="emerald" />
        <MetricCard label="Assinaturas Ativas" value={stats?.active ?? 0} sub={`de ${stats?.total ?? 0} total`} icon={CreditCard} color="blue" />
        <MetricCard label="Em Teste" value={stats?.trialing ?? 0} sub="periodo gratuito" icon={TrendingUp} color="amber" />
        <MetricCard label="Vencidas" value={stats?.pastDue ?? 0} sub="pagamento pendente" icon={AlertTriangle} color="red" />
      </div>

      <Card className="border-border/50 rounded-xl overflow-hidden">
        <div className="border-b border-border/40 px-6 py-4 flex items-center justify-between">
          <h3 className="text-sm font-bold">Assinaturas</h3>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-[10px]">Total: {subsResponse?.total ?? 0}</Badge>
          </div>
        </div>
        <CardContent className="p-0">
          {subscriptions.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-muted-foreground">
              Nenhuma assinatura encontrada.
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {subscriptions.map((sub) => {
                const cfg = statusConfig[sub.status] ?? { label: sub.status, color: "text-muted-foreground bg-muted" };
                const lastInvoice = sub.invoices?.[0];
                return (
                  <div key={sub.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Building2 className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{sub.business!.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {sub.plan?.name ?? "Sem plano"} · criada em {formatDate(sub.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      {lastInvoice && (
                        <div className="text-right hidden md:block">
                          <p className="text-xs font-medium">{formatCurrency(lastInvoice.amount)}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {lastInvoice.status === "PAID" ? `Pago em ${formatDate(lastInvoice.paidAt!)}` : `Vence ${formatDate(lastInvoice.dueDate)}`}
                          </p>
                        </div>
                      )}
                      <Badge className={cn("text-[10px] font-bold rounded-full px-2.5", cfg.color)}>
                        {cfg.label}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string | number; sub: string; icon: React.ElementType;
  color: "emerald" | "blue" | "amber" | "red";
}) {
  const colors = { emerald: "bg-emerald-500/10 text-emerald-500", blue: "bg-blue-500/10 text-blue-500", amber: "bg-amber-500/10 text-amber-500", red: "bg-red-500/10 text-red-500" };
  return (
    <Card className="border-border/50 rounded-xl">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
          <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center", colors[color])}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="mt-1 text-[11px] font-medium text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  );
}
