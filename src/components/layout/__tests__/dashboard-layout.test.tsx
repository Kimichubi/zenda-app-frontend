import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
  useRouter: () => ({ push: vi.fn() }),
}));

describe("DashboardLayout", () => {
  it("renders sidebar", () => {
    render(
      <DashboardLayout>
        <p>Content</p>
      </DashboardLayout>,
    );
    expect(screen.getByText("Zenda")).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <DashboardLayout>
        <p>Dashboard Content</p>
      </DashboardLayout>,
    );
    expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
  });

  it("renders with header", () => {
    render(
      <DashboardLayout>
        <p>Content</p>
      </DashboardLayout>,
    );
    // Should have main content area
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
