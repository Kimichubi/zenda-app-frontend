import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Toast, ToastProvider, useToast } from "@/components/ui/toast";

function TestComponent() {
  const { showToast } = useToast();
  return (
    <button onClick={() => showToast("Success!", "success")}>Show Toast</button>
  );
}

describe("Toast", () => {
  it("renders toast message", () => {
    render(<Toast message="Hello" type="success" onClose={() => {}} />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("applies success style", () => {
    render(<Toast message="OK" type="success" onClose={() => {}} />);
    expect(screen.getByRole("alert").className).toContain("green");
  });

  it("applies error style", () => {
    render(<Toast message="Fail" type="error" onClose={() => {}} />);
    expect(screen.getByRole("alert").className).toContain("red");
  });

  it("calls onClose when dismiss is clicked", async () => {
    const { default: userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Toast message="Close me" type="info" onClose={onClose} />);
    await user.click(screen.getByRole("button", { name: /fechar/i }));
    expect(onClose).toHaveBeenCalled();
  });
});

describe("ToastProvider", () => {
  it("renders children", () => {
    render(
      <ToastProvider>
        <p>Child</p>
      </ToastProvider>,
    );
    expect(screen.getByText("Child")).toBeInTheDocument();
  });

  it("shows toast via context", async () => {
    const { default: userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );
    await user.click(screen.getByText("Show Toast"));
    expect(screen.getByText("Success!")).toBeInTheDocument();
  });
});
