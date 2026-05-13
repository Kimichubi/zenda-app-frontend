"use client";

import { Card, CardContent } from "@/components/ui";
import { Calendar, DollarSign, Clock, UserX, LucideIcon, TrendingUp } from "lucide-react";
import { formatCurrency, cn } from "@/utils";

interface DashboardCardsProps {
  todayRevenue: number;
  todayAppointmentsCount: number;
  upcomingCount: number;
  noShowCount: number;
}

interface CardConfig {
  key: keyof DashboardCardsProps | "revenue" | "appointments" | "upcoming" | "noShow";
  label: string;
  icon: LucideIcon;
  variant: "emerald" | "blue" | "zinc" | "rose";
  format: (v: number) => string;
}

const cards: CardConfig[] = [
  {
    key: "revenue",
    label: "Faturamento",
    icon: DollarSign,
    variant: "emerald",
    format: (v: number) => formatCurrency(v),
  },
  {
    key: "appointments",
    label: "Atendimentos",
    icon: Calendar,
    variant: "blue",
    format: (v: number) => String(v),
  },
  {
    key: "upcoming",
    label: "Próximos",
    icon: Clock,
    variant: "zinc",
    format: (v: number) => String(v),
  },
  {
    key: "noShow",
    label: "Ausências",
    icon: UserX,
    variant: "rose",
    format: (v: number) => String(v),
  },
];

const variantStyles = {
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20",
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-blue-500/20",
  zinc: "bg-zinc-800/10 text-zinc-700 dark:text-zinc-300 ring-zinc-500/20 dark:bg-zinc-300/10",
  rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/20",
};

export function DashboardCards({
  todayRevenue,
  todayAppointmentsCount,
  upcomingCount,
  noShowCount,
}: DashboardCardsProps) {
  const values: Record<string, number> = {
    revenue: todayRevenue,
    appointments: todayAppointmentsCount,
    upcoming: upcomingCount,
    noShow: noShowCount,
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.key} className="group relative overflow-hidden border border-border/30 bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md hover:shadow-foreground/5 hover:-translate-y-0.5 transition-all duration-300 rounded-2xl">
            <div className={cn(
              "absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500",
              card.variant === "emerald" ? "bg-emerald-500" :
              card.variant === "blue" ? "bg-blue-500" :
              card.variant === "zinc" ? "bg-zinc-500" : "bg-rose-500"
            )} />
            
            <CardContent className="p-6 flex flex-col h-full !pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl ring-1 shadow-inner transition-all duration-500 group-hover:scale-110",
                  variantStyles[card.variant]
                )}>
                  <Icon className="h-6 w-6" strokeWidth={2.5} />
                </div>
                
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0">
                  <TrendingUp className="h-3 w-3" />
                  <span>12%</span>
                </div>
              </div>
                
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground/70 uppercase tracking-[0.15em]">{card.label}</p>
                <p className="text-3xl font-black tracking-tighter text-foreground group-hover:text-foreground/80 transition-colors">
                  {card.format(values[card.key])}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
