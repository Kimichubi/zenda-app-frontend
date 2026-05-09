"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import { Loader2 } from "lucide-react";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function check() {
      const token = localStorage.getItem("zenda_token");
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const response = await authService.validateToken();
        if (response.valid && response.role === "PLATFORM_ADMIN") {
          setAuthorized(true);
        } else {
          localStorage.removeItem("zenda_token");
          localStorage.removeItem("zenda_refresh_token");
          router.replace("/login");
        }
      } catch {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }

    check();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          <p className="text-sm text-slate-400">Verificando credenciais de administrador...</p>
        </div>
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
}
