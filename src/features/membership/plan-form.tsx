"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input, Select, Textarea, useToast } from "@/components/ui";
import { Loader2, Plus, X, Save, Scissors } from "lucide-react";
import type { MembershipPlan, MembershipPlanFormData } from "@/types/membership";
import { useServices } from "@/hooks";

const planSchema = z.object({
  name: z.string().min(1, "Nome e obrigatorio"),
  description: z.string().optional(),
  monthlyPrice: z.coerce.number().min(0, "Preco deve ser maior ou igual a 0"),
  billingFrequency: z.string().default("MONTHLY"),
  usageLimitsPerPeriod: z.coerce.number().min(0).optional(),
  autoRenewal: z.boolean().default(true),
  extraBenefits: z.string().optional(),
  validDays: z.coerce.number().min(0).optional(),
  validStartHour: z.string().optional(),
  validEndHour: z.string().optional(),
  minCommitmentMonths: z.coerce.number().min(0).default(1),
  cancellationRules: z.string().optional(),
  trialDays: z.coerce.number().min(0).default(0),
  maxActiveSubscriptions: z.coerce.number().min(0).optional(),
});

interface PlanFormValues {
  name: string;
  description?: string;
  monthlyPrice: number;
  billingFrequency: string;
  usageLimitsPerPeriod?: number;
  autoRenewal: boolean;
  extraBenefits?: string;
  validDays?: number;
  validStartHour: string;
  validEndHour: string;
  minCommitmentMonths: number;
  cancellationRules?: string;
  trialDays: number;
  maxActiveSubscriptions?: number;
}

interface PlanFormProps {
  plan?: MembershipPlan;
  onSubmit: (data: MembershipPlanFormData) => void;
  onCancel?: () => void;
  isPending?: boolean;
}

export function PlanForm({ plan, onSubmit, onCancel, isPending }: PlanFormProps) {
  const { data: services } = useServices();
  const [selectedServices, setSelectedServices] = useState<
    Array<{ serviceId: string; name: string; usageLimit?: number }>
  >(
    plan?.servicesIncluded?.map((s) => ({
      serviceId: s.serviceId,
      name: s.service.name,
      usageLimit: s.usageLimit ?? undefined,
    })) ?? [],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema) as any,
    defaultValues: plan
      ? {
          name: plan.name,
          description: plan.description ?? "",
          monthlyPrice: plan.monthlyPrice,
          billingFrequency: plan.billingFrequency,
          usageLimitsPerPeriod: plan.usageLimitsPerPeriod ?? undefined,
          autoRenewal: plan.autoRenewal,
          extraBenefits: plan.extraBenefits ?? "",
          validDays: plan.validDays ?? undefined,
          validStartHour: plan.validStartHour ?? "",
          validEndHour: plan.validEndHour ?? "",
          minCommitmentMonths: plan.minCommitmentMonths,
          cancellationRules: plan.cancellationRules ?? "",
          trialDays: plan.trialDays,
          maxActiveSubscriptions: plan.maxActiveSubscriptions ?? undefined,
        }
      : {
          name: "",
          description: "",
          monthlyPrice: 0,
          billingFrequency: "MONTHLY",
          autoRenewal: true,
          minCommitmentMonths: 1,
          trialDays: 0,
        },
  });

  const servicesList = services?.data ?? [];
  const addService = (serviceId: string) => {
    if (selectedServices.some((s) => s.serviceId === serviceId)) return;
    const svc = servicesList.find((s) => s.id === serviceId);
    if (!svc) return;
    setSelectedServices([...selectedServices, { serviceId, name: svc.name }]);
  };

  const removeService = (serviceId: string) => {
    setSelectedServices(selectedServices.filter((s) => s.serviceId !== serviceId));
  };

  const onFormSubmit = (data: PlanFormValues) => {
    onSubmit({
      ...data,
      servicesIncluded: selectedServices.map((s) => ({
        serviceId: s.serviceId,
        usageLimit: s.usageLimit,
      })),
      usageLimitsPerPeriod: data.usageLimitsPerPeriod || undefined,
      validDays: data.validDays || undefined,
      maxActiveSubscriptions: data.maxActiveSubscriptions || undefined,
      extraBenefits: data.extraBenefits || undefined,
      cancellationRules: data.cancellationRules || undefined,
      validStartHour: data.validStartHour || undefined,
      validEndHour: data.validEndHour || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Nome do Plano</label>
          <Input {...register("name")} placeholder="Ex: Corte Ilimitado" error={errors.name?.message} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Preco Mensal (R$)</label>
          <Input
            {...register("monthlyPrice")}
            type="number"
            step="0.01"
            placeholder="79,90"
            error={errors.monthlyPrice?.message}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Descricao</label>
        <Textarea
          {...register("description")}
          placeholder="Descreva os beneficios do plano..."
          className="min-h-[80px]"
        />
      </div>

      <div className="border-t border-border/40 pt-5">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Configuracao de Cobranca</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Faturamento</label>
            <select
              {...register("billingFrequency")}
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="WEEKLY">Semanal</option>
              <option value="BIWEEKLY">Quinzenal</option>
              <option value="MONTHLY">Mensal</option>
              <option value="BIMONTHLY">Bimestral</option>
              <option value="QUARTERLY">Trimestral</option>
              <option value="SEMESTERLY">Semestral</option>
              <option value="YEARLY">Anual</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Periodo de Teste (dias)</label>
            <Input {...register("trialDays")} type="number" placeholder="0" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Compromisso Minimo (meses)</label>
            <Input {...register("minCommitmentMonths")} type="number" placeholder="1" />
          </div>
        </div>
      </div>

      <div className="border-t border-border/40 pt-5">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Limites e Restricoes</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Limite de Usos/Periodo</label>
            <Input {...register("usageLimitsPerPeriod")} type="number" placeholder="Ilimitado" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Valido por (dias)</label>
            <Input {...register("validDays")} type="number" placeholder="30" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Max. Assinaturas Ativas</label>
            <Input {...register("maxActiveSubscriptions")} type="number" placeholder="Ilimitado" />
          </div>
        </div>
      </div>

      <div className="border-t border-border/40 pt-5">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Horario de Validade</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Horario Inicio</label>
            <Input {...register("validStartHour")} type="time" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Horario Fim</label>
            <Input {...register("validEndHour")} type="time" />
          </div>
        </div>
      </div>

      <div className="border-t border-border/40 pt-5">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Beneficios e Regras</p>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Beneficios Extras</label>
            <Textarea
              {...register("extraBenefits")}
              placeholder="Desconto em produtos, prioridade no agendamento..."
              className="min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Regras de Cancelamento</label>
            <Textarea
              {...register("cancellationRules")}
              placeholder="Cancelamento com 30 dias de aviso..."
              className="min-h-[80px]"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/20 border border-border/30">
        <input type="checkbox" {...register("autoRenewal")} className="h-4 w-4 rounded border-border/40 accent-primary cursor-pointer" />
        <label className="text-sm font-semibold text-foreground cursor-pointer select-none">Renovacao Automatica</label>
      </div>

      <div className="border-t border-border/40 pt-5">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Servicos Inclusos</p>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <select
              className="flex h-10 flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  addService(e.target.value);
                  e.target.value = "";
                }
              }}
            >
              <option value="">Adicionar servico...</option>
              {servicesList
                .filter((s) => !selectedServices.some((ss) => ss.serviceId === s.id))
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} - R$ {s.price.toFixed(2)}
                  </option>
                ))}
            </select>
          </div>
          {selectedServices.length > 0 && (
            <div className="space-y-2">
              {selectedServices.map((s) => (
                <div key={s.serviceId} className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/30 group hover:border-primary/20 transition-all">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                    <Scissors className="h-3.5 w-3.5" />
                  </div>
                  <span className="flex-1 text-sm font-semibold">{s.name}</span>
                  <input
                    type="number"
                    placeholder="Limite"
                    className="h-8 w-20 rounded-lg border border-input bg-background px-2.5 text-xs font-medium text-center focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    value={s.usageLimit ?? ""}
                    onChange={(e) =>
                      setSelectedServices(
                        selectedServices.map((ss) =>
                          ss.serviceId === s.serviceId
                            ? { ...ss, usageLimit: e.target.value ? Number(e.target.value) : undefined }
                            : ss,
                        ),
                      )
                    }
                  />
                  <button
                    type="button"
                    onClick={() => removeService(s.serviceId)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-5 border-t border-border/40">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="rounded-xl">
            Cancelar
          </Button>
        )}
        <Button type="submit" loading={isPending} className="gap-2 rounded-xl shadow-lg shadow-primary/20">
          <Save className="h-4 w-4" />
          {plan ? "Atualizar Plano" : "Criar Plano"}
        </Button>
      </div>
    </form>
  );
}
