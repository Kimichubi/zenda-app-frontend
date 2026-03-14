"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  CreditCard,
  LogOut,
  Zap,
  Scissors,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/utils";
import { Button } from "@/components/ui";
import { useUser } from "@/hooks";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/agenda", label: "Agenda", icon: Calendar },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/servicos", label: "Serviços", icon: Scissors },
  { href: "/pagamentos", label: "Pagamentos", icon: CreditCard },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: user } = useUser();

  return (
    <aside className="relative hidden md:flex h-screen w-[300px] flex-col bg-card border-r border-border/50 transition-all duration-500 z-40">
      {/* Branding Area */}
      <div className="flex h-20 items-center px-10 border-b border-border/50">
        <Link href="/dashboard" className="flex items-center gap-4 group">
          <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20 group-hover:scale-105 group-hover:rotate-3 transition-all duration-500">
            <Zap className="w-6 h-6 text-white fill-white/10" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-foreground uppercase italic">Zenda</h1>
        </Link>
      </div>

      {/* Navigation Area */}
      <div className="flex-1 overflow-y-auto py-10 px-6 scrollbar-none">
        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-8 px-4 opacity-50">
          Main Menu
        </div>
        <nav className="space-y-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold transition-all duration-300",
                  isActive
                    ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className={cn("h-5 w-5 transition-all duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
                <span className="tracking-tight">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </Link>
            );
          })}

          {/* Admin Link - Only visible to ADMIN */}
          {user?.role === "ADMIN" && (
            <div className="pt-6 mt-6 border-t border-border/50 space-y-3">
              <div className="text-[10px] font-black text-purple-500 uppercase tracking-[0.3em] px-4 opacity-70">
                Administration
              </div>
              <Link
                href="/admin"
                className={cn(
                  "group flex items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold transition-all duration-300",
                  pathname === "/admin"
                    ? "bg-purple-500 text-white shadow-xl shadow-purple-500/20 scale-[1.02]"
                    : "text-muted-foreground hover:bg-purple-500/5 hover:text-purple-600",
                )}
              >
                <ShieldCheck className={cn("h-5 w-5 transition-all duration-300", pathname === "/admin" ? "scale-110" : "group-hover:scale-110")} />
                <span className="tracking-tight">Backoffice</span>
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* Footer Area */}
      <div className="p-6 mt-auto border-t border-border/50 bg-muted/20">
        <Button
          variant="ghost"
          className="w-full justify-start gap-4 rounded-2xl h-14 text-muted-foreground hover:bg-destructive/10 hover:text-destructive font-bold transition-all duration-300"
          onClick={() => {
            localStorage.removeItem("zenda_token");
            localStorage.removeItem("zenda_refresh_token");
            window.location.href = "/login";
          }}
        >
          <LogOut className="h-5 w-5" />
          <span className="tracking-tight">Sair do Sistema</span>
        </Button>
      </div>
    </aside>
  );
}
