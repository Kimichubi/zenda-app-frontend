"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { ThemeToggle } from "./theme-toggle";
import { User, Menu, X, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui";
import Link from "next/link";
import { useUser } from "@/hooks";
import { cn } from "@/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { data: user } = useUser();

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:relative z-40 h-full shrink-0 transition-all duration-300",
          mobileMenuOpen ? "left-0" : "-left-full md:left-0",
          sidebarCollapsed ? "md:w-[72px]" : "md:w-[256px]"
        )}
      >
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/50 bg-background/95 px-4 md:px-6 backdrop-blur-md z-20">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-muted/40 border border-border/30 px-3 h-9 rounded-lg w-full max-w-md group focus-within:border-primary/20 focus-within:bg-muted/60 transition-all">
              <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Buscar clientes, servicos, agendamentos..."
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/50 h-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 md:gap-2 h-full">
            <ThemeToggle />

            <div className="h-6 w-px bg-border/50 mx-1 hidden sm:block" />

            {/* Notification bell placeholder */}
            <Button variant="ghost" size="icon" className="h-9 w-9 relative hidden sm:flex">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
            </Button>

            {/* User dropdown */}
            <Link href="/perfil" className="flex items-center ml-1">
              <Button
                variant="ghost"
                className="group flex items-center gap-2.5 px-2 h-9 rounded-lg hover:bg-muted/60 transition-all"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() ?? "?"}
                </div>
                <div className="flex flex-col items-start leading-none hidden lg:flex text-left">
                  <span className="text-xs font-semibold tracking-tight truncate max-w-[120px]">
                    {user?.name ?? "Usuario"}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-normal mt-0.5 truncate max-w-[120px]">
                    {user?.email ?? ""}
                  </span>
                </div>
              </Button>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto scroll-smooth bg-muted/20 dark:bg-background/30">
          <div className="mx-auto max-w-7xl w-full p-5 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
