"use client";

import { useState } from "react";
import { useStaff, useAddStaff } from "@/hooks";
import { Button, Input, Card, CardContent, Modal, useToast, Badge } from "@/components/ui";
import { Loader2, UserPlus, Mail, Percent, User, MoreVertical, ShieldCheck } from "lucide-react";
import { cn } from "@/utils";

export default function EquipePage() {
  const { data: staff = [], isLoading } = useStaff();
  const addStaff = useAddStaff();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    commission: 30,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStaff.mutate(formData, {
      onSuccess: () => {
        showToast("Profissional adicionado com sucesso!", "success");
        setIsModalOpen(false);
        setFormData({ name: "", email: "", commission: 30 });
      },
      onError: (err: any) => {
        showToast(err.message || "Erro ao adicionar profissional.", "error");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Carregando sua equipe...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest text-primary/80">
            <ShieldCheck className="h-3 w-3" />
            Recursos Humanos
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Sua Equipe</h1>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((member) => (
          <Card 
            key={member.id} 
            className="group border border-border/40 bg-card/20 backdrop-blur-sm shadow-sm rounded-[2rem] overflow-hidden hover:border-primary/30 transition-all duration-500"
          >
            <CardContent className="p-8 space-y-6">
              <div className="flex items-start justify-between">
                <div className="w-16 h-16 rounded-[1.5rem] bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 font-black text-[8px] uppercase tracking-[0.2em] px-3">
                  {member.role}
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
                  <div className="flex items-center gap-1.5 text-primary">
                    <Percent className="h-4 w-4" />
                    <span className="text-2xl font-black tracking-tighter">{member.baseCommission}%</span>
                  </div>
                </div>
                <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl hover:bg-primary/10">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
                required
                className="h-14 rounded-2xl bg-primary/5 border-border/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">E-mail de Acesso</label>
              <Input 
                type="email"
                placeholder="joao@exemplo.com" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="h-14 rounded-2xl bg-primary/5 border-border/20"
              />
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
                  required
                  className="h-14 rounded-2xl bg-primary/5 border-border/20 pl-12"
                />
                <Percent className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
              </div>
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
