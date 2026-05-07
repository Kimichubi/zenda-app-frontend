"use client";

import { useEffect, useState, useCallback } from "react";
import { adminService } from "@/services/admin";
import { useToast, Card, CardContent, Badge, Button, Modal, Input } from "@/components/ui";
import {
  UserPlus, Loader2, Clock, CheckCircle2, XCircle, Building2, ArrowRight,
} from "lucide-react";
import { cn, formatDate } from "@/utils";

export default function OnboardingPage() {
  const { showToast } = useToast();
  const [onboardingUsers, setOnboardingUsers] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newBiz, setNewBiz] = useState({ name: "", slug: "", plan: "PRO" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [users, biz] = await Promise.all([
        adminService.getOnboarding(),
        adminService.listBusinesses(),
      ]);
      setOnboardingUsers(users as any[]);
      setBusinesses(biz);
    } catch {
      showToast("Erro ao carregar dados", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const handleCreateAndLink = async () => {
    if (!newBiz.name || !newBiz.slug || !selectedUser) {
      showToast("Preencha todos os campos", "error");
      return;
    }
    try {
      const business = await adminService.createBusiness({
        name: newBiz.name,
        slug: newBiz.slug,
        ownerId: selectedUser.id,
        plan: newBiz.plan,
      });
      showToast("Negocio criado e usuario vinculado!", "success");
      setShowCreate(false);
      setSelectedUser(null);
      setNewBiz({ name: "", slug: "", plan: "PRO" });
      load();
    } catch {
      showToast("Erro ao criar negocio", "error");
    }
  };

  const handleLinkToBusiness = async (userId: string, businessId: string) => {
    try {
      await adminService.linkUserToBusiness(businessId, userId);
      showToast("Usuario vinculado ao negocio!", "success");
      load();
    } catch {
      showToast("Erro ao vincular", "error");
    }
  };

  const handleAttachToBusiness = (user: any) => {
    setSelectedUser(user);
    setShowCreate(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Onboarding</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {onboardingUsers.length} usuario{onboardingUsers.length !== 1 ? "s" : ""} aguardando onboarding
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <p className="text-xl font-bold">{onboardingUsers.length}</p>
                <p className="text-[10px] text-slate-400 font-medium uppercase">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-xl font-bold">{businesses.length}</p>
                <p className="text-[10px] text-slate-400 font-medium uppercase">Negocios Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <UserPlus className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <p className="text-xl font-bold">{onboardingUsers.length > 0 ? Math.round((businesses.length / (businesses.length + onboardingUsers.length)) * 100) : 100}%</p>
                <p className="text-[10px] text-slate-400 font-medium uppercase">Taxa de Conversao</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onboarding Queue */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-4">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Fila de Onboarding</h3>
        </div>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-purple-500" /></div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {onboardingUsers.length === 0 ? (
                <div className="px-6 py-12 text-center text-sm text-slate-400">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-3 text-emerald-400 opacity-50" />
                  Nenhum usuario aguardando onboarding.
                </div>
              ) : (
                onboardingUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-500 shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email} · {user.phone} · {formatDate(user.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        onChange={(e) => {
                          if (e.target.value) handleLinkToBusiness(user.id, e.target.value);
                        }}
                        className="h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-2 text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                        defaultValue=""
                      >
                        <option value="" disabled>Vincular a...</option>
                        {businesses.map((b) => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                      <Button
                        onClick={() => handleAttachToBusiness(user)}
                        className="h-8 px-3 rounded-lg text-[10px] font-bold gap-1.5 bg-purple-600 hover:bg-purple-700"
                      >
                        <Building2 className="h-3 w-3" /> Criar Negocio
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Business for Onboarding Modal */}
      <Modal open={showCreate} onClose={() => { setShowCreate(false); setSelectedUser(null); }} title={`Criar Negocio para ${selectedUser?.name ?? ""}`}>
        <div className="space-y-4 p-2">
          <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
            <p className="text-xs text-amber-600 font-medium">
              Criando negocio para <strong>{selectedUser?.name}</strong> ({selectedUser?.email})
            </p>
          </div>
          <Input label="Nome do Negocio" value={newBiz.name} onChange={(e) => setNewBiz({ ...newBiz, name: e.target.value })} placeholder="Barbearia do Joao" className="h-12 rounded-xl" />
          <Input label="Slug (URL)" value={newBiz.slug} onChange={(e) => setNewBiz({ ...newBiz, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} placeholder="barbearia-do-joao" className="h-12 rounded-xl" />
          <div className="space-y-2">
            <label className="text-sm font-medium">Plano</label>
            <select value={newBiz.plan} onChange={(e) => setNewBiz({ ...newBiz, plan: e.target.value })}
              className="h-12 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20">
              <option value="PRO">PRO</option>
              <option value="ENTERPRISE">ENTERPRISE</option>
            </select>
          </div>
          <Button onClick={handleCreateAndLink} className="w-full h-12 rounded-xl font-bold bg-purple-600 hover:bg-purple-700 gap-2">
            <ArrowRight className="h-4 w-4" /> Criar e Vincular
          </Button>
        </div>
      </Modal>
    </div>
  );
}
