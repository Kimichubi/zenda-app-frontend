"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { signupSchema, type SignupFormData } from "@/utils/validations";
import { authService } from "@/services/auth";
import { AlertCircle } from "lucide-react";

export function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setError("");
      const response = await authService.signup(data);
      localStorage.setItem("zenda_token", response.accessToken);
      localStorage.setItem("zenda_refresh_token", response.refreshToken || "");
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <Input
          {...register("name")}
          placeholder="Seu nome completo"
          label="Nome Completo"
          error={errors.name?.message}
          className="h-11 transition-all duration-200"
        />

        <Input
          {...register("email")}
          type="email"
          placeholder="exemplo@email.com"
          label="Email Profissional"
          error={errors.email?.message}
          className="h-11 transition-all duration-200"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            {...register("phone")}
            placeholder="(11) 99999-9999"
            label="Telefone"
            error={errors.phone?.message}
            className="h-11 transition-all duration-200"
          />

          <Input
            {...register("businessName")}
            placeholder="Nome da sua empresa"
            label="Nome do negócio"
            error={errors.businessName?.message}
            className="h-11 transition-all duration-200"
          />
        </div>

        <Input
          {...register("password")}
          type="password"
          placeholder="••••••••"
          label="Crie uma senha forte"
          error={errors.password?.message}
          className="h-11 transition-all duration-200"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full h-11 text-sm font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 mt-4"
        loading={isSubmitting}
      >
        Criar minha conta gratuita
      </Button>
    </form>
  );
}
