"use client";

import { LoginForm } from "@/features/auth/login-form";
import Link from "next/link";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LightningBoltIcon } from "@radix-ui/react-icons"; // Assuming I might want to use icons, but I'll stick to Lucide

import { Zap } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Theme toggle in top right */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Left side: branding/image gradient area */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center p-12 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary via-primary/90 to-indigo-900/50"></div>
        
        {/* Floating shapes for visual interest */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 w-full max-w-lg text-primary-foreground">
          <div className="mb-8">
            {/* Logo placeholder */}
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center mb-8 ring-1 ring-white/20 shadow-2xl">
              <Zap className="w-8 h-8 text-white fill-white/10" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl mb-6 leading-[1.1]">
              Gerencie com <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-indigo-200">
                excelência.
              </span>
            </h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed font-medium max-w-md">
              A plataforma intuitiva para profissionais que valorizam seu tempo e seus clientes.
            </p>
          </div>
          
          <div className="flex items-center gap-6 mt-16 pt-12 border-t border-white/10">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-primary bg-indigo-200/30 backdrop-blur-md" />
              ))}
            </div>
            <p className="text-sm font-medium text-primary-foreground/70">
              Confiado por mais de <span className="text-white font-bold">2.000</span> profissionais de elite.
            </p>
          </div>
        </div>
      </div>

      {/* Right side: form area */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-20 xl:px-24 relative">
        <div className="mx-auto w-full max-w-sm lg:w-[420px]">
          <div className="lg:hidden mb-12 flex justify-center">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20">
              <Zap className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          
          <div className="mb-12 text-center lg:text-left space-y-2">
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              Boas-vindas
            </h2>
            <p className="text-muted-foreground font-medium">
              Entre com suas credenciais para gerenciar sua conta.
            </p>
          </div>

          <div className="bg-card/50 backdrop-blur-sm p-2 rounded-3xl">
            <LoginForm />
          </div>

          <p className="mt-12 text-center text-sm text-muted-foreground font-medium">
            Ainda não tem acesso?{" "}
            <Link href="/signup" className="font-bold text-primary hover:underline transition-all">
              Crie sua conta agora
            </Link>
          </p>
        </div>
        
        {/* Subtle background detail */}
        <div className="absolute bottom-0 right-0 p-8 opacity-5 hidden lg:block">
          <Zap className="w-64 h-64 text-primary" />
        </div>
      </div>
    </div>
  );
}
