"use client";

import { useState } from "react";
import {
  useWhatsappStatus,
  useWhatsappQR,
  useConnectWhatsapp,
  useLogoutWhatsapp,
  useChatSessions,
  useChatLogs,
  useChatStats,
  useResetChatSession,
} from "@/hooks";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, useToast } from "@/components/ui";
import {
  Loader2,
  MessageCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Bot,
  Users,
  MessageSquare,
  BrainCircuit,
  CalendarClock,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from "lucide-react";

import { formatDate, cn } from "@/utils";

export default function WhatsappConfigPage() {
  const { data: statusData, isLoading: isLoadingStatus } = useWhatsappStatus();
  const connect = useConnectWhatsapp();
  const logout = useLogoutWhatsapp();
  const { showToast } = useToast();

  const isScanning = statusData?.status === "SCANNING" || statusData?.status === "SCAN_QR_CODE";
  const isConnected = statusData?.status === "CONNECTED" || statusData?.status === "WORKING";
  const isConnecting = statusData?.status === "STARTING";

  const { data: qrData, isLoading: isLoadingQR } = useWhatsappQR(isScanning);
  const { data: statsData } = useChatStats();
  const { data: sessionsData } = useChatSessions(20);
  const resetSession = useResetChatSession();

  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const { data: logsData } = useChatLogs(expandedSession ?? "");

  const handleConnect = () => {
    connect.mutate(undefined, {
      onSuccess: () => showToast("Iniciando conexão...", "info"),
      onError: () => showToast("Erro ao conectar", "error"),
    });
  };

  const handleLogout = () => {
    if (confirm("Deseja desconectar seu WhatsApp?")) {
      logout.mutate(undefined, {
        onSuccess: () => showToast("WhatsApp desconectado", "success"),
      });
    }
  };

  const handleReset = (sessionId: string) => {
    if (confirm("Deseja resetar o contexto desta conversa?")) {
      resetSession.mutate(sessionId, {
        onSuccess: () => showToast("Contexto resetado", "success"),
      });
    }
  };

  const sessions = sessionsData?.sessions ?? [];
  const stats = statsData;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="space-y-1">
        <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest">
          <MessageCircle className="h-3 w-3" />
          Integrações
        </div>
        <h1 className="text-3xl font-bold tracking-tight">WhatsApp</h1>
        <p className="text-muted-foreground font-medium text-sm">
          Conecte seu número e monitore o assistente virtual de IA.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Conexão */}
        <div className="lg:col-span-1">
          <Card className="border border-border/50 bg-card shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-border/40 p-6 bg-muted/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : isScanning || isConnecting ? "bg-amber-500 animate-pulse" : "bg-muted-foreground/30"}`} />
                  Status
                </CardTitle>
                <Badge variant={isConnected ? "success" : isScanning || isConnecting ? "warning" : "secondary"} className="uppercase text-[9px] font-bold tracking-wider">
                  {isConnected ? "Conectado" : isConnecting ? "Iniciando..." : isScanning ? "Aguardando QR" : statusData?.status || "Desconectado"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
              {!isConnected && !isScanning && !isConnecting && (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                    <MessageCircle className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold">Conecte seu WhatsApp</h3>
                    <p className="text-muted-foreground text-xs">
                      O Zenda enviará confirmações e o bot de IA atenderá seus clientes.
                    </p>
                  </div>
                  <Button onClick={handleConnect} className="h-11 px-6 font-bold rounded-xl gap-2 shadow-lg shadow-primary/20" disabled={connect.isPending}>
                    {connect.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                    Gerar QR Code
                  </Button>
                </>
              )}

              {isConnecting && (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-amber-600">Iniciando</h3>
                    <p className="text-muted-foreground text-xs">Preparando o servidor...</p>
                  </div>
                </>
              )}

              {isScanning && (
                <>
                  <div className="bg-white p-5 rounded-2xl shadow-inner border-8 border-muted">
                    {isLoadingQR || !qrData?.qr ? (
                      <div className="w-40 h-40 flex items-center justify-center bg-muted/10 rounded-lg">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <img src={`data:image/png;base64,${qrData.qr}`} alt="QR Code WhatsApp" className="w-40 h-40" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-amber-600">Aguardando Leitura</h3>
                    <p className="text-muted-foreground text-xs">Abra o WhatsApp e escaneie o código.</p>
                  </div>
                </>
              )}

              {isConnected && (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-emerald-600">WhatsApp Ativo</h3>
                    <p className="text-muted-foreground text-xs">Notificações e bot de IA operando.</p>
                  </div>
                  <Button variant="outline" onClick={handleLogout} className="h-11 px-6 font-bold rounded-xl gap-2 border-destructive/20 text-destructive hover:bg-destructive/5" disabled={logout.isPending}>
                    {logout.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                    Desconectar
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats do Bot */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border border-border/40 bg-card/50 rounded-2xl">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Sessões</p>
                  <p className="text-xl font-bold">{stats?.totalSessions ?? 0}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border/40 bg-card/50 rounded-2xl">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Mensagens</p>
                  <p className="text-xl font-bold">{stats?.totalMessages ?? 0}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border/40 bg-card/50 rounded-2xl">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">IA Ativa</p>
                  <p className="text-xl font-bold">Gemini</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sessões Recentes */}
          <Card className="border border-border/50 bg-card/50 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-border/40 p-6">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                Conversas Recentes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {sessions.length === 0 ? (
                <div className="p-10 text-center text-muted-foreground text-sm">
                  Nenhuma conversa registrada ainda.
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  {sessions.map((session: any) => (
                    <div key={session.id}>
                      <button
                        onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-muted/20 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <MessageCircle className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold">{session.phoneNumber}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                              {session.state}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-muted-foreground">
                            {formatDate(session.lastMessageAt)}
                          </span>
                          {expandedSession === session.id ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </button>

                      {expandedSession === session.id && (
                        <div className="px-4 pb-4">
                          <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Histórico</p>
                              <Button size="sm" variant="ghost" className="h-7 text-[10px] gap-1" onClick={() => handleReset(session.id)}>
                                <RotateCcw className="h-3 w-3" />
                                Resetar Contexto
                              </Button>
                            </div>
                              {logsData?.logs?.length === 0 ? (
                              <p className="text-xs text-muted-foreground">Sem mensagens.</p>
                            ) : (
                              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                                {logsData?.logs?.map((log: any) => (
                                  <div key={log.id} className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-[8px] h-4 px-1.5">
                                        {log.intent}
                                      </Badge>
                                      <span className="text-[9px] text-muted-foreground">
                                        {new Date(log.createdAt).toLocaleTimeString("pt-BR")}
                                      </span>
                                      <span className="text-[9px] text-muted-foreground ml-auto">
                                        {(log.confidence * 100).toFixed(0)}%
                                      </span>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-xs bg-primary/5 rounded-lg px-3 py-2 text-foreground">
                                        <span className="font-bold text-primary mr-1">Cliente:</span>
                                        {log.incoming}
                                      </p>
                                      <p className="text-xs bg-emerald-500/5 rounded-lg px-3 py-2 text-foreground">
                                        <span className="font-bold text-emerald-600 mr-1">Bot:</span>
                                        {log.outgoing}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}