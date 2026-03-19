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
        {/* Header Superior Refinado - Mais Profissional */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-background/95 px-6 md:px-10 backdrop-blur-md z-30">
          <div className="flex items-center gap-6 flex-1">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* Barra de Busca Profissional */}
            <div className="hidden lg:flex items-center gap-2.5 bg-muted/40 border border-border/40 px-3.5 h-9 rounded-lg w-full max-w-sm group focus-within:border-primary/40 focus-within:bg-muted/60 transition-all duration-200">
              <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/50 h-full"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4 h-full">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all relative">
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full ring-2 ring-background" />
              </Button>
              <ThemeToggle />
            </div>
            
            <div className="h-8 w-px bg-border/60 mx-1" />
            
            <Link href="/perfil" className="flex items-center">
              <Button variant="ghost" className="group flex items-center gap-2.5 px-2 h-10 rounded-lg hover:bg-muted/80 transition-all duration-200">
                <div className="flex h-7.5 w-7.5 items-center justify-center rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-200">
                  <User className="h-3.5 w-3.5" />
                </div>
                <div className="flex flex-col items-start justify-center leading-none hidden sm:flex text-left">
                  <span className="text-xs font-semibold tracking-tight">Meu Perfil</span>
                  <span className="text-[9px] text-muted-foreground font-normal mt-0.5">Configurações</span>
                </div>
              </Button>
            </Link>
          </div>
        </header>
        
        {/* Container Principal com Scroll Suave e Layout Robusto */}
        <main className="flex-1 overflow-y-auto scroll-smooth bg-muted/5 dark:bg-background/50" role="main">
          <div className="mx-auto max-w-7xl w-full p-6 md:p-8 lg:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
