"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { loginSchema, type LoginFormData } from "@/utils/validations";
import { authService } from "@/services/auth";
import { AlertCircle, Lock, Mail } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
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
      const response = await authService.login(data);
      localStorage.setItem("zenda_token", response.accessToken);
      localStorage.setItem("zenda_refresh_token", response.refreshToken || "");
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="relative group">
          <Input
            {...register("email")}
            type="email"
            placeholder="exemplo@email.com"
            label="Email"
            error={errors.email?.message}
            className="h-11 transition-all duration-200"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Senha
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-primary hover:underline transition-all"
            >
              Esqueceu sua senha?
            </Link>
          </div>
          <Input
            {...register("password")}
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            className="h-11 transition-all duration-200"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full h-11 text-sm font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
        loading={isSubmitting}
      >
        Entrar na conta
      </Button>
    </form>
  );
}
