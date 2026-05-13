"use client";

import { useState, useCallback } from "react";
import { ServiceTable } from "@/features/services/service-table";
import { ServiceForm } from "@/features/services/service-form";
import { FilterBar } from "@/features/services/filter-bar";
import { Modal, Button, useToast, Card } from "@/components/ui";
import {
  useServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
} from "@/hooks";
import type { Service, ServiceFilters } from "@/types";
import { ServiceFormData } from "@/services/services";
import { PageHeader } from "@/components/layout/page-header";
import { Plus, Scissors, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

export default function ServicosPage() {
  const [filters, setFilters] = useState<ServiceFilters>({ page: 1, limit: 10 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const { data, isLoading } = useServices(filters);
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();
  const { showToast } = useToast();

  const handleFilterChange = useCallback((newFilters: Partial<ServiceFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  }, []);

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

  const services = data?.data ?? [];
  const total = data?.total ?? 0;
  const limit = data?.limit ?? filters.limit ?? 10;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        badge={
          <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest">
            <Scissors className="h-3 w-3" />
            Catalogo de Servicos
          </div>
        }
        title="Servicos"
        description={
          <>
            Configure o menu de servicos oferecidos (<span className="text-foreground font-bold">{total}</span> cadastrados)
          </>
        }
        action={
          <Button onClick={() => setIsModalOpen(true)} className="h-10 px-6 gap-2 rounded-lg shadow-sm text-xs font-bold uppercase tracking-wider transition-all">
            <Plus className="h-4 w-4" />
            Novo servico
          </Button>
        }
      />

      <FilterBar onFilterChange={handleFilterChange} />

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden rounded-2xl">
        <ServiceTable
          services={services}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground font-medium">
            Página <span className="text-foreground font-bold">{filters.page}</span> de <span className="text-foreground font-bold">{totalPages}</span>
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={filters.page! <= 1}
              onClick={() => handlePageChange(filters.page! - 1)}
              className="gap-1 h-9"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={filters.page! >= totalPages}
              onClick={() => handlePageChange(filters.page! + 1)}
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
