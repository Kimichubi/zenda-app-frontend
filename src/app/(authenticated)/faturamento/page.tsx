"use client";

import { useState } from "react";
import { useBusinessSubscription, useInvoices, useCreateCheckout, useBillingPlans, useChangePlan, useCancelSubscription } from "@/hooks/use-billing";
import { Card, CardContent, Badge, Button, useToast, Modal } from "@/components/ui";
import { Loader2, CreditCard, Receipt, Building2, Calendar, ArrowRight, CheckCircle2, XCircle, AlertCircle, Clock, Sparkles, ExternalLink, ChevronDown } from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/utils";
import { PageHeader } from "@/components/layout/page-header";
import type { BillingPlan } from "@/services/billing";

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  ACTIVE: { label: "Ativo", icon: CheckCircle2, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
  TRIALING: { label: "Periodo de Teste", icon: Clock, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
  CANCELLED: { label: "Cancelado", icon: XCircle, color: "text-red-500 bg-red-500/10 border-red-500/20" },
  PAST_DUE: { label: "Pagamento Pendente", icon: AlertCircle, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
  EXPIRED: { label: "Expirado", icon: XCircle, color: "text-muted-foreground bg-muted/30 border-border" },
};

const invoiceStatusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pendente", color: "text-amber-500 bg-amber-500/10" },
  PAID: { label: "Pago", color: "text-emerald-500 bg-emerald-500/10" },
  OVERDUE: { label: "Vencido", color: "text-red-500 bg-red-500/10" },
  CANCELLED: { label: "Cancelado", color: "text-muted-foreground bg-muted" },
  REFUNDED: { label: "Reembolsado", color: "text-blue-500 bg-blue-500/10" },
  FAILED: { label: "Falhou", color: "text-red-500 bg-red-500/10" },
};

export default function BillingPage() {
  const { data: subscription, isLoading: subLoading } = useBusinessSubscription();
  const { data: invoices, isLoading: invLoading } = useInvoices();
  const { data: plans } = useBillingPlans();
  const createCheckout = useCreateCheckout();
  const changePlan = useChangePlan();
  const cancelSub = useCancelSubscription();
  const { showToast } = useToast();

  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const isLoading = subLoading || invLoading;

  const handleUpgrade = (plan: BillingPlan) => {
    changePlan.mutate({ planId: plan.id }, {
      onSuccess: () => {
        showToast("Plano alterado com sucesso!", "success");
        setShowPlanModal(false);
      },
      onError: (err) => showToast(err instanceof Error ? err.message : "Erro ao alterar plano", "error"),
    });
  };

  const handleCheckout = () => {
    createCheckout.mutate(undefined, {
      onSuccess: (data) => {
        if (data.checkoutUrl) {
          window.open(data.checkoutUrl, "_blank");
        } else {
          showToast(data.message ?? "Fatura gerada", "success");
        }
      },
      onError: () => showToast("Erro ao gerar checkout", "error"),
    });
  };

  const handleCancel = () => {
    cancelSub.mutate(cancelReason || undefined, {
      onSuccess: () => {
        showToast("Assinatura cancelada", "success");
        setShowCancelModal(false);
      },
      onError: () => showToast("Erro ao cancelar", "error"),
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const status = subscription?.status ?? "TRIALING";
  const cfg = statusConfig[status] ?? statusConfig.TRIALING;
  const StatusIcon = cfg.icon;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Faturamento"
        description="Gerencie sua assinatura e acompanhe suas faturas"
      />

      {/* Plan Card */}
      <Card className="border-border/50 rounded-2xl overflow-hidden">
        <div className={cn(
          "h-2 w-full",
          status === "ACTIVE" ? "bg-emerald-500" :
          status === "TRIALING" ? "bg-blue-500" :
          status === "PAST_DUE" ? "bg-amber-500" :
          "bg-muted-foreground/30"
        )} />
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold">{subscription?.plan?.name ?? "Gratuito"}</p>
                    <Badge className={cn("rounded-full px-2.5 py-0.5 text-[10px] font-bold border", cfg.color)}>
                      <StatusIcon className="h-3 w-3 mr-1 inline" />
                      {cfg.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Plano atual</p>
                </div>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black">
                  {formatCurrency(subscription?.plan?.monthlyPrice ?? 0)}
                </span>
                <span className="text-sm text-muted-foreground">/mes</span>
              </div>

              {subscription?.trialEnd && new Date(subscription.trialEnd) > new Date() && (
                <span className="text-xs text-muted-foreground">
                  Periodo de teste termina em {formatDate(subscription.trialEnd)}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={handleCheckout} loading={createCheckout.isPending} className="gap-2 rounded-xl">
                <CreditCard className="h-4 w-4" />
                Gerar Pagamento
              </Button>
              <Button variant="outline" onClick={() => setShowPlanModal(true)} className="gap-2 rounded-xl">
                <Sparkles className="h-4 w-4" />
                Mudar de Plano
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border/40">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Inicio do Periodo</p>
              <p className="text-sm font-semibold mt-1">
                {subscription?.currentPeriodStart ? formatDate(subscription.currentPeriodStart) : "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Fim do Periodo</p>
              <p className="text-sm font-semibold mt-1">
                {subscription?.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Ultimo Pagamento</p>
              <p className="text-sm font-semibold mt-1">
                {subscription?.lastBillingAt ? formatDate(subscription.lastBillingAt) : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Proximo Pagamento</p>
              <p className="text-sm font-semibold mt-1">
                {subscription?.nextBillingAt ? formatDate(subscription.nextBillingAt) : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card className="border-border/50 rounded-2xl overflow-hidden">
        <div className="border-b border-border/40 px-6 py-4 flex items-center justify-between">
          <h3 className="text-sm font-bold">Faturas</h3>
          <Badge variant="outline" className="text-[10px]">
            {invoices?.length ?? 0} faturas
          </Badge>
        </div>
        <CardContent className="p-0">
          {(!invoices || invoices.length === 0) ? (
            <div className="px-6 py-12 text-center">
              <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-3">
                <Receipt className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">Nenhuma fatura encontrada</p>
              <p className="text-xs text-muted-foreground mt-1">Suas faturas aparecerao aqui.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {invoices.map((inv) => {
                const ic = invoiceStatusConfig[inv.status] ?? invoiceStatusConfig.PENDING;
                return (
                  <div key={inv.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "h-9 w-9 rounded-xl flex items-center justify-center shrink-0",
                        inv.status === "PAID" ? "bg-emerald-500/10" :
                        inv.status === "PENDING" ? "bg-amber-500/10" : "bg-muted"
                      )}>
                        <Receipt className={cn(
                          "h-4 w-4",
                          inv.status === "PAID" ? "text-emerald-500" :
                          inv.status === "PENDING" ? "text-amber-500" : "text-muted-foreground"
                        )} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{formatCurrency(inv.amount)}</p>
                        <p className="text-xs text-muted-foreground">
                          {inv.invoiceNumber} · Vencimento: {formatDate(inv.dueDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={cn("text-[10px] font-bold rounded-full px-2.5", ic.color)}>
                        {ic.label}
                      </Badge>
                      {inv.payments?.map((p) =>
                        p.pixCode && (
                          <Button key={p.id} variant="ghost" size="icon" className="h-7 w-7" title="Copiar PIX">
                            <CreditCard className="h-3 w-3" />
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan Selection Modal */}
      <Modal open={showPlanModal} onClose={() => setShowPlanModal(false)} title="Mudar de Plano" className="max-w-2xl">
        <div className="space-y-4">
          {plans?.filter((p) => p.isActive).map((plan) => {
            const isCurrent = plan.id === subscription?.planId;
            return (
              <div
                key={plan.id}
                className={cn(
                  "relative rounded-2xl border p-5 transition-all duration-200 cursor-pointer hover:border-primary/30",
                  isCurrent ? "border-primary/50 bg-primary/5" : "border-border/50 bg-card",
                )}
                onClick={() => !isCurrent && handleUpgrade(plan)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold">{plan.name}</p>
                      {isCurrent && (
                        <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20">
                          Plano Atual
                        </Badge>
                      )}
                    </div>
                    {plan.description && (
                      <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black">{formatCurrency(plan.monthlyPrice)}</p>
                    <p className="text-xs text-muted-foreground">/mes</p>
                  </div>
                </div>
                {plan.features && plan.features.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(plan.features as string[]).map((f, i) => (
                      <span key={i} className="text-xs bg-muted/50 px-2.5 py-1 rounded-full text-muted-foreground">
                        {f}
                      </span>
                    ))}
                  </div>
                )}
                {!isCurrent && (
                  <Button
                    className="mt-4 w-full rounded-xl"
                    onClick={() => handleUpgrade(plan)}
                    loading={changePlan.isPending}
                  >
                    {plan.monthlyPrice > (subscription?.plan?.monthlyPrice ?? 0)
                      ? "Fazer Upgrade"
                      : "Fazer Downgrade"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </Modal>

      {/* Cancel Modal */}
      <Modal open={showCancelModal} onClose={() => setShowCancelModal(false)} title="Cancelar Assinatura" className="max-w-md">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Tem certeza? Seu acesso continuara ate o final do periodo vigente.
          </p>
          <input
            type="text"
            placeholder="Motivo do cancelamento (opcional)"
            className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowCancelModal(false)}>
              Voltar
            </Button>
            <Button variant="danger" className="flex-1 rounded-xl" onClick={handleCancel} loading={cancelSub.isPending}>
              Confirmar Cancelamento
            </Button>
          </div>
        </div>
      </Modal>

      <div className="flex justify-center pt-4">
        <Button variant="ghost" className="text-xs text-muted-foreground hover:text-destructive" onClick={() => setShowCancelModal(true)}>
          Cancelar assinatura
        </Button>
      </div>
    </div>
  );
}
