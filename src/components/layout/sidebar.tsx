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
  MessageCircle,
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
  { href: "/configuracoes/whatsapp", label: "WhatsApp", icon: MessageCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: user } = useUser();

  return (
    <aside className="relative hidden md:flex h-screen w-[260px] flex-col bg-card border-r border-border/60 transition-all duration-300 z-40">
      {/* Branding Area - Mais Sóbria */}
      <div className="flex h-16 items-center px-6 border-b border-border/60">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/10 transition-transform duration-300">
            <Zap className="w-4.5 h-4.5 text-white fill-white/10" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground uppercase">Zenda</h1>
        </Link>
      </div>

      {/* Navigation Area */}
      <div className="flex-1 overflow-y-auto py-6 px-3 scrollbar-none">
        <div className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-4 px-3">
          Menu Principal
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className={cn("h-4.5 w-4.5 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                <span className="tracking-tight">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1 h-1 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}

          {/* Admin Link - Estilo Robusto */}
          {user?.role === "ADMIN" && (
            <div className="pt-4 mt-4 border-t border-border/60 space-y-1">
              <div className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest px-3 mb-2">
                Administração
              </div>
              <Link
                href="/admin"
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  pathname === "/admin"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <ShieldCheck className={cn("h-4.5 w-4.5 transition-colors", pathname === "/admin" ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                <span className="tracking-tight">Backoffice</span>
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* Footer Area */}
      <div className="p-4 mt-auto border-t border-border/60 bg-muted/5">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 rounded-lg h-10 text-muted-foreground hover:bg-destructive/5 hover:text-destructive font-medium text-sm transition-all duration-200"
          onClick={() => {
            localStorage.removeItem("zenda_token");
            localStorage.removeItem("zenda_refresh_token");
            window.location.href = "/login";
          }}
        >
          <LogOut className="h-4.5 w-4.5" />
          <span className="tracking-tight">Sair</span>
        </Button>
      </div>
    </aside>
  );
}
