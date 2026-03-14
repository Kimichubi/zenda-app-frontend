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
} from "lucide-react";
import { cn } from "@/utils";
import { Button } from "@/components/ui";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/agenda", label: "Agenda", icon: Calendar },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/servicos", label: "Serviços", icon: Scissors },
  { href: "/pagamentos", label: "Pagamentos", icon: CreditCard },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="relative flex h-screen w-72 flex-col bg-card border-r border-border transition-all duration-300">
      <div className="flex h-16 items-center px-8 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <Zap className="w-6 h-6 text-primary-foreground fill-primary-foreground/10" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Zenda</h1>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-8 px-4 scrollbar-none">
        <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-6 px-4">
          Navegação
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border bg-card/50">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 rounded-xl h-12 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={() => {
            localStorage.removeItem("zenda_token");
            window.location.href = "/login";
          }}
        >
          <LogOut className="h-5 w-5" />
          <span className="font-semibold">Sair do sistema</span>
        </Button>
      </div>
    </aside>
  );
}
