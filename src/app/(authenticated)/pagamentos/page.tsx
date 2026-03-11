"use client";

import { PaymentTable } from "@/features/payments/payment-table";
import { usePayments, useGeneratePix, useMarkPaid } from "@/hooks";
import { useToast } from "@/components/ui";

export default function PagamentosPage() {
  const { data: payments = [], isLoading } = usePayments();
  const generatePix = useGeneratePix();
  const markPaid = useMarkPaid();
  const { showToast } = useToast();

  const handleGeneratePix = (appointmentId: string) => {
    generatePix.mutate(appointmentId, {
      onSuccess: () => showToast("Pix gerado com sucesso!", "success"),
      onError: () => showToast("Erro ao gerar Pix", "error"),
    });
  };

  const handleMarkPaid = (paymentId: string) => {
    markPaid.mutate(paymentId, {
      onSuccess: () => showToast("Pagamento confirmado!", "success"),
      onError: () => showToast("Erro ao confirmar pagamento", "error"),
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-gray-500">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Pagamentos</h1>
      <PaymentTable
        payments={payments}
        onGeneratePix={handleGeneratePix}
        onMarkPaid={handleMarkPaid}
      />
    </div>
  );
}
