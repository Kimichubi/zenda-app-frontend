"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdminUsers, useAdminStats, useUpdateUserPlan, useUser, useUserDetail } from "@/hooks";
import { adminService } from "@/services/admin";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, useToast, Modal, Input } from "@/components/ui";
import { Users, ShieldCheck, TrendingUp, Loader2, Search, DollarSign, BarChart3,   Calendar, UserPlus, Layers, Clock,   Building2, Plus, Zap, ShoppingBag, Package, Link2 } from "lucide-react";
import { cn, formatDate, formatCurrency } from "@/utils";
import type { User } from "@/types";

export default function AdminPage() {
  const { data: currentUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (currentUser && currentUser.role !== "PLATFORM_ADMIN") {
      router.replace("/dashboard");
    }
  }, [currentUser, router]);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "businesses">("overview");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showCreateBusiness, setShowCreateBusiness] = useState(false);
  const [showAddStaff, setShowAddStaff] = useState<string | null>(null);
  const [showLinkUser, setShowLinkUser] = useState<string | null>(null);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [businessesLoading, setBusinessesLoading] = useState(false);

  const { data: users = [], isLoading: isLoadingUsers } = useAdminUsers(debouncedSearch || undefined);
  const { data: stats, isLoading: isLoadingStats } = useAdminStats();
  const { data: userDetail } = useUserDetail(selectedUserId);
  const updatePlan = useUpdateUserPlan();
  const { showToast } = useToast();

  const [newBusiness, setNewBusiness] = useState({ name: "", slug: "", ownerId: "", plan: "PRO" });
  const [newStaff, setNewStaff] = useState({ name: "", email: "", commission: 30 });
  const [linkUserId, setLinkUserId] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (activeTab === "businesses") {
      setBusinessesLoading(true);
      adminService.listBusinesses().then(data => { setBusinesses(data); setBusinessesLoading(false); });
    }
  }, [activeTab]);

  const handleUpdatePlan = useCallback((userId: string, plan: string) => {
    updatePlan.mutate({ id: userId, plan }, {
      onSuccess: () => showToast("Plano atualizado!", "success"),
      onError: () => showToast("Erro ao atualizar plano", "error"),
    });
  }, [updatePlan, showToast]);

  const handleCreateBusiness = async () => {
    if (!newBusiness.name || !newBusiness.slug || !newBusiness.ownerId) {
      showToast("Preencha todos os campos", "error");
      return;
    }
    try {
      await adminService.createBusiness(newBusiness);
      showToast("Negocio criado!", "success");
      setShowCreateBusiness(false);
      setNewBusiness({ name: "", slug: "", ownerId: "", plan: "PRO" });
      const data = await adminService.listBusinesses();
      setBusinesses(data);
    } catch { showToast("Erro ao criar negocio", "error"); }
  };

  const handleAddStaff = async (businessId: string) => {
    if (!newStaff.name || !newStaff.email) { showToast("Preencha todos os campos", "error"); return; }
    try {
      await adminService.updateBusiness(businessId, { addStaff: newStaff });
      showToast("Profissional adicionado!", "success");
      setShowAddStaff(null);
      setNewStaff({ name: "", email: "", commission: 30 });
      const data = await adminService.listBusinesses();
      setBusinesses(data);
    } catch { showToast("Erro ao adicionar profissional", "error"); }
  };

  const handleLinkUser = async (businessId: string) => {
    if (!linkUserId) { showToast("Selecione um usuario", "error"); return; }
    try {
      await adminService.linkUserToBusiness(businessId, linkUserId);
      showToast("Usuario vinculado!", "success");
      setShowLinkUser(null);
      setLinkUserId("");
      const data = await adminService.listBusinesses();
      setBusinesses(data);
    } catch { showToast("Erro ao vincular usuario", "error"); }
  };

  const handleUpdateBusiness = async (businessId: string, data: any) => {
    try {
      await adminService.updateBusiness(businessId, data);
      showToast("Negocio atualizado!", "success");
      const d = await adminService.listBusinesses();
      setBusinesses(d);
    } catch { showToast("Erro ao atualizar", "error"); }
  };

  const isLoading = isLoadingUsers || isLoadingStats;

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-bold tracking-tight text-muted-foreground animate-pulse">Carregando painel de controle...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-purple-500 uppercase tracking-[0.4em]">
            <ShieldCheck className="h-3 w-3" /> Admin Backoffice
          </div>
          <h1 className="text-3xl font-black tracking-tight">Control Panel</h1>
          <p className="text-muted-foreground text-sm">{stats?.totalUsers ?? 0} usuarios na plataforma</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setActiveTab("overview")} className={cn("h-9 px-4 rounded-lg text-xs font-bold transition-all", activeTab === "overview" ? "bg-primary text-white shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80")}>Visao Geral</button>
          <button onClick={() => setActiveTab("users")} className={cn("h-9 px-4 rounded-lg text-xs font-bold transition-all", activeTab === "users" ? "bg-primary text-white shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80")}>Usuarios</button>
          <button onClick={() => setActiveTab("businesses")} className={cn("h-9 px-4 rounded-lg text-xs font-bold transition-all", activeTab === "businesses" ? "bg-primary text-white shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80")}>Negocios</button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm rounded-2xl"><CardContent className="p-5"><div className="flex items-center gap-3 mb-3"><div className="h-9 w-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500"><Users className="h-4 w-4" /></div><p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Usuarios</p></div><p className="text-2xl font-black">{stats?.totalUsers ?? 0}</p><p className="text-[10px] font-bold text-muted-foreground mt-1"><span className="text-amber-500">{stats?.onboardingUsers ?? 0} Onboarding</span>{" · "}<span className="text-emerald-500">{stats?.proUsers ?? 0} Pro</span>{" · "}<span className="text-primary">{stats?.enterpriseUsers ?? 0} Enterprise</span></p></CardContent></Card>
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm rounded-2xl"><CardContent className="p-5"><div className="flex items-center gap-3 mb-3"><div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><DollarSign className="h-4 w-4" /></div><p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Receita Total</p></div><p className="text-2xl font-black">{formatCurrency(stats?.totalRevenue ?? 0)}</p><p className="text-[10px] font-bold text-muted-foreground mt-1">Pagamentos confirmados</p></CardContent></Card>
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm rounded-2xl"><CardContent className="p-5"><div className="flex items-center gap-3 mb-3"><div className="h-9 w-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500"><Calendar className="h-4 w-4" /></div><p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Agendamentos</p></div><p className="text-2xl font-black">{stats?.totalAppointments ?? 0}</p><p className="text-[10px] font-bold text-muted-foreground mt-1">{stats?.totalClients ?? 0} clientes totais</p></CardContent></Card>
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm rounded-2xl"><CardContent className="p-5"><div className="flex items-center gap-3 mb-3"><div className="h-9 w-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500"><TrendingUp className="h-4 w-4" /></div><p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Novos (mes)</p></div><p className="text-2xl font-black">+{stats?.newThisMonth ?? 0}</p><p className="text-[10px] font-bold text-muted-foreground mt-1">Este mes</p></CardContent></Card>
      </div>

      {/* Tab: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {stats?.recentUsers && stats.recentUsers.length > 0 && (
            <Card className="border-border/40 bg-card/50 rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-border/40 p-4 bg-muted/20"><CardTitle className="text-sm font-bold flex items-center gap-2"><UserPlus className="h-4 w-4 text-primary" />Novos Cadastros</CardTitle></CardHeader>
              <CardContent className="p-0">
                {stats.recentUsers.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-4 border-b border-border/20 last:border-0 hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-3 min-w-0"><div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">{u.name.charAt(0).toUpperCase()}</div><div className="min-w-0"><p className="text-sm font-bold truncate">{u.name}</p><p className="text-[10px] text-muted-foreground truncate">{u.email} · {u.businessName}</p></div></div>
                    <div className="flex items-center gap-3 shrink-0"><Badge variant="outline" className={cn("text-[9px] font-bold uppercase", u.plan === "PRO" && "border-emerald-500/20 text-emerald-500", u.plan === "ENTERPRISE" && "border-purple-500/20 text-purple-500")}>{u.plan}</Badge><span className="text-[10px] text-muted-foreground whitespace-nowrap">{formatDate(u.createdAt)}</span></div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          <Card className="border-border/40 bg-card/50 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-border/40 p-4 bg-muted/20"><CardTitle className="text-sm font-bold flex items-center gap-2"><Layers className="h-4 w-4 text-primary" />Distribuicao de Planos</CardTitle></CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[{ label: "ONBOARDING", count: stats?.onboardingUsers ?? 0, total: stats?.totalUsers ?? 1, color: "bg-amber-500" },{ label: "PRO", count: stats?.proUsers ?? 0, total: stats?.totalUsers ?? 1, color: "bg-emerald-500" },{ label: "ENTERPRISE", count: stats?.enterpriseUsers ?? 0, total: stats?.totalUsers ?? 1, color: "bg-purple-500" }].map((plan) => (
                  <div key={plan.label} className="space-y-2"><div className="flex items-center justify-between text-xs"><span className="font-bold">{plan.label}</span><span className="text-muted-foreground">{plan.count} ({Math.round((plan.count / plan.total) * 100)}%)</span></div><div className="h-2 bg-muted rounded-full overflow-hidden"><div className={cn("h-full rounded-full transition-all duration-500", plan.color)} style={{ width: `${Math.max((plan.count / plan.total) * 100, 2)}%` }} /></div></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab: Users */}
      {activeTab === "users" && (
        <Card className="border-border/40 bg-card/50 rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-border/40 p-4 bg-muted/20"><div className="flex items-center justify-between gap-4"><CardTitle className="text-sm font-bold flex items-center gap-2"><Users className="h-4 w-4 text-primary" />Todos os Usuarios ({users.length})</CardTitle><div className="relative w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nome, email..." className="w-full h-9 pl-9 pr-3 rounded-lg border border-border/40 bg-muted/20 text-xs placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all" /></div></div></CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-border/20 bg-muted/10"><th className="h-10 px-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Usuario</th><th className="h-10 px-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Acesso</th><th className="h-10 px-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Plano</th><th className="h-10 px-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden md:table-cell">Membro desde</th><th className="h-10 px-4 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Acoes</th></tr></thead>
              <tbody>{users.length === 0 ? <tr><td colSpan={5} className="p-12 text-center text-sm text-muted-foreground">{debouncedSearch ? "Nenhum usuario encontrado." : "Nenhum usuario cadastrado."}</td></tr> : users.map((user: User) => (
                <tr key={user.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3"><div className="flex items-center gap-3 min-w-0"><div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">{user.name.charAt(0).toUpperCase()}</div><div className="min-w-0"><p className="text-sm font-bold truncate">{user.name}</p><p className="text-[10px] text-muted-foreground truncate">{user.email}</p></div></div></td>
                  <td className="px-4 py-3"><Badge variant={user.role === "PLATFORM_ADMIN" ? "default" : "outline"} className={cn("font-bold uppercase text-[9px] tracking-widest", user.role === "PLATFORM_ADMIN" ? "bg-purple-500 text-white" : "")}>{user.role}</Badge></td>
                  <td className="px-4 py-3"><Badge variant="outline" className={cn("font-bold uppercase text-[9px] tracking-widest", user.plan === "PRO" && "border-emerald-500/20 text-emerald-500", user.plan === "ENTERPRISE" && "border-purple-500/20 text-purple-500", user.plan === "ONBOARDING" && "border-border/40 text-muted-foreground")}>{user.plan}</Badge></td>
                  <td className="px-4 py-3 hidden md:table-cell"><div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock className="h-3 w-3 opacity-50" />{formatDate(user.createdAt)}</div></td>
                  <td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-1.5"><Button size="sm" variant="ghost" onClick={() => setSelectedUserId(user.id)} className="h-8 w-8 rounded-lg p-0"><BarChart3 className="h-3.5 w-3.5" /></Button>
                    <select value={user.plan} onChange={(e) => handleUpdatePlan(user.id, e.target.value)} className="h-8 rounded-lg border border-border/40 bg-card px-2 text-[10px] font-bold uppercase tracking-wider cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/30 appearance-none text-center pr-6 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px] bg-[right_4px_center] bg-no-repeat"><option value="ONBOARDING">ONBOARDING</option><option value="PRO">PRO</option><option value="ENTERPRISE">ENTERPRISE</option></select></div></td>
                </tr>
              ))}</tbody></table></div>
          </CardContent>
        </Card>
      )}

      {/* Tab: Businesses */}
      {activeTab === "businesses" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-muted-foreground">{businesses.length} negocios cadastrados</p>
            <Button onClick={() => setShowCreateBusiness(true)} className="h-9 px-4 rounded-lg text-xs font-bold gap-2"><Building2 className="h-3.5 w-3.5" />Criar Negocio</Button>
          </div>

          {businessesLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {businesses.map((biz: any) => (
                <Card key={biz.id} className="border-border/40 bg-card/50 rounded-2xl overflow-hidden">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">{biz.name.charAt(0)}</div>
                        <div><p className="font-bold">{biz.name}</p><p className="text-[10px] text-muted-foreground">/{biz.slug} · {biz.owner?.name}</p></div>
                      </div>
                      <div className="flex gap-1">
                        <Badge className={cn("text-[9px] font-bold", biz.plan === "PRO" ? "bg-emerald-500/10 text-emerald-500" : "bg-purple-500/10 text-purple-500")} variant="outline">{biz.plan}</Badge>
                        <Badge className={cn("text-[9px] font-bold", biz.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-500" : biz.status === "PENDING" ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500")} variant="outline">{biz.status}</Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{biz._count?.staff ?? 0} staff</span>
                      <span className="flex items-center gap-1"><ShoppingBag className="h-3 w-3" />{biz._count?.products ?? 0} produtos</span>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-border/20">
                      <select value={biz.plan} onChange={(e) => handleUpdateBusiness(biz.id, { plan: e.target.value })} className="h-8 rounded-lg border border-border/40 bg-card px-2 text-[10px] font-bold uppercase tracking-wider cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/30">
                        <option value="PRO">PRO</option><option value="ENTERPRISE">ENTERPRISE</option>
                      </select>
                      <select value={biz.status} onChange={(e) => handleUpdateBusiness(biz.id, { status: e.target.value })} className="h-8 rounded-lg border border-border/40 bg-card px-2 text-[10px] font-bold uppercase tracking-wider cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/30">
                        <option value="ACTIVE">ATIVO</option><option value="PENDING">PENDENTE</option><option value="SUSPENDED">SUSPENSO</option>
                      </select>
                      <Button size="sm" variant="outline" onClick={() => setShowAddStaff(biz.id)} className="h-8 text-[10px] font-bold gap-1"><UserPlus className="h-3 w-3" />Add Staff</Button>
                      <Button size="sm" variant="ghost" onClick={() => setShowLinkUser(biz.id)} className="h-8 text-[10px] font-bold gap-1"><Link2 className="h-3 w-3" />Vincular</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {businesses.length === 0 && <div className="col-span-full py-12 text-center text-muted-foreground">Nenhum negocio cadastrado.</div>}
            </div>
          )}
        </div>
      )}

      {/* Create Business Modal */}
      <Modal open={showCreateBusiness} onClose={() => setShowCreateBusiness(false)} title="Criar Negocio" className="max-w-md">
        <div className="space-y-4 p-2">
          <Input label="Nome do Negocio" value={newBusiness.name} onChange={(e) => setNewBusiness({ ...newBusiness, name: e.target.value })} placeholder="Ex: Barbearia do Ze" className="h-12 rounded-xl" />
          <Input label="Slug (URL)" value={newBusiness.slug} onChange={(e) => setNewBusiness({ ...newBusiness, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} placeholder="barbearia-do-ze" className="h-12 rounded-xl" />
          <div className="space-y-2"><label className="text-sm font-medium">Proprietario</label>
            <select value={newBusiness.ownerId} onChange={(e) => setNewBusiness({ ...newBusiness, ownerId: e.target.value })} className="h-12 w-full rounded-xl border border-border/40 bg-muted/20 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"><option value="">Selecione o proprietario...</option>{users.map((u) => (<option key={u.id} value={u.id}>{u.name} ({u.email})</option>))}</select>
          </div>
          <div className="space-y-2"><label className="text-sm font-medium">Plano</label><select value={newBusiness.plan} onChange={(e) => setNewBusiness({ ...newBusiness, plan: e.target.value })} className="h-12 w-full rounded-xl border border-border/40 bg-muted/20 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"><option value="PRO">PRO (R$49/mes)</option><option value="ENTERPRISE">ENTERPRISE (R$149/mes)</option></select></div>
          <Button onClick={handleCreateBusiness} className="w-full h-12 rounded-xl font-bold"><Building2 className="h-4 w-4 mr-2" />Criar Negocio</Button>
        </div>
      </Modal>

      {/* Add Staff Modal */}
      <Modal open={!!showAddStaff} onClose={() => setShowAddStaff(null)} title="Adicionar Profissional" className="max-w-md">
        <div className="space-y-4 p-2">
          <Input label="Nome" value={newStaff.name} onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} placeholder="Nome do profissional" className="h-12 rounded-xl" />
          <Input label="Email" value={newStaff.email} onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })} placeholder="email@exemplo.com" className="h-12 rounded-xl" />
          <Input label="Comissao (%)" type="number" value={newStaff.commission} onChange={(e) => setNewStaff({ ...newStaff, commission: Number(e.target.value) })} className="h-12 rounded-xl" />
          <Button onClick={() => handleAddStaff(showAddStaff!)} className="w-full h-12 rounded-xl font-bold"><UserPlus className="h-4 w-4 mr-2" />Adicionar</Button>
        </div>
      </Modal>

      {/* Link User Modal */}
      <Modal open={!!showLinkUser} onClose={() => setShowLinkUser(null)} title="Vincular Usuario ao Negocio" className="max-w-md">
        <div className="space-y-4 p-2">
          <div className="space-y-2"><label className="text-sm font-medium">Usuario</label><select value={linkUserId} onChange={(e) => setLinkUserId(e.target.value)} className="h-12 w-full rounded-xl border border-border/40 bg-muted/20 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"><option value="">Selecione o usuario...</option>{users.filter(u => u.plan === "ONBOARDING").map((u) => (<option key={u.id} value={u.id}>{u.name} ({u.email})</option>))}</select></div>
          <Button onClick={() => handleLinkUser(showLinkUser!)} className="w-full h-12 rounded-xl font-bold"><Link2 className="h-4 w-4 mr-2" />Vincular ao Negocio</Button>
        </div>
      </Modal>

      {/* User Detail Modal */}
      <Modal open={!!selectedUserId} onClose={() => setSelectedUserId(null)} title="Detalhes do Usuario" className="max-w-lg">
        {userDetail ? (
          <div className="p-2 space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30"><div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-black text-primary shrink-0">{userDetail.name.charAt(0).toUpperCase()}</div><div><p className="text-lg font-bold">{userDetail.name}</p><p className="text-xs text-muted-foreground">{userDetail.email}</p><div className="flex items-center gap-2 mt-1"><Badge className="text-[9px] font-bold bg-muted-foreground/10 text-muted-foreground border-border/20" variant="outline">{userDetail.role}</Badge><Badge className={cn("text-[9px] font-bold", userDetail.plan === "PRO" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", userDetail.plan === "ENTERPRISE" && "bg-purple-500/10 text-purple-500 border-purple-500/20", userDetail.plan === "ONBOARDING" && "bg-amber-500/10 text-amber-500 border-amber-500/20")} variant="outline">{userDetail.plan}</Badge></div></div></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-muted/20 border border-border/30"><p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Agendamentos</p><p className="text-xl font-black">{userDetail.stats.totalAppointments}</p></div>
              <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10"><p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Receita</p><p className="text-xl font-black text-emerald-600">{formatCurrency(userDetail.stats.totalRevenue)}</p></div>
              <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10"><p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">Clientes</p><p className="text-xl font-black text-blue-600">{userDetail.stats.totalClients}</p></div>
              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10"><p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1">Servicos</p><p className="text-xl font-black text-amber-600">{userDetail.stats.totalServices}</p></div>
            </div>
          </div>
        ) : (<div className="flex items-center justify-center p-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>)}
      </Modal>
    </div>
  );
}
