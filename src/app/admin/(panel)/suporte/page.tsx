"use client";

import { useState } from "react";
import { useSupportTickets, useCreateSupportTicket, useUpdateSupportTicket } from "@/hooks/use-admin";
import { useToast, Button, Modal, Input, Card, CardContent, Badge } from "@/components/ui";
import { Headphones, Plus, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn, formatDate } from "@/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
  OPEN: { label: "Aberto", className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  IN_PROGRESS: { label: "Em Andamento", className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  WAITING: { label: "Aguardando", className: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  RESOLVED: { label: "Resolvido", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  CLOSED: { label: "Fechado", className: "bg-muted text-muted-foreground border-border" },
};

const priorityConfig: Record<string, { label: string; className: string }> = {
  LOW: { label: "Baixa", className: "text-muted-foreground" },
  MEDIUM: { label: "Media", className: "text-amber-500" },
  HIGH: { label: "Alta", className: "text-orange-500" },
  URGENT: { label: "Urgente", className: "text-red-500" },
};

export default function SuportePage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [page, setPage] = useState(1);
  const { showToast } = useToast();

  const { data, isLoading } = useSupportTickets({
    status: statusFilter === "all" ? undefined : statusFilter,
    priority: priorityFilter === "all" ? undefined : priorityFilter,
    page,
    limit: 20,
  });

  const createTicket = useCreateSupportTicket();
  const updateTicket = useUpdateSupportTicket();

  const [showCreate, setShowCreate] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: "", description: "", priority: "MEDIUM" });
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [internalNotes, setInternalNotes] = useState("");

  const handleCreate = () => {
    if (!newTicket.subject || !newTicket.description) {
      showToast("Preencha todos os campos", "error");
      return;
    }
    createTicket.mutate(newTicket, {
      onSuccess: () => {
        showToast("Ticket criado!", "success");
        setShowCreate(false);
        setNewTicket({ subject: "", description: "", priority: "MEDIUM" });
      },
      onError: () => showToast("Erro ao criar ticket", "error"),
    });
  };

  const handleUpdateStatus = (ticket: any, status: string) => {
    updateTicket.mutate({ id: ticket.id, data: { status } }, {
      onSuccess: () => showToast("Status atualizado!", "success"),
      onError: () => showToast("Erro ao atualizar", "error"),
    });
  };

  const handleSaveNotes = () => {
    if (!selectedTicket) return;
    updateTicket.mutate({ id: selectedTicket.id, data: { internalNotes } }, {
      onSuccess: () => {
        showToast("Notas salvas!", "success");
        setSelectedTicket(null);
        setInternalNotes("");
      },
      onError: () => showToast("Erro ao salvar notas", "error"),
    });
  };

  const tickets = data?.data ?? [];
  const totalPages = Math.ceil((data?.total ?? 0) / 20);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Suporte</h1>
          <p className="text-sm text-muted-foreground mt-1">Tickets de suporte da plataforma</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="h-10 px-4 rounded-lg text-sm font-bold gap-2">
          <Plus className="h-4 w-4" /> Novo Ticket
        </Button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="h-10 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
          <option value="all">Todos status</option>
          <option value="OPEN">Aberto</option>
          <option value="IN_PROGRESS">Em Andamento</option>
          <option value="WAITING">Aguardando</option>
          <option value="RESOLVED">Resolvido</option>
          <option value="CLOSED">Fechado</option>
        </select>
        <select value={priorityFilter} onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
          className="h-10 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
          <option value="all">Todas prioridades</option>
          <option value="LOW">Baixa</option>
          <option value="MEDIUM">Media</option>
          <option value="HIGH">Alta</option>
          <option value="URGENT">Urgente</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <>
          <Card className="border-border/50 bg-card rounded-xl overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/30">
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Assunto</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Prioridade</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Criado</th>
                      <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Acoes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {tickets.map((ticket: any) => {
                      const s = statusConfig[ticket.status] ?? { label: ticket.status, className: "" };
                      const p = priorityConfig[ticket.priority] ?? { label: ticket.priority, className: "" };
                      return (
                        <tr key={ticket.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-medium">{ticket.subject}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{ticket.description}</p>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className={cn("text-[10px] font-bold uppercase tracking-wider", s.className)}>
                              {s.label}
                            </Badge>
                          </td>
                          <td className={cn("px-4 py-3 text-xs font-bold", p.className)}>{p.label}</td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">{formatDate(ticket.createdAt)}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <select
                                value={ticket.status}
                                onChange={(e) => handleUpdateStatus(ticket, e.target.value)}
                                className="h-8 rounded-lg border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/20"
                              >
                                <option value="OPEN">Aberto</option>
                                <option value="IN_PROGRESS">Em Andamento</option>
                                <option value="WAITING">Aguardando</option>
                                <option value="RESOLVED">Resolvido</option>
                                <option value="CLOSED">Fechado</option>
                              </select>
                              <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => { setSelectedTicket(ticket); setInternalNotes(ticket.internalNotes || ""); }}>
                                Notas
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {tickets.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                          <Headphones className="h-8 w-8 mx-auto mb-2 opacity-30" />
                          Nenhum ticket encontrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Pagina {page} de {totalPages}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Anterior</Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Proxima</Button>
              </div>
            </div>
          )}
        </>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Novo Ticket de Suporte">
        <div className="space-y-4 p-2">
          <Input label="Assunto" value={newTicket.subject} onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })} placeholder="Resumo do problema" className="h-12 rounded-xl" />
          <div className="space-y-2">
            <label className="text-sm font-medium">Descricao</label>
            <textarea
              value={newTicket.description}
              onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
              placeholder="Detalhes do ticket..."
              rows={4}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Prioridade</label>
            <select
              value={newTicket.priority}
              onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
              className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="LOW">Baixa</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
              <option value="URGENT">Urgente</option>
            </select>
          </div>
          <Button onClick={handleCreate} className="w-full h-12 rounded-xl font-bold" loading={createTicket.isPending}>
            Criar Ticket
          </Button>
        </div>
      </Modal>

      <Modal open={!!selectedTicket} onClose={() => { setSelectedTicket(null); setInternalNotes(""); }} title="Notas Internas">
        <div className="space-y-4 p-2">
          <textarea
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            placeholder="Adicione notas internas sobre este ticket..."
            rows={6}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
          <Button onClick={handleSaveNotes} className="w-full h-12 rounded-xl font-bold" loading={updateTicket.isPending}>
            Salvar Notas
          </Button>
        </div>
      </Modal>
    </div>
  );
}
