"use client";

import { useEffect, useState, useCallback } from "react";
import { adminService } from "@/services/admin";
import { useToast, Card, CardContent, Badge, Button } from "@/components/ui";
import {
  CreditCard, Loader2, CheckCircle2, AlertTriangle, Ban, Building2, Users,
} from "lucide-react";
import { cn, formatDate } from "@/utils";

export default function SubscriptionsPage() {
  const { showToast } = useToast();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.listBusinesses();
      setBusinesses(data);
    } catch {
      showToast("Erro ao carregar", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const handleUpdatePlan = async (id: string, plan: string) => {
    try {
      await adminService.updateBusiness(id, { plan });
      showToast("Plano atualizado!", "success");
      load();
    } catch {
      showToast("Erro ao atualizar", "error");
    }
  };

  const handleSuspend = async (id: string) => {
    try {
      await adminService.updateBusiness(id, { status: "SUSPENDED" });
      showToast("Negocio suspenso!", "success");
      load();
    } catch {
      showToast("Erro ao suspender", "error");
    }
  };

  const handleReactivate = async (id: string) => {
    try {
      await adminService.updateBusiness(id, { status: "ACTIVE" });
      showToast("Negocio reativado!", "success");
      load();
    } catch {
      showToast("Erro ao reativar", "error");
    }
  };

  const proCount = businesses.filter(b => b.plan === "PRO").length;
  const enterpriseCount = businesses.filter(b => b.plan === "ENTERPRISE").length;
  const activeCount = businesses.filter(b => b.status === "ACTIVE").length;
  const suspendedCount = businesses.filter(b => b.status === "SUSPENDED").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Assinaturas</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gerenciamento de planos e cobrancas
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard label="Total Assinaturas" value={businesses.length} icon={CreditCard} color="purple" />
        <SummaryCard label="PRO" value={proCount} icon={Building2} color="emerald" />
        <SummaryCard label="Enterprise" value={enterpriseCount} icon={Building2} color="indigo" />
        <SummaryCard label="Suspensos" value={suspendedCount} icon={AlertTriangle} color="red" />
      </div>

      {/* Table */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-4">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Todas as Assinaturas</h3>
        </div>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-purple-500" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <th className="h-10 px-6 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Negocio</th>
                    <th className="h-10 px-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Plano</th>
                    <th className="h-10 px-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="h-10 px-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Criado em</th>
                    <th className="h-10 px-4 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider">Acoes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {businesses.map((biz) => {
                    const owner = biz.staff?.find((s: any) => s.role === "OWNER");
                    return (
                      <tr key={biz.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-xs font-bold text-purple-500 shrink-0">{biz.name.charAt(0)}</div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{biz.name}</p>
                              <p className="text-[10px] text-slate-400 truncate">{owner?.name ?? "Sem owner"} · {owner?.email ?? ""}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4">
                          <Badge variant="outline" className={cn("text-[10px] font-bold uppercase", biz.plan === "PRO" ? "border-emerald-500/20 text-emerald-500" : "border-purple-500/20 text-purple-500")}>
                            {biz.plan}
                          </Badge>
                        </td>
                        <td className="px-4">
                          <Badge variant="outline" className={cn("text-[10px] font-bold uppercase",
                            biz.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                            biz.status === "SUSPENDED" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                            "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          )}>
                            {biz.status === "ACTIVE" ? "Ativo" : biz.status === "SUSPENDED" ? "Suspenso" : "Pendente"}
                          </Badge>
                        </td>
                        <td className="px-4 hidden md:table-cell">
                          <p className="text-xs text-slate-400">{formatDate(biz.createdAt)}</p>
                        </td>
                        <td className="px-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <select
                              value={biz.plan}
                              onChange={(e) => handleUpdatePlan(biz.id, e.target.value)}
                              className="h-7 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-2 text-[9px] font-bold uppercase cursor-pointer focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                            >
                              <option value="PRO">PRO</option>
                              <option value="ENTERPRISE">Enterprise</option>
                            </select>
                            {biz.status === "SUSPENDED" ? (
                              <Button onClick={() => handleReactivate(biz.id)} variant="ghost" className="h-7 px-2 text-[9px] font-bold text-emerald-500 hover:bg-emerald-500/10">
                                Reativar
                              </Button>
                            ) : biz.status === "ACTIVE" ? (
                              <Button onClick={() => handleSuspend(biz.id)} variant="ghost" className="h-7 px-2 text-[9px] font-bold text-red-500 hover:bg-red-500/10">
                                Suspender
                              </Button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {businesses.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-400">Nenhuma assinatura encontrada.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  const colorMap: Record<string, string> = {
    purple: "bg-purple-500/10 text-purple-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    indigo: "bg-indigo-500/10 text-indigo-500",
    red: "bg-red-500/10 text-red-500",
  };

  return (
    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">{label}</p>
          <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", colorMap[color] ?? "")}>
            <Icon className="h-3.5 w-3.5" />
          </div>
        </div>
        <p className="text-2xl font-bold mt-2">{value}</p>
      </CardContent>
    </Card>
  );
}
