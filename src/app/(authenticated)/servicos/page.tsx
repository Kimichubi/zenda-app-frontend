"use client";

import { useState } from "react";
import { ServiceTable } from "@/features/services/service-table";
import { ServiceForm } from "@/features/services/service-form";
import { Modal, Button, useToast, Card } from "@/components/ui";
import {
  useServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
} from "@/hooks";
import type { Service } from "@/types";
import { ServiceFormData } from "@/services/services";
import { Plus, Scissors, Loader2 } from "lucide-react";

export default function ServicosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const { data: services = [], isLoading } = useServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();
  const { showToast } = useToast();

  const handleSubmit = (formData: ServiceFormData) => {
    const options = {
      onSuccess: () => {
        showToast(editingService ? "Serviço atualizado!" : "Serviço cadastrado!", "success");
        setIsModalOpen(false);
        setEditingService(null);
      },
      onError: () => showToast("Erro na operação", "error"),
    };

    if (editingService) {
      updateService.mutate({ id: editingService.id, data: formData }, options);
    } else {
      createService.mutate(formData, options);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este serviço?")) {
      deleteService.mutate(id, {
        onSuccess: () => showToast("Serviço removido!", "success"),
        onError: () => showToast("Erro ao remover", "error"),
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Carregando serviços...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Serviços</h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Scissors className="h-4 w-4" />
            Configure o menu de serviços oferecidos
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="sm:w-auto gap-2 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" />
          Novo serviço
        </Button>
      </header>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden rounded-2xl">
        <ServiceTable
          services={services}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={editingService ? "Editar serviço" : "Cadastrar novo serviço"}
      >
        <ServiceForm
          onSubmit={handleSubmit}
          initialData={
            editingService
              ? {
                  name: editingService.name,
                  duration: editingService.duration,
                  price: editingService.price,
                }
              : undefined
          }
          isLoading={createService.isPending || updateService.isPending}
        />
      </Modal>
    </div>
  );
}
