"use client";

import { useAdminUsers, useAdminStats, useUpdateUserPlan, useUser } from "@/hooks";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  Table, 
  Badge, 
  Button, 
  useToast 
} from "@/components/ui";
import { 
  Users, 
  ShieldCheck, 
  Crown, 
  Zap, 
  TrendingUp, 
  Loader2, 
  Mail,
  Calendar
} from "lucide-react";
import { cn, formatDate } from "@/utils";
import type { User } from "@/types";
import { redirect } from "next/navigation";

export default function AdminPage() {
  const { data: currentUser } = useUser();
  const { data: users = [], isLoading: isLoadingUsers } = useAdminUsers();
  const { data: stats, isLoading: isLoadingStats } = useAdminStats();
  const updatePlan = useUpdateUserPlan();
  const { showToast } = useToast();

  // Redirect if not admin (double check on frontend)
  if (currentUser && currentUser.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const handleUpdatePlan = (userId: string, plan: string) => {
    updatePlan.mutate({ id: userId, plan }, {
      onSuccess: () => showToast("Plano atualizado com sucesso!", "success"),
      onError: () => showToast("Erro ao atualizar plano", "error"),
    });
  };

  const columns = [
    {
      key: "name" as const,
      label: "Usuário",
      render: (value: string, user: User) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground font-black text-xs">
            {value.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-foreground">{value}</span>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
              <Mail className="h-3 w-3 opacity-50" />
              {user.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "role" as const,
      label: "Acesso",
      render: (value: string) => (
        <Badge 
          variant={value === "ADMIN" ? "default" : "outline"} 
          className={cn(
            "font-black uppercase text-[9px] tracking-widest",
            value === "ADMIN" ? "bg-purple-500 text-white" : ""
          )}
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "plan" as const,
      label: "Plano Atual",
      render: (value: string) => (
        <Badge 
          variant={value === "FREE" ? "secondary" : "success"}
          className="font-black uppercase text-[9px] tracking-widest"
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "createdAt" as const,
      label: "Membro desde",
      render: (value: string) => (
        <div className="flex items-center gap-2 text-muted-foreground font-medium text-xs">
          <Calendar className="h-3 w-3" />
          {formatDate(value)}
        </div>
      ),
    },
    {
      key: "id" as const,
      label: "Ações",
      render: (_: string, user: User) => (
        <div className="flex justify-end gap-2">
          {user.plan !== "PRO" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleUpdatePlan(user.id, "PRO")}
              className="h-8 text-[9px] font-black uppercase tracking-widest border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/10"
            >
              Ativar PRO
            </Button>
          )}
          {user.plan !== "FREE" && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleUpdatePlan(user.id, "FREE")}
              className="h-8 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:bg-muted"
            >
              Downgrade
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (isLoadingUsers || isLoadingStats) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-bold tracking-tight text-muted-foreground animate-pulse">Acessando Terminal de Controle...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black text-purple-500 uppercase tracking-[0.4em]">
            <ShieldCheck className="h-3 w-3" />
            Admin Backoffice
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic">Control Panel</h1>
          <p className="text-muted-foreground font-medium text-lg">
            Visão centralizada de todos os <span className="text-foreground font-bold italic underline decoration-purple-500 decoration-2 underline-offset-4">parceiros da plataforma</span>.
          </p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-4">
        <Card className="border-none bg-card/40 backdrop-blur-xl shadow-2xl shadow-black/5 rounded-3xl">
          <CardContent className="p-8">
            <div className="flex flex-col gap-4">
              <div className="p-3 bg-muted rounded-2xl w-fit">
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Users</p>
                <p className="text-2xl font-black">{stats?.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-emerald-500/5 backdrop-blur-xl shadow-2xl shadow-emerald-500/5 rounded-3xl">
          <CardContent className="p-8">
            <div className="flex flex-col gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-2xl w-fit text-emerald-600">
                <Crown className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Pro Plan</p>
                <p className="text-2xl font-black text-emerald-600">{stats?.proUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-purple-500/5 backdrop-blur-xl shadow-2xl shadow-purple-500/5 rounded-3xl">
          <CardContent className="p-8">
            <div className="flex flex-col gap-4">
              <div className="p-3 bg-purple-500/10 rounded-2xl w-fit text-purple-600">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Enterprise</p>
                <p className="text-2xl font-black text-purple-600">{stats?.enterpriseUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-muted/20 backdrop-blur-xl shadow-2xl shadow-black/5 rounded-3xl">
          <CardContent className="p-8">
            <div className="flex flex-col gap-4">
              <div className="p-3 bg-muted rounded-2xl w-fit text-muted-foreground">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Growth</p>
                <p className="text-2xl font-black">---</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none bg-card/40 backdrop-blur-xl shadow-2xl shadow-black/5 overflow-hidden rounded-[2.5rem]">
        <Table
          columns={columns}
          data={users}
          emptyMessage="Nenhum usuário encontrado."
        />
      </Card>
    </div>
  );
}
