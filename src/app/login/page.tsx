"use client";

import { LoginForm } from "@/features/auth/login-form";
import Link from "next/link";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Zap, Shield, Lock } from "lucide-react";
import { Logo } from "@/components/layout/logo";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="hidden lg:flex lg:w-[45%] relative bg-slate-950 items-center justify-center p-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/10" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 w-full max-w-md text-white space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Logo height={40} />
            </div>
            <h1 className="text-4xl font-bold tracking-tight leading-tight">Bem-vindo de volta!</h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              Acesse sua conta e continue gerenciando seu negócio com inteligência.
            </p>
          </div>

          <div className="flex items-center gap-6 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-slate-400">
              <Shield className="h-4 w-4" />
              <span className="text-xs font-medium">Dados criptografados</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Lock className="h-4 w-4" />
              <span className="text-xs font-medium">Autenticação segura</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-[420px]">
          <div className="lg:hidden mb-10 flex justify-center">
            <Logo height={48} iconOnly />
          </div>

          <div className="mb-8 space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Acesse sua conta</h2>
            <p className="text-sm text-muted-foreground">Informe suas credenciais para continuar.</p>
          </div>

          <div className="bg-card border border-border/50 p-6 md:p-8 rounded-2xl shadow-sm">
            <LoginForm />
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Não possui uma conta?{" "}
            <Link href="/signup" className="font-semibold text-primary hover:text-primary/80 transition-colors">
              Cadastre-se agora
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
