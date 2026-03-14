"use client";

import { useState } from "react";
import { PaymentTable } from "@/features/payments/payment-table";
import { usePayments, useGeneratePix, useMarkPaid } from "@/hooks";
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
  QrCode
} from "lucide-react";
import { formatCurrency, cn } from "@/utils";
import type { Payment } from "@/types";

export default function PagamentosPage() {
  const { data: payments = [], isLoading } = usePayments();
  const generatePix = useGeneratePix();
  const markPaid = useMarkPaid();
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
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Carregando pagamentos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Pagamentos</h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Acompanhe o histórico financeiro e cobranças
          </p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Receita Total</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(stats.total)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-emerald-500/5 border-emerald-500/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Total Pago</p>
                <p className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.paid)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-500/5 border-amber-500/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Aguardando</p>
                <p className="text-2xl font-bold text-amber-600">{formatCurrency(stats.pending)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-xl border border-border/50">
            {[
              { id: "all", label: "Todos" },
              { id: "paid", label: "Pagos" },
              { id: "pending", label: "Pendentes" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setFilter(t.id)}
                className={cn(
                  "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                  filter === t.id 
                    ? "bg-card text-foreground shadow-sm ring-1 ring-border" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden rounded-2xl">
          <PaymentTable
            payments={filteredPayments}
            onGeneratePix={handleGeneratePix}
            onMarkPaid={handleMarkPaid}
          />
        </Card>
      </div>

      {/* Pix Modal */}
      <Modal
        open={!!selectedPayment && !!selectedPayment.pixCode}
        onClose={() => setSelectedPayment(null)}
        title="Detalhes do Pagamento Pix"
      >
        {selectedPayment && (
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="p-6 bg-white rounded-3xl shadow-inner border-8 border-muted">
              <QrCode className="h-48 w-48 text-slate-900" />
            </div>
            
            <div className="space-y-2 w-full">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Valor a pagar</p>
              <p className="text-3xl font-extrabold text-primary">{formatCurrency(selectedPayment.amount)}</p>
            </div>

            <div className="w-full space-y-3">
              <p className="text-xs text-muted-foreground font-medium">
                Escaneie o QR Code acima ou copie o código abaixo para pagar via Pix.
              </p>
              <div className="flex gap-2">
                <div className="flex-1 bg-muted p-3 rounded-xl text-[10px] font-mono break-all text-left border border-border/50 max-h-20 overflow-y-auto">
                  {selectedPayment.pixCode}
                </div>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="shrink-0 h-12 w-12 rounded-xl"
                  onClick={copyPixCode}
                >
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <Button 
              className="w-full h-12 gap-2 text-base font-bold shadow-lg shadow-primary/20"
              onClick={() => handleMarkPaid(selectedPayment.id)}
            >
              <CheckCircle2 className="h-5 w-5" />
              Já recebi este valor
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
