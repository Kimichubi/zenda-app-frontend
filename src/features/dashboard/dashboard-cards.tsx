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
  variant: "emerald" | "blue" | "purple" | "rose";
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
    variant: "purple",
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
  purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 ring-purple-500/20",
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
          <Card key={card.key} className="group relative overflow-hidden border border-border/50 bg-card shadow-sm hover:shadow-md transition-all duration-300 rounded-xl">
            <CardContent className="p-5 flex items-center justify-center h-full min-h-[100px] !pt-5">
              <div className="flex items-center gap-4 w-full justify-center">
                <div className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ring-1 transition-all duration-300",
                  variantStyles[card.variant]
                )}>
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                
                <div className="flex flex-col justify-center min-w-0">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest truncate">{card.label}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xl font-bold tracking-tight text-foreground">
                      {card.format(values[card.key])}
                    </p>
                    <div className="flex items-center gap-0.5 text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded shrink-0">
                      <TrendingUp className="h-2.5 w-2.5" />
                      <span>12%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
