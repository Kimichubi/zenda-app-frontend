"use client";

import { useState, useCallback } from "react";
import { useCommissions, usePayCommissions } from "@/hooks";
import { Button, Card, CardContent, Badge, Input, useToast } from "@/components/ui";
import { Loader2, TrendingUp, CheckCircle2, Clock, Wallet, Calendar, ShoppingCart, DollarSign } from "lucide-react";
import { formatCurrency, formatDate, cn } from "@/utils";
import type { Commission } from "@/types/enterprise";

export default function ComissoesPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { data: commissions = [], isLoading } = useCommissions(
    startDate || undefined,
    endDate || undefined
  );
  const payCommissions = usePayCommissions();
  const { showToast } = useToast();

  const stats = {
    total: commissions.reduce((acc, c) => acc + c.amount, 0),
    paid: commissions.filter(c => c.status === "PAID").reduce((acc, c) => acc + c.amount, 0),
    pending: commissions.filter(c => c.status === "PENDING").reduce((acc, c) => acc + c.amount, 0),
  };

  const pendingCommissions = commissions.filter(c => c.status === "PENDING");

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleToggleAll = useCallback(() => {
    if (selectedIds.size === pendingCommissions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pendingCommissions.map(c => c.id)));
    }
  }, [selectedIds, pendingCommissions]);

  const handlePay = () => {
    if (selectedIds.size === 0) return;
    payCommissions.mutate(Array.from(selectedIds), {
      onSuccess: () => {
        showToast("Comissões pagas com sucesso!", "success");
        setSelectedIds(new Set());
      },
      onError: () => showToast("Erro ao pagar comissões", "error"),
    });
  };

  const getStatusBadge = (status: Commission["status"]) => {
    const variants: Record<string, string> = {
      PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      PAID: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      CANCELLED: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    };
    const labels: Record<string, string> = {
      PENDING: "Pendente",
      PAID: "Pago",
      CANCELLED: "Cancelado",
    };
    return (
      <Badge className={cn("font-black text-[8px] uppercase tracking-widest px-3 py-1 rounded-full", variants[status])}>
        {labels[status]}
      </Badge>
    );
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm rounded-2xl">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Valor Total</p>
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
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Pago</p>
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
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Pendente</p>
              <p className="text-2xl font-black text-amber-500">{formatCurrency(stats.pending)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">De</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-10 rounded-xl bg-primary/5 border-border/20 text-sm w-40"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Até</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-10 rounded-xl bg-primary/5 border-border/20 text-sm w-40"
            />
          </div>
        </div>

        {selectedIds.size > 0 && (
          <Button
            onClick={handlePay}
            loading={payCommissions.isPending}
            className="h-10 px-6 gap-2 rounded-2xl shadow-xl shadow-primary/20 font-black uppercase tracking-widest text-[10px] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <DollarSign className="h-4 w-4" />
            Pagar ({selectedIds.size})
          </Button>
        )}
      </div>

      <Card className="border border-border/40 bg-card/20 backdrop-blur-sm shadow-sm rounded-3xl overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="bg-muted/50 border-y border-border/50">
              <tr className="transition-colors hover:bg-muted/50">
                <th className="h-12 px-4 text-left align-middle w-12">
                  <input
                    type="checkbox"
                    checked={pendingCommissions.length > 0 && selectedIds.size === pendingCommissions.length}
                    onChange={handleToggleAll}
                    className="h-4 w-4 rounded accent-primary"
                  />
                </th>
                <th className="h-12 px-6 text-left align-middle font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Profissional</th>
                <th className="h-12 px-6 text-left align-middle font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Tipo</th>
                <th className="h-12 px-6 text-left align-middle font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Valor</th>
                <th className="h-12 px-6 text-left align-middle font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Porcentagem</th>
                <th className="h-12 px-6 text-left align-middle font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Status</th>
                <th className="h-12 px-6 text-left align-middle font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Data</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {commissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-16 text-center align-middle text-sm text-muted-foreground italic">
                    Nenhuma comissão registrada
                  </td>
                </tr>
              ) : (
                commissions.map((commission) => (
                  <tr
                    key={commission.id}
                    className={cn(
                      "border-b border-border/40 transition-colors hover:bg-muted/30",
                      selectedIds.has(commission.id) && "bg-primary/5"
                    )}
                  >
                    <td className="px-4 py-4 align-middle">
                      {commission.status === "PENDING" && (
                        <input
                          type="checkbox"
                          checked={selectedIds.has(commission.id)}
                          onChange={() => handleToggleSelect(commission.id)}
                          className="h-4 w-4 rounded accent-primary"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 align-middle font-medium">
                      {commission.appointment?.clientName || "Venda de Produto"}
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-1.5">
                        {commission.appointmentId ? (
                          <>
                            <Calendar className="h-3.5 w-3.5 text-primary" />
                            <span className="text-xs font-bold">Atendimento</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-3.5 w-3.5 text-primary" />
                            <span className="text-xs font-bold">Venda</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle font-black text-primary">
                      {formatCurrency(commission.amount)}
                    </td>
                    <td className="px-6 py-4 align-middle font-bold text-muted-foreground">
                      {commission.percentage}%
                    </td>
                    <td className="px-6 py-4 align-middle">
                      {getStatusBadge(commission.status)}
                    </td>
                    <td className="px-6 py-4 align-middle text-muted-foreground text-xs font-medium">
                      {formatDate(commission.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}