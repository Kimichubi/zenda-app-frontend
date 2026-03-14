"use client";

import { Pencil, Trash2, Mail, Phone, User, ChevronRight } from "lucide-react";
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
      label: "Identificação",
      render: (value: string, client: Client) => (
        <div className="flex items-center gap-4 py-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary font-black text-sm shadow-inner shrink-0">
            {value.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-black text-base tracking-tight text-foreground">{value}</span>
            {client.notes && (
              <span className="text-[10px] text-muted-foreground line-clamp-1 max-w-[250px] font-medium mt-0.5">
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
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-foreground font-bold text-sm tracking-tight">
            <Phone className="h-3.5 w-3.5 text-primary/60" />
            <span>{formatPhone(value)}</span>
          </div>
          {client.email && (
            <div className="flex items-center gap-2 text-muted-foreground font-medium text-[11px]">
              <Mail className="h-3.5 w-3.5 opacity-50" />
              <span>{client.email}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "id" as const,
      label: "Ações",
      render: (_: string, client: Client) => (
        <div className="flex justify-end gap-3 px-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(client)}
            className="h-10 w-10 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all shadow-sm border border-transparent hover:border-primary/20"
            aria-label="Editar"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(client.id)}
            className="h-10 w-10 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all shadow-sm border border-transparent hover:border-destructive/20"
            aria-label="Excluir"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <div className="flex h-10 w-10 items-center justify-center opacity-20">
            <ChevronRight className="h-4 w-4" />
          </div>
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
