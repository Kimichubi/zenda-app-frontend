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
    async function validate() {
      const token = localStorage.getItem("zenda_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const response = await authService.validateToken();

        // Onboarding users can ONLY access /onboarding — hard block everything else
        if (response.needsOnboarding) {
          if (pathname !== "/onboarding") {
            router.replace("/onboarding");
            return;
          }
          setIsAuthorized(true);
          setIsLoading(false);
          return;
        }

        // Users who are done onboarding can't access /onboarding
        if (pathname === "/onboarding") {
          router.replace("/dashboard");
          return;
        }

        setIsAuthorized(true);
      } catch (err) {
        console.error("Token validation failed", err);
      } finally {
        setIsLoading(false);
      }
    }

    validate();
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