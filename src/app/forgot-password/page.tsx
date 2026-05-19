"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button, Input } from "@/components/ui";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/utils/validations";
import { authService } from "@/services/auth";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Logo } from "@/components/layout/logo";
import { AlertCircle, ArrowLeft, Lock, Mail, Shield, CheckCircle2, ArrowRight } from "lucide-react";

export default function ForgotPasswordPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setError("");
      await authService.forgotPassword(data.email);
      setSubmittedEmail(data.email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar email");
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="absolute top-6 right-6 z-50">
          <ThemeToggle />
        </div>

        <div className="hidden lg:flex lg:w-[45%] relative bg-slate-950 items-center justify-center p-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-zinc-500/10" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-zinc-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 w-full max-w-md text-white space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Logo height={40} />
              </div>
              <h1 className="text-4xl font-bold tracking-tight leading-tight">Email enviado!</h1>
              <p className="text-lg text-slate-400 leading-relaxed">
                Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
              </p>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-slate-400">
                <Shield className="h-4 w-4" />
                <span className="text-xs font-medium">Link seguro</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Lock className="h-4 w-4" />
                <span className="text-xs font-medium">Válido por 1 hora</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24">
          <div className="mx-auto w-full max-w-[420px]">
            <div className="lg:hidden mb-10 flex justify-center">
              <Logo height={48} iconOnly />
            </div>

            <div className="bg-card border border-border/50 p-6 md:p-8 rounded-2xl shadow-sm text-center">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                </div>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-foreground mb-2">Verifique seu email</h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Enviamos um link de redefinição para{" "}
                <span className="font-semibold text-foreground">{submittedEmail}</span>
              </p>

              <div className="p-4 rounded-xl bg-muted/30 border border-border/40 mb-6">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  <span>Não recebeu? Verifique a caixa de spam ou tente novamente.</span>
                </div>
              </div>

              <Link href="/login">
                <Button variant="outline" className="w-full h-12 text-sm font-bold rounded-xl gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar ao login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="hidden lg:flex lg:w-[45%] relative bg-slate-950 items-center justify-center p-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-500/20 via-transparent to-zinc-500/10" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-zinc-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-zinc-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 w-full max-w-md text-white space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Logo height={40} />
            </div>
            <h1 className="text-4xl font-bold tracking-tight leading-tight">Recuperar acesso</h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              Informe seu email e enviaremos um link para redefinir sua senha.
            </p>
          </div>

          <div className="flex items-center gap-6 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-slate-400">
              <Shield className="h-4 w-4" />
              <span className="text-xs font-medium">Dados criptografados</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Lock className="h-4 w-4" />
              <span className="text-xs font-medium">Link seguro</span>
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
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Recuperar senha</h2>
            <p className="text-sm text-muted-foreground">Informe seu email para receber o link de redefinição.</p>
          </div>

          <div className="bg-card border border-border/50 p-6 md:p-8 rounded-2xl shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              {error && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span className="font-medium">{error}</span>
                  </div>
                </div>
              )}

              <Input
                {...register("email")}
                type="email"
                placeholder="seu@email.com"
                label="Email"
                error={errors.email?.message}
                className="h-12 rounded-xl"
                autoComplete="email"
              />

              <Button
                type="submit"
                className="w-full h-12 text-sm font-bold rounded-xl shadow-lg shadow-primary/20"
                loading={isSubmitting}
              >
                Enviar link de redefinição
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              Voltar ao login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
