"use client";

import { useBusinessSubscription, useInvoices, useGenerateInvoice } from "@/hooks/use-billing";
import { Card, CardContent, Badge, Button, useToast } from "@/components/ui";
import { Loader2, CreditCard, Download, Receipt, Building2, Calendar, ArrowRight, CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/utils";
import { PageHeader } from "@/components/layout/page-header";

const planLabels: Record<string, string> = {
  PRO: "Profissional",
  ENTERPRISE: "Enterprise",
};

const planPrices: Record<string, number> = {
  PRO: 49.90,
  ENTERPRISE: 149.90,
};

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
  const generateInvoice = useGenerateInvoice();
  const { showToast } = useToast();

  const isLoading = subLoading || invLoading;

  const handleGenerateInvoice = () => {
    generateInvoice.mutate(undefined, {
      onSuccess: () => showToast("Fatura gerada com sucesso!", "success"),
      onError: () => showToast("Erro ao gerar fatura.", "error"),
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const status = subscription?.status ?? "ACTIVE";
  const cfg = statusConfig[status] ?? statusConfig.ACTIVE;
  const StatusIcon = cfg.icon;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Faturamento"
        description="Gerencie sua assinatura e historico de pagamentos"
        className="animate-fade-in-up"
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
                  <p className="text-lg font-bold">{planLabels[subscription?.plan ?? "PRO"]}</p>
                  <p className="text-sm text-muted-foreground">Plano atual</p>
                </div>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black">{formatCurrency(planPrices[subscription?.plan ?? "PRO"])}</span>
                <span className="text-sm text-muted-foreground">/mes</span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Badge className={cn("rounded-full px-3 py-1 text-xs font-bold border", cfg.color)}>
                  <StatusIcon className="h-3 w-3 mr-1 inline" />
                  {cfg.label}
                </Badge>
                {subscription?.trialEndsAt && new Date(subscription.trialEndsAt) > new Date() && (
                  <span className="text-xs text-muted-foreground">
                    Periodo de teste termina em {formatDate(subscription.trialEndsAt)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={handleGenerateInvoice} loading={generateInvoice.isPending} className="gap-2">
                <Receipt className="h-4 w-4" />
                Gerar Fatura
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
          <h3 className="text-sm font-bold">Historico de Faturamento</h3>
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
              <p className="text-xs text-muted-foreground mt-1">As faturas geradas aparecerao aqui.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {invoices.map((invoice) => {
                const invCfg = invoiceStatusConfig[invoice.status] ?? invoiceStatusConfig.PENDING;
                return (
                  <div key={invoice.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "h-9 w-9 rounded-xl flex items-center justify-center shrink-0",
                        invoice.status === "PAID" ? "bg-emerald-500/10" :
                        invoice.status === "PENDING" ? "bg-amber-500/10" :
                        "bg-muted"
                      )}>
                        <Receipt className={cn(
                          "h-4 w-4",
                          invoice.status === "PAID" ? "text-emerald-500" :
                          invoice.status === "PENDING" ? "text-amber-500" :
                          "text-muted-foreground"
                        )} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{formatCurrency(invoice.amount)}</p>
                        <p className="text-xs text-muted-foreground">
                          Vencimento: {formatDate(invoice.dueDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={cn("text-[10px] font-bold rounded-full px-2.5", invCfg.color)}>
                        {invCfg.label}
                      </Badge>
                      {invoice.paidAt && (
                        <span className="text-[10px] text-muted-foreground hidden md:block">
                          Pago em {formatDate(invoice.paidAt)}
                        </span>
                      )}
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
