"use client";

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui";
import { formatCurrency } from "@/utils";
import { Edit2, Trash2, Users, CreditCard, Clock, Calendar } from "lucide-react";
import type { MembershipPlan } from "@/types/membership";
import { cn } from "@/utils";

interface PlanCardProps {
  plan: MembershipPlan;
  onEdit: (plan: MembershipPlan) => void;
  onDelete: (plan: MembershipPlan) => void;
}

export function PlanCard({ plan, onEdit, onDelete }: PlanCardProps) {
  const frequencyLabels: Record<string, string> = {
    WEEKLY: "Semanal",
    BIWEEKLY: "Quinzenal",
    MONTHLY: "Mensal",
    BIMONTHLY: "Bimestral",
    QUARTERLY: "Trimestral",
    SEMESTERLY: "Semestral",
    YEARLY: "Anual",
  };

  return (
    <Card
      className={cn(
        "border-border/50 rounded-2xl transition-all duration-200 overflow-hidden",
        !plan.isActive && "opacity-60",
      )}
    >
      <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{plan.name}</CardTitle>
            {plan.description && (
              <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(plan)}>
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(plan)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black">{formatCurrency(plan.monthlyPrice)}</span>
          <span className="text-sm text-muted-foreground">/mes</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-xs">
            <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{frequencyLabels[plan.billingFrequency] || plan.billingFrequency}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{plan._count?.subscriptions ?? 0} assinantes</span>
          </div>
          {plan.usageLimitsPerPeriod && (
            <div className="flex items-center gap-2 text-xs">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{plan.usageLimitsPerPeriod} usos/periodo</span>
            </div>
          )}
          {plan.trialDays > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{plan.trialDays} dias gratis</span>
            </div>
          )}
        </div>

        {plan.extraBenefits && (
          <p className="text-xs text-muted-foreground leading-relaxed">{plan.extraBenefits}</p>
        )}

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] font-bold",
              plan.isActive
                ? "border-emerald-500/20 text-emerald-500"
                : "border-muted-foreground/20 text-muted-foreground",
            )}
          >
            {plan.isActive ? "Ativo" : "Inativo"}
          </Badge>
          {plan.minCommitmentMonths > 1 && (
            <Badge variant="outline" className="text-[10px]">
              {plan.minCommitmentMonths} meses minimo
            </Badge>
          )}
        </div>

        {plan.servicesIncluded && plan.servicesIncluded.length > 0 && (
          <div className="pt-3 border-t border-border/30">
            <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2">Servicos Inclusos</p>
            <div className="space-y-1">
              {plan.servicesIncluded.map((s) => (
                <div key={s.id} className="flex items-center justify-between text-xs">
                  <span>{s.service.name}</span>
                  {s.usageLimit && (
                    <span className="text-muted-foreground">Limite: {s.usageLimit}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
