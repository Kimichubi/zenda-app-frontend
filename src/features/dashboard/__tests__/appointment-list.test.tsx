import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AppointmentList } from "@/features/dashboard/appointment-list";
import type { Appointment } from "@/types";

const mockAppointments: Appointment[] = [
  {
    id: "1",
    clientId: "c1",
    clientName: "João Silva",
    serviceId: "s1",
    serviceName: "Corte de cabelo",
    date: "2026-03-10",
    startTime: "09:00",
    endTime: "09:30",
    status: "scheduled",
    price: 50,
  },
  {
    id: "2",
    clientId: "c2",
    clientName: "Maria Souza",
    serviceId: "s1",
    serviceName: "Barba",
    date: "2026-03-10",
    startTime: "10:00",
    endTime: "10:30",
    status: "confirmed",
    price: 30,
  },
];

describe("AppointmentList", () => {
  it("renders appointment items", () => {
    render(
      <AppointmentList appointments={mockAppointments} title="Agenda do dia" />,
    );
    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("Maria Souza")).toBeInTheDocument();
  });

  it("renders title", () => {
    render(
      <AppointmentList appointments={mockAppointments} title="Agenda do dia" />,
    );
    expect(screen.getByText("Agenda do dia")).toBeInTheDocument();
  });

  it("shows empty state when no appointments", () => {
    render(<AppointmentList appointments={[]} title="Agenda do dia" />);
    expect(screen.getByText(/nenhum atendimento/i)).toBeInTheDocument();
  });

  it("shows appointment time", () => {
    render(<AppointmentList appointments={mockAppointments} title="Agenda" />);
    expect(screen.getByText("09:00")).toBeInTheDocument();
  });

  it("shows appointment status", () => {
    render(<AppointmentList appointments={mockAppointments} title="Agenda" />);
    expect(screen.getByText("Agendado")).toBeInTheDocument();
    expect(screen.getByText("Confirmado")).toBeInTheDocument();
  });
});
