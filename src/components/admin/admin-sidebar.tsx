"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/utils";
import {
  LayoutDashboard,
  Building2,
  UserPlus,
  CreditCard,
  BarChart3,
  Users,
  MessageSquareQuote,
  Bot,
  Wallet,
  ToggleLeft,
  Headphones,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/businesses", icon: Building2, label: "Negocios" },
  { href: "/admin/billing", icon: CreditCard, label: "Faturamento" },
  { href: "/admin/subscriptions", icon: UserPlus, label: "Assinaturas" },
  { href: "/admin/monitoring", icon: BarChart3, label: "Monitoramento" },
  { href: "/admin/usuarios", icon: Users, label: "Usuarios" },
  { href: "/admin/avaliacoes", icon: MessageSquareQuote, label: "Avaliacoes" },
  { href: "/admin/conversas", icon: Bot, label: "Conversas Bot" },
  { href: "/admin/financeiro", icon: Wallet, label: "Financeiro" },
  { href: "/admin/feature-flags", icon: ToggleLeft, label: "Feature Flags" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-border/40 bg-card">
      <div className="flex h-16 items-center gap-3 border-b border-border/40 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <ShieldCheck className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold tracking-tight">Zenda Admin</p>
          <p className="text-[10px] text-muted-foreground font-medium">Platform Control</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4 overflow-y-auto scrollbar-none">
        <div className="px-2 pb-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/50">Menu</p>
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
              )}
              <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/40 px-3 py-4">
        <div className="px-2 pb-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/50">Outros</p>
        </div>
        <Link
          href="/admin/suporte"
          className={cn(
            "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-150",
            pathname === "/admin/suporte"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
          )}
        >
          {pathname === "/admin/suporte" && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
          )}
          <Headphones className={cn("h-4 w-4 shrink-0", pathname === "/admin/suporte" ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
          <span>Suporte</span>
        </Link>
      </div>

      <div className="border-t border-border/40 p-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-3 w-3" />
          Voltar ao Dashboard
        </Link>
      </div>
    </aside>
  );
}
