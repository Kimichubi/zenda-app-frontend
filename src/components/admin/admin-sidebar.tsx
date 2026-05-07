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
  Headphones,
  ChevronLeft,
  ShieldCheck,
} from "lucide-react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/businesses", icon: Building2, label: "Negocios" },
  { href: "/admin/onboarding", icon: UserPlus, label: "Onboarding" },
  { href: "/admin/subscriptions", icon: CreditCard, label: "Assinaturas" },
  { href: "/admin/monitoring", icon: BarChart3, label: "Monitoramento" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-slate-800 bg-slate-950">
      <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600">
          <ShieldCheck className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white tracking-tight">Zenda Admin</p>
          <p className="text-[10px] text-slate-500 font-medium">Platform Control</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        <div className="px-2 pb-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">Menu</p>
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-purple-500/10 text-purple-400"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200",
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-purple-400" : "text-slate-500 group-hover:text-slate-300")} />
              <span>{item.label}</span>
              {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-purple-500" />}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 px-3 py-4">
        <div className="px-2 pb-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">Outros</p>
        </div>
        <Link
          href="/admin/support"
          className={cn(
            "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
            pathname === "/admin/support"
              ? "bg-purple-500/10 text-purple-400"
              : "text-slate-400 hover:bg-slate-900 hover:text-slate-200",
          )}
        >
          <Headphones className={cn("h-4 w-4 shrink-0", pathname === "/admin/support" ? "text-purple-400" : "text-slate-500 group-hover:text-slate-300")} />
          <span>Suporte</span>
        </Link>
      </div>

      <div className="border-t border-slate-800 p-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          <ChevronLeft className="h-3 w-3" />
          Voltar ao Dashboard
        </Link>
      </div>
    </aside>
  );
}
