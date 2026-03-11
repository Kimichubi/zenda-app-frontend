import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { SignupForm } from "@/features/auth/signup-form";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("SignupForm", () => {
  it("renders all required fields", () => {
    render(<SignupForm />);
    expect(screen.getByPlaceholderText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/senha/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/telefone/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/nome do negócio/i)).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<SignupForm />);
    expect(
      screen.getByRole("button", { name: /criar conta/i }),
    ).toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);
    await user.click(screen.getByRole("button", { name: /criar conta/i }));
    await waitFor(() => {
      expect(screen.getAllByText(/pelo menos/i).length).toBeGreaterThan(0);
    });
  });

  it("renders link to login", () => {
    render(<SignupForm />);
    expect(screen.getByText(/já tem conta/i)).toBeInTheDocument();
  });
});
