"use client";

import { SignupForm } from "@/features/auth/signup-form";
import NextLink from "next/link";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Zap, Check, Shield, Clock } from "lucide-react";
import { Logo } from "@/components/layout/logo";

const benefits = [
  "Agenda inteligente com lembretes automáticos",
  "Página de agendamento personalizada",
  "Pagamentos via Pix integrados",
  "Suporte dedicado via WhatsApp",
];

export default function SignupPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="hidden lg:flex lg:w-[45%] relative bg-slate-950 items-center justify-center p-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-emerald-500/10" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 w-full max-w-md text-white space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Logo height={40} />
            </div>
            <h1 className="text-4xl font-bold tracking-tight leading-tight">
              Comece a transformar seu negócio hoje
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              Crie sua conta e nossa equipe te ajudará a configurar tudo.
            </p>
          </div>

          <div className="space-y-4">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary shrink-0">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm text-slate-300">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-6 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-slate-400">
              <Shield className="h-4 w-4" />
              <span className="text-xs font-medium">Dados seguros</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-medium">Suporte em cada etapa</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-[440px]">
          <div className="lg:hidden mb-10 flex justify-center">
            <Logo height={48} iconOnly />
          </div>

          <div className="mb-8 space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Crie sua conta</h2>
            <p className="text-sm text-muted-foreground">
              Após o cadastro, nossa equipe irá auxiliar na configuração do seu negócio.
            </p>
          </div>

          <div className="bg-card border border-border/50 p-6 md:p-8 rounded-2xl shadow-sm">
            <SignupForm />
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Já utiliza o Zenda?{" "}
            <NextLink href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
              Acesse sua conta
            </NextLink>
          </p>
        </div>
      </div>
    </div>
  );
}
