"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input, Button } from "@/components/ui";
import type { ClientFilters } from "@/types";

interface FilterBarProps {
  onFilterChange: (filters: Partial<ClientFilters>) => void;
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE" | "">("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({ search });
    }, 500);
    return () => clearTimeout(timer);
  }, [search, onFilterChange]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as "ACTIVE" | "INACTIVE" | "";
    setStatus(val);
    onFilterChange({ status: val || undefined });
  };

  const handleDateChange = (type: "start" | "end", val: string) => {
    if (type === "start") {
      setStartDate(val);
      onFilterChange({ startDate: val || undefined });
    } else {
      setEndDate(val);
      onFilterChange({ endDate: val || undefined });
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setStartDate("");
    setEndDate("");
    onFilterChange({
      search: "",
      status: undefined,
      startDate: undefined,
      endDate: undefined,
    });
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-card/50 rounded-2xl border border-border/50 shadow-sm animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        <div className="md:col-span-5 relative">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
            Pesquisa Geral
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Nome, e-mail ou telefone..."
              className="pl-10 h-11 border-border/40 focus:border-primary/50 transition-all rounded-xl shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <div className="md:col-span-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
            Status
          </label>
          <select
            className="flex h-11 w-full rounded-xl border border-border/40 bg-background px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all shadow-sm"
            value={status}
            onChange={handleStatusChange}
          >
            <option value="">Todos os status</option>
            <option value="ACTIVE">Ativos</option>
            <option value="INACTIVE">Inativos</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
            Cadastrados de
          </label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => handleDateChange("start", e.target.value)}
            className="h-11 border-border/40 focus:border-primary/50 transition-all rounded-xl shadow-sm"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
            Até
          </label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => handleDateChange("end", e.target.value)}
            className="h-11 border-border/40 focus:border-primary/50 transition-all rounded-xl shadow-sm"
          />
        </div>

        <div className="md:col-span-1 flex justify-end">
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="h-11 px-4 gap-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all"
            title="Limpar filtros"
          >
            <X className="h-4 w-4" />
            <span className="md:hidden">Limpar</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
