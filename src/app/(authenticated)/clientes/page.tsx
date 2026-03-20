"use client";

import { useState } from "react";
import { ClientTable } from "@/features/clients/client-table";
import { ClientForm } from "@/features/clients/client-form";
import { Modal, Button, useToast, Card } from "@/components/ui";
import {
  useClients,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
} from "@/hooks";
import type { Client, ClientFormData } from "@/types";
import { Plus, Users, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export default function ClientesPage() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const { data, isLoading } = useClients(page);
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();
  const { showToast } = useToast();

  const handleSubmit = (formData: ClientFormData) => {
    const options = {
      onSuccess: () => {
        showToast(editingClient ? "Cliente atualizado!" : "Cliente cadastrado!", "success");
        setIsModalOpen(false);
        setEditingClient(null);
      },
      onError: () => showToast("Erro na operação", "error"),
    };

    if (editingClient) {
      updateClient.mutate({ id: editingClient.id, data: formData }, options);
    } else {
      createClient.mutate(formData, options);
    }
  };

  // Corrigindo a mutação para clients
  const handleFormSubmit = (formData: ClientFormData) => {
    const options = {
      onSuccess: () => {
        showToast(editingClient ? "Cliente atualizado!" : "Cliente cadastrado!", "success");
        setIsModalOpen(false);
        setEditingClient(null);
      },
      onError: () => showToast("Erro na operação", "error"),
    };

    if (editingClient) {
      updateClient.mutate({ id: editingClient.id, data: formData }, options);
    } else {
      createClient.mutate(formData, options);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      deleteClient.mutate(id, {
        onSuccess: () => showToast("Cliente removido!", "success"),
        onError: () => showToast("Erro ao remover", "error"),
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Carregando clientes...</p>
      </div>
    );
  }

  const clients = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest">
            <Users className="h-3 w-3" />
            Base de Clientes
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground font-medium text-sm">
            Total de <span className="text-foreground font-bold">{total}</span> clientes cadastrados
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="h-10 px-6 gap-2 rounded-lg shadow-sm text-xs font-bold uppercase tracking-wider transition-all">
          <Plus className="h-4 w-4" />
          Novo cliente
        </Button>
      </header>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden rounded-2xl">
        <ClientTable
          clients={clients}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground font-medium">
            Página <span className="text-foreground font-bold">{page}</span> de <span className="text-foreground font-bold">{totalPages}</span>
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="gap-1 h-9"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="gap-1 h-9"
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={editingClient ? "Editar dados do cliente" : "Cadastrar novo cliente"}
      >
        <ClientForm
          onSubmit={handleFormSubmit}
          initialData={
            editingClient
              ? {
                  name: editingClient.name,
                  phone: editingClient.phone,
                  email: editingClient.email,
                  notes: editingClient.notes,
                }
              : undefined
          }
          isLoading={createClient.isPending || updateClient.isPending}
        />
      </Modal>
    </div>
  );
}
