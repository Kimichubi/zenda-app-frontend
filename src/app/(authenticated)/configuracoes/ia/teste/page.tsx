"use client";

import { useState, useRef, useEffect } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, useToast, Input } from "@/components/ui";
import { Send, Bot, User, Sparkles, Loader2, RotateCcw, MessageSquare } from "lucide-react";
import { cn } from "@/utils";
import { useServices, useAppointments } from "@/hooks";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  intent?: string;
  confidence?: number;
}

export default function AiTestChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Oi! 👋 Sou a Zenda, sua assistente virtual. Como posso te ajudar hoje?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: servicesData } = useServices({ page: 1, limit: 100 });
  const { data: appointmentsData } = useAppointments();

  const services = servicesData?.data || [];
  const appointments = appointmentsData || [];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const servicesContext = services
      .map((s) => `- ${s.name}: R$${s.price.toFixed(2)} (${s.duration}min) [id:${s.id}]`)
      .join("\n");

    const upcomingAppointments = appointments
      .filter((a) => {
        const aptDate = new Date(a.date);
        return aptDate >= new Date() && ["scheduled", "confirmed"].includes(a.status.toLowerCase());
      })
      .slice(0, 5)
      .map((a) => `• ${a.serviceName} — ${new Date(a.date).toLocaleDateString("pt-BR")} às ${a.startTime}`)
      .join("\n");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/webhooks/whatsapp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "message.received",
          testMode: true,
          payload: {
            from: "5511999999999@c.us",
            body: userMsg.content,
            fromMe: false,
          },
          context: {
            services: servicesContext || "Nenhum serviço cadastrado",
            appointments: upcomingAppointments || "Nenhum agendamento futuro",
            currentDate: new Date().toLocaleDateString("pt-BR"),
          },
        }),
      });

      if (!res.ok) throw new Error("Erro na API");

      const data = await res.json();

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "Desculpe, não consegui processar sua mensagem. 😅",
        timestamp: new Date(),
        intent: data.intent ?? "FALLBACK",
        confidence: data.confidence ?? 0,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsLoading(false);
    } catch {
      showToast("Erro ao enviar mensagem", "error");
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Oi! 👋 Sou a Zenda, sua assistente virtual. Como posso te ajudar hoje?",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest">
            <Sparkles className="h-3 w-3" />
            Teste de IA
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Chat com a Zenda</h1>
          <p className="text-muted-foreground font-medium text-sm">
            Teste como a IA responde aos seus clientes em tempo real.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={clearChat}
          className="h-10 px-4 rounded-xl gap-2 text-xs font-bold"
        >
          <RotateCcw className="h-4 w-4" />
          Limpar Chat
        </Button>
      </header>

      {/* Chat Container */}
      <Card className="flex-1 flex flex-col border border-border/50 bg-card shadow-sm rounded-2xl overflow-hidden min-h-0">
        {/* Chat Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              {/* Avatar */}
              <div className={cn(
                "h-9 w-9 rounded-xl flex items-center justify-center shrink-0",
                msg.role === "user"
                  ? "bg-primary text-white"
                  : "bg-emerald-500/10 text-emerald-600"
              )}>
                {msg.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>

              {/* Message Bubble */}
              <div className={cn(
                "max-w-[75%] space-y-1",
                msg.role === "user" ? "items-end" : "items-start"
              )}>
                <div className={cn(
                  "rounded-2xl px-5 py-3 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-primary text-white rounded-tr-sm"
                    : "bg-muted/50 text-foreground rounded-tl-sm border border-border/30"
                )}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>

                {/* Meta */}
                <div className={cn(
                  "flex items-center gap-2 text-[10px] text-muted-foreground",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}>
                  <span>{msg.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
                  {msg.intent && (
                    <Badge variant="outline" className="h-4 text-[8px] px-1.5">
                      {msg.intent}
                    </Badge>
                  )}
                  {msg.confidence !== undefined && (
                    <span className="text-[9px]">{(msg.confidence * 100).toFixed(0)}%</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-muted/50 rounded-2xl rounded-tl-sm border border-border/30 px-5 py-4">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-xs text-muted-foreground">Zenda está digitando...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-border/40 p-4 bg-muted/5">
          <div className="flex items-end gap-3 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite uma mensagem para testar a IA..."
                className="h-12 pr-12 rounded-xl bg-card border-border/40 text-sm resize-none"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="h-12 w-12 rounded-xl p-0 shrink-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-center text-[10px] text-muted-foreground mt-2">
            Pressione Enter para enviar • Respostas em tempo real via IA
          </p>
        </div>
      </Card>

      {/* Quick Test Suggestions */}
      <div className="shrink-0 space-y-3">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Sugestões de Teste</p>
        <div className="flex flex-wrap gap-2">
          {[
            "Oi, quais serviços vocês têm?",
            "Quero agendar um corte",
            "Meus agendamentos",
            "Quanto custa a barba?",
            "Cancelar meu agendamento",
            "Horários disponíveis para amanhã",
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                setInput(suggestion);
              }}
              className="h-9 px-4 rounded-xl bg-muted text-xs font-bold text-muted-foreground hover:bg-primary hover:text-white transition-all"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
