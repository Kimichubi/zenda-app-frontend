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
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.key} className="group relative overflow-hidden border-none bg-card/40 backdrop-blur-xl shadow-2xl shadow-black/5 hover:bg-card transition-all duration-500 rounded-[2rem]">
            <CardContent className="p-8">
              <div className="flex flex-col gap-6">
                <div className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-2xl ring-1 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
                  variantStyles[card.variant]
                )}>
                  <Icon className="h-7 w-7" strokeWidth={2.5} />
                </div>
                
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{card.label}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-black tracking-tighter">
                      {card.format(values[card.key])}
                    </p>
                    <div className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-500">
                      <TrendingUp className="h-3 w-3" />
                      <span>+12%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative background element */}
              <div className={cn(
                "absolute -right-4 -bottom-4 h-24 w-24 opacity-[0.03] transition-transform duration-700 group-hover:scale-150",
                variantStyles[card.variant]
              )}>
                <Icon className="h-full w-full" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
