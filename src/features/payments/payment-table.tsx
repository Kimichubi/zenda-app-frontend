"use client";

import { Badge, Button, Table } from "@/components/ui";
import { formatCurrency, getStatusLabel, formatDate } from "@/utils";
import type { Payment } from "@/types";
import { DollarSign, CheckCircle2, QrCode, Clock } from "lucide-react";

interface PaymentTableProps {
  payments: Payment[];
  onGeneratePix: (appointmentId: string) => void;
  onMarkPaid: (paymentId: string) => void;
}

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
> = {
  pending: "warning",
  paid: "success",
  overdue: "destructive",
  cancelled: "secondary",
};

export function PaymentTable({
  payments,
  onGeneratePix,
  onMarkPaid,
}: PaymentTableProps) {
  const columns = [
    {
      key: "clientName" as const,
      label: "Cliente",
      render: (value: string) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground font-bold text-xs">
            {value.charAt(0).toUpperCase()}
          </div>
          <span className="font-bold">{value}</span>
        </div>
      ),
    },
    {
      key: "amount" as const,
      label: "Valor",
      render: (value: number) => (
        <span className="font-mono font-bold text-primary">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: "status" as const,
      label: "Status",
      render: (value: string) => (
        <Badge variant={statusVariant[value.toLowerCase()] || "default"} className="font-bold">
          {getStatusLabel(value)}
        </Badge>
      ),
    },
    {
      key: "createdAt" as const,
      label: "Data",
      render: (value: string) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span className="text-xs font-medium">{formatDate(value)}</span>
        </div>
      ),
    },
    {
      key: "id" as const,
      label: "Ações",
      render: (_: string, payment: Payment) => (
        <div className="flex justify-end gap-2">
          {payment.status.toLowerCase() === "pending" && !payment.pixCode && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onGeneratePix(payment.appointmentId)}
              className="h-8 gap-1.5 text-[11px] font-bold"
            >
              <QrCode className="h-3.5 w-3.5" />
              Gerar Pix
            </Button>
          )}
          {payment.status.toLowerCase() === "pending" && (
            <Button 
              size="sm" 
              onClick={() => onMarkPaid(payment.id)}
              className="h-8 gap-1.5 text-[11px] font-bold shadow-sm"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Confirmar
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={payments}
      emptyMessage="Nenhum pagamento registrado até o momento."
      className="border-none shadow-none"
    />
  );
}
