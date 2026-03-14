"use client";

import { Badge, Button, Table } from "@/components/ui";
import { formatCurrency, getStatusLabel, formatDate } from "@/utils";
import type { Payment } from "@/types";
import { DollarSign, CheckCircle2, QrCode, Clock, XCircle, Info } from "lucide-react";

interface PaymentTableProps {
  payments: Payment[];
  onGeneratePix: (appointmentId: string) => void;
  onMarkPaid: (paymentId: string) => void;
  onCancel?: (paymentId: string) => void;
}

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
> = {
  pending: "warning",
  paid: "success",
  overdue: "destructive",
  cancelled: "secondary",
  failed: "destructive",
};

export function PaymentTable({
  payments,
  onGeneratePix,
  onMarkPaid,
  onCancel,
}: PaymentTableProps) {
  const columns = [
    {
      key: "clientName" as const,
      label: "Cliente",
      render: (value: string | undefined, payment: Payment) => {
        const safeValue = value || "Cliente";
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground font-bold text-xs">
                {safeValue.charAt(0).toUpperCase()}
              </div>
              <span className="font-bold">{safeValue}</span>
            </div>
            {payment.reason && (
              <div className="flex items-center gap-1.5 ml-11 text-[10px] text-muted-foreground italic">
                <Info className="h-3 w-3" />
                {payment.reason}
              </div>
            )}
          </div>
        );
      },
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
          {payment.status.toLowerCase() === "pending" && onCancel && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onCancel(payment.id)}
              className="h-8 w-8 p-0 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              aria-label="Cancelar cobrança"
            >
              <XCircle className="h-4 w-4" />
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
