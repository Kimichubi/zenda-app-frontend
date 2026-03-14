"use client";

import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { ThemeToggle } from "./theme-toggle";
import { User, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui";
import Link from "next/link";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300 overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-1 flex-col relative overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card/30 px-6 md:px-10 backdrop-blur-md z-20">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground hidden sm:flex">
              <Bell className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            <div className="mx-1 h-6 w-px bg-border hidden sm:block" />
            <Link href="/perfil">
              <Button variant="ghost" className="flex items-center gap-2 pl-1 pr-3 md:pr-4 rounded-full hover:bg-accent transition-all text-left">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                  <User className="h-5 w-5" />
                </div>
                <span className="text-sm font-bold tracking-tight hidden sm:inline">Meu Perfil</span>
              </Button>
            </Link>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto" role="main">
          <div className="mx-auto max-w-[1600px] w-full p-6 md:p-10 lg:p-12 space-y-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
