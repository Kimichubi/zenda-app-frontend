"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui";
import { authService } from "@/services/auth";
import {
  Sparkles,
  Headphones,
  MessageCircle,
  Clock,
  Loader2,
} from "lucide-react";

export default function OnboardingPage() {
  const [businessName, setBusinessName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.validateToken().then(r => {
      setBusinessName(r.businessName || null);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            {businessName ? `Bem-vindo, ${businessName}!` : "Bem-vindo a Zenda!"}
          </h1>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Sua conta foi criada. Para ativar o acesso ao sistema, entre em contato com nosso suporte.
          </p>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg">
          <CardContent className="p-8 md:p-10 space-y-8">
            <div className="space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Headphones className="h-5 w-5 text-primary" />
                Proximos passos
              </h2>
              <div className="space-y-3">
                {[
                  {
                    title: "Entre em contato com o suporte",
                    desc: "Nossa equipe vai entender seu negocio e ativar sua conta na plataforma.",
                    icon: MessageCircle,
                  },
                  {
                    title: "Configuracao do seu negocio",
                    desc: "Cadastramos seus servicos, precos, horarios e profissionais da sua equipe.",
                    icon: Sparkles,
                  },
                  {
                    title: "Sua conta e ativada",
                    desc: "Apos a ativacao, voce e sua equipe terao acesso completo ao sistema.",
                    icon: Sparkles,
                  },
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
                  Seg a Sex, das 9h as 18h
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Entre em contato para ativar sua conta e escolher o melhor plano para seu negocio.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
