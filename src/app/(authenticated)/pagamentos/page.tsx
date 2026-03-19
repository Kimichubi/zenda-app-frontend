"use client";

import { useState } from "react";
import { PaymentTable } from "@/features/payments/payment-table";
import { usePayments, useGeneratePix, useMarkPaid, useCancelPayment } from "@/hooks";
import { useToast, Card, CardContent, Button, Modal } from "@/components/ui";
import { 
  CreditCard, 
  Loader2, 
  DollarSign, 
  Search, 
  Filter, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2,
  Copy,
  ArrowUpRight,
  Clock
} from "lucide-react";
import { formatCurrency, cn } from "@/utils";
import type { Payment } from "@/types";
import { QRCodeSVG } from "qrcode.react";

export default function PagamentosPage() {
  const { data: payments = [], isLoading } = usePayments();
  const generatePix = useGeneratePix();
  const markPaid = useMarkPaid();
  const cancelPayment = useCancelPayment();
  const { showToast } = useToast();
  
  const [filter, setFilter] = useState<string>("all");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const handleGeneratePix = (appointmentId: string) => {
    generatePix.mutate(appointmentId, {
      onSuccess: (newPayment) => {
        showToast("Pix gerado com sucesso!", "success");
        setSelectedPayment(newPayment);
      },
      onError: () => showToast("Erro ao gerar Pix", "error"),
    });
  };

  const handleMarkPaid = (paymentId: string) => {
    markPaid.mutate(paymentId, {
      onSuccess: () => {
        showToast("Pagamento confirmado!", "success");
        if (selectedPayment?.id === paymentId) setSelectedPayment(null);
      },
      onError: () => showToast("Erro ao confirmar pagamento", "error"),
    });
  };

  const handleCancel = (paymentId: string) => {
    if (confirm("Deseja cancelar esta cobrança?")) {
      cancelPayment.mutate(paymentId, {
        onSuccess: () => showToast("Cobrança cancelada", "info"),
        onError: () => showToast("Erro ao cancelar", "error"),
      });
    }
  };

  const copyPixCode = () => {
    if (selectedPayment?.pixCode) {
      navigator.clipboard.writeText(selectedPayment.pixCode);
      showToast("Código Copia e Cola copiado!", "success");
    }
  };

  const filteredPayments = payments.filter(p => 
    filter === "all" ? true : p.status.toLowerCase() === filter
  );

  const stats = {
    total: payments.reduce((acc, p) => acc + p.amount, 0),
    paid: payments.filter(p => p.status.toLowerCase() === "paid").reduce((acc, p) => acc + p.amount, 0),
    pending: payments.filter(p => p.status.toLowerCase() === "pending").reduce((acc, p) => acc + p.amount, 0),
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-bold tracking-tight text-muted-foreground animate-pulse">Sincronizando financeiro...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest">
            <DollarSign className="h-3 w-3" />
            Gestão Financeira
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Pagamentos</h1>
          <p className="text-muted-foreground font-medium text-sm">
            Acompanhe seu fluxo de caixa em <span className="text-primary font-semibold">tempo real</span>.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="border border-border/50 bg-card shadow-sm rounded-xl overflow-hidden">
          <CardContent className="p-6 flex items-center justify-center !pt-6">
            <div className="flex items-center gap-4 w-full justify-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Receita Bruta</p>
                <p className="text-2xl font-bold tracking-tight text-foreground">{formatCurrency(stats.total)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-border/50 bg-card shadow-sm rounded-xl overflow-hidden">
          <CardContent className="p-6 flex items-center justify-center !pt-6">
            <div className="flex items-center gap-4 w-full justify-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Liquidez Confirmada</p>
                <p className="text-2xl font-bold tracking-tight text-foreground">{formatCurrency(stats.paid)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-card shadow-sm rounded-xl overflow-hidden">
          <CardContent className="p-6 flex items-center justify-center !pt-6">
            <div className="flex items-center gap-4 w-full justify-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20">
                <Clock className="h-6 w-6" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Contas a Receber</p>
                <p className="text-2xl font-bold tracking-tight text-foreground">{formatCurrency(stats.pending)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-muted/40 border border-border/40 p-1 rounded-lg">
            {[
              { id: "all", label: "Todos" },
              { id: "paid", label: "Pagos" },
              { id: "pending", label: "Pendentes" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setFilter(t.id)}
                className={cn(
                  "px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all duration-200",
                  filter === t.id 
                    ? "bg-background text-foreground shadow-sm border border-border/50" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <Card className="border border-border/50 bg-card shadow-sm rounded-xl overflow-hidden">
          <PaymentTable
            payments={filteredPayments}
            onGeneratePix={handleGeneratePix}
            onMarkPaid={handleMarkPaid}
            onCancel={handleCancel}
          />
        </Card>
      </div>

      <Modal
        open={!!selectedPayment && !!selectedPayment.pixCode}
        onClose={() => setSelectedPayment(null)}
        title="Checkout Pix"
        className="max-w-sm rounded-[3rem]"
      >
        {selectedPayment && (
          <div className="flex flex-col items-center text-center space-y-8 p-4">
            <div className="p-8 bg-white rounded-[2.5rem] shadow-inner border-[12px] border-muted group transition-all duration-500">
              <QRCodeSVG 
                value={selectedPayment.pixCode || ""} 
                size={200}
                level="H"
                includeMargin={false}
                className="group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Valor Final</p>
              <p className="text-4xl font-black tracking-tighter text-primary">{formatCurrency(selectedPayment.amount)}</p>
            </div>

            <div className="w-full space-y-4">
              <div className="flex gap-2 p-2 bg-muted/50 rounded-2xl border border-border/50">
                <div className="flex-1 px-3 py-2 text-[10px] font-mono text-muted-foreground line-clamp-1 overflow-hidden">
                  {selectedPayment.pixCode}
                </div>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="shrink-0 h-10 w-10 rounded-xl hover:bg-background"
                  onClick={copyPixCode}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <Button 
                className="w-full h-14 gap-3 text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 rounded-2xl"
                onClick={() => handleMarkPaid(selectedPayment.id)}
              >
                <CheckCircle2 className="h-5 w-5" />
                Confirmar Recebimento
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
