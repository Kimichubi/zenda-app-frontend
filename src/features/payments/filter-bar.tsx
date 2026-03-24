"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X, SlidersHorizontal, Calendar, ArrowDownNarrowWide, ArrowUpNarrowWide } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PaymentFilters } from "@/types";
import { cn } from "@/utils";

interface FilterBarProps {
  onFilterChange: (filters: Partial<PaymentFilters>) => void;
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minAmount, setMinAmount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<string>("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({ search });
    }, 500);
    return () => clearTimeout(timer);
  }, [search, onFilterChange]);

  const handleDateChange = useCallback(() => {
    onFilterChange({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  }, [startDate, endDate, onFilterChange]);

  const handleAmountChange = useCallback(() => {
    onFilterChange({
      minAmount: minAmount ? Number(minAmount) : undefined,
      maxAmount: maxAmount ? Number(maxAmount) : undefined,
    });
  }, [minAmount, maxAmount, onFilterChange]);

  const clearFilters = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setMinAmount("");
    setMaxAmount("");
    onFilterChange({ 
      search: "", 
      startDate: undefined, 
      endDate: undefined, 
      minAmount: undefined, 
      maxAmount: undefined 
    });
  };

  const hasActiveFilters = search || startDate || endDate || minAmount || maxAmount;

  const inputClasses = "h-11 bg-primary/5 border-primary/10 focus:bg-primary/10 focus:border-primary/40 transition-all rounded-xl shadow-none font-bold text-foreground placeholder:text-muted-foreground/50";

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Buscar por cliente ou serviço..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-12 bg-primary/5 border-primary/10 focus:bg-primary/10 focus:border-primary/40 transition-all rounded-xl shadow-none font-bold text-foreground"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
            >
              <X className="h-3 w-3 text-primary" />
            </button>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "h-12 px-5 gap-2 rounded-xl border-primary/10 transition-all shadow-none font-black text-[10px] uppercase tracking-wider",
              isExpanded ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-primary/5 text-primary hover:bg-primary/10"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros Avançados
            {hasActiveFilters && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-current text-[8px] font-black invert ml-1">
                !
              </span>
            )}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="h-12 px-4 text-[10px] font-black uppercase tracking-wider text-rose-500 hover:bg-rose-500/10 transition-all"
            >
              Limpar
            </Button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8 bg-primary/[0.03] backdrop-blur-xl border border-primary/10 rounded-[2.5rem] animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
              <Calendar className="h-3 w-3" />
              Início
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              onBlur={handleDateChange}
              className={inputClasses}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
              <Calendar className="h-3 w-3" />
              Fim
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              onBlur={handleDateChange}
              className={inputClasses}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
              <ArrowDownNarrowWide className="h-3 w-3" />
              Mínimo
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-primary/40">R$</span>
              <Input
                type="number"
                placeholder="0,00"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                onBlur={handleAmountChange}
                className={cn(inputClasses, "pl-10")}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
              <ArrowUpNarrowWide className="h-3 w-3" />
              Máximo
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-primary/40">R$</span>
              <Input
                type="number"
                placeholder="999,99"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                onBlur={handleAmountChange}
                className={cn(inputClasses, "pl-10")}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
