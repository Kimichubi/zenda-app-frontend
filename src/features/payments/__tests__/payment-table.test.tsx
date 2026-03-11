import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { PaymentTable } from "@/features/payments/payment-table";
import type { Payment } from "@/types";

const mockPayments: Payment[] = [
  {
    id: "p1",
    appointmentId: "a1",
    clientName: "João Silva",
    amount: 50,
    status: "pending",
    pixCode: null,
    paidAt: null,
    createdAt: "2026-03-10",
  },
  {
    id: "p2",
    appointmentId: "a2",
    clientName: "Maria Souza",
    amount: 80,
    status: "paid",
    pixCode: null,
    paidAt: "2026-03-10",
    createdAt: "2026-03-09",
  },
];

describe("PaymentTable", () => {
  it("renders payment data", () => {
    render(
      <PaymentTable
        payments={mockPayments}
        onGeneratePix={vi.fn()}
        onMarkPaid={vi.fn()}
      />,
    );
    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("Maria Souza")).toBeInTheDocument();
  });

  it("renders column headers", () => {
    render(
      <PaymentTable
        payments={mockPayments}
        onGeneratePix={vi.fn()}
        onMarkPaid={vi.fn()}
      />,
    );
    expect(screen.getByText("Cliente")).toBeInTheDocument();
    expect(screen.getByText("Valor")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("shows payment status badge", () => {
    render(
      <PaymentTable
        payments={mockPayments}
        onGeneratePix={vi.fn()}
        onMarkPaid={vi.fn()}
      />,
    );
    expect(screen.getByText("Pendente")).toBeInTheDocument();
    expect(screen.getByText("Pago")).toBeInTheDocument();
  });

  it("shows generate pix button for pending payments", () => {
    render(
      <PaymentTable
        payments={mockPayments}
        onGeneratePix={vi.fn()}
        onMarkPaid={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("button", { name: /gerar pix/i }),
    ).toBeInTheDocument();
  });

  it("calls onMarkPaid when button is clicked", async () => {
    const user = userEvent.setup();
    const onMarkPaid = vi.fn();
    render(
      <PaymentTable
        payments={mockPayments}
        onGeneratePix={vi.fn()}
        onMarkPaid={onMarkPaid}
      />,
    );
    const markPaidBtn = screen.getByRole("button", { name: /marcar pago/i });
    await user.click(markPaidBtn);
    expect(onMarkPaid).toHaveBeenCalledWith("p1");
  });

  it("shows empty state when no payments", () => {
    render(
      <PaymentTable
        payments={[]}
        onGeneratePix={vi.fn()}
        onMarkPaid={vi.fn()}
      />,
    );
    expect(screen.getByText(/nenhum pagamento/i)).toBeInTheDocument();
  });
});
