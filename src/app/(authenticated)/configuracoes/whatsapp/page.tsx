"use client";

import { useState, useCallback } from "react";
import {
  useWhatsappStatus,
  useWhatsappQR,
  useConnectWhatsapp,
  useLogoutWhatsapp,
  useChatStats,
  useBotSettings,
  useUpdateBotSettings,
} from "@/hooks";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, useToast } from "@/components/ui";
import {
  Loader2,
  MessageCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Users,
  MessageSquare,
  Settings,
  Save,
} from "lucide-react";

const DEFAULT_CONFIRMATION = `Olá *{clientName}*! 🌟

Confirmamos seu agendamento de *{serviceName}*.

📅 *Data:* {date}
⏰ *Hora:* {time}
🏢 *Local:* {businessName}

Estamos te esperando!`;

const DEFAULT_REMINDER = `Olá {clientName}, este é um lembrete do seu agendamento de {serviceName} amanhã, dia {date} às {time} com {businessName}. Responda SIM para confirmar ou NAO para cancelar.`;

const TEMPLATE_VARIABLES = [
  { key: "{clientName}", label: "Nome do cliente" },
  { key: "{serviceName}", label: "Nome do serviço" },
  { key: "{date}", label: "Data do agendamento" },
  { key: "{time}", label: "Horário" },
  { key: "{businessName}", label: "Nome do negócio" },
];

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
  const { data: botSettings } = useBotSettings();
  const updateBotSettings = useUpdateBotSettings();

  const [confirmationTemplate, setConfirmationTemplate] = useState("");
  const [reminderTemplate, setReminderTemplate] = useState("");
  const [templatesLoaded, setTemplatesLoaded] = useState(false);
  const [savingTemplates, setSavingTemplates] = useState(false);

  if (botSettings && !templatesLoaded) {
    setConfirmationTemplate(botSettings.appointmentConfirmationTemplate || DEFAULT_CONFIRMATION);
    setReminderTemplate(botSettings.appointmentReminderTemplate || DEFAULT_REMINDER);
    setTemplatesLoaded(true);
  }

  const handleSaveTemplates = useCallback(async () => {
    setSavingTemplates(true);
    updateBotSettings.mutate(
      {
        appointmentConfirmationTemplate: confirmationTemplate,
        appointmentReminderTemplate: reminderTemplate,
      },
      {
        onSuccess: () => {
          showToast("Templates de mensagem salvos!", "success");
          setSavingTemplates(false);
        },
        onError: () => {
          showToast("Erro ao salvar templates", "error");
          setSavingTemplates(false);
        },
      },
    );
  }, [confirmationTemplate, reminderTemplate, updateBotSettings, showToast]);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>
        </div>
      </div>

      {/* Message Templates */}
      <Card className="border border-border/50 bg-card/50 rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/40 p-6 bg-muted/5">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Templates de Mensagem
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Personalize as mensagens enviadas aos seus clientes via WhatsApp.
          </p>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-sm mb-2">Mensagem de Confirmação</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Enviada quando um agendamento é criado ou confirmado.
              </p>
              <textarea
                value={confirmationTemplate}
                onChange={(e) => setConfirmationTemplate(e.target.value)}
                rows={8}
                className="w-full rounded-xl border border-border/40 bg-muted/20 p-4 text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all font-mono"
              />
            </div>

            <div>
              <h3 className="font-bold text-sm mb-2">Mensagem de Lembrete</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Enviada 1 dia antes do agendamento como lembrete automático.
              </p>
              <textarea
                value={reminderTemplate}
                onChange={(e) => setReminderTemplate(e.target.value)}
                rows={8}
                className="w-full rounded-xl border border-border/40 bg-muted/20 p-4 text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all font-mono"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-muted/30 border border-border/30">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Variáveis disponíveis</p>
              <div className="flex flex-wrap gap-2">
                {TEMPLATE_VARIABLES.map((v) => (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(v.key);
                      showToast(`Copiado: ${v.key}`, "info");
                    }}
                    className="h-7 px-2.5 rounded-lg bg-muted border border-border/30 text-[10px] font-bold text-muted-foreground hover:bg-primary hover:text-white transition-all cursor-pointer"
                    title={`Clique para copiar ${v.key}`}
                  >
                    {v.key}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 mt-2">
                {TEMPLATE_VARIABLES.map((v) => (
                  <span key={v.key} className="text-[10px] text-muted-foreground">
                    <code className="bg-muted px-1 py-0.5 rounded text-[10px] font-bold">{v.key}</code> = {v.label}
                  </span>
                ))}
              </div>
            </div>

            <Button
              onClick={handleSaveTemplates}
              className="h-11 px-6 font-bold rounded-xl gap-2 sm:shrink-0"
              disabled={savingTemplates || updateBotSettings.isPending}
              loading={savingTemplates || updateBotSettings.isPending}
            >
              <Save className="h-4 w-4" />
              Salvar Templates
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
