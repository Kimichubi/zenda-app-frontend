"use client";

import { Badge, Button } from "@/components/ui";
import { formatCurrency, getStatusLabel, formatDate } from "@/utils";
import type { Payment } from "@/types";

interface PaymentTableProps {
  payments: Payment[];
  onGeneratePix: (appointmentId: string) => void;
  onMarkPaid: (paymentId: string) => void;
}

const statusVariant: Record<
  string,
  "default" | "success" | "danger" | "warning" | "info"
> = {
  pending: "warning",
  paid: "success",
  overdue: "danger",
  cancelled: "default",
};

export function PaymentTable({
  payments,
  onGeneratePix,
  onMarkPaid,
}: PaymentTableProps) {
  if (payments.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
        Nenhum pagamento encontrado
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Cliente
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Valor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Data
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {payments.map((payment) => (
            <tr key={payment.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                {payment.clientName}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {formatCurrency(payment.amount)}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <Badge variant={statusVariant[payment.status] || "default"}>
                  {getStatusLabel(payment.status)}
                </Badge>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {formatDate(payment.createdAt)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  {payment.status === "pending" && !payment.pixCode && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onGeneratePix(payment.appointmentId)}
                    >
                      Gerar Pix
                    </Button>
                  )}
                  {payment.status === "pending" && (
                    <Button size="sm" onClick={() => onMarkPaid(payment.id)}>
                      Marcar pago
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
