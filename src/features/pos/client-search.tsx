"use client";

import { useState } from "react";
import { Search, UserPlus, X, Phone, Mail, User } from "lucide-react";
import { Input, Button } from "@/components/ui";
import { useSearchPosClients, useCreateWalkInClient } from "@/hooks/use-pos";
import { cn } from "@/utils";

interface ClientSearchProps {
  onSelectClient: (client: { id: string; name: string; phone: string }) => void;
  selectedClientId?: string;
  className?: string;
}

export function ClientSearch({ onSelectClient, selectedClientId, className }: ClientSearchProps) {
  const [query, setQuery] = useState("");
  const [showWalkIn, setShowWalkIn] = useState(false);
  const [walkInName, setWalkInName] = useState("");
  const [walkInPhone, setWalkInPhone] = useState("");

  const { data: clients = [], isLoading } = useSearchPosClients(query);
  const createWalkIn = useCreateWalkInClient();

  const handleWalkIn = async () => {
    if (!walkInName || !walkInPhone) return;
    try {
      const client = await createWalkIn.mutateAsync({
        name: walkInName,
        phone: walkInPhone,
      });
      onSelectClient(client);
      setShowWalkIn(false);
      setWalkInName("");
      setWalkInPhone("");
    } catch {}
  };

  return (
    <div className={cn("space-y-3", className)}>
      <label className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Cliente</label>

      {showWalkIn ? (
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary">Novo cliente (Walk-in)</span>
            <button onClick={() => setShowWalkIn(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Nome completo"
                value={walkInName}
                onChange={(e) => setWalkInName(e.target.value)}
                className="pl-10 h-11 rounded-xl bg-background border-border/40 text-sm"
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Telefone (obrigatorio)"
                value={walkInPhone}
                onChange={(e) => setWalkInPhone(e.target.value)}
                className="pl-10 h-11 rounded-xl bg-background border-border/40 text-sm"
              />
            </div>
          </div>
          <Button
            onClick={handleWalkIn}
            disabled={!walkInName || !walkInPhone || createWalkIn.isPending}
            className="w-full h-11 rounded-xl text-xs font-bold gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Criar e Selecionar
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou telefone..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-11 rounded-xl bg-primary/5 border-primary/10 text-sm font-medium"
              autoFocus
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {!query && (
            <button
              onClick={() => setShowWalkIn(true)}
              className="w-full h-10 rounded-xl border border-dashed border-primary/20 text-primary/70 hover:text-primary hover:border-primary/40 text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Cliente sem cadastro (Walk-in)
            </button>
          )}

          {query && clients.length > 0 && (
            <div className="bg-card border border-border/40 rounded-2xl overflow-hidden max-h-64 overflow-y-auto">
              {clients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => onSelectClient(client)}
                  className={cn(
                    "w-full p-3 flex items-center gap-3 hover:bg-primary/5 transition-colors text-left border-b border-border/20 last:border-0",
                    selectedClientId === client.id && "bg-primary/10 border-primary/20"
                  )}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate">{client.name}</p>
                    <p className="text-[10px] text-muted-foreground">{client.phone}</p>
                  </div>
                  {client.pointsBalance > 0 && (
                    <span className="text-[9px] font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">
                      {client.pointsBalance} pts
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {query && !isLoading && clients.length === 0 && (
            <div className="text-center py-6 opacity-50">
              <p className="text-xs font-bold">Nenhum cliente encontrado</p>
              <button
                onClick={() => setShowWalkIn(true)}
                className="text-[10px] text-primary font-bold mt-1 hover:underline"
              >
                Criar novo walk-in
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
