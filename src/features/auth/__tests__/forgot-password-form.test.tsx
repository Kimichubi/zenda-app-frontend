import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ForgotPasswordForm } from "@/features/auth/forgot-password-form";

describe("ForgotPasswordForm", () => {
  it("renders email field", () => {
    render(<ForgotPasswordForm />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<ForgotPasswordForm />);
    expect(screen.getByRole("button", { name: /enviar/i })).toBeInTheDocument();
  });

  it("shows validation error for invalid email", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);
    await user.type(screen.getByPlaceholderText(/email/i), "invalid");
    await user.click(screen.getByRole("button", { name: /enviar/i }));
    await waitFor(() => {
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
    });
  });

  it("renders link back to login", () => {
    render(<ForgotPasswordForm />);
    expect(screen.getByText(/voltar/i)).toBeInTheDocument();
  });
});
