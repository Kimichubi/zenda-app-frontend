"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/hooks";
import { ShieldCheck, LogOut } from "lucide-react";

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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl px-6">
      <div className="flex items-center gap-3">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Plataforma <span className="text-slate-300 dark:text-slate-600">/</span>{" "}
          <span className="text-slate-700 dark:text-slate-300 font-medium">Admin</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10">
            <ShieldCheck className="h-3.5 w-3.5 text-purple-500" />
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{user?.name ?? "Admin"}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-red-500 transition-colors"
          title="Sair"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
