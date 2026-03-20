"use client";

import { LoginForm } from "@/features/auth/login-form";
import Link from "next/link";
import { ThemeToggle } from "@/components/layout/theme-toggle";

import { Zap } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Theme toggle in top right */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Left side: branding area - Mais Robusto e Profissional */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-slate-950 items-center justify-center p-16 overflow-hidden border-r border-border/10">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent opacity-40"></div>
        
        <div className="relative z-10 w-full max-w-md text-white">
          <div className="mb-12">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center mb-10 shadow-lg shadow-primary/20">
              <Zap className="w-5 h-5 text-white fill-white/10" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-6 leading-tight">
              Gestão inteligente para o seu <span className="text-primary">negócio.</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed font-medium">
              A plataforma definitiva para profissionais que buscam excelência operacional e crescimento sustentável.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 mt-16 pt-12 border-t border-white/5">
            <div>
              <p className="text-2xl font-bold text-white">+2.000</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">Usuários Ativos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">99.9%</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">Uptime Garantido</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: form area */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 lg:px-16 xl:px-24 bg-card/20 dark:bg-background">
        <div className="mx-auto w-full max-w-[400px]">
          <div className="lg:hidden mb-10 flex justify-center">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/10">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="mb-10 space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Acesse sua conta
            </h2>
            <p className="text-sm text-muted-foreground font-medium">
              Informe suas credenciais para continuar.
            </p>
          </div>

          <div className="bg-card border border-border/50 p-8 rounded-xl shadow-sm">
            <LoginForm />
          </div>

          <p className="mt-10 text-center text-sm text-muted-foreground font-medium">
            Não possui uma conta?{" "}
            <Link href="/signup" className="font-semibold text-primary hover:text-primary/80 transition-all">
              Cadastre-se agora
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
