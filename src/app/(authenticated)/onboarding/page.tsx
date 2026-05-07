"use client";

import { useCallback, useState } from "react";
import { Button, Card, CardContent, useToast } from "@/components/ui";
import { api } from "@/services/api";
import {
  Sparkles,
  Headphones,
  ClipboardList,
  MessageCircle,
  Clock,
  Shield,
  Loader2,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";

export default function OnboardingPage() {
  const { showToast } = useToast();
  const [acknowledged, setAcknowledged] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAcknowledge = useCallback(async () => {
    setLoading(true);
    try {
      await api.patch("/auth/complete-onboarding");
      setAcknowledged(true);
      showToast("Solicitação registrada!", "success");
    } catch {
      showToast("Erro. Tente novamente.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight">Bem-vindo à Zenda!</h1>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Sua conta foi criada. Agora ela precisa ser ativada pela nossa equipe.
          </p>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg">
          <CardContent className="p-8 md:p-10 space-y-8">
            <div className="space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                Como funciona
              </h2>
              <div className="space-y-3">
                {[
                  { title: "Entre em contato com o suporte", desc: "Nossa equipe vai atender você e ativar sua conta na plataforma.", icon: Headphones },
                  { title: "Escolha seu plano", desc: "Você poderá escolher entre os planos Essencial ou Enterprise.", icon: Sparkles },
                  { title: "Sua conta é ativada", desc: "Após a ativação, você terá acesso completo ao sistema.", icon: Shield },
                ].map((step, i) => (
                  <div key={step.title} className="flex gap-4 p-4 rounded-xl bg-muted/20 border border-border/30">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <step.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{step.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-3">
              <div className="flex items-center gap-2">
                <Headphones className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-sm">Fale com nosso suporte</h3>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  WhatsApp: (11) 99999-9999
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Seg a Sex, das 9h às 18h
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Entre em contato para ativar sua conta e escolher o melhor plano para seu negocio.
              </p>
            </div>

            {!acknowledged ? (
              <Button
                onClick={handleAcknowledge}
                loading={loading}
                className="w-full h-14 rounded-xl text-sm font-bold gap-2 shadow-lg shadow-primary/20"
              >
                <Logo height={20} iconOnly />
                Entendi, quero ativar minha conta
              </Button>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center">
                <Shield className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-emerald-600">Solicitacao enviada!</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Nossa equipe entrara em contato em breve para ativar sua conta.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
