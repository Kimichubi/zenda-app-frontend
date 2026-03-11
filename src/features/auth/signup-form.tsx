"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { signupSchema, type SignupFormData } from "@/utils/validations";
import { authService } from "@/services/auth";

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
      localStorage.setItem("zenda_token", response.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta");
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Criar conta</h1>
        <p className="mt-2 text-sm text-gray-600">
          Comece a gerenciar seus atendimentos
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <Input
          {...register("name")}
          placeholder="Nome completo"
          label="Nome"
          error={errors.name?.message}
        />

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

        <Input
          {...register("phone")}
          placeholder="Telefone"
          label="Telefone"
          error={errors.phone?.message}
        />

        <Input
          {...register("businessName")}
          placeholder="Nome do negócio"
          label="Nome do negócio"
          error={errors.businessName?.message}
        />

        <Button type="submit" className="w-full" loading={isSubmitting}>
          Criar conta
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600">
        Já tem conta?{" "}
        <Link href="/login" className="text-indigo-600 hover:text-indigo-500">
          Entrar
        </Link>
      </p>
    </div>
  );
}
