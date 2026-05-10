"use client";

import { formatCurrency, cn } from "@/utils";
import { DollarSign, TrendingUp, ShoppingBag, CreditCard, Banknote, QrCode, Loader2 } from "lucide-react";
import type { PosDailySummary } from "@/services/pos";

interface DailySummaryProps {
  summary?: PosDailySummary;
  isLoading?: boolean;
  className?: string;
}

const methodIcons: Record<string, React.ComponentType<any>> = {
  DINHEIRO: Banknote,
  CARTAO: CreditCard,
  PIX: QrCode,
};

export function DailySummary({ summary, isLoading, className }: DailySummaryProps) {
  if (isLoading) {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">Resumo do Dia</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-muted/30 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-primary" />
          <span className="text-xs font-black uppercase tracking-wider">Resumo do Dia</span>
        </div>
        <span className="text-[10px] font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
          {summary.date}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
          <p className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Receita</p>
          <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(summary.totalRevenue)}</p>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
          <p className="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">Pendente</p>
          <p className="text-lg font-black text-amber-600 dark:text-amber-400">{formatCurrency(summary.totalPending)}</p>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
          <p className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Atendimentos</p>
          <p className="text-lg font-black text-blue-600 dark:text-blue-400">{summary.appointments.total}</p>
        </div>

        <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-3">
          <p className="text-[9px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-1">Produtos</p>
          <p className="text-lg font-black text-violet-600 dark:text-violet-400">{formatCurrency(summary.totalProductsSales)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span className="text-[9px] font-bold bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">
          {summary.appointments.completed} concluidos
        </span>
        <span className="text-[9px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
          {summary.appointments.confirmed} confirmados
        </span>
        <span className="text-[9px] font-bold bg-slate-500/10 text-slate-500 px-2 py-0.5 rounded-full">
          {summary.appointments.scheduled} agendados
        </span>
        {summary.appointments.cancelled > 0 && (
          <span className="text-[9px] font-bold bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-full">
            {summary.appointments.cancelled} cancelados
          </span>
        )}
      </div>

      {summary.salesByMethod.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">Por metodo</span>
          <div className="flex flex-wrap gap-2">
            {summary.salesByMethod.map((m) => {
              const Icon = methodIcons[m.method] || CreditCard;
              return (
                <div key={m.method} className="flex items-center gap-1.5 bg-muted/30 border border-border/20 rounded-full px-2.5 py-1">
                  <Icon className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[10px] font-bold">{m.method}</span>
                  <span className="text-[10px] font-black text-primary">{formatCurrency(m.total)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
