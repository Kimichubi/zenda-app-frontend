import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Modal } from "@/components/ui/modal";

describe("Modal", () => {
  it("renders when open is true", () => {
    render(
      <Modal open onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>,
    );
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    render(
      <Modal open={false} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>,
    );
    expect(screen.queryByText("Test Modal")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Close Me">
        <p>Content</p>
      </Modal>,
    );
    await user.click(screen.getByRole("button", { name: /fechar/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders with custom footer", () => {
    render(
      <Modal
        open
        onClose={() => {}}
        title="With Footer"
        footer={<button>Save</button>}
      >
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });
});
