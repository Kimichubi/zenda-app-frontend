"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { loginSchema, type LoginFormData } from "@/utils/validations";
import { authService } from "@/services/auth";
import { AlertCircle, Eye, EyeOff, ShieldCheck } from "lucide-react";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError("");
      const response = await authService.adminLogin({
        email: data.email,
        password: data.password,
      });

      if ("accessToken" in response) {
        localStorage.setItem("zenda_token", response.accessToken);
        localStorage.setItem("zenda_refresh_token", response.refreshToken || "");
        router.push("/admin");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 pb-4 border-b border-border/40">
        <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
          <ShieldCheck className="h-5 w-5 text-purple-500" />
        </div>
        <div>
          <p className="text-sm font-bold">Painel Administrativo</p>
          <p className="text-[11px] text-muted-foreground">Acesso restrito a administradores da plataforma</p>
        </div>
      </div>

      <div className="space-y-4">
        <Input
          {...register("email")}
          type="email"
          placeholder="admin@zenda.com"
          label="Email"
          error={errors.email?.message}
          className="h-12 rounded-xl"
          autoComplete="email"
        />

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Senha</label>
          <div className="relative">
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              error={errors.password?.message}
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

      <Button
        type="submit"
        className="w-full h-12 text-sm font-bold rounded-xl shadow-lg shadow-purple-500/20 bg-purple-600 hover:bg-purple-700"
        loading={isSubmitting}
      >
        Acessar Painel
      </Button>
    </form>
  );
}
