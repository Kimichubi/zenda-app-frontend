"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  CreditCard,
  LogOut,
  Scissors,
  ShieldCheck,
  MessageCircle,
  ShoppingCart,
  Package,
  Users2,
  Wallet,
  Settings,
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import { cn } from "@/utils";
import { Button } from "@/components/ui";
import { useUser } from "@/hooks";
import { adminService } from "@/services/admin";
import { authService } from "@/services/auth";
import { Logo } from "./logo";

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: () => void;
}

const navGroups = [
  {
    label: "Principal",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/agenda", label: "Agenda", icon: Calendar },
      { href: "/clientes", label: "Clientes", icon: Users },
      { href: "/servicos", label: "Serviços", icon: Scissors },
      { href: "/pagamentos", label: "Pagamentos", icon: CreditCard },
      { href: "/membros", label: "Membros", icon: Users },
    ],
  },
  {
    label: "Gestão",
    items: [
      { href: "/pdv", label: "PDV (Vendas)", icon: ShoppingCart },
      { href: "/inventario", label: "Inventário", icon: Package },
      { href: "/equipe", label: "Equipe", icon: Users2 },
      { href: "/comissoes", label: "Comissões", icon: Wallet },
      { href: "/faturamento", label: "Faturamento", icon: CreditCard },
      { href: "/configuracoes/membership", label: "Planos", icon: FileText },
    ],
  },
  {
    label: "Configurações",
    items: [
      { href: "/configuracoes", label: "Landing Page", icon: LayoutDashboard },
      { href: "/configuracoes/whatsapp", label: "WhatsApp", icon: MessageCircle },
      { href: "/perfil", label: "Meu Perfil", icon: Settings },
    ],
  },
];

export function Sidebar({ collapsed = false, onCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { data: user } = useUser();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isImpersonating = user?.isImpersonating === true;

  const handleLogout = () => {
    localStorage.removeItem("zenda_token");
    localStorage.removeItem("zenda_refresh_token");
    window.location.href = "/login";
  };

  const handleRestoreAdmin = async () => {
    try {
      const response = await authService.exitImpersonation();
      localStorage.setItem("zenda_token", response.accessToken);
      localStorage.setItem("zenda_refresh_token", response.refreshToken || "");
      window.location.href = "/admin";
    } catch {
      handleLogout();
    }
  };

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r border-border/40 bg-card transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[256px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border/40 px-4 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          {collapsed ? <Logo iconOnly /> : <Logo />}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className={cn("ml-auto h-7 w-7 shrink-0 text-muted-foreground/40 hover:text-foreground", collapsed ? "hidden" : "hidden md:flex")}
          onClick={onCollapse}
          aria-label="Recolher menu"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="mx-auto h-7 w-7 shrink-0 text-muted-foreground/40 hover:text-foreground hidden md:flex"
            onClick={onCollapse}
            aria-label="Expandir menu"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-3 px-3 scrollbar-none">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-4">
            {!collapsed && (
              <p className="px-3 pb-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                {group.label}
              </p>
            )}
            <nav className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = (() => {
                  const a = pathname.split("/").filter(Boolean);
                  const b = item.href.split("/").filter(Boolean);
                  if (a.join("/") === b.join("/")) return true;
                  if (a.length <= b.length) return false;
                  if (!b.every((p, i) => p === a[i])) return false;
                  return !group.items.some((o) => {
                    if (o.href === item.href) return false;
                    const c = o.href.split("/").filter(Boolean);
                    return c.length > b.length && c.every((p, i) => p === a[i]);
                  });
                })();
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl py-2 text-sm font-medium transition-all duration-200",
                      collapsed ? "justify-center px-2" : "px-3",
                      isActive
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                    )}
                  >
                    {isActive && !collapsed && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full shadow-sm shadow-primary/30" />
                    )}
                    <item.icon
                      className={cn(
                        "shrink-0 transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                        collapsed ? "h-5 w-5" : "h-[18px] w-[18px]"
                      )}
                      strokeWidth={isActive ? 2.25 : 1.75}
                    />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}

        {/* Admin link */}
        {user?.role === "PLATFORM_ADMIN" && (
          <div className="mb-4">
            {!collapsed && (
              <p className="px-3 pb-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                Sistema
              </p>
            )}
            <Link
              href="/admin"
              className={cn(
                "group relative flex items-center gap-3 rounded-lg py-2 text-sm font-medium transition-all duration-150",
                collapsed ? "justify-center px-2" : "px-3",
                pathname.startsWith("/admin")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
              title={collapsed ? "Backoffice" : undefined}
            >
              {pathname.startsWith("/admin") && !collapsed && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
              )}
              <ShieldCheck
                className={cn(
                  "shrink-0 transition-colors",
                  pathname.startsWith("/admin") ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                  collapsed ? "h-5 w-5" : "h-[18px] w-[18px]"
                )}
                strokeWidth={pathname.startsWith("/admin") ? 2.25 : 1.75}
              />
              {!collapsed && <span className="truncate">Backoffice</span>}
            </Link>
          </div>
        )}
      </div>

      {/* Bottom area */}
      <div className="border-t border-border/40 p-3 shrink-0 space-y-2">
        {/* Impersonation notice */}
        {isImpersonating && user?.role === "PLATFORM_ADMIN" && (
          <Button
            variant="ghost"
            className={cn(
              "text-amber-600 hover:bg-amber-500/10 text-xs font-semibold transition-all rounded-lg",
              collapsed ? "w-full h-10 justify-center p-0" : "w-full justify-start gap-2 h-9 px-3"
            )}
            onClick={handleRestoreAdmin}
            title="Voltar para conta admin"
          >
            <ArrowLeftRight className="h-3.5 w-3.5" />
            {!collapsed && "Voltar para minha conta"}
          </Button>
        )}

        {/* User card */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={cn(
              "w-full flex items-center gap-2.5 rounded-xl transition-all duration-150 hover:bg-accent/40",
              collapsed ? "justify-center p-2" : "px-2 py-2"
            )}
          >
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
              {user?.name?.charAt(0) ?? "?"}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1 text-left">
                <p className="text-xs font-semibold text-foreground truncate leading-tight">
                  {user?.name ?? "Usuario"}
                </p>
                <p className="text-[10px] text-muted-foreground truncate leading-tight">
                  {user?.email ?? ""}
                </p>
              </div>
            )}
          </button>

          {/* Dropdown */}
          {showUserMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-card border border-border/40 rounded-xl shadow-lg shadow-foreground/5 overflow-hidden z-50">
              <div className="p-1">
                <Link
                  href="/perfil"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-accent transition-colors"
                >
                  <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                  Configuracoes
                </Link>
                {user?.role === "PLATFORM_ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-accent transition-colors"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                    Backoffice
                  </Link>
                )}
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/5 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
