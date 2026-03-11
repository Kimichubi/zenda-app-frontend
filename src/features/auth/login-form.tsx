"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { loginSchema, type LoginFormData } from "@/utils/validations";
import { authService } from "@/services/auth";

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
      localStorage.setItem("zenda_token", response.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Entrar no Zenda</h1>
        <p className="mt-2 text-sm text-gray-600">
          Gerencie sua agenda e clientes
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

        <Input
          {...register("password")}
          type="password"
          placeholder="Senha"
          label="Senha"
          error={errors.password?.message}
        />

        <Button type="submit" className="w-full" loading={isSubmitting}>
          Entrar
        </Button>
      </form>

      <div className="space-y-2 text-center text-sm">
        <Link
          href="/forgot-password"
          className="text-indigo-600 hover:text-indigo-500"
        >
          Esqueceu a senha?
        </Link>
        <p className="text-gray-600">
          Não tem conta?{" "}
          <Link
            href="/signup"
            className="text-indigo-600 hover:text-indigo-500"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
