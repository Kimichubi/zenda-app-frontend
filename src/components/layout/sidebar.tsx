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
  Bot,
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
  { href: "/configuracoes/ia", label: "Assistente IA", icon: Bot },
  { href: "/perfil", label: "Meu Perfil", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: user } = useUser();

  const NavLink = ({ item }: { item: typeof mainNavItems[0] }) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;
    return (
      <Link
        href={item.href}
        className={cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
        <span className="tracking-tight">{item.label}</span>
        {isActive && (
          <div className="ml-auto w-1 h-1 rounded-full bg-primary" />
        )}
      </Link>
    );
  };

  return (
    <aside className="relative hidden md:flex h-screen w-[260px] flex-col bg-card border-r border-border/60 transition-all duration-300 z-40">
      <div className="flex h-16 items-center px-6 border-b border-border/60">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/10 transition-transform duration-300">
            <Zap className="w-5 h-5 text-white fill-white/10" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground uppercase">Zenda</h1>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 scrollbar-none space-y-8">
        {/* Main Section */}
        <div className="space-y-1">
          <div className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] mb-4 px-3">
            Operacional
          </div>
          <nav className="space-y-1">
            {mainNavItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>
        </div>

        {/* Enterprise Section */}
        <div className="space-y-1">
          <div className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] mb-4 px-3">
            Gestão Enterprise
          </div>
          <nav className="space-y-1">
            {enterpriseNavItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>
        </div>

        {/* Settings Section */}
        <div className="space-y-1">
          <div className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] mb-4 px-3">
            Configurações
          </div>
          <nav className="space-y-1">
            {settingsNavItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>
        </div>

        {/* Admin Link */}
        {user?.role === "ADMIN" && (
          <div className="pt-4 border-t border-border/60 space-y-1">
            <div className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] px-3 mb-4">
              Sistema
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
              <ShieldCheck className={cn("h-5 w-5 transition-colors", pathname === "/admin" ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              <span className="tracking-tight">Backoffice</span>
            </Link>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border/60 bg-muted/5">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 rounded-lg h-10 text-muted-foreground hover:bg-destructive/5 hover:text-destructive font-medium text-sm transition-all duration-200"
          onClick={() => {
            localStorage.removeItem("zenda_token");
            localStorage.removeItem("zenda_refresh_token");
            window.location.href = "/login";
          }}
        >
          <LogOut className="h-5 w-5" />
          <span className="tracking-tight">Sair</span>
        </Button>
      </div>
    </aside>
  );
}
