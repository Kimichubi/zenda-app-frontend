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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.4em]">
            <DollarSign className="h-3 w-3" />
            Financial Overview
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic">Pagamentos</h1>
          <p className="text-muted-foreground font-medium text-lg">
            Acompanhe seu fluxo de caixa em <span className="text-foreground font-bold italic underline decoration-primary decoration-2 underline-offset-4">tempo real</span>.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        <Card className="border-none bg-primary/5 dark:bg-primary/10 rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/5">
          <CardContent className="p-8">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="p-4 bg-primary text-white rounded-2xl shadow-lg shadow-primary/30">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                  Total <ArrowUpRight className="h-3 w-3" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Receita Bruta</p>
                <p className="text-3xl font-black tracking-tighter text-primary">{formatCurrency(stats.total)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none bg-emerald-500/5 dark:bg-emerald-500/10 rounded-[2rem] overflow-hidden shadow-2xl shadow-emerald-500/5">
          <CardContent className="p-8">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">
                  Recebido
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Liquidez Confirmada</p>
                <p className="text-3xl font-black tracking-tighter text-emerald-600">{formatCurrency(stats.paid)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-amber-500/5 dark:bg-amber-500/10 rounded-[2rem] overflow-hidden shadow-2xl shadow-amber-500/5">
          <CardContent className="p-8">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="p-4 bg-amber-500 text-white rounded-2xl shadow-lg shadow-amber-500/30">
                  <Clock className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full">
                  Pendente
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Contas a Receber</p>
                <p className="text-3xl font-black tracking-tighter text-amber-600">{formatCurrency(stats.pending)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-muted/50 border border-border/50 p-1.5 rounded-[1.25rem] shadow-inner">
            {[
              { id: "all", label: "Todos" },
              { id: "paid", label: "Pagos" },
              { id: "pending", label: "Pendentes" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setFilter(t.id)}
                className={cn(
                  "px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300",
                  filter === t.id 
                    ? "bg-background text-foreground shadow-md ring-1 ring-border/50" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <Card className="border-none bg-card/40 backdrop-blur-xl shadow-2xl shadow-black/5 overflow-hidden rounded-[2.5rem]">
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
