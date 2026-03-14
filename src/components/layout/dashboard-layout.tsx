"use client";

import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { ThemeToggle } from "./theme-toggle";
import { User, Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui";
import Link from "next/link";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300 overflow-hidden font-sans">
      <Sidebar />
      
      <div className="flex flex-1 flex-col relative overflow-hidden">
        {/* Header Superior Refinado */}
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-border/50 bg-background/80 px-8 md:px-12 backdrop-blur-xl z-30">
          <div className="flex items-center gap-8 flex-1">
            <Button variant="ghost" size="icon" className="md:hidden -ml-2">
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* Barra de Busca Placeholder para Equilíbrio Visual */}
            <div className="hidden lg:flex items-center gap-3 bg-muted/50 border border-border/50 px-4 py-2 rounded-2xl w-full max-w-md group focus-within:border-primary/50 transition-all">
              <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Buscar por cliente ou agendamento..." 
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/60"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background" />
              </Button>
              <ThemeToggle />
            </div>
            
            <div className="h-8 w-px bg-border/60" />
            
            <Link href="/perfil">
              <Button variant="ghost" className="group flex items-center gap-3 pl-1 pr-4 py-1.5 rounded-2xl hover:bg-muted transition-all duration-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex flex-col items-start leading-none hidden sm:flex">
                  <span className="text-sm font-bold tracking-tight">Meu Perfil</span>
                  <span className="text-[10px] text-muted-foreground font-medium mt-1">Configurações</span>
                </div>
              </Button>
            </Link>
          </div>
        </header>
        
        {/* Container Principal com Scroll Suave e Padding Centralizado */}
        <main className="flex-1 overflow-y-auto scroll-smooth bg-[#fdfdfd] dark:bg-background" role="main">
          <div className="mx-auto max-w-[1400px] w-full p-8 md:p-12 lg:p-16 space-y-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
