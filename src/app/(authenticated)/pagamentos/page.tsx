"use client";

import { useState, useCallback } from "react";
import { PaymentTable } from "@/features/payments/payment-table";
import { FilterBar } from "@/features/payments/filter-bar";
import { usePayments, useGeneratePix, useMarkPaid, useCancelPayment } from "@/hooks";
import { useToast, Card, CardContent, Button, Modal } from "@/components/ui";
import { 
  CreditCard, 
  Loader2, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2,
  Copy,
  Clock,
  Download,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { formatCurrency, cn } from "@/utils";
import type { Payment, PaymentFilters } from "@/types";
import { QRCodeSVG } from "qrcode.react";

export default function PagamentosPage() {
  const [filters, setFilters] = useState<PaymentFilters>({ page: 1, limit: 10, status: "all" });
  
  const { data, isLoading } = usePayments(filters);
  const generatePix = useGeneratePix();
  const markPaid = useMarkPaid();
  const cancelPayment = useCancelPayment();
  const { showToast } = useToast();
  
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const handleFilterChange = useCallback((newFilters: Partial<PaymentFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  }, []);

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

  const handleExport = () => {
    const token = localStorage.getItem("zenda_token");
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    window.open(`${baseUrl}/reports/payments/export?token=${token}`, "_blank");
  };

  const copyPixCode = () => {
    if (selectedPayment?.pixCode) {
      navigator.clipboard.writeText(selectedPayment.pixCode);
      showToast("Código Copia e Cola copiado!", "success");
    }
  };

  const payments = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / (filters.limit || 10));

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
          <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest text-primary/80">
            <DollarSign className="h-3 w-3" />
            Gestão Financeira
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Pagamentos</h1>
          <p className="text-muted-foreground font-medium text-sm">
            Acompanhe seu fluxo de caixa em <span className="text-primary font-semibold">tempo real</span>.
          </p>
        </div>

        <Button 
          variant="outline" 
          onClick={handleExport} 
          className="h-10 px-4 gap-2 rounded-lg text-xs font-black uppercase tracking-wider border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-none"
        >
          <Download className="h-4 w-4" />
          Exportar Planilha
        </Button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6 flex items-center justify-center !pt-6">
            <div className="flex items-center gap-4 w-full justify-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Receita Bruta</p>
                <p className="text-2xl font-bold tracking-tight text-foreground">{formatCurrency(stats.total)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6 flex items-center justify-center !pt-6">
            <div className="flex items-center gap-4 w-full justify-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Liquidez</p>
                <p className="text-2xl font-bold tracking-tight text-foreground">{formatCurrency(stats.paid)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6 flex items-center justify-center !pt-6">
            <div className="flex items-center gap-4 w-full justify-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <Clock className="h-6 w-6" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Pendentes</p>
                <p className="text-2xl font-bold tracking-tight text-foreground">{formatCurrency(stats.pending)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <FilterBar onFilterChange={handleFilterChange} />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-primary/5 border border-primary/10 p-1.5 rounded-2xl backdrop-blur-md">
            {[
              { id: "all", label: "Todos" },
              { id: "paid", label: "Pagos" },
              { id: "pending", label: "Pendentes" },
              { id: "failed", label: "Falhos" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => handleFilterChange({ status: t.id as any })}
                className={cn(
                  "px-5 py-2 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all duration-300",
                  filters.status === t.id 
                    ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.05]" 
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <Card className="border border-border/40 bg-card/20 backdrop-blur-sm shadow-sm rounded-3xl overflow-hidden">
          <PaymentTable
            payments={payments}
            onGeneratePix={handleGeneratePix}
            onMarkPaid={handleMarkPaid}
            onCancel={handleCancel}
          />
        </Card>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-2 pt-4">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Página <span className="text-primary">{filters.page}</span> de {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page! <= 1}
                onClick={() => handlePageChange(filters.page! - 1)}
                className="h-9 rounded-xl border-primary/10 bg-transparent text-primary hover:bg-primary/5"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page! >= totalPages}
                onClick={() => handlePageChange(filters.page! + 1)}
                className="h-9 rounded-xl border-primary/10 bg-transparent text-primary hover:bg-primary/5"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Modal
        open={!!selectedPayment && !!selectedPayment.pixCode}
        onClose={() => setSelectedPayment(null)}
        title="Checkout Pix"
        className="max-w-sm rounded-[3rem] border-primary/20"
      >
        {selectedPayment && (
          <div className="flex flex-col items-center text-center space-y-8 p-4">
            <div className="p-8 bg-white rounded-[2.5rem] shadow-2xl border-[12px] border-slate-50 group">
              <QRCodeSVG 
                value={selectedPayment.pixCode || ""} 
                size={200}
                level="H"
                className="group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Valor Total</p>
              <p className="text-4xl font-black tracking-tighter text-primary">{formatCurrency(selectedPayment.amount)}</p>
            </div>

            <div className="w-full space-y-4">
              <div className="flex gap-2 p-2 bg-primary/5 rounded-2xl border border-primary/10 backdrop-blur-md">
                <div className="flex-1 px-3 py-2 text-[10px] font-mono text-muted-foreground truncate">
                  {selectedPayment.pixCode}
                </div>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="shrink-0 h-10 w-10 rounded-xl hover:bg-primary/10 text-primary"
                  onClick={copyPixCode}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <Button 
                className="w-full h-14 gap-3 text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 rounded-2xl"
                onClick={() => handleMarkPaid(selectedPayment.id)}
              >
                <CheckCircle2 className="h-4 w-4" />
                Confirmar Recebimento
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
