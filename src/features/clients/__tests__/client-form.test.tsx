import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ClientForm } from "@/features/clients/client-form";

describe("ClientForm", () => {
  it("renders all fields", () => {
    render(<ClientForm onSubmit={vi.fn()} />);
    expect(screen.getByPlaceholderText(/nome/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/telefone/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/observações/i)).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<ClientForm onSubmit={vi.fn()} />);
    expect(screen.getByRole("button", { name: /salvar/i })).toBeInTheDocument();
  });

  it("shows validation error for empty name", async () => {
    const user = userEvent.setup();
    render(<ClientForm onSubmit={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: /salvar/i }));
    await waitFor(() => {
      expect(screen.getByText(/pelo menos 2 caracteres/i)).toBeInTheDocument();
    });
  });

  it("calls onSubmit with valid data", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ClientForm onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText(/nome/i), "João");
    await user.type(screen.getByPlaceholderText(/telefone/i), "11999998888");
    await user.type(screen.getByPlaceholderText(/email/i), "joao@test.com");
    await user.click(screen.getByRole("button", { name: /salvar/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
      const callArgs = onSubmit.mock.calls[0][0];
      expect(callArgs).toMatchObject({
        name: "João",
        phone: "11999998888",
        email: "joao@test.com",
      });
    });
  });

  it("fills form with initial data", () => {
    render(
      <ClientForm
        onSubmit={vi.fn()}
        initialData={{
          name: "Maria",
          phone: "11888887777",
          email: "maria@test.com",
          notes: "VIP",
        }}
      />,
    );
    expect(screen.getByDisplayValue("Maria")).toBeInTheDocument();
    expect(screen.getByDisplayValue("11888887777")).toBeInTheDocument();
  });

  it("shows loading state on button", () => {
    render(<ClientForm onSubmit={vi.fn()} isLoading />);
    expect(screen.getByRole("button", { name: /salvar/i })).toBeDisabled();
  });
});
