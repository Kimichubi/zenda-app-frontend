"use client";

import { AdminLoginForm } from "@/features/auth/admin-login-form";
import Link from "next/link";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-12 mx-auto w-full max-w-[420px]">
        <div className="mb-8 space-y-2 text-center">
          <div className="inline-flex items-center gap-2 text-[10px] font-black text-purple-500 uppercase tracking-[0.4em] mb-4">
            Zenda Platform
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Admin Login</h2>
          <p className="text-sm text-muted-foreground">Painel de controle da plataforma.</p>
        </div>

        <div className="bg-card border border-border/50 p-6 md:p-8 rounded-2xl shadow-sm">
          <AdminLoginForm />
        </div>

        <Link
          href="/login"
          className="mt-6 text-center text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1"
        >
          <ArrowLeft className="h-3 w-3" />
          Voltar para o login de usuario
        </Link>
      </div>
    </div>
  );
}
