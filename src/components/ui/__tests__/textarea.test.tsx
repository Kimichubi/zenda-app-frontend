import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Textarea } from "@/components/ui/textarea";

describe("Textarea", () => {
  it("renders with placeholder", () => {
    render(<Textarea placeholder="Type here" />);
    expect(screen.getByPlaceholderText("Type here")).toBeInTheDocument();
  });

  it("accepts user input", async () => {
    const user = userEvent.setup();
    render(<Textarea placeholder="Notes" />);
    const textarea = screen.getByPlaceholderText("Notes");
    await user.type(textarea, "Some notes here");
    expect(textarea).toHaveValue("Some notes here");
  });

  it("shows label when provided", () => {
    render(<Textarea label="Observações" />);
    expect(screen.getByText("Observações")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<Textarea error="Obrigatório" />);
    expect(screen.getByText("Obrigatório")).toBeInTheDocument();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Textarea disabled placeholder="Disabled" />);
    expect(screen.getByPlaceholderText("Disabled")).toBeDisabled();
  });

  it("applies aria-invalid and aria-describedby when error is present", () => {
    render(<Textarea label="Test" error="Erro" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(textarea).toHaveAttribute("aria-describedby");
  });

  it("supports rows prop", () => {
    render(<Textarea rows={5} placeholder="Long text" />);
    expect(screen.getByPlaceholderText("Long text")).toHaveAttribute("rows", "5");
  });
});
