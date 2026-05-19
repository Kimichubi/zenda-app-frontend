"use client";

import { useState } from "react";
import {
  useMembershipPlans,
  useCreateMembershipPlan,
  useUpdateMembershipPlan,
  useDeleteMembershipPlan,
} from "@/hooks/use-membership";
import { PlanCard } from "@/features/membership/plan-card";
import { PlanForm } from "@/features/membership/plan-form";
import { Button, Modal, useToast, Card, CardContent } from "@/components/ui";
import { Plus, FileText, Loader2, Package } from "lucide-react";
import type { MembershipPlan, MembershipPlanFormData } from "@/types/membership";

export default function MembershipPlansPage() {
  const { data: plans, isLoading } = useMembershipPlans(true);
  const createPlan = useCreateMembershipPlan();
  const updatePlan = useUpdateMembershipPlan();
  const deletePlan = useDeleteMembershipPlan();
  const { showToast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

  const handleSubmit = (data: MembershipPlanFormData) => {
    if (editingPlan) {
      updatePlan.mutate(
        { id: editingPlan.id, data },
        {
          onSuccess: () => {
            showToast("Plano atualizado com sucesso!", "success");
            setShowForm(false);
            setEditingPlan(null);
          },
          onError: () => showToast("Erro ao atualizar plano.", "error"),
        },
      );
    } else {
      createPlan.mutate(data, {
        onSuccess: () => {
          showToast("Plano criado com sucesso!", "success");
          setShowForm(false);
        },
        onError: () => showToast("Erro ao criar plano.", "error"),
      });
    }
  };

  const handleDelete = (plan: MembershipPlan) => {
    if (!confirm(`Tem certeza que deseja excluir o plano "${plan.name}"?`)) return;
    deletePlan.mutate(plan.id, {
      onSuccess: () => showToast("Plano excluido com sucesso!", "success"),
      onError: (err) => showToast(err instanceof Error ? err.message : "Erro ao excluir plano.", "error"),
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading">Planos de Assinatura</h1>
          <p className="text-muted-foreground font-medium mt-1">
            Crie e gerencie planos de assinatura para seus clientes.
          </p>
        </div>
        <Button onClick={() => { setEditingPlan(null); setShowForm(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> Novo Plano
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !plans || plans.length === 0 ? (
        <Card className="border-border/50 rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-1">Nenhum plano de assinatura</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Crie seu primeiro plano de assinatura para comecar a oferecer membresia para seus clientes.
            </p>
            <Button onClick={() => setShowForm(true)} className="mt-6 gap-2">
              <Plus className="h-4 w-4" /> Criar Primeiro Plano
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onEdit={(p) => {
                setEditingPlan(p);
                setShowForm(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal
        open={showForm}
        onClose={() => { setShowForm(false); setEditingPlan(null); }}
        title={editingPlan ? "Editar Plano" : "Novo Plano de Assinatura"}
        className="max-w-3xl"
      >
        <div className="max-h-[70vh] overflow-y-auto">
          <PlanForm
            plan={editingPlan ?? undefined}
            onSubmit={handleSubmit}
            onCancel={() => { setShowForm(false); setEditingPlan(null); }}
            isPending={createPlan.isPending || updatePlan.isPending}
          />
        </div>
      </Modal>
    </div>
  );
}
