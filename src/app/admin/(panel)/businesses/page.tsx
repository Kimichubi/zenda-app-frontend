"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { adminService, type BusinessDetail } from "@/services/admin";
import { useToast, Card, CardContent, Badge, Button, Modal, Input } from "@/components/ui";
import {
  Building2, Search, Filter, Loader2, ExternalLink, MoreHorizontal,
  Users, ShoppingBag, Calendar, CreditCard, UserPlus, Link2, Plus,
} from "lucide-react";
import { cn, formatDate, formatCurrency } from "@/utils";

export default function BusinessesPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");

  const [showCreate, setShowCreate] = useState(false);
  const [newBiz, setNewBiz] = useState({ name: "", slug: "", ownerId: "", plan: "PRO" });
  const [users, setUsers] = useState<any[]>([]);
  const [selectedBiz, setSelectedBiz] = useState<BusinessDetail | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const loadBusinesses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (planFilter !== "all") params.set("plan", planFilter);
      const data = await adminService.listBusinesses();
      setBusinesses(data);
    } catch {
      showToast("Erro ao carregar negocios", "error");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, planFilter, showToast]);

  useEffect(() => { loadBusinesses(); }, [loadBusinesses]);

  const handleAccessBusiness = async (businessId: string) => {
    try {
      const currentToken = localStorage.getItem("zenda_token");
      const currentRefresh = localStorage.getItem("zenda_refresh_token");
      if (currentToken) localStorage.setItem("zenda_admin_token", currentToken);
      if (currentRefresh) localStorage.setItem("zenda_admin_refresh_token", currentRefresh);

      const response = await adminService.accessBusiness(businessId);
      if (response?.accessToken) {
        const refreshToken = response.refreshToken || "";
        window.open(`/auth/redirect?token=${encodeURIComponent(response.accessToken)}&refresh_token=${encodeURIComponent(refreshToken)}&redirect=/dashboard`, "_blank");
      }
    } catch {
      showToast("Erro ao acessar negocio", "error");
    }
  };

  const handleCreateBusiness = async () => {
    if (!newBiz.name || !newBiz.slug || !newBiz.ownerId) {
      showToast("Preencha todos os campos", "error");
      return;
    }
    try {
      await adminService.createBusiness({ ...newBiz, activateNow: true });
      showToast("Negocio criado!", "success");
      setShowCreate(false);
      setNewBiz({ name: "", slug: "", ownerId: "", plan: "PRO" });
      loadBusinesses();
    } catch {
      showToast("Erro ao criar negocio", "error");
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await adminService.updateBusiness(id, { status });
      showToast("Status atualizado!", "success");
      loadBusinesses();
    } catch {
      showToast("Erro ao atualizar", "error");
    }
  };

  const handleOpenDetail = async (id: string) => {
    try {
      const biz = await adminService.getBusiness(id);
      const users = await adminService.getOnboarding();
      setSelectedBiz(biz);
      setUsers(users as any[]);
      setShowDetail(true);
    } catch {
      showToast("Erro ao carregar detalhes", "error");
    }
  };

  const statusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string }> = {
      ACTIVE: { label: "Ativo", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
      PENDING: { label: "Pendente", className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
      SUSPENDED: { label: "Suspenso", className: "bg-red-500/10 text-red-500 border-red-500/20" },
    };
    const c = config[status] ?? { label: status, className: "bg-slate-500/10 text-slate-500" };
    return (
      <Badge variant="outline" className={cn("text-[10px] font-bold uppercase tracking-wider", c.className)}>
        {c.label}
      </Badge>
    );
  };

  const planBadge = (plan: string) => (
    <Badge variant="outline" className={cn(
      "text-[10px] font-bold uppercase tracking-wider",
      plan === "PRO" ? "border-emerald-500/20 text-emerald-500" : "border-purple-500/20 text-purple-500",
    )}>
      {plan}
    </Badge>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Negocios</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {businesses.length} negocio{businesses.length !== 1 ? "s" : ""} cadastrado{businesses.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => {
          adminService.getOnboarding().then(u => { setUsers(u as any[]); setShowCreate(true); });
        }} className="h-10 px-4 rounded-lg text-sm font-bold gap-2 bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4" /> Novo Negocio
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, slug, staff..."
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20">
          <option value="all">Todos status</option>
          <option value="ACTIVE">Ativos</option>
          <option value="PENDING">Pendentes</option>
          <option value="SUSPENDED">Suspensos</option>
        </select>
        <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}
          className="h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20">
          <option value="all">Todos planos</option>
          <option value="PRO">PRO</option>
          <option value="ENTERPRISE">ENTERPRISE</option>
        </select>
        <button onClick={loadBusinesses} className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Filter className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Business Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-purple-500" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {businesses.map((biz) => {
            const owner = biz.staff?.find((s: any) => s.role === "OWNER");
            return (
              <Card key={biz.id} className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl hover:shadow-md transition-shadow">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center text-purple-500 font-bold text-sm shrink-0">
                        {biz.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{biz.name}</p>
                        <p className="text-[11px] text-slate-400">/{biz.slug}</p>
                      </div>
                    </div>
                    <button onClick={() => handleOpenDetail(biz.id)} className="h-7 w-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400">
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {statusBadge(biz.status)}
                    {planBadge(biz.plan)}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{biz._count?.staff ?? 0}</span>
                    <span className="flex items-center gap-1"><ShoppingBag className="h-3 w-3" />{biz._count?.products ?? 0}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{biz._count?.appointments ?? 0}</span>
                  </div>

                  {owner && (
                    <p className="text-[11px] text-slate-400">
                      Owner: <span className="text-slate-600 dark:text-slate-300">{owner.name}</span> — {owner.email}
                    </p>
                  )}

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <select
                      value={biz.status}
                      onChange={(e) => handleUpdateStatus(biz.id, e.target.value)}
                      className="h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-2 text-[10px] font-bold uppercase tracking-wider cursor-pointer focus:outline-none focus:ring-1 focus:ring-purple-500/30 text-slate-600 dark:text-slate-300"
                    >
                      <option value="ACTIVE">Ativo</option>
                      <option value="PENDING">Pendente</option>
                      <option value="SUSPENDED">Suspenso</option>
                    </select>
                    <select
                      value={biz.plan}
                      onChange={(e) => adminService.updateBusiness(biz.id, { plan: e.target.value }).then(() => loadBusinesses())}
                      className="h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-2 text-[10px] font-bold uppercase tracking-wider cursor-pointer focus:outline-none focus:ring-1 focus:ring-purple-500/30 text-slate-600 dark:text-slate-300"
                    >
                      <option value="PRO">PRO</option>
                      <option value="ENTERPRISE">ENTERPRISE</option>
                    </select>
                    <button
                      onClick={() => handleAccessBusiness(biz.id)}
                      className="ml-auto h-8 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" /> Acessar
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {businesses.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-400">
              <Building2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>Nenhum negocio encontrado.</p>
            </div>
          )}
        </div>
      )}

      {/* Create Business Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Criar Novo Negocio">
        <div className="space-y-4 p-2">
          <Input label="Nome do Negocio" value={newBiz.name} onChange={(e) => setNewBiz({ ...newBiz, name: e.target.value })} placeholder="Barbearia do Joao" className="h-12 rounded-xl" />
          <Input label="Slug (URL)" value={newBiz.slug} onChange={(e) => setNewBiz({ ...newBiz, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} placeholder="barbearia-do-joao" className="h-12 rounded-xl" />
          <div className="space-y-2">
            <label className="text-sm font-medium">Proprietario</label>
            <select value={newBiz.ownerId} onChange={(e) => setNewBiz({ ...newBiz, ownerId: e.target.value })}
              className="h-12 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20">
              <option value="">Selecione...</option>
              {users.map((u: any) => (<option key={u.id} value={u.id}>{u.name} ({u.email})</option>))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Plano</label>
            <select value={newBiz.plan} onChange={(e) => setNewBiz({ ...newBiz, plan: e.target.value })}
              className="h-12 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20">
              <option value="PRO">PRO</option>
              <option value="ENTERPRISE">ENTERPRISE</option>
            </select>
          </div>
          <Button onClick={handleCreateBusiness} className="w-full h-12 rounded-xl font-bold bg-purple-600 hover:bg-purple-700">
            Criar Negocio
          </Button>
        </div>
      </Modal>

      {/* Business Detail Modal */}
      <Modal open={showDetail} onClose={() => setShowDetail(false)} title={selectedBiz?.name ?? "Detalhes"} className="max-w-2xl">
        {selectedBiz && (
          <div className="p-2 space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="h-14 w-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-2xl font-bold text-purple-500 shrink-0">
                {selectedBiz.name.charAt(0)}
              </div>
              <div>
                <p className="text-lg font-bold">{selectedBiz.name}</p>
                <p className="text-xs text-slate-400">/{selectedBiz.slug} · {selectedBiz.plan} · Criado em {formatDate(selectedBiz.createdAt)}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold mb-3">Equipe ({selectedBiz.staff?.length ?? 0})</h4>
              <div className="space-y-2">
                {selectedBiz.staff?.map((s: any) => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">{s.name.charAt(0)}</div>
                      <div>
                        <p className="text-sm font-medium">{s.name}</p>
                        <p className="text-[11px] text-slate-400">{s.email}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px]">{s.role}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => handleAccessBusiness(selectedBiz.id)}
                className="flex-1 h-10 rounded-xl text-sm font-bold bg-purple-600 hover:bg-purple-700 gap-2">
                <ExternalLink className="h-4 w-4" /> Acessar Negocio
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
