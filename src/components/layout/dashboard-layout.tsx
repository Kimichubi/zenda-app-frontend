"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { ThemeToggle } from "./theme-toggle";
import { User, Menu, X, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui";
import Link from "next/link";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300 overflow-hidden font-sans">
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className={mobileMenuOpen ? "fixed inset-y-0 left-0 z-40 md:relative md:z-auto" : "hidden md:block"}>
        <Sidebar collapsed={sidebarCollapsed} />
      </div>

      <div className="flex flex-1 flex-col relative overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-background/95 px-4 md:px-6 backdrop-blur-md z-30">
          <div className="flex items-center gap-3 flex-1">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              aria-label={sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </Button>

            <div className="hidden lg:flex items-center gap-2.5 bg-muted/40 border border-border/40 px-3.5 h-9 rounded-lg w-full max-w-sm group focus-within:border-primary/40 focus-within:bg-muted/60 transition-all duration-200">
              <input
                type="text"
                placeholder="Buscar clientes, serviços..."
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/50 h-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 h-full">
            <div className="flex items-center gap-1">
              <ThemeToggle />
            </div>

            <div className="h-8 w-px bg-border/60 mx-1" />

            <Link href="/perfil" className="flex items-center">
              <Button variant="ghost" className="group flex items-center gap-2.5 px-2 h-10 rounded-lg hover:bg-muted/80 transition-all duration-200">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-200">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex flex-col items-start justify-center leading-none hidden sm:flex text-left">
                  <span className="text-xs font-semibold tracking-tight">Meu Perfil</span>
                  <span className="text-[9px] text-muted-foreground font-normal mt-0.5">Configurações</span>
                </div>
              </Button>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto scroll-smooth bg-muted/5 dark:bg-background/50" role="main">
          <div className="mx-auto max-w-7xl w-full p-6 md:p-8 lg:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
