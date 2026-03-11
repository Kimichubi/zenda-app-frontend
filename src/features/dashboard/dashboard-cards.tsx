"use client";

import { Card } from "@/components/ui";
import { Calendar, DollarSign, Clock, UserX } from "lucide-react";
import { formatCurrency } from "@/utils";

interface DashboardCardsProps {
  todayRevenue: number;
  todayAppointmentsCount: number;
  upcomingCount: number;
  noShowCount: number;
}

const cards = [
  {
    key: "revenue",
    label: "Faturamento do dia",
    icon: DollarSign,
    color: "text-green-600 bg-green-50",
    format: (v: number) => formatCurrency(v),
  },
  {
    key: "appointments",
    label: "Atendimentos hoje",
    icon: Calendar,
    color: "text-blue-600 bg-blue-50",
    format: (v: number) => String(v),
  },
  {
    key: "upcoming",
    label: "Próximos",
    icon: Clock,
    color: "text-indigo-600 bg-indigo-50",
    format: (v: number) => String(v),
  },
  {
    key: "noShow",
    label: "Faltas",
    icon: UserX,
    color: "text-red-600 bg-red-50",
    format: (v: number) => String(v),
  },
] as const;

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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.key}>
            <div className="flex items-center gap-4">
              <div className={`rounded-lg p-3 ${card.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {card.format(values[card.key])}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
