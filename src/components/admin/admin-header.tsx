"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/hooks";
import { ShieldCheck, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function AdminHeader() {
  const { data: user } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("zenda_token");
      localStorage.removeItem("zenda_refresh_token");
    }
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-xl px-6">
      <div className="flex items-center gap-3">
        <div className="text-xs text-muted-foreground">
          Plataforma <span className="text-border">/</span>{" "}
          <span className="text-foreground font-medium">Admin</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="h-6 w-px bg-border/60" />
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">{user?.name ?? "Admin"}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-destructive transition-colors"
          title="Sair"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
