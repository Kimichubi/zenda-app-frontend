import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DashboardCards } from "@/features/dashboard/dashboard-cards";

describe("DashboardCards", () => {
  it("renders revenue card", () => {
    render(
      <DashboardCards
        todayRevenue={350}
        todayAppointmentsCount={5}
        upcomingCount={3}
        noShowCount={1}
      />,
    );
    expect(screen.getByText("Faturamento do dia")).toBeInTheDocument();
    expect(screen.getByText("R$ 350,00")).toBeInTheDocument();
  });

  it("renders appointments count", () => {
    render(
      <DashboardCards
        todayRevenue={0}
        todayAppointmentsCount={5}
        upcomingCount={3}
        noShowCount={1}
      />,
    );
    expect(screen.getByText("Atendimentos hoje")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders upcoming count", () => {
    render(
      <DashboardCards
        todayRevenue={0}
        todayAppointmentsCount={0}
        upcomingCount={3}
        noShowCount={0}
      />,
    );
    expect(screen.getByText("Próximos")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders no show count", () => {
    render(
      <DashboardCards
        todayRevenue={0}
        todayAppointmentsCount={0}
        upcomingCount={0}
        noShowCount={2}
      />,
    );
    expect(screen.getByText("Faltas")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
