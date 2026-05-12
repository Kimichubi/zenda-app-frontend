"use client";

import { useUser, useUpdateProfile } from "@/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input, Card, CardContent, CardHeader, CardTitle, useToast } from "@/components/ui";
import { Loader2, User, Building, Phone, Globe, Save, CreditCard, Instagram, FileText } from "lucide-react";
import { useEffect } from "react";
import { maskPhoneInput } from "@/utils";

const profileSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  phone: z.string().min(1, "O telefone é obrigatório"),
  bio: z.string().optional(),
  instagramUrl: z.string().optional(),
  businessName: z.string().min(1, "O nome do negócio é obrigatório"),
  slug: z.string().min(1, "O link da agenda é obrigatório")
    .regex(/^[a-z0-9-]+$/, "O link deve conter apenas letras minúsculas, números e hífens"),
  pixKey: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function PerfilPage() {
  const { data: user, isLoading: isLoadingUser } = useUser();
  const updateProfile = useUpdateProfile();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        phone: user.phone,
        bio: user.bio ?? "",
        instagramUrl: user.instagramUrl ?? "",
        businessName: user.businessName ?? "",
        slug: user.slug ?? "",
        pixKey: user.pixKey ?? "",
      });
    }
  }, [user, reset]);

  const onSubmit = (data: ProfileFormData) => {
    updateProfile.mutate(data, {
      onSuccess: () => {
        showToast("Perfil atualizado com sucesso!", "success");
      },
      onError: () => {
        showToast("Erro ao atualizar perfil.", "error");
      },
    });
  };

  if (isLoadingUser) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Carregando seu perfil...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
        <p className="text-muted-foreground font-medium mt-1">
          Gerencie suas informações pessoais e configurações do seu negócio.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden rounded-2xl">
          <CardHeader className="border-b border-border/50 bg-muted/20 pb-6">
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="h-5 w-5 text-primary" />
              Informações da Conta
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">
                  <User className="h-3 w-3" />
                  Dados Pessoais
                </div>
                <Input
                  label="Nome Completo"
                  placeholder="Seu nome"
                  {...register("name")}
                  error={errors.name?.message}
                />
                <Input
                  label="Telefone"
                  placeholder="(11) 98888-8888"
                  {...register("phone", {
                    onChange: (e) => {
                      e.target.value = maskPhoneInput(e.target.value);
                    },
                  })}
                  error={errors.phone?.message}
                />
                <div>
                  <label className="text-sm font-medium leading-none flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5" />
                    Bio / Especialidade
                  </label>
                  <textarea
                    {...register("bio")}
                    rows={3}
                    placeholder="Ex: Especialista em cortes modernos e barba..."
                    className="mt-2 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                  />
                </div>
                <Input
                  label="Instagram Pessoal"
                  placeholder="@seuinstagram"
                  {...register("instagramUrl")}
                  error={errors.instagramUrl?.message}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">
                  <Building className="h-3 w-3" />
                  O Negócio
                </div>
                <Input
                  label="Nome do Negócio"
                  placeholder="Ex: Minha Barbearia"
                  {...register("businessName")}
                  error={errors.businessName?.message}
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5" />
                    Link da Agenda Online
                  </label>
                  <div className="flex items-center">
                    <div className="flex h-10 items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-xs font-medium text-muted-foreground">
                      zenda.com/
                    </div>
                    <input
                      {...register("slug")}
                      className="flex h-10 w-full rounded-r-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  {errors.slug && (
                    <p className="text-sm font-medium text-destructive">{errors.slug.message}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden rounded-2xl">
          <CardHeader className="border-b border-border/50 bg-muted/20 pb-6">
            <CardTitle className="flex items-center gap-2 text-xl">
              <CreditCard className="h-5 w-5 text-primary" />
              Chave Pix para Recebimento
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <p className="text-sm text-muted-foreground mb-6">
              Configure sua chave Pix para que os clientes possam pagar seus agendamentos.
            </p>
            <div className="max-w-md">
              <Input
                label="Chave Pix"
                placeholder="Sua chave Pix (CPF, CNPJ, e-mail, telefone ou aleatória)"
                {...register("pixKey")}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button type="submit" className="gap-2 px-12 h-14 rounded-2xl shadow-xl shadow-primary/20 font-black uppercase tracking-widest text-xs" loading={updateProfile.isPending}>
            <Save className="h-4 w-4" />
            Salvar Todas as Configurações
          </Button>
        </div>
      </form>
    </div>
  );
}
