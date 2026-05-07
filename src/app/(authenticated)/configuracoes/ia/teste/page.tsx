"use client";

import { Card, CardContent } from "@/components/ui";
import { Bot, Sparkles, Clock } from "lucide-react";

export default function AiTestChatPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 h-[calc(100vh-8rem)] flex flex-col">
      <header className="flex items-center justify-between shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest">
            <Sparkles className="h-3 w-3" />
            Teste de IA
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Chat com a Zenda</h1>
          <p className="text-muted-foreground font-medium text-sm">
            Em breve você poderá testar a IA em tempo real.
          </p>
        </div>
      </header>

      <Card className="flex-1 flex flex-col border border-border/50 bg-card shadow-sm rounded-2xl overflow-hidden min-h-0">
        <CardContent className="flex-1 flex flex-col items-center justify-center p-16 text-center space-y-6">
          <div className="h-24 w-24 rounded-3xl bg-amber-500/10 flex items-center justify-center">
            <Clock className="h-12 w-12 text-amber-500" />
          </div>
          <div className="space-y-2 max-w-md">
            <h2 className="text-2xl font-black tracking-tight">Coming in the future</h2>
            <p className="text-muted-foreground">
              O chat de teste com IA estará disponível junto com o assistente virtual. Você poderá testar como a IA responde antes de ativar para seus clientes.
            </p>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/30 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-amber-500" />
            Funcionalidade em desenvolvimento
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
