import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { BookingForm } from "@/features/booking/booking-form";
import type { Service, TimeSlot } from "@/types";

const mockServices: Service[] = [
  { id: "s1", name: "Corte de cabelo", duration: 30, price: 50 },
  { id: "s2", name: "Barba", duration: 20, price: 30 },
];

const mockSlots: TimeSlot[] = [
  { time: "09:00", available: true },
  { time: "09:30", available: true },
  { time: "10:00", available: false },
];

describe("BookingForm", () => {
  it("renders service selection", () => {
    render(
      <BookingForm
        services={mockServices}
        slots={[]}
        onServiceSelect={vi.fn()}
        onDateSelect={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByText("Corte de cabelo")).toBeInTheDocument();
    expect(screen.getByText("Barba")).toBeInTheDocument();
  });

  it("renders date input", () => {
    render(
      <BookingForm
        services={mockServices}
        slots={[]}
        onServiceSelect={vi.fn()}
        onDateSelect={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByLabelText(/data/i)).toBeInTheDocument();
  });

  it("renders available time slots", () => {
    render(
      <BookingForm
        services={mockServices}
        slots={mockSlots}
        selectedService="s1"
        selectedDate="2026-03-15"
        onServiceSelect={vi.fn()}
        onDateSelect={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByText("09:00")).toBeInTheDocument();
    expect(screen.getByText("09:30")).toBeInTheDocument();
  });

  it("renders client info fields", () => {
    render(
      <BookingForm
        services={mockServices}
        slots={mockSlots}
        selectedService="s1"
        selectedDate="2026-03-15"
        onServiceSelect={vi.fn()}
        onDateSelect={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByPlaceholderText(/seu nome/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/seu telefone/i)).toBeInTheDocument();
  });

  it("calls onServiceSelect when a service is clicked", async () => {
    const user = userEvent.setup();
    const onServiceSelect = vi.fn();
    render(
      <BookingForm
        services={mockServices}
        slots={[]}
        onServiceSelect={onServiceSelect}
        onDateSelect={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );
    await user.click(screen.getByText("Corte de cabelo"));
    expect(onServiceSelect).toHaveBeenCalledWith("s1");
  });

  it("renders submit button", () => {
    render(
      <BookingForm
        services={mockServices}
        slots={mockSlots}
        selectedService="s1"
        selectedDate="2026-03-15"
        onServiceSelect={vi.fn()}
        onDateSelect={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("button", { name: /confirmar agendamento/i }),
    ).toBeInTheDocument();
  });
});
