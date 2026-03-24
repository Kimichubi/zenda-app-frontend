import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ClientTable } from "@/features/clients/client-table";
import type { Client } from "@/types";

const mockClients: Client[] = [
  {
    id: "1",
    name: "João Silva",
    phone: "11999998888",
    email: "joao@test.com",
    notes: "",
    createdAt: "2026-01-01",
  },
  {
    id: "2",
    name: "Maria Souza",
    phone: "11888887777",
    email: "maria@test.com",
    notes: "VIP",
    createdAt: "2026-02-01",
  },
];

describe("ClientTable", () => {
  it("renders client names", () => {
    render(
      <ClientTable clients={mockClients} onEdit={vi.fn()} onDelete={vi.fn()} />,
    );
    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("Maria Souza")).toBeInTheDocument();
  });

  it("renders column headers", () => {
    render(
      <ClientTable clients={mockClients} onEdit={vi.fn()} onDelete={vi.fn()} />,
    );
    expect(screen.getByText("Identificação")).toBeInTheDocument();
    expect(screen.getByText("Contato")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("shows empty message when no clients", () => {
    render(<ClientTable clients={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/nenhum cliente/i)).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(
      <ClientTable clients={mockClients} onEdit={onEdit} onDelete={vi.fn()} />,
    );
    const editButtons = screen.getAllByRole("button", { name: /editar/i });
    await user.click(editButtons[0]);
    expect(onEdit).toHaveBeenCalledWith(mockClients[0]);
  });

  it("calls onDelete when delete button is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(
      <ClientTable
        clients={mockClients}
        onEdit={vi.fn()}
        onDelete={onDelete}
      />,
    );
    const deleteButtons = screen.getAllByRole("button", { name: /excluir/i });
    await user.click(deleteButtons[0]);
    expect(onDelete).toHaveBeenCalledWith("1");
  });
});
