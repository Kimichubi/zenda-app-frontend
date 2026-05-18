"use client";

import { useSubscriptions, useUpdateSubscription, useSubscriptionDashboard } from "@/hooks/use-membership";
import { useMembershipPlans } from "@/hooks/use-membership";
import { Button, Card, CardContent, Badge, useToast } from "@/components/ui";
import { formatCurrency, formatDate } from "@/utils";
import { useState } from "react";
import { Users, Loader2, CreditCard, Clock, AlertTriangle, CheckCircle2, XCircle, PauseCircle } from "lucide-react";
import { cn } from "@/utils";

const statusConfig: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  ACTIVE: { label: "Ativo", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", icon: CheckCircle2 },
  TRIALING: { label: "Teste", className: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: Clock },
  PAUSED: { label: "Pausado", className: "bg-amber-500/10 text-amber-500 border-amber-500/20", icon: PauseCircle },
  PAST_DUE: { label: "Inadimplente", className: "bg-red-500/10 text-red-500 border-red-500/20", icon: AlertTriangle },
  CANCELLED: { label: "Cancelado", className: "bg-muted text-muted-foreground", icon: XCircle },
  EXPIRED: { label: "Expirado", className: "bg-muted text-muted-foreground border-muted-foreground/20", icon: XCircle },
};

export default function SubscriptionsPage() {
  const { data: subscriptions, isLoading } = useSubscriptions();
  const { data: dashboard } = useSubscriptionDashboard();
  const { data: plans } = useMembershipPlans();
  const updateSubscription = useUpdateSubscription();
  const { showToast } = useToast();
  const [filterByPlan, setFilterByPlan] = useState<string>("");
  const [filterByStatus, setFilterByStatus] = useState<string>("");

  const filteredSubscriptions = subscriptions?.filter((s) => {
    if (filterByPlan && s.planId !== filterByPlan) return false;
    if (filterByStatus && s.status !== filterByStatus) return false;
    return true;
  });

  const handleStatusChange = (subscriptionId: string, status: string) => {
    updateSubscription.mutate(
      { id: subscriptionId, data: { status } },
      {
        onSuccess: () => showToast("Assinatura atualizada!", "success"),
        onError: () => showToast("Erro ao atualizar assinatura.", "error"),
      },
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Membros</h1>
        <p className="text-muted-foreground font-medium mt-1">
          Gerencie as assinaturas ativas dos seus clientes.
        </p>
      </div>

      {/* Dashboard Stats */}
      {dashboard && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <StatCard label="Ativos" value={dashboard.active} icon={Users} accent="emerald" />
          <StatCard label="Teste" value={dashboard.trialing} icon={Clock} accent="blue" />
          <StatCard label="Inadimplentes" value={dashboard.pastDue} icon={AlertTriangle} accent="red" />
          <StatCard label="Renovacoes no Mes" value={dashboard.renewalsThisMonth} icon={CreditCard} accent="primary" />
          <StatCard label="Cancelados" value={dashboard.cancelled} icon={XCircle} accent="muted" />
          <StatCard label="Faturamento" value={formatCurrency(dashboard.monthlyRevenue)} icon={CreditCard} accent="primary" />
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3">
        <select
          value={filterByStatus}
          onChange={(e) => setFilterByStatus(e.target.value)}
          className="h-9 rounded-lg border border-border bg-background px-3 text-xs font-bold"
        >
          <option value="">Todos os Status</option>
          <option value="ACTIVE">Ativo</option>
          <option value="TRIALING">Teste</option>
          <option value="PAUSED">Pausado</option>
          <option value="PAST_DUE">Inadimplente</option>
          <option value="CANCELLED">Cancelado</option>
          <option value="EXPIRED">Expirado</option>
        </select>

        <select
          value={filterByPlan}
          onChange={(e) => setFilterByPlan(e.target.value)}
          className="h-9 rounded-lg border border-border bg-background px-3 text-xs font-bold"
        >
          <option value="">Todos os Planos</option>
          {plans?.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Subscriptions List */}
      {isLoading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !filteredSubscriptions || filteredSubscriptions.length === 0 ? (
        <Card className="border-border/50 rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-1">Nenhuma assinatura encontrada</h3>
            <p className="text-sm text-muted-foreground">
              {subscriptions?.length === 0
                ? "Nenhum cliente possui assinatura ativa no momento."
                : "Nenhuma assinatura corresponde aos filtros selecionados."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredSubscriptions.map((sub) => {
            const status = statusConfig[sub.status] || statusConfig.CANCELLED;
            const StatusIcon = status.icon;
            return (
              <Card key={sub.id} className="border-border/50 rounded-xl hover:border-border/80 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                        {sub.client.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold truncate">{sub.client.name}</p>
                        <p className="text-xs text-muted-foreground">{sub.client.phone}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {sub.plan.name} - {formatCurrency(sub.plan.monthlyPrice)}/mes
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge variant="outline" className={cn("text-[10px] font-bold gap-1", status.className)}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {sub.status === "ACTIVE" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-[10px] font-bold text-amber-500"
                              onClick={() => handleStatusChange(sub.id, "PAUSED")}
                            >
                              Pausar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-[10px] font-bold text-red-500"
                              onClick={() => handleStatusChange(sub.id, "CANCELLED")}
                            >
                              Cancelar
                            </Button>
                          </>
                        )}
                        {sub.status === "PAUSED" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-[10px] font-bold text-emerald-500"
                            onClick={() => handleStatusChange(sub.id, "ACTIVE")}
                          >
                            Reativar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-[10px] text-muted-foreground">
                    <span>Inicio: {formatDate(sub.startDate)}</span>
                    <span>Prox. cobranca: {formatDate(sub.nextBillingAt)}</span>
                    {sub.usageLimit && <span>Uso: {sub.usageCount}/{sub.usageLimit}</span>}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, accent }: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent: string;
}) {
  const accentColors: Record<string, string> = {
    emerald: "bg-emerald-500/10 text-emerald-500",
    blue: "bg-blue-500/10 text-blue-500",
    red: "bg-red-500/10 text-red-500",
    primary: "bg-primary/10 text-primary",
    muted: "bg-muted text-muted-foreground",
  };

  return (
    <Card className="border-border/50 rounded-xl">
      <CardContent className="p-4 flex items-center gap-3">
        <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center", accentColors[accent])}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-lg font-bold truncate">{value}</p>
          <p className="text-[10px] text-muted-foreground font-medium uppercase truncate">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
