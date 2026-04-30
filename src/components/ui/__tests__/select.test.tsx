import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Select } from "@/components/ui/select";

describe("Select", () => {
  const options = [
    { value: "option1", label: "Opção 1" },
    { value: "option2", label: "Opção 2" },
    { value: "option3", label: "Opção 3" },
  ];

  it("renders with label", () => {
    render(<Select label="Escolha" options={options} />);
    expect(screen.getByText("Escolha")).toBeInTheDocument();
  });

  it("renders options", () => {
    render(<Select options={options} />);
    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("");
  });

  it("shows error message", () => {
    render(<Select label="Test" error="Campo obrigatório" options={options} />);
    expect(screen.getByText("Campo obrigatório")).toBeInTheDocument();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Select label="Test" disabled options={options} />);
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("applies aria-invalid and aria-describedby when error is present", () => {
    render(<Select label="Test" error="Erro" options={options} />);
    const select = screen.getByRole("combobox");
    expect(select).toHaveAttribute("aria-invalid", "true");
    expect(select).toHaveAttribute("aria-describedby");
  });

  it("calls onChange when value changes", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Select label="Test" options={options} onChange={handleChange} />);

    await user.selectOptions(screen.getByRole("combobox"), "option2");
    expect(handleChange).toHaveBeenCalledWith("option2");
  });

  it("sets a default value", () => {
    render(<Select label="Test" options={options} defaultValue="option2" />);
    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("option2");
  });
});
