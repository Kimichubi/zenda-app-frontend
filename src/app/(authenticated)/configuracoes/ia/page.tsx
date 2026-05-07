"use client";

import { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, useToast, Input } from "@/components/ui";
import { Bot, Save, Sparkles, MessageSquare, Type, Hash, ToggleLeft, Loader2, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useBotSettings, useUpdateBotSettings } from "@/hooks";
import { cn } from "@/utils";

const botSettingsSchema = z.object({
  botEnabled: z.boolean(),
  botPrompt: z.string().max(4000, "Máximo 4000 caracteres"),
  botTone: z.string().max(50, "Máximo 50 caracteres"),
  botUseEmojis: z.boolean(),
  botMaxSentences: z.number().min(1).max(10),
});

type BotSettingsFormData = z.infer<typeof botSettingsSchema>;

const toneOptions = [
  { value: "amigável", label: "Amigável", desc: "Casual, acolhedor, como um amigo" },
  { value: "profissional", label: "Profissional", desc: "Formal, direto, corporativo" },
  { value: "divertido", label: "Divertido", desc: "Descontraído, com piadas e energia" },
  { value: "elegante", label: "Elegante", desc: "Sofisticado, refinado, luxo" },
  { value: "direto", label: "Direto", desc: "Rápido, objetivo, sem floreios" },
];

const promptTemplates = [
  {
    name: "Padrão",
    prompt: `Você é Zenda, assistente virtual de um estabelecimento de beleza.
Fale de forma amigável e prestativa.
Use emojis para deixar a conversa mais leve.
Sempre liste todos os serviços quando perguntarem.
Mostre todos os agendamentos do cliente quando consultar.`,
  },
  {
    name: "Luxo",
    prompt: `Você é a concierge exclusiva de um salão de alta perfumaria.
Trate cada cliente como VIP. Use linguagem sofisticada.
Sempre confirme detalhes antes de agendar.
Mencione a exclusividade dos serviços.`,
  },
  {
    name: "Rápido",
    prompt: `Você é um assistente eficiente de uma barbearia movimentada.
Respostas curtas e diretas. Máximo 2 frases.
Vá direto ao ponto. Horários e preços apenas.
Sem emojis. Sem floreios.`,
  },
];

export default function BotSettingsPage() {
  const { data: settings, isLoading } = useBotSettings();
  const updateSettings = useUpdateBotSettings();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"personality" | "prompt">("personality");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<BotSettingsFormData>({
    resolver: zodResolver(botSettingsSchema),
    defaultValues: settings ? {
      botEnabled: settings.botEnabled,
      botPrompt: settings.botPrompt ?? "",
      botTone: settings.botTone ?? "amigável",
      botUseEmojis: settings.botUseEmojis,
      botMaxSentences: settings.botMaxSentences,
    } : undefined,
  });

  const botEnabled = watch("botEnabled");
  const botPrompt = watch("botPrompt");
  const currentTone = watch("botTone");
  const botUseEmojis = watch("botUseEmojis");
  const botMaxSentences = watch("botMaxSentences");

  const onSubmit = useCallback((data: BotSettingsFormData) => {
    updateSettings.mutate(data, {
      onSuccess: () => showToast("Configurações salvas!", "success"),
      onError: () => showToast("Erro ao salvar", "error"),
    });
  }, [updateSettings, showToast]);

  const handleToggleEnabled = useCallback(() => {
    setValue("botEnabled", !botEnabled, { shouldDirty: true });
  }, [setValue, botEnabled]);

  const handleToggleEmojis = useCallback(() => {
    setValue("botUseEmojis", !botUseEmojis, { shouldDirty: true });
  }, [setValue, botUseEmojis]);

  const handleToneSelect = useCallback((tone: string) => {
    setValue("botTone", tone, { shouldDirty: true });
  }, [setValue]);

  const handleTemplateSelect = useCallback((prompt: string, name: string) => {
    setValue("botPrompt", prompt, { shouldDirty: true });
    showToast(`Template "${name}" aplicado!`, "info");
  }, [setValue, showToast]);

  const promptLength = botPrompt?.length ?? 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest">
            <Bot className="h-3 w-3" />
            Inteligência Artificial
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Assistente Virtual</h1>
          <p className="text-muted-foreground font-medium text-sm">
            Personalize como a IA atende seus clientes pelo WhatsApp.
          </p>
        </div>
        <Link href="/configuracoes/ia/teste">
          <Button
            variant="outline"
            className="h-10 px-5 rounded-xl gap-2 text-xs font-bold border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all"
          >
            <MessageCircle className="h-4 w-4" />
            Testar Chat
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border border-border/50 bg-card shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", botEnabled ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground")}>
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold">Assistente IA</h3>
                  <p className="text-sm text-muted-foreground">
                    {botEnabled ? "Ativo e respondendo clientes" : "Desativado — você responde manualmente"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleToggleEnabled}
                className={cn(
                  "relative h-8 w-14 rounded-full transition-colors duration-300",
                  botEnabled ? "bg-primary" : "bg-muted"
                )}
              >
                <div className={cn(
                  "absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-300",
                  botEnabled ? "left-7" : "left-1"
                )} />
              </button>
            </div>
          </CardContent>
        </Card>

        {botEnabled && (
          <>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("personality")}
                className={cn(
                  "h-10 px-5 rounded-xl text-sm font-bold transition-all",
                  activeTab === "personality"
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                Personalidade
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("prompt")}
                className={cn(
                  "h-10 px-5 rounded-xl text-sm font-bold transition-all",
                  activeTab === "prompt"
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                Prompt Personalizado
              </button>
            </div>

            {activeTab === "personality" && (
              <div key="personality-tab" className="space-y-8">
                <Card className="border border-border/50 bg-card shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="border-b border-border/40 p-6 bg-muted/5">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Type className="h-5 w-5 text-primary" />
                      Tom de Voz
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {toneOptions.map((tone) => (
                        <button
                          key={tone.value}
                          type="button"
                          onClick={() => handleToneSelect(tone.value)}
                          className={cn(
                            "relative p-4 rounded-xl border text-left transition-all duration-200",
                            currentTone === tone.value
                              ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                              : "border-border/40 bg-card hover:border-primary/30 hover:bg-muted/20"
                          )}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm">{tone.label}</span>
                            {currentTone === tone.value && (
                              <Badge variant="success" className="h-5 text-[9px] font-black uppercase tracking-wider">Ativo</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{tone.desc}</p>
                        </button>
                      ))}
                    </div>
                    {errors.botTone && (
                      <p className="text-xs text-rose-500 mt-2">{errors.botTone.message}</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="border border-border/50 bg-card shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="border-b border-border/40 p-6 bg-muted/5">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      Estilo de Resposta
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm">Usar Emojis</p>
                        <p className="text-xs text-muted-foreground">Adiciona emojis nas respostas para deixar mais leve</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleToggleEmojis}
                        className={cn(
                          "relative h-8 w-14 rounded-full transition-colors duration-300",
                          botUseEmojis ? "bg-primary" : "bg-muted"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-300",
                          botUseEmojis ? "left-7" : "left-1"
                        )} />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-sm">Máximo de Frases</p>
                          <p className="text-xs text-muted-foreground">Limite o tamanho das respostas da IA</p>
                        </div>
                        <span className="text-2xl font-black text-primary">{botMaxSentences}</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={10}
                        {...register("botMaxSentences", { valueAsNumber: true })}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                        <span>Curto (1)</span>
                        <span>Médio (5)</span>
                        <span>Longo (10)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "prompt" && (
              <div key="prompt-tab" className="space-y-8">
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Templates Rápidos</p>
                  <div className="flex flex-wrap gap-2">
                    {promptTemplates.map((t) => (
                      <button
                        key={t.name}
                        type="button"
                        onClick={() => handleTemplateSelect(t.prompt, t.name)}
                        className="h-9 px-4 rounded-xl bg-muted text-xs font-bold text-muted-foreground hover:bg-primary hover:text-white transition-all"
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>

                <Card className="border border-border/50 bg-card shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="border-b border-border/40 p-6 bg-muted/5">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Hash className="h-5 w-5 text-primary" />
                      Prompt do Sistema
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <textarea
                      {...register("botPrompt")}
                      rows={12}
                      placeholder={`Exemplo:\nVocê é o assistente virtual de uma barbearia.\n- Fale de forma amigável\n- Use emojis\n- Sempre liste os serviços disponíveis\n- Confirme antes de agendar`}
                      className="w-full rounded-xl border border-border/40 bg-muted/30 p-4 text-sm font-mono leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                    />
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-muted-foreground">
                        Use <code className="bg-muted px-1 py-0.5 rounded text-[10px]">{"{services}"}</code>, <code className="bg-muted px-1 py-0.5 rounded text-[10px]">{"{currentDate}"}</code>, <code className="bg-muted px-1 py-0.5 rounded text-[10px]">{"{appointmentsContext}"}</code> como variáveis.
                      </p>
                      <span className={cn("text-xs font-bold", promptLength > 3500 ? "text-rose-500" : "text-muted-foreground")}>
                        {promptLength}/4000
                      </span>
                    </div>
                    {errors.botPrompt && (
                      <p className="text-xs text-rose-500 mt-2">{errors.botPrompt.message}</p>
                    )}
                  </CardContent>
                </Card>

                {botPrompt && (
                  <Card className="border border-border/50 bg-card shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="border-b border-border/40 p-6 bg-muted/5">
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Bot className="h-5 w-5 text-primary" />
                        Pré-visualização
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="bg-muted/30 rounded-xl p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-muted-foreground max-h-64 overflow-y-auto">
                        {botPrompt}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </>
        )}

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            className="h-12 px-8 rounded-xl font-bold gap-2 shadow-lg shadow-primary/20"
            disabled={!isDirty || updateSettings.isPending}
            loading={updateSettings.isPending}
          >
            <Save className="h-4 w-4" />
            Salvar Configurações
          </Button>
        </div>
      </form>
    </div>
  );
}
