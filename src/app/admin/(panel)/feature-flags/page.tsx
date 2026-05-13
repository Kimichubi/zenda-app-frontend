"use client";

import { useState } from "react";
import { useFeatureFlags, useCreateFeatureFlag, useUpdateFeatureFlag, useDeleteFeatureFlag } from "@/hooks/use-admin";
import { useToast, Button, Modal, Input, Card, CardContent, Badge } from "@/components/ui";
import { ToggleLeft, Plus, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/utils";

export default function FeatureFlagsPage() {
  const { data: flags = [], isLoading } = useFeatureFlags();
  const createFlag = useCreateFeatureFlag();
  const updateFlag = useUpdateFeatureFlag();
  const deleteFlag = useDeleteFeatureFlag();
  const { showToast } = useToast();

  const [showCreate, setShowCreate] = useState(false);
  const [newFlag, setNewFlag] = useState({ key: "", name: "", enabled: false, plan: "" });

  const handleCreate = () => {
    if (!newFlag.key || !newFlag.name) {
      showToast("Preencha key e nome", "error");
      return;
    }
    createFlag.mutate(newFlag, {
      onSuccess: () => {
        showToast("Feature flag criada!", "success");
        setShowCreate(false);
        setNewFlag({ key: "", name: "", enabled: false, plan: "" });
      },
      onError: () => showToast("Erro ao criar", "error"),
    });
  };

  const handleToggle = (flag: any) => {
    updateFlag.mutate({ id: flag.id, data: { enabled: !flag.enabled } }, {
      onSuccess: () => showToast("Status atualizado!", "success"),
      onError: () => showToast("Erro ao atualizar", "error"),
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta flag?")) {
      deleteFlag.mutate(id, {
        onSuccess: () => showToast("Flag removida!", "success"),
        onError: () => showToast("Erro ao remover", "error"),
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Feature Flags</h1>
          <p className="text-sm text-muted-foreground mt-1">Controle de funcionalidades por plano</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="h-10 px-4 rounded-lg text-sm font-bold gap-2">
          <Plus className="h-4 w-4" /> Nova Flag
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <Card className="border-border/50 bg-card rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Key</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Nome</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Plano</th>
                    <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Acoes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {flags.map((flag: any) => (
                    <tr key={flag.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs">{flag.key}</td>
                      <td className="px-4 py-3 font-medium">{flag.name}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggle(flag)}
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors",
                            flag.enabled
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          <span className={cn("h-1.5 w-1.5 rounded-full", flag.enabled ? "bg-emerald-500" : "bg-muted-foreground")} />
                          {flag.enabled ? "Ativo" : "Inativo"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        {flag.plan ? (
                          <Badge variant="outline" className="text-[10px]">{flag.plan}</Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">Todos</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDelete(flag.id)}
                          className="h-8 w-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {flags.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                        <ToggleLeft className="h-8 w-8 mx-auto mb-2 opacity-30" />
                        Nenhuma feature flag cadastrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Nova Feature Flag">
        <div className="space-y-4 p-2">
          <Input label="Key (unico)" value={newFlag.key} onChange={(e) => setNewFlag({ ...newFlag, key: e.target.value })} placeholder="ex: new_dashboard" className="h-12 rounded-xl" />
          <Input label="Nome" value={newFlag.name} onChange={(e) => setNewFlag({ ...newFlag, name: e.target.value })} placeholder="Descricao da flag" className="h-12 rounded-xl" />
          <div className="space-y-2">
            <label className="text-sm font-medium">Plano (opcional)</label>
            <select
              value={newFlag.plan}
              onChange={(e) => setNewFlag({ ...newFlag, plan: e.target.value })}
              className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Todos os planos</option>
              <option value="PRO">PRO</option>
              <option value="ENTERPRISE">ENTERPRISE</option>
            </select>
          </div>
          <Button onClick={handleCreate} className="w-full h-12 rounded-xl font-bold" loading={createFlag.isPending}>
            Criar Flag
          </Button>
        </div>
      </Modal>
    </div>
  );
}
