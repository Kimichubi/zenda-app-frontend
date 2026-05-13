"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { adminService } from "@/services/admin";
import { useToast, Card, CardContent, Badge, Button, Modal, Input } from "@/components/ui";
import {
  Building2, Search, Loader2, ExternalLink, ChevronRight,
  Users, ShoppingBag, Calendar, Plus, TrendingUp, Eye,
} from "lucide-react";
import { cn, formatDate } from "@/utils";

const tabs = [
  { value: "all", label: "Todos" },
  { value: "ACTIVE", label: "Ativos" },
  { value: "PENDING", label: "Pendentes" },
  { value: "SUSPENDED", label: "Suspensos" },
];

export default function BusinessesPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [businesses, setBusinesses] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");

  const [showCreate, setShowCreate] = useState(false);
  const [newBiz, setNewBiz] = useState({ name: "", slug: "", ownerId: "", plan: "PRO" });
  const [users, setUsers] = useState<Record<string, unknown>[]>([]);

  const loadBusinesses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.listBusinesses();
      setBusinesses(data);
    } catch {
      showToast("Erro ao carregar negocios", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { loadBusinesses(); }, [loadBusinesses]);

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

  const handleAccessBusiness = async (businessId: string) => {
    try {
      const response = await adminService.accessBusiness(businessId);
      if (response?.accessToken) {
        localStorage.setItem("zenda_token", response.accessToken);
        localStorage.setItem("zenda_refresh_token", response.refreshToken || "");
        window.location.href = "/dashboard";
      }
    } catch {
      showToast("Erro ao acessar negocio", "error");
    }
  };

  const statusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string }> = {
      ACTIVE: { label: "Ativo", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
      PENDING: { label: "Pendente", className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
      SUSPENDED: { label: "Suspenso", className: "bg-red-500/10 text-red-500 border-red-500/20" },
    };
    const c = config[status] ?? { label: status, className: "bg-muted text-muted-foreground" };
    return (
      <Badge variant="outline" className={cn("text-[10px] font-bold uppercase tracking-wider", c.className)}>
        {c.label}
      </Badge>
    );
  };

  const planBadge = (plan: string) => (
    <Badge variant="outline" className={cn(
      "text-[10px] font-bold uppercase tracking-wider",
      plan === "PRO" ? "border-emerald-500/20 text-emerald-500" : "border-foreground/10 text-muted-foreground",
    )}>
      {plan}
    </Badge>
  );

  const filteredBusinesses = businesses.filter((b) => {
    const name = String(b.name || "");
    const slug = String(b.slug || "");
    const staff = (b.staff as Record<string, unknown>[] | undefined) || [];
    const matchesSearch = !search ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      slug.toLowerCase().includes(search.toLowerCase()) ||
      staff.some((s) => String(s.name || "").toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusTab === "all" || b.status === statusTab;
    const matchesPlan = planFilter === "all" || b.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const stats = {
    total: businesses.length,
    active: businesses.filter((b) => b.status === "ACTIVE").length,
    pending: businesses.filter((b) => b.status === "PENDING").length,
    suspended: businesses.filter((b) => b.status === "SUSPENDED").length,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Negocios</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {stats.total} cadastrados · {stats.active} ativos · {stats.pending} pendentes
          </p>
        </div>
        <Button onClick={() => {
          adminService.getOnboarding().then(u => { setUsers(u as Record<string, unknown>[]); setShowCreate(true); });
        }} className="h-10 px-4 rounded-lg text-sm font-bold gap-2">
          <Plus className="h-4 w-4" /> Novo Negocio
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickStat label="Total" value={stats.total} icon={Building2} />
        <QuickStat label="Ativos" value={stats.active} icon={TrendingUp} color="emerald" />
        <QuickStat label="Pendentes" value={stats.pending} icon={Calendar} color="amber" />
        <QuickStat label="Suspensos" value={stats.suspended} icon={ShoppingBag} color="red" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl border border-border/40">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusTab(tab.value)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all",
                statusTab === tab.value
                  ? "bg-background text-foreground shadow-sm border border-border/40"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, slug, staff..."
              className="w-full h-10 pl-9 pr-4 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}
            className="h-10 rounded-xl border border-border bg-background px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="all">Todos planos</option>
            <option value="PRO">PRO</option>
            <option value="ENTERPRISE">ENTERPRISE</option>
          </select>
        </div>
      </div>

      {/* Business Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredBusinesses.map((biz) => {
            const staffList = (biz.staff as Record<string, unknown>[] | undefined) || [];
            const owner = staffList.find((s) => s.role === "OWNER");
            const counts = (biz._count as Record<string, number> | undefined) || {};
            return (
              <Card key={String(biz.id)} className="border-border/50 bg-card rounded-xl hover:shadow-md transition-all group">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center font-bold text-sm shrink-0">
                        {String(biz.name || "").charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold truncate">{String(biz.name)}</p>
                        <p className="text-[11px] text-muted-foreground">/{String(biz.slug)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {statusBadge(String(biz.status))}
                      {planBadge(String(biz.plan))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 rounded-lg bg-muted/40 text-center">
                      <p className="text-lg font-bold">{counts.staff ?? 0}</p>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase">Staff</p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/40 text-center">
                      <p className="text-lg font-bold">{counts.products ?? 0}</p>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase">Produtos</p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/40 text-center">
                      <p className="text-lg font-bold">{counts.appointments ?? 0}</p>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase">Agenda</p>
                    </div>
                  </div>

                  {owner && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span className="truncate">{String(owner.name)} — {String(owner.email)}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-3 border-t border-border/40">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs gap-1.5"
                      onClick={() => router.push(`/admin/businesses/${String(biz.id)}`)}
                    >
                      <Eye className="h-3 w-3" /> Detalhes
                    </Button>
                    <Button
                      size="sm"
                      className="h-8 text-xs gap-1.5 ml-auto"
                      onClick={() => handleAccessBusiness(String(biz.id))}
                    >
                      <ExternalLink className="h-3 w-3" /> Acessar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {filteredBusinesses.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground">
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
              className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option value="">Selecione...</option>
              {users.map((u) => (<option key={String(u.id)} value={String(u.id)}>{String(u.name)} ({String(u.email)})</option>))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Plano</label>
            <select value={newBiz.plan} onChange={(e) => setNewBiz({ ...newBiz, plan: e.target.value })}
              className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option value="PRO">PRO</option>
              <option value="ENTERPRISE">ENTERPRISE</option>
            </select>
          </div>
          <Button onClick={handleCreateBusiness} className="w-full h-12 rounded-xl font-bold">
            Criar Negocio
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function QuickStat({ label, value, icon: Icon, color = "zinc" }: { label: string; value: number; icon: React.ElementType; color?: "zinc" | "emerald" | "amber" | "red" }) {
  const colors = {
    zinc: "text-foreground",
    emerald: "text-emerald-500",
    amber: "text-amber-500",
    red: "text-red-500",
  };
  return (
    <Card className="border-border/50 bg-card rounded-xl">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className={cn("h-4 w-4", colors[color])} />
        </div>
        <div>
          <p className="text-xl font-bold">{value}</p>
          <p className="text-[10px] text-muted-foreground font-medium uppercase">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
