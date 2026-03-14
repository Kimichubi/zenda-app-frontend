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
    expect(screen.getByPlaceholderText(/joão silva/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/exemplo@email.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/\(11\) 99999-9999/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/minha clínica/i)).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<SignupForm />);
    expect(
      screen.getByRole("button", { name: /começar agora/i }),
    ).toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);
    await user.click(screen.getByRole("button", { name: /começar agora/i }));
    await waitFor(() => {
      expect(screen.getAllByText(/pelo menos|inválido|obrigatório/i).length).toBeGreaterThan(0);
    });
  });
});
