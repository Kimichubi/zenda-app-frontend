"use client";

import { cn } from "@/utils";
import type { PosProfessional } from "@/services/pos";
import { User, Star } from "lucide-react";

interface ProfessionalSelectProps {
  professionals: PosProfessional[];
  selectedId?: string;
  onSelect: (professional: PosProfessional) => void;
  className?: string;
}

export function ProfessionalSelect({ professionals, selectedId, onSelect, className }: ProfessionalSelectProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <label className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Profissional</label>
      <div className="grid grid-cols-2 gap-2">
        {professionals.map((pro) => (
          <button
            key={pro.id}
            onClick={() => onSelect(pro)}
            className={cn(
              "p-3 rounded-xl border flex items-center gap-3 transition-all duration-200 text-left",
              selectedId === pro.id
                ? "border-primary bg-primary/10"
                : "border-border/40 bg-card hover:border-primary/30"
            )}
          >
            <div className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors",
              selectedId === pro.id
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground"
            )}>
              <User className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold truncate">{pro.name}</p>
              <p className="text-[9px] text-muted-foreground font-medium capitalize">{pro.role.toLowerCase()}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
