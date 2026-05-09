"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@/components/ui";
import { clientSchema } from "@/utils/validations";
import type { ClientFormData } from "@/types";
import { maskPhoneInput } from "@/utils";

interface ClientFormProps {
  onSubmit: (data: ClientFormData) => void;
  initialData?: ClientFormData;
  isLoading?: boolean;
}

export function ClientForm({
  onSubmit,
  initialData,
  isLoading,
}: ClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(clientSchema) as any,
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Input
        {...register("name")}
        placeholder="Nome"
        label="Nome"
        error={errors.name?.message}
      />

      <Input
        {...register("phone", {
          onChange: (e) => {
            e.target.value = maskPhoneInput(e.target.value);
          },
        })}
        placeholder="Telefone"
        label="Telefone"
        error={errors.phone?.message}
      />

      <Input
        {...register("email")}
        type="email"
        placeholder="Email"
        label="Email"
        error={errors.email?.message}
      />

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Observações
        </label>
        <textarea
          {...register("notes")}
          placeholder="Observações"
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          rows={3}
        />
      </div>

      <Button type="submit" loading={isLoading}>
        Salvar
      </Button>
    </form>
  );
}
