"use client";

import { cn } from "@/utils";
import * as React from "react";

export interface Column<T> {
  key: keyof T & string;
  label: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
}

export interface TableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  className?: string;
}

export function Table<T extends { id: string }>({
  columns,
  data,
  emptyMessage = "Nenhum registro encontrado",
  className,
}: TableProps<T>) {
  return (
    <div className={cn("relative w-full overflow-auto", className)}>
      <table className="w-full caption-bottom text-sm">
        <thead className="bg-muted/50 border-y border-border/50">
          <tr className="transition-colors hover:bg-muted/50">
            {columns.map((col) => (
              <th
                key={col.key}
                className="h-12 px-6 text-left align-middle font-bold text-muted-foreground uppercase tracking-wider text-[10px]"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="p-16 text-center align-middle text-sm text-muted-foreground italic"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr 
                key={item.id} 
                className="border-b border-border/40 transition-colors hover:bg-muted/30"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-6 py-4 align-middle font-medium"
                  >
                    {col.render
                      ? col.render(item[col.key], item)
                      : String(item[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
