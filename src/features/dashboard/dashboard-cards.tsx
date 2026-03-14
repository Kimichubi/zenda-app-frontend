"use client";

import { Card, CardContent } from "@/components/ui";
import { Calendar, DollarSign, Clock, UserX, LucideIcon } from "lucide-react";
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
    label: "Faturamento do dia",
    icon: DollarSign,
    variant: "emerald",
    format: (v: number) => formatCurrency(v),
  },
  {
    key: "appointments",
    label: "Atendimentos hoje",
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
    label: "Faltas",
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
          <Card key={card.key} className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:shadow-md hover:border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1",
                  variantStyles[card.variant]
                )}>
                  <Icon className="h-6 w-6" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                  <p className="mt-1 text-2xl font-bold tracking-tight">
                    {card.format(values[card.key])}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
