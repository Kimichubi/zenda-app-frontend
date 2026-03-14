"use client";

import { Pencil, Trash2, Clock, DollarSign } from "lucide-react";
import { formatCurrency } from "@/utils";
import type { Service } from "@/types";
import { Table, Button } from "@/components/ui";

interface ServiceTableProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
}

export function ServiceTable({ services, onEdit, onDelete }: ServiceTableProps) {
  const columns = [
    {
      key: "name" as const,
      label: "Serviço",
      render: (value: string) => (
        <div className="flex flex-col">
          <span className="font-bold text-foreground">{value}</span>
        </div>
      ),
    },
    {
      key: "duration" as const,
      label: "Duração",
      render: (value: number) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium">{value} min</span>
        </div>
      ),
    },
    {
      key: "price" as const,
      label: "Preço",
      render: (value: number) => (
        <div className="flex items-center gap-1.5 font-bold text-primary">
          <DollarSign className="h-4 w-4 opacity-50" />
          <span>{formatCurrency(value)}</span>
        </div>
      ),
    },
    {
      key: "id" as const,
      label: "Ações",
      render: (_: string, service: Service) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(service)}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10"
            aria-label="Editar"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(service.id)}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            aria-label="Excluir"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={services}
      emptyMessage="Nenhum serviço cadastrado."
      className="border-none shadow-none"
    />
  );
}
