"use client";

import { useState, useMemo } from "react";
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
  ChevronDown,
  ArrowLeftRight,
  Search,
} from "lucide-react";
import { cn } from "@/utils";
import { Button } from "@/components/ui";
import { useUser, useAdminUsers } from "@/hooks";
import { adminService } from "@/services/admin";
import { Logo } from "./logo";

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
  const { data: allUsers = [] } = useAdminUsers();
  const [showSwitchPanel, setShowSwitchPanel] = useState(false);
  const [switchSearch, setSwitchSearch] = useState("");

  const filteredUsers = useMemo(() => {
    if (!switchSearch) return allUsers.filter(u => u.id !== user?.id);
    const q = switchSearch.toLowerCase();
    return allUsers.filter(u =>
      u.id !== user?.id &&
      (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
    );
  }, [allUsers, switchSearch, user?.id]);

  const handleImpersonate = async (userId: string) => {
    const response = await adminService.impersonate(userId);
    localStorage.setItem("zenda_token", response.accessToken);
    localStorage.setItem("zenda_refresh_token", response.refreshToken);
    window.location.href = "/dashboard";
  };

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
        collapsed ? "justify-center px-2" : "px-4"
      )}>
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <Logo size={32} iconOnly />
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

      {/* Admin Account Switcher */}
      {user?.role === "ADMIN" && (
        <div className={cn("border-t border-border/60 bg-muted/5", collapsed ? "p-2" : "p-2")}>
          {showSwitchPanel && !collapsed ? (
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <input
                  type="text"
                  value={switchSearch}
                  onChange={(e) => setSwitchSearch(e.target.value)}
                  placeholder="Buscar conta..."
                  className="w-full h-8 pl-8 pr-2 rounded-lg border border-border/40 bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary/30"
                  autoFocus
                />
              </div>
              <div className="max-h-40 overflow-y-auto space-y-0.5">
                {filteredUsers.slice(0, 20).map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleImpersonate(u.id)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs hover:bg-primary/10 text-left transition-colors"
                  >
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary shrink-0">
                      {u.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate text-foreground">{u.name}</p>
                      <p className="text-[9px] text-muted-foreground truncate">{u.email}</p>
                    </div>
                  </button>
                ))}
              </div>
              <Button
                variant="ghost"
                className="w-full h-7 text-[10px] text-muted-foreground"
                onClick={() => setShowSwitchPanel(false)}
              >
                Fechar
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              className={cn(
                "text-muted-foreground hover:text-foreground text-xs transition-all rounded-lg",
                collapsed ? "w-full h-10 justify-center p-0" : "w-full justify-start gap-2 h-8"
              )}
              onClick={() => setShowSwitchPanel(true)}
              title="Trocar de conta"
            >
              <ArrowLeftRight className="h-4 w-4" />
              {!collapsed && "Trocar de conta"}
            </Button>
          )}
        </div>
      )}

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
