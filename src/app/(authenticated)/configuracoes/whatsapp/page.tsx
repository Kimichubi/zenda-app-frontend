"use client";

import { useWhatsappStatus, useWhatsappQR, useConnectWhatsapp, useLogoutWhatsapp } from "@/hooks";
import { Button, Card, CardContent, CardHeader, CardTitle, useToast } from "@/components/ui";
import { Loader2, MessageCircle, CheckCircle2, XCircle, RefreshCw } from "lucide-react";

export default function WhatsappConfigPage() {
  const { data: statusData, isLoading: isLoadingStatus } = useWhatsappStatus();
  const connect = useConnectWhatsapp();
  const logout = useLogoutWhatsapp();
  const { showToast } = useToast();

  const isScanning = statusData?.status === "SCANNING" || statusData?.status === "SCAN_QR_CODE";
  const isConnected = statusData?.status === "CONNECTED" || statusData?.status === "WORKING";
  const isConnecting = statusData?.status === "STARTING";
  
  const { data: qrData, isLoading: isLoadingQR } = useWhatsappQR(isScanning);

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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="space-y-1">
        <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest">
          <MessageCircle className="h-3 w-3" />
          Integrações
        </div>
        <h1 className="text-3xl font-bold tracking-tight">WhatsApp</h1>
        <p className="text-muted-foreground font-medium text-sm">
          Conecte seu número para automatizar lembretes e notificações.
        </p>
      </header>

      <div className="max-w-2xl">
        <Card className="border border-border/50 bg-card shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="border-b border-border/40 p-6 bg-muted/5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : isScanning || isConnecting ? "bg-amber-500 animate-pulse" : "bg-muted-foreground/30"}`} />
                Status da Conexão
              </CardTitle>
              <Badge variant={isConnected ? "success" : isScanning || isConnecting ? "warning" : "secondary"} className="uppercase text-[9px] font-bold tracking-wider">
                {isConnected ? "Conectado" : isConnecting ? "Iniciando..." : isScanning ? "Aguardando QR Code" : statusData?.status || "Desconectado"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-10 flex flex-col items-center text-center space-y-8">
            {!isConnected && !isScanning && !isConnecting && (
              <>
                <div className="w-20 h-20 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                  <MessageCircle className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Conecte seu WhatsApp</h3>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                    Ao conectar seu número, o Zenda enviará automaticamente confirmações para seus clientes.
                  </p>
                </div>
                <Button 
                  onClick={handleConnect} 
                  className="h-12 px-8 font-bold rounded-xl gap-2 shadow-lg shadow-primary/20"
                  disabled={connect.isPending}
                >
                  {connect.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  Gerar QR Code
                </Button>
              </>
            )}

            {isConnecting && (
              <>
                <div className="w-20 h-20 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <Loader2 className="w-10 h-10 animate-spin" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-amber-600">Iniciando Serviço</h3>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                    O servidor do WhatsApp está sendo preparado. Isso pode levar alguns segundos...
                  </p>
                </div>
              </>
            )}

            {isScanning && (
              <>
                <div className="bg-white p-6 rounded-2xl shadow-inner border-8 border-muted">
                  {isLoadingQR || !qrData?.qr ? (
                    <div className="w-48 h-48 flex items-center justify-center bg-muted/10 rounded-lg">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <img 
                      src={`data:image/png;base64,${qrData.qr}`} 
                      alt="WhatsApp QR Code" 
                      className="w-48 h-48"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-amber-600">Aguardando Leitura</h3>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                    Abra o WhatsApp no seu celular, vá em Aparelhos Conectados e escaneie o código acima.
                  </p>
                </div>
              </>
            )}

            {isConnected && (
              <>
                <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-emerald-600">WhatsApp Ativo</h3>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                    Seu sistema está operando com sucesso. As notificações automáticas estão habilitadas.
                  </p>
                </div>
                <Button 
                  variant="outline"
                  onClick={handleLogout} 
                  className="h-12 px-8 font-bold rounded-xl gap-2 border-destructive/20 text-destructive hover:bg-destructive/5"
                  disabled={logout.isPending}
                >
                  {logout.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                  Desconectar Dispositivo
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Badge({ children, variant, className }: any) {
  const styles = {
    success: "bg-emerald-500/10 text-emerald-600",
    warning: "bg-amber-500/10 text-amber-600",
    secondary: "bg-muted text-muted-foreground",
  };
  const currentStyle = (styles as any)[variant] || styles.secondary;
  return (
    <span className={`px-2.5 py-0.5 rounded-md ${currentStyle} ${className}`}>
      {children}
    </span>
  );
}