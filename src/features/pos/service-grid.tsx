"use client";

import { cn, formatCurrency } from "@/utils";
import { Clock, Scissors } from "lucide-react";
import type { PosService } from "@/services/pos";

interface ServiceGridProps {
  services: PosService[];
  selectedServiceId?: string;
  onSelect: (service: PosService) => void;
  className?: string;
}

export function ServiceGrid({ services, selectedServiceId, onSelect, className }: ServiceGridProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <label className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Servicos</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => onSelect(service)}
            className={cn(
              "p-4 rounded-2xl border text-left transition-all duration-200 group cursor-pointer",
              selectedServiceId === service.id
                ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                : "border-border/40 bg-card hover:border-primary/30 hover:bg-primary/[0.03]"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors",
              selectedServiceId === service.id
                ? "bg-primary text-white"
                : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
            )}>
              <Scissors className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold leading-tight line-clamp-1">{service.name}</h3>
            <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground font-medium">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {service.duration}min
              </span>
              <span className="text-primary font-bold text-xs">{formatCurrency(service.price)}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
