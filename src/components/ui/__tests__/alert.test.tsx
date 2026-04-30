import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Alert } from "@/components/ui/alert";

describe("Alert", () => {
  it("renders with title and description", () => {
    render(<Alert title="Aviso" description="Alguma informação importante." variant="info" />);
    expect(screen.getByText("Aviso")).toBeInTheDocument();
    expect(screen.getByText("Alguma informação importante.")).toBeInTheDocument();
  });

  it("has role alert", () => {
    render(<Alert title="Test" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("renders success variant with icon", () => {
    render(<Alert title="Sucesso" variant="success" />);
    const alert = screen.getByRole("alert");
    expect(alert.textContent).toContain("Sucesso");
  });

  it("renders error variant with icon", () => {
    render(<Alert title="Erro" variant="error" />);
    const alert = screen.getByRole("alert");
    expect(alert.textContent).toContain("Erro");
  });

  it("renders warning variant with icon", () => {
    render(<Alert title="Atenção" variant="warning" />);
    const alert = screen.getByRole("alert");
    expect(alert.textContent).toContain("Atenção");
  });

  it("can be dismissed when onDismiss is provided", async () => {
    const user = userEvent.setup();
    const handleDismiss = vi.fn();
    render(<Alert title="Dismissable" onDismiss={handleDismiss} />);
    await user.click(screen.getByRole("button", { name: /fechar/i }));
    expect(handleDismiss).toHaveBeenCalled();
  });

  it("does not show dismiss button when onDismiss is not provided", () => {
    render(<Alert title="No dismiss" />);
    expect(screen.queryByRole("button", { name: /fechar/i })).not.toBeInTheDocument();
  });
});
