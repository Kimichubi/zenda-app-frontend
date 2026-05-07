"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, useToast } from "@/components/ui";
import { api } from "@/services/api";
import {
  Check,
  Sparkles,
  Headphones,
  ClipboardList,
  ArrowRight,
  MessageCircle,
  Clock,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";

export default function OnboardingPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const handleComplete = useCallback(async () => {
    try {
      await api.patch("/auth/complete-onboarding");
      showToast("Onboarding concluído! Bem-vindo à Zenda!", "success");
      router.push("/dashboard");
    } catch {
      showToast("Erro ao finalizar. Tente novamente.", "error");
    }
  }, [router, showToast]);

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
            Sua conta foi criada com sucesso. Agora nossa equipe vai te ajudar a configurar tudo.
          </p>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg">
          <CardContent className="p-8 md:p-10 space-y-8">
            {/* Steps */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                Como funciona a configuração
              </h2>
              <div className="space-y-3">
                {[
                  {
                    title: "Entre em contato com nosso suporte",
                    desc: "Nossa equipe vai te atender e configurar seu negócio na plataforma.",
                    icon: Headphones,
                  },
                  {
                    title: "Cadastro dos seus serviços",
                    desc: "Vamos cadastrar todos os serviços, preços e horários da sua agenda.",
                    icon: Sparkles,
                  },
                  {
                    title: "Sua página online no ar",
                    desc: "Sua página de agendamento ficará disponível para seus clientes.",
                    icon: ArrowRight,
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

            {/* Contact Info */}
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
                Após a configuração, você poderá acessar todas as funcionalidades do sistema.
              </p>
            </div>

            <Button
              onClick={handleComplete}
              className="w-full h-14 rounded-xl text-sm font-bold gap-2 shadow-lg shadow-primary/20"
            >
              <Logo size={20} iconOnly />
              Entendi, ir para o Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
