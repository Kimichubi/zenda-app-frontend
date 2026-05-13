"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button, Input } from "@/components/ui";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/utils/validations";
import { authService } from "@/services/auth";

export function ForgotPasswordForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
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
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar email");
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Email enviado!</h1>
        <p className="text-sm text-gray-600">
          Verifique sua caixa de entrada para redefinir sua senha.
        </p>
        <Link href="/login" className="text-foreground hover:text-foreground/70">
          Voltar ao login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Recuperar senha</h1>
        <p className="mt-2 text-sm text-gray-600">
          Informe seu email para redefinir a senha
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <Input
          {...register("email")}
          type="email"
          placeholder="Email"
          label="Email"
          error={errors.email?.message}
        />

        <Button type="submit" className="w-full" loading={isSubmitting}>
          Enviar
        </Button>
      </form>

      <p className="text-center text-sm">
        <Link href="/login" className="text-foreground hover:text-foreground/70">
          Voltar ao login
        </Link>
      </p>
    </div>
  );
}
