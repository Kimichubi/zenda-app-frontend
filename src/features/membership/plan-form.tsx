"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input, Select, Textarea, useToast } from "@/components/ui";
import { Loader2, Plus, X, Save } from "lucide-react";
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Nome do Plano</label>
          <Input {...register("name")} placeholder="Ex: Corte Ilimitado" error={errors.name?.message} className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Preco Mensal (R$)</label>
          <Input
            {...register("monthlyPrice")}
            type="number"
            step="0.01"
            placeholder="79,90"
            error={errors.monthlyPrice?.message}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Descricao</label>
        <Textarea
          {...register("description")}
          placeholder="Descreva os beneficios do plano..."
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">Faturamento</label>
          <select
            {...register("billingFrequency")}
            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
        <div>
          <label className="text-sm font-medium">Periodo de Teste (dias)</label>
          <Input {...register("trialDays")} type="number" placeholder="0" className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Compromisso Minimo (meses)</label>
          <Input {...register("minCommitmentMonths")} type="number" placeholder="1" className="mt-1" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">Limite de Usos/Periodo</label>
          <Input
            {...register("usageLimitsPerPeriod")}
            type="number"
            placeholder="Ilimitado"
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Valido por (dias)</label>
          <Input {...register("validDays")} type="number" placeholder="30" className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Max. Assinaturas Ativas</label>
          <Input
            {...register("maxActiveSubscriptions")}
            type="number"
            placeholder="Ilimitado"
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Horario Inicio Validade</label>
          <Input {...register("validStartHour")} type="time" className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Horario Fim Validade</label>
          <Input {...register("validEndHour")} type="time" className="mt-1" />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Beneficios Extras</label>
        <Textarea
          {...register("extraBenefits")}
          placeholder="Desconto em produtos, prioridade no agendamento..."
          className="mt-1"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Regras de Cancelamento</label>
        <Textarea
          {...register("cancellationRules")}
          placeholder="Cancelamento com 30 dias de aviso..."
          className="mt-1"
        />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" {...register("autoRenewal")} className="h-4 w-4 rounded border-border/40 accent-primary" />
        <label className="text-sm font-medium">Renovacao Automatica</label>
      </div>

      <div>
        <label className="text-sm font-medium">Servicos Inclusos</label>
        <div className="mt-2 flex items-center gap-2">
          <select
            className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
            value=""
            onChange={(e) => {
              if (e.target.value) {
                addService(e.target.value);
                e.target.value = "";
              }
            }}
          >
            <option value="">Selecionar servico...</option>
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
          <div className="mt-3 space-y-2">
            {selectedServices.map((s) => (
              <div key={s.serviceId} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                <span className="flex-1 text-sm font-medium">{s.name}</span>
                <input
                  type="number"
                  placeholder="Limite"
                  className="h-8 w-20 rounded border border-input bg-background px-2 text-xs"
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
                  className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" loading={isPending} className="gap-2">
          <Save className="h-4 w-4" />
          {plan ? "Atualizar Plano" : "Criar Plano"}
        </Button>
      </div>
    </form>
  );
}
