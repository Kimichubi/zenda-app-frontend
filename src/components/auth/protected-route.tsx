"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/services/auth";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function tryRefreshToken(): Promise<boolean> {
      const refreshToken = localStorage.getItem("zenda_refresh_token");
      if (!refreshToken) return false;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/auth/refresh`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${refreshToken}`,
            },
          },
        );
        if (!res.ok) return false;
        const data = await res.json();
        localStorage.setItem("zenda_token", data.accessToken);
        localStorage.setItem("zenda_refresh_token", data.refreshToken);
        return true;
      } catch {
        return false;
      }
    }

    async function validate() {
      let token = localStorage.getItem("zenda_token");

      if (!token) {
        const refreshed = await tryRefreshToken();
        if (!refreshed) {
          if (!cancelled) router.replace("/login");
          return;
        }
        token = localStorage.getItem("zenda_token");
        if (!token) {
          if (!cancelled) router.replace("/login");
          return;
        }
      }

      try {
        const response = await authService.validateToken();

        if (!response.valid) {
          const refreshed = await tryRefreshToken();
          if (!refreshed) {
            if (!cancelled) router.replace("/login");
            return;
          }
          const retry = await authService.validateToken();
          if (!retry.valid) {
            if (!cancelled) router.replace("/login");
            return;
          }
          if (cancelled) return;

          if (retry.needsOnboarding) {
            if (pathname !== "/onboarding") {
              router.replace("/onboarding");
              return;
            }
            setIsAuthorized(true);
            setIsLoading(false);
            return;
          }

          if (pathname === "/onboarding") {
            router.replace("/dashboard");
            return;
          }

          setIsAuthorized(true);
          setIsLoading(false);
          return;
        }

        if (response.needsOnboarding) {
          if (pathname !== "/onboarding") {
            router.replace("/onboarding");
            return;
          }
          setIsAuthorized(true);
          setIsLoading(false);
          return;
        }

        if (pathname === "/onboarding") {
          router.replace("/dashboard");
          return;
        }

        setIsAuthorized(true);
      } catch {
        const refreshed = await tryRefreshToken();
        if (refreshed) {
          if (!cancelled) {
            window.location.reload();
          }
          return;
        }
        if (!cancelled) router.replace("/login");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    validate();
    return () => { cancelled = true; };
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-bold tracking-tight text-muted-foreground animate-pulse">
          Validando seu acesso...
        </p>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}