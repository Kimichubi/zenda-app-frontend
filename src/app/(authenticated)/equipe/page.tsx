"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useStaff, useAddStaff, useRemoveStaff, useUpdateStaffProfile, useSchedules, useUpsertSchedule, useBlockedSlots, useBlockSlot, useUnblockSlot } from "@/hooks";
import { useFileUpload } from "@/hooks/use-upload";
import { Button, Input, Card, CardContent, Modal, useToast, Badge } from "@/components/ui";
import { Loader2, UserPlus, Mail, Percent, User, Trash2, Check, X, ShieldCheck, Users, TrendingUp, Phone, Image, FileText, Pencil, Instagram, Upload, Calendar, Clock, Ban } from "lucide-react";
import { cn, getAvatarUrl } from "@/utils";
import type { StaffMember } from "@/types/enterprise";

const roleConfig: Record<StaffMember["role"], { label: string; variant: "default" | "success" | "warning"; className: string }> = {
  ADMIN: {
    label: "Admin",
    variant: "default",
    className: "bg-foreground/10 text-zinc-600 dark:text-zinc-300 border-foreground/10",
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
  const updateProfile = useUpdateStaffProfile();
  const { showToast } = useToast();
  const { uploadAvatar, isUploading: isUploadingAvatar } = useFileUpload();
  const { data: schedules = [] } = useSchedules();
  const upsertSchedule = useUpsertSchedule();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCommissionId, setEditingCommissionId] = useState<string | null>(null);
  const [commissionValue, setCommissionValue] = useState<number>(0);

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [blockedModalOpen, setBlockedModalOpen] = useState(false);
  const [schedulingMember, setSchedulingMember] = useState<StaffMember | null>(null);
  const [blockingMember, setBlockingMember] = useState<StaffMember | null>(null);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);
  const [profileForm, setProfileForm] = useState({ avatarPath: "", bio: "", phone: "", instagramUrl: "" });

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

  const openProfileModal = (member: StaffMember) => {
    setEditingMember(member);
    setProfileForm({
      avatarPath: member.avatarPath || "",
      bio: member.bio || "",
      phone: member.phone || "",
      instagramUrl: member.instagramUrl || "",
    });
    setProfileModalOpen(true);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    const payload: Partial<typeof profileForm> = {};
    if (profileForm.avatarPath) payload.avatarPath = profileForm.avatarPath;
    if (profileForm.bio) payload.bio = profileForm.bio;
    if (profileForm.phone) payload.phone = profileForm.phone;
    if (profileForm.instagramUrl) payload.instagramUrl = profileForm.instagramUrl;
    updateProfile.mutate(
      { id: editingMember.id, data: payload },
      {
        onSuccess: () => {
          showToast("Perfil atualizado!", "success");
          setProfileModalOpen(false);
          setEditingMember(null);
        },
        onError: () => showToast("Erro ao atualizar perfil.", "error"),
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
                    {member.avatarPath ? (
                      <img
                        src={getAvatarUrl(member.avatarPath) ?? undefined}
                        alt={member.name}
                        className="w-16 h-16 rounded-[1.5rem] object-cover border border-primary/20"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-[1.5rem] bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <User className="h-8 w-8 text-primary" />
                      </div>
                    )}
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
                    {member.phone && (
                      <div className="flex items-center gap-2 mt-1 text-muted-foreground font-medium text-xs">
                        <Phone className="h-3 w-3" />
                        {member.phone}
                      </div>
                    )}
                    {member.bio && (
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{member.bio}</p>
                    )}
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
                      className="h-10 w-10 rounded-xl hover:bg-amber-500/10 text-muted-foreground hover:text-amber-500 transition-colors"
                      onClick={() => { setSchedulingMember(member); setScheduleModalOpen(true); }}
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-10 w-10 rounded-xl hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-colors"
                      onClick={() => { setBlockingMember(member); setBlockedModalOpen(true); }}
                    >
                      <Ban className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-10 w-10 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => openProfileModal(member)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
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

      <Modal
        open={profileModalOpen}
        onClose={() => { setProfileModalOpen(false); setEditingMember(null); }}
        title={`Editar Perfil — ${editingMember?.name}`}
        className="max-w-md rounded-[2.5rem]"
      >
        <form onSubmit={handleProfileSubmit} className="space-y-6 p-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 flex items-center gap-1.5">
                <Image className="h-3 w-3" />
                Foto de Perfil
              </label>
              <div className="flex items-center gap-3">
                {profileForm.avatarPath ? (
                  <img
                    src={getAvatarUrl(profileForm.avatarPath) ?? undefined}
                    alt="Preview"
                    className="h-14 w-14 rounded-2xl object-cover border border-border"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                )}
                <label className="flex-1 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const path = await uploadAvatar(file);
                      if (path) setProfileForm((prev) => ({ ...prev, avatarPath: path }));
                    }}
                  />
                  <div className={cn(
                    "h-14 rounded-2xl border border-border/20 flex items-center justify-center gap-2 text-sm font-bold transition-colors hover:bg-accent",
                    isUploadingAvatar && "opacity-50 pointer-events-none"
                  )}>
                    {isUploadingAvatar ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        {profileForm.avatarPath ? "Trocar foto" : "Enviar foto"}
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 flex items-center gap-1.5">
                <FileText className="h-3 w-3" />
                Bio / Especialidade
              </label>
              <Input
                placeholder="Ex: Especialista em degradê e barba..."
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="h-14 rounded-2xl bg-primary/5 border-border/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 flex items-center gap-1.5">
                <Phone className="h-3 w-3" />
                Telefone
              </label>
              <Input
                placeholder="(11) 98888-8888"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="h-14 rounded-2xl bg-primary/5 border-border/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 flex items-center gap-1.5">
                <Instagram className="h-3 w-3" />
                Instagram
              </label>
              <Input
                placeholder="https://instagram.com/usuario"
                value={profileForm.instagramUrl}
                onChange={(e) => setProfileForm({ ...profileForm, instagramUrl: e.target.value })}
                className="h-14 rounded-2xl bg-primary/5 border-border/20"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-16 rounded-[1.5rem] shadow-2xl shadow-primary/20 font-black uppercase tracking-[0.2em] text-[10px] gap-3 mt-4"
            loading={updateProfile.isPending}
          >
            Salvar Perfil
          </Button>
        </form>
      </Modal>

      {/* Schedule Management Modal */}
      <ScheduleManagerModal
        open={scheduleModalOpen}
        onClose={() => { setScheduleModalOpen(false); setSchedulingMember(null); }}
        member={schedulingMember}
        schedules={schedules}
        onSave={(data) => {
          upsertSchedule.mutate({ ...data, professionalId: schedulingMember?.id }, {
            onSuccess: () => showToast("Horário salvo!", "success"),
            onError: () => showToast("Erro ao salvar horário.", "error"),
          });
        }}
        isLoading={upsertSchedule.isPending}
      />

      {/* Blocked Slots Modal */}
      <BlockedSlotsModal
        open={blockedModalOpen}
        onClose={() => { setBlockedModalOpen(false); setBlockingMember(null); }}
        member={blockingMember}
      />
    </div>
  );
}

// Schedule Manager Modal Component
const WEEKDAYS = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Segunda" },
  { value: 2, label: "Terça" },
  { value: 3, label: "Quarta" },
  { value: 4, label: "Quinta" },
  { value: 5, label: "Sexta" },
  { value: 6, label: "Sábado" },
];

interface ScheduleManagerModalProps {
  open: boolean;
  onClose: () => void;
  member: StaffMember | null;
  schedules: any[];
  onSave: (data: {
    weekday: number;
    startTime: string;
    endTime: string;
    slotDuration?: number;
    isActive?: boolean;
    breakStart?: string;
    breakEnd?: string;
  }) => void;
  isLoading: boolean;
}

function ScheduleManagerModal({ open, onClose, member, schedules, onSave, isLoading }: ScheduleManagerModalProps) {
  const memberSchedules = member
    ? schedules.filter((s: any) => s.professionalId === member.id)
    : [];

  const [activeDay, setActiveDay] = useState(1);
  const existing = memberSchedules.find((s: any) => s.weekday === activeDay);

  const [form, setForm] = useState({
    startTime: "09:00",
    endTime: "18:00",
    slotDuration: 30,
    isActive: true,
    breakStart: "",
    breakEnd: "",
  });

  // Reset form when day changes or modal opens
  useEffect(() => {
    if (existing) {
      setForm({
        startTime: existing.startTime,
        endTime: existing.endTime,
        slotDuration: existing.slotDuration || 30,
        isActive: existing.isActive ?? true,
        breakStart: existing.breakStart || "",
        breakEnd: existing.breakEnd || "",
      });
    } else {
      setForm({
        startTime: "09:00",
        endTime: "18:00",
        slotDuration: 30,
        isActive: true,
        breakStart: "",
        breakEnd: "",
      });
    }
  }, [activeDay, existing]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Agenda — ${member?.name}`}
      className="max-w-lg rounded-[2.5rem]"
    >
      <div className="p-2 space-y-6">
        {/* Weekday selector */}
        <div className="flex gap-1 overflow-x-auto pb-2">
          {WEEKDAYS.map((day) => {
            const hasSchedule = memberSchedules.some((s: any) => s.weekday === day.value);
            return (
              <button
                key={day.value}
                onClick={() => setActiveDay(day.value)}
                className={cn(
                  "px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border",
                  activeDay === day.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : hasSchedule
                      ? "bg-primary/5 text-primary border-primary/20"
                      : "bg-muted/30 text-muted-foreground border-border/30"
                )}
              >
                {day.label}
                {hasSchedule && <span className="ml-1">•</span>}
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Ativo</label>
            <button
              onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
              className={cn(
                "h-6 w-11 rounded-full transition-colors relative",
                form.isActive ? "bg-primary" : "bg-muted"
              )}
            >
              <div className={cn(
                "h-4 w-4 rounded-full bg-white absolute top-1 transition-all",
                form.isActive ? "left-6" : "left-1"
              )} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                Início
              </label>
              <Input
                type="time"
                value={form.startTime}
                onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                className="h-14 rounded-2xl bg-primary/5 border-border/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                Fim
              </label>
              <Input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
                className="h-14 rounded-2xl bg-primary/5 border-border/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Pausa (início)</label>
              <Input
                type="time"
                value={form.breakStart}
                onChange={(e) => setForm((f) => ({ ...f, breakStart: e.target.value }))}
                className="h-14 rounded-2xl bg-primary/5 border-border/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Pausa (fim)</label>
              <Input
                type="time"
                value={form.breakEnd}
                onChange={(e) => setForm((f) => ({ ...f, breakEnd: e.target.value }))}
                className="h-14 rounded-2xl bg-primary/5 border-border/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Duração do slot (min)</label>
            <Input
              type="number"
              min={5}
              max={120}
              value={form.slotDuration}
              onChange={(e) => setForm((f) => ({ ...f, slotDuration: Number(e.target.value) }))}
              className="h-14 rounded-2xl bg-primary/5 border-border/20"
            />
          </div>
        </div>

        <Button
          onClick={() => onSave({ weekday: activeDay, ...form })}
          className="w-full h-16 rounded-[1.5rem] shadow-2xl shadow-primary/20 font-black uppercase tracking-[0.2em] text-[10px] gap-3"
          loading={isLoading}
        >
          Salvar Horário
        </Button>
      </div>
    </Modal>
  );
}

// Blocked Slots Modal Component
interface BlockedSlotsModalProps {
  open: boolean;
  onClose: () => void;
  member: StaffMember | null;
}

function BlockedSlotsModal({ open, onClose, member }: BlockedSlotsModalProps) {
  const { showToast } = useToast();
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [reason, setReason] = useState("");

  const today = new Date();
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
  const startDateStr = format(today, "yyyy-MM-dd");
  const endDateStr = format(endOfMonth, "yyyy-MM-dd");

  const { data: blockedSlots = [], isLoading } = useBlockedSlots(
    member?.id || "",
    startDateStr,
    endDateStr
  );
  const blockSlot = useBlockSlot();
  const unblockSlot = useUnblockSlot();

  const handleBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!member || !date) return;
    blockSlot.mutate(
      {
        professionalId: member.id,
        date,
        startTime,
        endTime,
        reason: reason || "Bloqueio manual",
      },
      {
        onSuccess: () => {
          showToast("Bloqueio adicionado!", "success");
          setDate("");
          setReason("");
        },
        onError: () => showToast("Erro ao bloquear.", "error"),
      }
    );
  };

  const handleUnblock = (id: string) => {
    if (confirm("Remover este bloqueio?")) {
      unblockSlot.mutate(id, {
        onSuccess: () => showToast("Bloqueio removido!", "success"),
        onError: () => showToast("Erro ao remover bloqueio.", "error"),
      });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Bloqueios — ${member?.name}`}
      className="max-w-lg rounded-[2.5rem]"
    >
      <div className="p-2 space-y-6">
        <form onSubmit={handleBlock} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Data</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-12 rounded-2xl bg-primary/5 border-border/20"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Início</label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="h-12 rounded-2xl bg-primary/5 border-border/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Fim</label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="h-12 rounded-2xl bg-primary/5 border-border/20"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Motivo (opcional)</label>
            <Input
              placeholder="Ex: Férias, Dia off..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-12 rounded-2xl bg-primary/5 border-border/20"
            />
          </div>
          <Button
            type="submit"
            className="w-full h-14 rounded-[1.5rem] shadow-xl shadow-primary/20 font-black uppercase tracking-[0.2em] text-[10px] gap-2"
            loading={blockSlot.isPending}
          >
            <Ban className="h-4 w-4" />
            Bloquear Período
          </Button>
        </form>

        <div className="space-y-2">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Bloqueios ativos</p>
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : blockedSlots.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">Nenhum bloqueio neste período</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {blockedSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-rose-500/5 border border-rose-500/10"
                >
                  <div>
                    <p className="text-xs font-bold">{slot.date}</p>
                    <p className="text-[10px] text-muted-foreground">{slot.startTime} — {slot.endTime}</p>
                    {slot.reason && <p className="text-[10px] text-rose-500">{slot.reason}</p>}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-lg hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500"
                    onClick={() => handleUnblock(slot.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}