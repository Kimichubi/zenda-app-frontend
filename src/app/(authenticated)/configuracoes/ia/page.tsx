"use client";

import { Card, CardContent } from "@/components/ui";
import { Bot, Sparkles, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BotSettingsPage() {
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
            Em breve você poderá configurar sua IA para atender clientes.
          </p>
        </div>
      </header>

      <Card className="border border-border/50 bg-card shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-16 flex flex-col items-center text-center space-y-6">
          <div className="h-24 w-24 rounded-3xl bg-amber-500/10 flex items-center justify-center">
            <Clock className="h-12 w-12 text-amber-500" />
          </div>
          <div className="space-y-2 max-w-md">
            <h2 className="text-2xl font-black tracking-tight">Coming in the future</h2>
            <p className="text-muted-foreground">
              O assistente virtual com IA está em desenvolvimento. Em breve você poderá configurar um bot inteligente para atender seus clientes pelo WhatsApp 24 horas por dia.
            </p>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/30 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-amber-500" />
            Fique atento às novidades!
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
