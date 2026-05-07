"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function TokenRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const refreshToken = searchParams.get("refresh_token");

    if (token) {
      localStorage.setItem("zenda_token", token);
      if (refreshToken) {
        localStorage.setItem("zenda_refresh_token", refreshToken);
      }
    }

    const redirect = searchParams.get("redirect") || "/dashboard";
    router.replace(redirect);
  }, [router, searchParams]);

  return null;
}

export default function AuthRedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Autenticando...</p>
          </div>
        </div>
      }
    >
      <TokenRedirect />
    </Suspense>
  );
}
