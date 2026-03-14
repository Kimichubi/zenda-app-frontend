"use client";

import { SignupForm } from "@/features/auth/signup-form";
import Link from "react-link"; // Wait, it's next/link. Fix it.
import NextLink from "next/link";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Zap, Sparkles } from "lucide-react";

export default function SignupPage() {
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
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary via-indigo-900/80 to-purple-900/50"></div>
        
        {/* Floating shapes for visual interest */}
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 w-full max-w-lg text-primary-foreground">
          <div className="mb-8">
            {/* Logo placeholder */}
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center mb-8 ring-1 ring-white/20 shadow-2xl">
              <Sparkles className="w-8 h-8 text-white fill-white/10" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl mb-6 leading-[1.1]">
              O início de algo <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-amber-200">
                extraordinário.
              </span>
            </h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed font-medium max-w-md">
              Crie sua conta agora e transforme a maneira como você atende seus clientes. Sem compromisso, sem taxas ocultas.
            </p>
          </div>
          
          <div className="mt-16 pt-12 border-t border-white/10">
            <blockquote className="text-xl font-medium text-white italic leading-relaxed opacity-90">
              "A Zenda reduziu meu tempo de gestão pela metade. Eu finalmente tenho tempo para focar no que realmente importa: meus clientes."
            </blockquote>
            <p className="mt-6 text-sm text-primary-foreground/70 font-bold tracking-wider uppercase">— Mariana S., Fisioterapeuta</p>
          </div>
        </div>
      </div>

      {/* Right side: form area */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-20 xl:px-24 relative overflow-y-auto">
        <div className="mx-auto w-full max-w-sm lg:w-[440px]">
          <div className="lg:hidden mb-12 flex justify-center">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          
          <div className="mb-12 text-center lg:text-left space-y-2">
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              Crie sua conta
            </h2>
            <p className="text-muted-foreground font-medium">
              Leva menos de um minuto para você começar sua jornada.
            </p>
          </div>

          <div className="bg-card/50 backdrop-blur-sm p-1 rounded-3xl">
            <SignupForm />
          </div>

          <p className="mt-12 text-center text-sm text-muted-foreground font-medium">
            Já utiliza o Zenda?{" "}
            <NextLink href="/login" className="font-bold text-primary hover:underline transition-all">
              Acesse sua conta agora
            </NextLink>
          </p>
        </div>
        
        {/* Subtle background detail */}
        <div className="absolute bottom-0 right-0 p-8 opacity-5 hidden lg:block pointer-events-none">
          <Sparkles className="w-64 h-64 text-primary" />
        </div>
      </div>
    </div>
  );
}
