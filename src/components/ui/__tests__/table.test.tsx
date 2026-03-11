import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Table } from "@/components/ui/table";

const columns = [
  { key: "name" as const, label: "Nome" },
  { key: "email" as const, label: "Email" },
];

const data = [
  { id: "1", name: "João", email: "joao@test.com" },
  { id: "2", name: "Maria", email: "maria@test.com" },
];

describe("Table", () => {
  it("renders column headers", () => {
    render(<Table columns={columns} data={data} />);
    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("renders data rows", () => {
    render(<Table columns={columns} data={data} />);
    expect(screen.getByText("João")).toBeInTheDocument();
    expect(screen.getByText("maria@test.com")).toBeInTheDocument();
  });

  it("shows empty message when no data", () => {
    render(<Table columns={columns} data={[]} emptyMessage="Nenhum dado" />);
    expect(screen.getByText("Nenhum dado")).toBeInTheDocument();
  });

  it("renders correct number of rows", () => {
    render(<Table columns={columns} data={data} />);
    const rows = screen.getAllByRole("row");
    // 1 header row + 2 data rows
    expect(rows).toHaveLength(3);
  });
});
