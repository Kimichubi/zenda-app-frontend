"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X, SlidersHorizontal, ArrowDownNarrowWide, ArrowUpNarrowWide } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ServiceFilters } from "@/types";

interface FilterBarProps {
  onFilterChange: (filters: Partial<ServiceFilters>) => void;
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({ search });
    }, 500);
    return () => clearTimeout(timer);
  }, [search, onFilterChange]);

  const handlePriceChange = useCallback(() => {
    onFilterChange({
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  }, [minPrice, maxPrice, onFilterChange]);

  const clearFilters = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    onFilterChange({ search: "", minPrice: undefined, maxPrice: undefined });
  };

  const hasActiveFilters = search || minPrice || maxPrice;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Buscar serviço por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-12 bg-card/50 border-border/50 focus:bg-card transition-all rounded-xl shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={isExpanded ? "secondary" : "outline"}
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-12 px-5 gap-2 rounded-xl border-border/50 shadow-sm transition-all"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Filtros</span>
            {hasActiveFilters && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                !
              </span>
            )}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="h-12 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
            >
              Limpar
            </Button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <ArrowDownNarrowWide className="h-3 w-3" />
              Preço Mínimo
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">R$</span>
              <Input
                type="number"
                placeholder="0,00"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                onBlur={handlePriceChange}
                className="pl-11 h-11 bg-background/50 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <ArrowUpNarrowWide className="h-3 w-3" />
              Preço Máximo
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">R$</span>
              <Input
                type="number"
                placeholder="999,99"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                onBlur={handlePriceChange}
                className="pl-11 h-11 bg-background/50 rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
