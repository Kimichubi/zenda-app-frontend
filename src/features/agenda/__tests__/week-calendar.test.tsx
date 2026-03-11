import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { WeekCalendar } from "@/features/agenda/week-calendar";
import type { Appointment } from "@/types";

const mockAppointments: Appointment[] = [
  {
    id: "1",
    clientId: "c1",
    clientName: "João Silva",
    serviceId: "s1",
    serviceName: "Corte",
    date: "2026-03-10",
    startTime: "09:00",
    endTime: "09:30",
    status: "scheduled",
    price: 50,
  },
];

describe("WeekCalendar", () => {
  it("renders day headers", () => {
    render(
      <WeekCalendar
        appointments={mockAppointments}
        currentDate="2026-03-10"
        onConfirm={vi.fn()}
        onNavigate={vi.fn()}
      />,
    );
    // Should show day names
    expect(screen.getByText(/seg/i)).toBeInTheDocument();
    expect(screen.getByText(/ter/i)).toBeInTheDocument();
  });

  it("renders appointment in calendar", () => {
    render(
      <WeekCalendar
        appointments={mockAppointments}
        currentDate="2026-03-10"
        onConfirm={vi.fn()}
        onNavigate={vi.fn()}
      />,
    );
    expect(screen.getByText("João Silva")).toBeInTheDocument();
  });

  it("shows navigation buttons", () => {
    render(
      <WeekCalendar
        appointments={mockAppointments}
        currentDate="2026-03-10"
        onConfirm={vi.fn()}
        onNavigate={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("button", { name: /anterior/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /próxima/i }),
    ).toBeInTheDocument();
  });

  it("calls onConfirm when confirm button is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <WeekCalendar
        appointments={mockAppointments}
        currentDate="2026-03-10"
        onConfirm={onConfirm}
        onNavigate={vi.fn()}
      />,
    );
    const confirmBtn = screen.getByRole("button", { name: /confirmar/i });
    await user.click(confirmBtn);
    expect(onConfirm).toHaveBeenCalledWith("1");
  });

  it("calls onNavigate when clicking next week", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(
      <WeekCalendar
        appointments={mockAppointments}
        currentDate="2026-03-10"
        onConfirm={vi.fn()}
        onNavigate={onNavigate}
      />,
    );
    await user.click(screen.getByRole("button", { name: /próxima/i }));
    expect(onNavigate).toHaveBeenCalledWith("next");
  });
});
