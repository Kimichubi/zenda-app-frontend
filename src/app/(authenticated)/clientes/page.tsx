"use client";

import { useState } from "react";
import { ClientTable } from "@/features/clients/client-table";
import { ClientForm } from "@/features/clients/client-form";
import { Modal, Button, useToast } from "@/components/ui";
import {
  useClients,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
} from "@/hooks";
import type { Client, ClientFormData } from "@/types";

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
    if (editingClient) {
      updateClient.mutate(
        { id: editingClient.id, data: formData },
        {
          onSuccess: () => {
            showToast("Cliente atualizado!", "success");
            setIsModalOpen(false);
            setEditingClient(null);
          },
          onError: () => showToast("Erro ao atualizar", "error"),
        },
      );
    } else {
      createClient.mutate(formData, {
        onSuccess: () => {
          showToast("Cliente cadastrado!", "success");
          setIsModalOpen(false);
        },
        onError: () => showToast("Erro ao cadastrar", "error"),
      });
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteClient.mutate(id, {
      onSuccess: () => showToast("Cliente removido!", "success"),
      onError: () => showToast("Erro ao remover", "error"),
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-gray-500">Carregando...</p>
      </div>
    );
  }

  const clients = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
        <Button onClick={() => setIsModalOpen(true)}>Novo cliente</Button>
      </div>

      <ClientTable
        clients={clients}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Anterior
          </Button>
          <span className="flex items-center text-sm text-gray-600">
            Página {page} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Próxima
          </Button>
        </div>
      )}

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={editingClient ? "Editar cliente" : "Novo cliente"}
      >
        <ClientForm
          onSubmit={handleSubmit}
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
