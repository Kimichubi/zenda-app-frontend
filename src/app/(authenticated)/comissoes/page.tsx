"use client";

import { useCommissions } from "@/hooks";
import { Button, Card, CardContent, Badge, useToast } from "@/components/ui";
import { Loader2, TrendingUp, CheckCircle2, Clock, Wallet, Percent, Calendar } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils";

export default function ComissoesPage() {
  const { data: commissions = [], isLoading } = useCommissions();
  const { showToast } = useToast();

  const stats = {
    total: commissions.reduce((acc, c) => acc + c.amount, 0),
    paid: commissions.filter(c => c.status === "PAID").reduce((acc, c) => acc + c.amount, 0),
    pending: commissions.filter(c => c.status === "PENDING").reduce((acc, c) => acc + c.amount, 0),
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Calculando comissões...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="space-y-1">
        <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest text-primary/80">
          <Wallet className="h-3 w-3" />
          Financeiro Profissional
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Suas Comissões</h1>
        <p className="text-muted-foreground font-medium text-sm">
          Acompanhe seus ganhos por <span className="text-primary font-semibold">serviços e vendas</span>.
        </p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm rounded-2xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Acumulado</p>
              <p className="text-2xl font-black text-foreground">{formatCurrency(stats.total)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-emerald-500/5 backdrop-blur-sm rounded-2xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Pago</p>
              <p className="text-2xl font-black text-emerald-500">{formatCurrency(stats.paid)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-amber-500/5 backdrop-blur-sm rounded-2xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">A Receber</p>
              <p className="text-2xl font-black text-amber-500">{formatCurrency(stats.pending)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commissions List */}
      <div className="space-y-4">
        {commissions.length === 0 ? (
          <div className="py-20 text-center opacity-20">
            <Percent className="h-12 w-12 mx-auto mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest">Nenhuma comissão registrada</p>
          </div>
        ) : (
          commissions.map((commission) => (
            <Card key={commission.id} className="border border-border/40 bg-card/20 hover:border-primary/20 transition-all rounded-2xl overflow-hidden group">
              <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 flex-1">
                  <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    {commission.appointmentId ? <Calendar className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-black text-foreground">
                      {commission.appointment?.serviceName || "Venda de Produto"}
                    </p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      {commission.appointment?.clientName || "Consumidor Final"} • {formatDate(commission.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Taxa ({commission.percentage}%)</p>
                    <p className="text-lg font-black text-primary">{formatCurrency(commission.amount)}</p>
                  </div>
                  
                  <Badge className={cn(
                    "font-black text-[8px] uppercase tracking-widest px-3 py-1 rounded-full",
                    commission.status === "PAID" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  )}>
                    {commission.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

import { ShoppingCart } from "lucide-react";
