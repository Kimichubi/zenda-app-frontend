"use client";

import { LoginForm } from "@/features/auth/login-form";
import Link from "next/link";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Zap, Star, Users, Shield } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Left side: branding */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-slate-950 items-center justify-center p-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/10" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 w-full max-w-md text-white space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">Zenda</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight leading-tight">
              Bem-vindo de volta!
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              Acesse sua conta e continue gerenciando seu negócio com inteligência.
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-2xl font-bold text-white">+2.000</p>
                <p className="text-xs font-medium text-slate-400 mt-1">Profissionais ativos</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-2xl font-bold text-white">99.9%</p>
                <p className="text-xs font-medium text-slate-400 mt-1">Uptime garantido</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-300 italic">
                "A Zenda transformou a gestão do meu salão. Recomendo demais!"
              </p>
              <p className="text-xs text-slate-500 mt-2 font-medium">— Mariana S., Fisioterapeuta</p>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-slate-400">
              <Shield className="h-4 w-4" />
              <span className="text-xs font-medium">Dados seguros</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Users className="h-4 w-4" />
              <span className="text-xs font-medium">Suporte 24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-[420px]">
          <div className="lg:hidden mb-10 flex justify-center">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="mb-8 space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Acesse sua conta
            </h2>
            <p className="text-sm text-muted-foreground">
              Informe suas credenciais para continuar.
            </p>
          </div>

          <div className="bg-card border border-border/50 p-6 md:p-8 rounded-2xl shadow-sm">
            <LoginForm />
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Não possui uma conta?{" "}
            <Link href="/signup" className="font-semibold text-primary hover:text-primary/80 transition-colors">
              Cadastre-se gratuitamente
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
