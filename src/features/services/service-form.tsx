"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input } from "@/components/ui";
import type { ServiceFormData } from "@/services/services";

const serviceSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  duration: z.number().min(1, "A duração deve ser maior que 0"),
  price: z.number().min(0, "O preço não pode ser negativo"),
});

interface ServiceFormProps {
  onSubmit: (data: ServiceFormData) => void;
  initialData?: ServiceFormData;
  isLoading?: boolean;
}

export function ServiceForm({ onSubmit, initialData, isLoading }: ServiceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nome do Serviço"
        placeholder="Ex: Corte de Cabelo"
        {...register("name")}
        error={errors.name?.message}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Duração (minutos)"
          type="number"
          placeholder="30"
          {...register("duration", { valueAsNumber: true })}
          error={errors.duration?.message}
        />
        
        <Input
          label="Preço (R$)"
          type="number"
          step="0.01"
          placeholder="50.00"
          {...register("price", { valueAsNumber: true })}
          error={errors.price?.message}
        />
      </div>

      <Button type="submit" className="w-full" loading={isLoading}>
        {initialData ? "Atualizar Serviço" : "Salvar Serviço"}
      </Button>
    </form>
  );
}
