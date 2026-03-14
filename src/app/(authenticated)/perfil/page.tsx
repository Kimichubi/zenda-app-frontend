"use client";

import { useUser, useUpdateProfile } from "@/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input, Card, CardContent, CardHeader, CardTitle, useToast } from "@/components/ui";
import { Loader2, User, Building, Phone, Globe, Save } from "lucide-react";
import { useEffect } from "react";

const profileSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  phone: z.string().min(1, "O telefone é obrigatório"),
  businessName: z.string().min(1, "O nome do negócio é obrigatório"),
  slug: z.string().min(1, "O link da agenda é obrigatório")
    .regex(/^[a-z0-9-]+$/, "O link deve conter apenas letras minúsculas, números e hífens"),
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
        businessName: user.businessName,
        slug: user.slug,
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

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden rounded-2xl">
        <CardHeader className="border-b border-border/50 bg-muted/20 pb-6">
          <CardTitle className="flex items-center gap-2 text-xl">
            <User className="h-5 w-5 text-primary" />
            Informações da Conta
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wider">
                  <User className="h-3.5 w-3.5" />
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
                  placeholder="(00) 00000-0000"
                  {...register("phone")}
                  error={errors.phone?.message}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wider">
                  <Building className="h-3.5 w-3.5" />
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
                  <p className="text-[10px] text-muted-foreground italic mt-1">
                    Este é o link que você enviará para seus clientes agendarem online.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border/50 flex justify-end">
              <Button type="submit" className="gap-2 px-8 h-11" loading={updateProfile.isPending}>
                <Save className="h-4 w-4" />
                Salvar Alterações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-destructive/5 backdrop-blur-sm overflow-hidden rounded-2xl border-dashed">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-bold text-destructive">Zona de Perigo</h3>
              <p className="text-xs text-muted-foreground">
                As ações nesta seção podem ser irreversíveis.
              </p>
            </div>
            <Button variant="outline" className="border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all">
              Excluir minha conta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
