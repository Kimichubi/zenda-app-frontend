"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { loginSchema, verifyCodeSchema, type LoginFormData, type VerifyCodeFormData } from "@/utils/validations";
import { authService } from "@/services/auth";
import { AlertCircle, Eye, EyeOff, Mail, ArrowLeft, Shield } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [step, setStep] = useState<"credentials" | "2fa">("credentials");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [loginEmail, setLoginEmail] = useState("");

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerCode,
    handleSubmit: handleCodeSubmit,
    formState: { errors: codeErrors, isSubmitting: isCodeSubmitting },
  } = useForm<VerifyCodeFormData>({
    resolver: zodResolver(verifyCodeSchema),
  });

  const onSubmitCredentials = async (data: LoginFormData) => {
    try {
      setError("");
      const response = await authService.login({ ...data, rememberMe } as any);

      if ("requires2FA" in response && response.requires2FA) {
        setMaskedEmail(response.email);
        setLoginEmail(data.email);
        setStep("2fa");
        return;
      }

      if ("accessToken" in response) {
        localStorage.setItem("zenda_token", response.accessToken);
        localStorage.setItem("zenda_refresh_token", response.refreshToken || "");

        if (response.user.role === "PLATFORM_ADMIN") {
          router.push("/admin");
        } else if (response.user.plan === "ONBOARDING") {
          router.push("/onboarding");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
    }
  };

  const onSubmitCode = async (data: VerifyCodeFormData) => {
    try {
      setError("");
      const response = await authService.verifyLoginCode({
        email: loginEmail,
        code: data.code,
        rememberMe,
      });

      if ("valid" in response && !response.valid) {
        setError(response.message || "Código inválido.");
        return;
      }

      if ("accessToken" in response) {
        localStorage.setItem("zenda_token", response.accessToken);
        localStorage.setItem("zenda_refresh_token", response.refreshToken || "");

        if (response.user.role === "PLATFORM_ADMIN") {
          router.push("/admin");
        } else if (response.user.plan === "ONBOARDING") {
          router.push("/onboarding");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao verificar código");
    }
  };

  if (step === "2fa") {
    return (
      <form onSubmit={handleCodeSubmit(onSubmitCode)} noValidate className="space-y-5">
        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        <div className="text-center space-y-2 pb-2">
          <div className="flex justify-center">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-7 w-7 text-primary" />
            </div>
          </div>
          <h3 className="font-bold">Verificação em duas etapas</h3>
          <p className="text-sm text-muted-foreground">
            Enviamos um código de 6 dígitos para{" "}
            <span className="font-semibold text-foreground">{maskedEmail}</span>
          </p>
        </div>

        <Input
          {...registerCode("code")}
          placeholder="000000"
          label="Código de verificação"
          error={codeErrors.code?.message}
          className="h-12 rounded-xl text-center text-2xl font-mono tracking-[0.3em]"
          maxLength={6}
          autoComplete="one-time-code"
        />

        <Button
          type="submit"
          className="w-full h-12 text-sm font-bold rounded-xl shadow-lg shadow-primary/20"
          loading={isCodeSubmitting}
        >
          Verificar e entrar
        </Button>

        <button
          type="button"
          onClick={() => {
            setStep("credentials");
            setError("");
          }}
          className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1"
        >
          <ArrowLeft className="h-3 w-3" />
          Voltar para o login
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleLoginSubmit(onSubmitCredentials)} noValidate className="space-y-5">
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <Input
          {...registerLogin("email")}
          type="email"
          placeholder="seu@email.com"
          label="Email"
          error={loginErrors.email?.message}
          className="h-12 rounded-xl"
          autoComplete="email"
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium leading-none">Senha</label>
            <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
              Esqueceu sua senha?
            </Link>
          </div>
          <div className="relative">
            <Input
              {...registerLogin("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              error={loginErrors.password?.message}
              className="h-12 rounded-xl pr-12"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded-lg"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="rememberMe"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 rounded border-border/40 accent-primary cursor-pointer"
        />
        <label htmlFor="rememberMe" className="text-xs text-muted-foreground cursor-pointer select-none">
          Lembrar de mim por 30 dias
        </label>
      </div>

      <Button
        type="submit"
        className="w-full h-12 text-sm font-bold rounded-xl shadow-lg shadow-primary/20"
        loading={isSubmitting}
      >
        Entrar na conta
      </Button>
    </form>
  );
}
