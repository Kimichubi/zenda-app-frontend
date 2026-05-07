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
  ShoppingCart,
  Package,
  Users2,
  Wallet,
  Settings,
} from "lucide-react";
import { cn } from "@/utils";
import { Button } from "@/components/ui";
import { useUser } from "@/hooks";

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/agenda", label: "Agenda", icon: Calendar },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/servicos", label: "Serviços", icon: Scissors },
  { href: "/pagamentos", label: "Pagamentos", icon: CreditCard },
];

const enterpriseNavItems = [
  { href: "/pdv", label: "PDV (Vendas)", icon: ShoppingCart },
  { href: "/inventario", label: "Inventário", icon: Package },
  { href: "/equipe", label: "Equipe", icon: Users2 },
  { href: "/comissoes", label: "Comissões", icon: Wallet },
];

const settingsNavItems = [
  { href: "/configuracoes/whatsapp", label: "WhatsApp", icon: MessageCircle },
  { href: "/perfil", label: "Meu Perfil", icon: Settings },
];

type NavItem = typeof mainNavItems[0];

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const pathname = usePathname();
  const { data: user } = useUser();

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;
    return (
      <Link
        href={item.href}
        title={collapsed ? item.label : undefined}
        className={cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
          collapsed && "justify-center px-2",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        <Icon className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
        {!collapsed && (
          <>
            <span className="tracking-tight">{item.label}</span>
            {isActive && (
              <div className="ml-auto w-1 h-1 rounded-full bg-primary" />
            )}
          </>
        )}
      </Link>
    );
  };

  return (
    <aside className={cn(
      "relative hidden md:flex h-screen flex-col bg-card border-r border-border/60 transition-all duration-300 z-40",
      collapsed ? "w-[68px]" : "w-[260px]"
    )}>
      <div className={cn(
        "flex h-16 items-center border-b border-border/60",
        collapsed ? "justify-center px-2" : "px-6"
      )}>
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/10 transition-transform duration-300 shrink-0">
            <Zap className="w-5 h-5 text-white fill-white/10" />
          </div>
          {!collapsed && (
            <h1 className="text-xl font-bold tracking-tight text-foreground uppercase">Zenda</h1>
          )}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 scrollbar-none space-y-8">
        <div className="space-y-1">
          {!collapsed && (
            <div className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] mb-4 px-3">
              Operacional
            </div>
          )}
          <nav className="space-y-1">
            {mainNavItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>
        </div>

        <div className="space-y-1">
          {!collapsed && (
            <div className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] mb-4 px-3">
              Gestão Enterprise
            </div>
          )}
          <nav className="space-y-1">
            {enterpriseNavItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>
        </div>

        <div className="space-y-1">
          {!collapsed && (
            <div className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] mb-4 px-3">
              Configurações
            </div>
          )}
          <nav className="space-y-1">
            {settingsNavItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>
        </div>

        {user?.role === "ADMIN" && (
          <div className="pt-4 border-t border-border/60 space-y-1">
            {!collapsed && (
              <div className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] px-3 mb-4">
                Sistema
              </div>
            )}
            <Link
              href="/admin"
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                collapsed && "justify-center px-2",
                pathname === "/admin"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
              title={collapsed ? "Backoffice" : undefined}
            >
              <ShieldCheck className={cn("h-5 w-5 shrink-0 transition-colors", pathname === "/admin" ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              {!collapsed && <span className="tracking-tight">Backoffice</span>}
            </Link>
          </div>
        )}
      </div>

      <div className={cn(
        "border-t border-border/60 bg-muted/5",
        collapsed ? "p-2" : "p-4"
      )}>
        <Button
          variant="ghost"
          className={cn(
            "text-muted-foreground hover:bg-destructive/5 hover:text-destructive font-medium text-sm transition-all duration-200 rounded-lg",
            collapsed
              ? "w-full h-10 justify-center"
              : "w-full justify-start gap-3 h-10"
          )}
          onClick={() => {
            localStorage.removeItem("zenda_token");
            localStorage.removeItem("zenda_refresh_token");
            window.location.href = "/login";
          }}
          title="Sair"
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="tracking-tight">Sair</span>}
        </Button>
      </div>
    </aside>
  );
}
