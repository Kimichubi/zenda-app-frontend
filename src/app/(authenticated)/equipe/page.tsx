"use client";

import { useState } from "react";
import { useStaff, useAddStaff, useRemoveStaff } from "@/hooks";
import { Button, Input, Card, CardContent, Modal, useToast, Badge } from "@/components/ui";
import { Loader2, UserPlus, Mail, Percent, User, Trash2, Check, X, ShieldCheck, Users, TrendingUp } from "lucide-react";
import { cn } from "@/utils";
import type { StaffMember } from "@/types/enterprise";

const roleConfig: Record<StaffMember["role"], { label: string; variant: "default" | "success" | "warning"; className: string }> = {
  ADMIN: {
    label: "Admin",
    variant: "default",
    className: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
  MANAGER: {
    label: "Gerente",
    variant: "success",
    className: "",
  },
  PROFESSIONAL: {
    label: "Profissional",
    variant: "warning",
    className: "",
  },
};

export default function EquipePage() {
  const { data: staff = [], isLoading } = useStaff();
  const addStaff = useAddStaff();
  const removeStaff = useRemoveStaff();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCommissionId, setEditingCommissionId] = useState<string | null>(null);
  const [commissionValue, setCommissionValue] = useState<number>(0);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    commission: 30,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Nome é obrigatório";
    if (!formData.email.trim()) errors.email = "E-mail é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "E-mail inválido";
    if (formData.commission < 0 || formData.commission > 100) errors.commission = "Comissão deve ser entre 0 e 100";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    addStaff.mutate(formData, {
      onSuccess: () => {
        showToast("Profissional adicionado com sucesso!", "success");
        setIsModalOpen(false);
        setFormData({ name: "", email: "", commission: 30 });
        setFormErrors({});
      },
      onError: (err: any) => {
        showToast(err.message || "Erro ao adicionar profissional.", "error");
      },
    });
  };

  const handleRemove = (member: StaffMember) => {
    if (confirm(`Tem certeza que deseja remover ${member.name} da equipe?`)) {
      removeStaff.mutate(member.id, {
        onSuccess: () => showToast("Profissional removido!", "success"),
        onError: () => showToast("Erro ao remover profissional.", "error"),
      });
    }
  };

  const startEditingCommission = (member: StaffMember) => {
    setEditingCommissionId(member.id);
    setCommissionValue(member.baseCommission);
  };

  const cancelEditingCommission = () => {
    setEditingCommissionId(null);
    setCommissionValue(0);
  };

  const saveCommission = (member: StaffMember) => {
    if (commissionValue < 0 || commissionValue > 100) {
      showToast("Comissão deve ser entre 0 e 100", "error");
      return;
    }
    addStaff.mutate(
      { name: member.name, email: member.email, commission: commissionValue },
      {
        onSuccess: () => {
          showToast("Comissão atualizada!", "success");
          setEditingCommissionId(null);
        },
        onError: () => showToast("Erro ao atualizar comissão.", "error"),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Carregando sua equipe...</p>
      </div>
    );
  }

  const totalStaff = staff.length;
  const avgCommission = totalStaff > 0
    ? staff.reduce((sum, m) => sum + m.baseCommission, 0) / totalStaff
    : 0;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest">
            <ShieldCheck className="h-3 w-3" />
            Recursos Humanos
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Sua Equipe</h1>
          <p className="text-muted-foreground font-medium text-sm">
            Gerencie os profissionais e suas <span className="text-primary font-semibold">taxas de comissão</span>.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="h-12 px-6 gap-2 rounded-2xl shadow-xl shadow-primary/20 font-black uppercase tracking-widest text-[10px] transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <UserPlus className="h-4 w-4" />
          Adicionar Profissional
        </Button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border border-border/40 bg-card/20 backdrop-blur-sm rounded-[2rem] overflow-hidden">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-[1.25rem] bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Users className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total de Profissionais</p>
              <p className="text-2xl font-black tracking-tight">{totalStaff}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/40 bg-card/20 backdrop-blur-sm rounded-[2rem] overflow-hidden">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-[1.25rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="h-7 w-7 text-emerald-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Comissão Média</p>
              <p className="text-2xl font-black tracking-tight">{avgCommission.toFixed(1)}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {staff.length === 0 ? (
        <Card className="border border-dashed border-border/40 bg-card/20 backdrop-blur-sm rounded-[2rem] overflow-hidden">
          <CardContent className="py-20 flex flex-col items-center justify-center gap-4">
            <div className="w-20 h-20 rounded-[2rem] bg-primary/5 flex items-center justify-center">
              <Users className="h-10 w-10 text-primary/40" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-lg font-bold tracking-tight">Nenhum profissional cadastrado</p>
              <p className="text-sm text-muted-foreground font-medium">Adicione o primeiro membro à sua equipe.</p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="h-10 px-6 gap-2 rounded-xl shadow-sm text-xs font-bold uppercase tracking-wider transition-all"
            >
              <UserPlus className="h-4 w-4" />
              Adicionar Profissional
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((member) => {
            const role = roleConfig[member.role];
            const isEditing = editingCommissionId === member.id;

            return (
              <Card
                key={member.id}
                className="group border border-border/40 bg-card/20 backdrop-blur-sm shadow-sm rounded-[2rem] overflow-hidden hover:border-primary/30 transition-all duration-500"
              >
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <Badge
                      variant={role?.variant}
                      className={cn("font-black text-[8px] uppercase tracking-[0.2em] px-3", role?.className)}
                    >
                      {role?.label}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-lg font-black tracking-tight text-foreground">{member.name}</h3>
                    <div className="flex items-center gap-2 mt-1 text-muted-foreground font-medium text-xs">
                      <Mail className="h-3 w-3" />
                      {member.email}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/20 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Comissão</p>
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={commissionValue}
                            onChange={(e) => setCommissionValue(Number(e.target.value))}
                            className="h-8 w-20 text-sm rounded-lg bg-primary/5 border-border/20"
                            autoFocus
                          />
                          <span className="text-sm font-bold text-primary">%</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 rounded-lg hover:bg-emerald-500/10"
                            onClick={() => saveCommission(member)}
                          >
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 rounded-lg hover:bg-destructive/10"
                            onClick={cancelEditingCommission}
                          >
                            <X className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditingCommission(member)}
                          className="flex items-center gap-1.5 text-primary hover:opacity-80 transition-opacity cursor-pointer"
                        >
                          <Percent className="h-4 w-4" />
                          <span className="text-2xl font-black tracking-tighter">{member.baseCommission}%</span>
                        </button>
                      )}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-10 w-10 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      onClick={() => handleRemove(member)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={isModalOpen}
        onClose={() => { setIsModalOpen(false); setFormErrors({}); }}
        title="Novo Profissional"
        className="max-w-md rounded-[2.5rem]"
      >
        <form onSubmit={handleSubmit} className="space-y-6 p-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Nome Completo</label>
              <Input
                placeholder="Ex: João Silva"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={cn("h-14 rounded-2xl bg-primary/5 border-border/20", formErrors.name && "border-destructive")}
              />
              {formErrors.name && (
                <p className="text-[10px] font-bold text-destructive ml-1">{formErrors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">E-mail de Acesso</label>
              <Input
                type="email"
                placeholder="joao@exemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={cn("h-14 rounded-2xl bg-primary/5 border-border/20", formErrors.email && "border-destructive")}
              />
              {formErrors.email && (
                <p className="text-[10px] font-bold text-destructive ml-1">{formErrors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Percentual de Comissão (%)</label>
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.commission}
                  onChange={(e) => setFormData({ ...formData, commission: Number(e.target.value) })}
                  className={cn("h-14 rounded-2xl bg-primary/5 border-border/20 pl-12", formErrors.commission && "border-destructive")}
                />
                <Percent className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
              </div>
              {formErrors.commission && (
                <p className="text-[10px] font-bold text-destructive ml-1">{formErrors.commission}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-16 rounded-[1.5rem] shadow-2xl shadow-primary/20 font-black uppercase tracking-[0.2em] text-[10px] gap-3 mt-4"
            loading={addStaff.isPending}
          >
            Confirmar Cadastro
          </Button>
        </form>
      </Modal>
    </div>
  );
}