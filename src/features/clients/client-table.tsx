"use client";

import { Pencil, Trash2, Mail, Phone, User } from "lucide-react";
import { formatPhone } from "@/utils";
import type { Client } from "@/types";
import { Table, Button } from "@/components/ui";

interface ClientTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
}

export function ClientTable({ clients, onEdit, onDelete }: ClientTableProps) {
  const columns = [
    {
      key: "name" as const,
      label: "Cliente",
      render: (value: string, client: Client) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
            {value.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-foreground">{value}</span>
            {client.notes && (
              <span className="text-[10px] text-muted-foreground line-clamp-1 max-w-[200px]">
                {client.notes}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "phone" as const,
      label: "Contato",
      render: (value: string, client: Client) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span className="text-xs font-medium">{formatPhone(value)}</span>
          </div>
          {client.email && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span className="text-xs">{client.email}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "id" as const, // Use id for actions column
      label: "Ações",
      render: (_: string, client: Client) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(client)}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10"
            aria-label="Editar"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(client.id)}
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
      data={clients}
      emptyMessage="Nenhum cliente encontrado no seu cadastro."
      className="border-none shadow-none"
    />
  );
}
