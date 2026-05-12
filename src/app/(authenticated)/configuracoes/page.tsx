"use client";

import { useSiteSettings, useUpdateSiteSettings } from "@/hooks/use-site-settings";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Card, CardContent, CardHeader, CardTitle, useToast } from "@/components/ui";
import { useEffect } from "react";
import { Loader2, Globe, Palette, MessageCircle, Camera, FileText, Hash } from "lucide-react";

const siteSchema = z.object({
  heroTitle: z.string().min(1, "O titulo e obrigatorio"),
  heroSubtitle: z.string().min(1, "O subtitulo e obrigatorio"),
  aboutText: z.string().min(1, "O texto sobre e obrigatorio"),
  themeColor: z.string().min(1, "A cor do tema e obrigatoria"),
  instagramUrl: z.string().optional().or(z.literal("")),
  whatsappUrl: z.string().optional().or(z.literal("")),
  logoUrl: z.string().optional().or(z.literal("")),
});

type SiteFormData = z.infer<typeof siteSchema>;

export default function SiteConfigPage() {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SiteFormData>({
    resolver: zodResolver(siteSchema),
  });

  useEffect(() => {
    if (settings) {
      reset({
        heroTitle: settings.heroTitle || "",
        heroSubtitle: settings.heroSubtitle || "",
        aboutText: settings.aboutText || "",
        themeColor: settings.themeColor || "#4f46e5",
        instagramUrl: settings.instagramUrl || "",
        whatsappUrl: settings.whatsappUrl || "",
        logoUrl: settings.logoUrl || "",
      });
    }
  }, [settings, reset]);

  const onSubmit = (data: SiteFormData) => {
    updateSettings.mutate(data, {
      onSuccess: () => showToast("Landing page atualizada com sucesso!", "success"),
      onError: () => showToast("Erro ao atualizar landing page.", "error"),
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Carregando configuracoes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Landing Page</h1>
        <p className="text-muted-foreground font-medium mt-1">
          Personalize a pagina publica de agendamento do seu negocio.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden rounded-2xl">
          <CardHeader className="border-b border-border/50 bg-muted/20 pb-6">
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5 text-primary" />
              Hero e Apresentacao
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div>
              <label className="text-sm font-medium">Titulo Principal</label>
              <input
                {...register("heroTitle")}
                placeholder="Ex: Agende seu horario"
                className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              {errors.heroTitle && <p className="text-sm font-medium text-destructive mt-1">{errors.heroTitle.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Subtitulo</label>
              <input
                {...register("heroSubtitle")}
                placeholder="Ex: O melhor servico da regiao"
                className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              {errors.heroSubtitle && <p className="text-sm font-medium text-destructive mt-1">{errors.heroSubtitle.message}</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden rounded-2xl">
          <CardHeader className="border-b border-border/50 bg-muted/20 pb-6">
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5 text-primary" />
              Nossa Historia
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div>
              <label className="text-sm font-medium">Sobre o Negocio</label>
              <p className="text-xs text-muted-foreground mt-1 mb-2">
                Conte a historia da sua barbearia. Este texto aparece na secao "Sobre" da sua landing page.
              </p>
              <textarea
                {...register("aboutText")}
                rows={5}
                placeholder="Ex: Focados em excelencia e estilo desde 2015..."
                className="mt-2 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
              />
              {errors.aboutText && <p className="text-sm font-medium text-destructive mt-1">{errors.aboutText.message}</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden rounded-2xl">
          <CardHeader className="border-b border-border/50 bg-muted/20 pb-6">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Palette className="h-5 w-5 text-primary" />
              Aparencia
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div>
              <label className="text-sm font-medium">Cor do Tema</label>
              <p className="text-xs text-muted-foreground mt-1 mb-2">
                Cor principal da sua landing page (botoes, destaques, icones).
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  {...register("themeColor")}
                  className="h-10 w-16 rounded-md border border-input cursor-pointer"
                />
                <input
                  {...register("themeColor")}
                  placeholder="#4f46e5"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">URL do Logo</label>
              <p className="text-xs text-muted-foreground mt-1 mb-2">
                Link para a imagem do logo da sua barbearia (opcional).
              </p>
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  {...register("logoUrl")}
                  placeholder="https://exemplo.com/logo.png"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden rounded-2xl">
          <CardHeader className="border-b border-border/50 bg-muted/20 pb-6">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Hash className="h-5 w-5 text-primary" />
              Redes Sociais
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div>
              <label className="text-sm font-medium">Instagram</label>
              <p className="text-xs text-muted-foreground mt-1 mb-2">
                Link para o perfil do Instagram da barbearia. Aparece como icone clicavel na landing page.
              </p>
              <input
                {...register("instagramUrl")}
                placeholder="https://instagram.com/suabarbearia"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-emerald-500" />
                WhatsApp
              </label>
              <p className="text-xs text-muted-foreground mt-1 mb-2">
                Link do WhatsApp da barbearia. Use o formato wa.me. Aparece como botao na landing page.
              </p>
              <input
                {...register("whatsappUrl")}
                placeholder="https://wa.me/5511988888888"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button type="submit" className="gap-2 px-12 h-14 rounded-2xl shadow-xl shadow-primary/20 font-black uppercase tracking-widest text-xs" loading={updateSettings.isPending}>
            <Globe className="h-4 w-4" />
            Salvar Landing Page
          </Button>
        </div>
      </form>
    </div>
  );
}
