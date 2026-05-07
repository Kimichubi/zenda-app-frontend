"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdminUsers, useAdminStats, useUpdateUserPlan, useUser, useUserDetail } from "@/hooks";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  useToast,
  Modal,
} from "@/components/ui";
import {
  Users,
  ShieldCheck,
  Crown,
  Zap,
  TrendingUp,
  Loader2,
  Mail,
  Search,
  DollarSign,
  BarChart3,
  Calendar,
  UserPlus,
  ChevronRight,
  Layers,
  Clock,
} from "lucide-react";
import { cn, formatDate, formatCurrency } from "@/utils";
import type { User } from "@/types";

export default function AdminPage() {
  const { data: currentUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (currentUser && currentUser.role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [currentUser, router]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "users">("overview");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { data: users = [], isLoading: isLoadingUsers } = useAdminUsers(debouncedSearch || undefined);
  const { data: stats, isLoading: isLoadingStats } = useAdminStats();
  const updatePlan = useUpdateUserPlan();
  const { data: userDetail } = useUserDetail(selectedUserId);
  const { showToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleUpdatePlan = useCallback((userId: string, plan: string) => {
    updatePlan.mutate({ id: userId, plan }, {
      onSuccess: () => showToast("Plano atualizado!", "success"),
      onError: () => showToast("Erro ao atualizar plano", "error"),
    });
  }, [updatePlan, showToast]);

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
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-purple-500 uppercase tracking-[0.4em]">
            <ShieldCheck className="h-3 w-3" />
            Admin Backoffice
          </div>
          <h1 className="text-3xl font-black tracking-tight">Control Panel</h1>
          <p className="text-muted-foreground text-sm">
            {stats?.totalUsers ?? 0} parceiros na plataforma
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={cn(
              "h-9 px-4 rounded-lg text-xs font-bold transition-all",
              activeTab === "overview"
                ? "bg-primary text-white shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={cn(
              "h-9 px-4 rounded-lg text-xs font-bold transition-all",
              activeTab === "users"
                ? "bg-primary text-white shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            Usuários
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                <Users className="h-4 w-4" />
              </div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Usuários</p>
            </div>
            <p className="text-2xl font-black">{stats?.totalUsers ?? 0}</p>
            <p className="text-[10px] font-bold text-muted-foreground mt-1">
              <span className="text-amber-500">{stats?.onboardingUsers ?? 0} Onboarding</span>
              {" · "}
              <span className="text-emerald-500">{stats?.proUsers ?? 0} Pro</span>
              {" · "}
              <span className="text-primary">{stats?.enterpriseUsers ?? 0} Enterprise</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <DollarSign className="h-4 w-4" />
              </div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Receita Total</p>
            </div>
            <p className="text-2xl font-black">{formatCurrency(stats?.totalRevenue ?? 0)}</p>
            <p className="text-[10px] font-bold text-muted-foreground mt-1">Pagamentos confirmados</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Calendar className="h-4 w-4" />
              </div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Agendamentos</p>
            </div>
            <p className="text-2xl font-black">{stats?.totalAppointments ?? 0}</p>
            <p className="text-[10px] font-bold text-muted-foreground mt-1">{stats?.totalClients ?? 0} clientes totais</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <TrendingUp className="h-4 w-4" />
              </div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Novos (mês)</p>
            </div>
            <p className="text-2xl font-black">+{stats?.newThisMonth ?? 0}</p>
            <p className="text-[10px] font-bold text-muted-foreground mt-1">Este mês</p>
          </CardContent>
        </Card>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Recent Users */}
          {stats?.recentUsers && stats.recentUsers.length > 0 && (
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-border/40 p-4 bg-muted/20">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-primary" />
                  Novos Cadastros
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {stats.recentUsers.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-4 border-b border-border/20 last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate">{u.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{u.email} · {u.businessName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] font-bold uppercase",
                          u.plan === "PRO" && "border-emerald-500/20 text-emerald-500",
                          u.plan === "ENTERPRISE" && "border-purple-500/20 text-purple-500",
                        )}
                      >
                        {u.plan}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {formatDate(u.createdAt)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => {
                          setSelectedUserId(u.id);
                          setActiveTab("users");
                        }}
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Plan Distribution */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-border/40 p-4 bg-muted/20">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                Distribuição de Planos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[
                  { label: "ONBOARDING", count: stats?.onboardingUsers ?? 0, total: stats?.totalUsers ?? 1, color: "bg-amber-500" },
                  { label: "PRO", count: stats?.proUsers ?? 0, total: stats?.totalUsers ?? 1, color: "bg-emerald-500" },
                  { label: "ENTERPRISE", count: stats?.enterpriseUsers ?? 0, total: stats?.totalUsers ?? 1, color: "bg-purple-500" },
                ].map((plan) => (
                  <div key={plan.label} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold">{plan.label}</span>
                      <span className="text-muted-foreground">{plan.count} ({Math.round((plan.count / plan.total) * 100)}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-500", plan.color)}
                        style={{ width: `${Math.max((plan.count / plan.total) * 100, 2)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "users" && (
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-border/40 p-4 bg-muted/20">
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Todos os Usuários ({users.length})
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nome, email..."
                  className="w-full h-9 pl-9 pr-3 rounded-lg border border-border/40 bg-muted/20 text-xs placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/20 bg-muted/10">
                    <th className="h-10 px-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Usuário</th>
                    <th className="h-10 px-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Acesso</th>
                    <th className="h-10 px-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Plano</th>
                    <th className="h-10 px-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden md:table-cell">Membro desde</th>
                    <th className="h-10 px-4 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-sm text-muted-foreground">
                        {debouncedSearch ? "Nenhum usuário encontrado para esta busca." : "Nenhum usuário cadastrado."}
                      </td>
                    </tr>
                  ) : (
                    users.map((user: User) => (
                      <tr key={user.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold truncate">{user.name}</p>
                              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={user.role === "ADMIN" ? "default" : "outline"}
                            className={cn(
                              "font-bold uppercase text-[9px] tracking-widest",
                              user.role === "ADMIN" ? "bg-purple-500 text-white" : ""
                            )}
                          >
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={cn(
                              "font-bold uppercase text-[9px] tracking-widest",
                              user.plan === "PRO" && "border-emerald-500/20 text-emerald-500",
                              user.plan === "ENTERPRISE" && "border-purple-500/20 text-purple-500",
                              user.plan === "ONBOARDING" && "border-border/40 text-muted-foreground",
                            )}
                          >
                            {user.plan}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 opacity-50" />
                            {formatDate(user.createdAt)}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedUserId(user.id)}
                              className="h-8 w-8 rounded-lg p-0"
                            >
                              <BarChart3 className="h-3.5 w-3.5" />
                            </Button>
                            <select
                              value={user.plan}
                              onChange={(e) => handleUpdatePlan(user.id, e.target.value)}
                              className="h-8 rounded-lg border border-border/40 bg-card px-2 text-[10px] font-bold uppercase tracking-wider cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/30 appearance-none text-center pr-6 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px] bg-[right_4px_center] bg-no-repeat"
                            >
                              <option value="ONBOARDING">ONBOARDING</option>
                              <option value="PRO">PRO</option>
                              <option value="ENTERPRISE">ENTERPRISE</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Detail Modal */}
      <Modal
        open={!!selectedUserId}
        onClose={() => setSelectedUserId(null)}
        title="Detalhes do Usuário"
        className="max-w-lg"
      >
        {userDetail ? (
          <div className="p-2 space-y-6">
            {/* Profile Header */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-black text-primary shrink-0">
                {userDetail.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-lg font-bold">{userDetail.name}</p>
                <p className="text-xs text-muted-foreground">{userDetail.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="text-[9px] font-bold bg-muted-foreground/10 text-muted-foreground border-border/20" variant="outline">
                    {userDetail.role}
                  </Badge>
                  <Badge
                    className={cn(
                      "text-[9px] font-bold",
                      userDetail.plan === "PRO" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                      userDetail.plan === "ENTERPRISE" && "bg-purple-500/10 text-purple-500 border-purple-500/20",
                      userDetail.plan === "ONBOARDING" && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                    )}
                    variant="outline"
                  >
                    {userDetail.plan}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-muted/20 border border-border/30">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Agendamentos</p>
                <p className="text-xl font-black">{userDetail.stats.totalAppointments}</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Receita</p>
                <p className="text-xl font-black text-emerald-600">{formatCurrency(userDetail.stats.totalRevenue)}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">Clientes</p>
                <p className="text-xl font-black text-blue-600">{userDetail.stats.totalClients}</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1">Serviços</p>
                <p className="text-xl font-black text-amber-600">{userDetail.stats.totalServices}</p>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-2 p-4 rounded-xl bg-muted/20">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Negócio</span>
                <span className="font-medium">{userDetail.businessName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Membro desde</span>
                <span className="font-medium">{formatDate(userDetail.createdAt)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
      </Modal>
    </div>
  );
}