"use client";

import { useState, useMemo, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { resetPasswordSchema } from "@/utils/validations";
import { authService } from "@/services/auth";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Logo } from "@/components/layout/logo";
import { AlertCircle, Eye, EyeOff, Shield, Lock, Check, X, ArrowLeft, CheckCircle2 } from "lucide-react";
import { cn } from "@/utils";
import type { z } from "zod";

type ResetFormData = z.infer<typeof resetPasswordSchema>;

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: "Fraca", color: "bg-rose-500" };
  if (score <= 2) return { score, label: "Razoável", color: "bg-amber-500" };
  if (score <= 3) return { score, label: "Boa", color: "bg-blue-500" };
  return { score, label: "Forte", color: "bg-emerald-500" };
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch("password") || "";
  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);

  const passwordRequirements = [
    { label: "Mínimo 8 caracteres", met: password.length >= 8 },
    { label: "Uma letra maiúscula", met: /[A-Z]/.test(password) },
    { label: "Um número", met: /[0-9]/.test(password) },
  ];

  const onSubmit = async (data: ResetFormData) => {
    if (!token) {
      setError("Link inválido ou expirado.");
      return;
    }
    try {
      setError("");
      await authService.resetPassword({ token, password: data.password });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao redefinir senha");
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Link inválido</h2>
          <p className="text-sm text-muted-foreground">
            Este link de redefinição é inválido ou expirou. Solicite um novo.
          </p>
          <Link href="/forgot-password">
            <Button className="h-12 px-8 text-sm font-bold rounded-xl">
              Solicitar novo link
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Senha redefinida!</h2>
          <p className="text-sm text-muted-foreground">
            Sua senha foi alterada com sucesso. Use sua nova senha para acessar sua conta.
          </p>
          <Link href="/login">
            <Button className="h-12 px-8 text-sm font-bold rounded-xl gap-2">
              Entrar na conta
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Button>
          </Link>
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
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-zinc-500/10" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-zinc-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 w-full max-w-md text-white space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Logo height={40} />
            </div>
            <h1 className="text-4xl font-bold tracking-tight leading-tight">Redefinir senha</h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              Escolha uma nova senha forte para sua conta.
            </p>
          </div>

          <div className="flex items-center gap-6 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-slate-400">
              <Shield className="h-4 w-4" />
              <span className="text-xs font-medium">Link seguro</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Lock className="h-4 w-4" />
              <span className="text-xs font-medium">Criptografado</span>
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
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Nova senha</h2>
            <p className="text-sm text-muted-foreground">Crie uma senha forte para proteger sua conta.</p>
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

              <div className="space-y-3">
                <div className="relative">
                  <Input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Nova senha"
                    label="Nova Senha"
                    error={errors.password?.message}
                    className="h-12 rounded-xl pr-12"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[calc(50%+0.75rem)] -translate-y-1/2 h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded-lg"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {password && (
                  <div className="space-y-2 px-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all duration-300", passwordStrength.color)} style={{ width: `${(passwordStrength.score / 5) * 100}%` }} />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">{passwordStrength.label}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5">
                      {passwordRequirements.map((req) => (
                        <div key={req.label} className="flex items-center gap-2 text-xs">
                          {req.met ? <Check className="h-3 w-3 text-emerald-500" /> : <X className="h-3 w-3 text-muted-foreground/40" />}
                          <span className={req.met ? "text-emerald-600" : "text-muted-foreground"}>{req.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Input
                {...register("confirmPassword")}
                type="password"
                placeholder="Confirme a nova senha"
                label="Confirmar Senha"
                error={errors.confirmPassword?.message}
                className="h-12 rounded-xl"
                autoComplete="new-password"
              />

              <Button
                type="submit"
                className="w-full h-12 text-sm font-bold rounded-xl shadow-lg shadow-primary/20"
                loading={isSubmitting}
              >
                Redefinir senha
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-sm text-muted-foreground">Carregando...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
