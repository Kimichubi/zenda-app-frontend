"use client";

import { useState, useEffect } from "react";
import { X, Copy, Check, Clock, QrCode, Loader2 } from "lucide-react";
import { Button } from "@/components/ui";
import { formatCurrency, cn } from "@/utils";
import { QRCodeSVG } from "qrcode.react";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

interface PixModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixCode: string;
  amount: number;
  clientName?: string;
  serviceName?: string;
  onConfirmPayment?: () => void;
  isConfirming?: boolean;
}

export function PixModal({ isOpen, onClose, pixCode, amount, clientName, serviceName, onConfirmPayment, isConfirming }: PixModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) setCopied(false);
  }, [isOpen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  if (!isOpen) return null;

  const isValidPix = pixCode.startsWith("000201");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border/40 rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-black">Pagamento PIX</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          <div className="text-center space-y-2">
            <p className="text-3xl font-black text-foreground tracking-tight">{formatCurrency(amount)}</p>
            {clientName && <p className="text-sm font-medium text-muted-foreground">{clientName}</p>}
            {serviceName && <p className="text-xs text-muted-foreground">{serviceName}</p>}
          </div>

          {!isValidPix && (
            <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  Chave PIX nao configurada
                </p>
                <p className="text-[10px] text-amber-600/70 dark:text-amber-400/70">
                  Configure a chave PIX do seu negocio para gerar QR Codes validos.
                </p>
                <Link
                  href="/configuracoes/whatsapp"
                  className="text-[10px] font-bold text-amber-600 dark:text-amber-400 underline hover:no-underline"
                >
                  Ir para Configuracoes
                </Link>
              </div>
            </div>
          )}

          <div className="flex justify-center py-4">
            <div className={cn("p-4 rounded-2xl shadow-lg border border-border/20", isValidPix ? "bg-white" : "bg-white/50 opacity-60")}>
              <QRCodeSVG
                value={isValidPix ? pixCode : "https://zenda.app"}
                size={200}
                level="M"
                includeMargin
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-muted/50 border border-border/30 rounded-xl p-3 overflow-hidden">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">
                  PIX Copia e Cola
                </p>
                <p className="text-[11px] font-mono font-medium text-foreground break-all line-clamp-2">
                  {pixCode}
                </p>
              </div>
              <Button
                onClick={handleCopy}
                variant="outline"
                size="icon"
                className={cn(
                  "h-12 w-12 rounded-xl shrink-0 transition-all",
                  copied && "bg-green-500/10 border-green-500/30 text-green-500"
                )}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-center text-[10px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>QR Code expira em 30 minutos</span>
          </div>

          {onConfirmPayment && (
            <Button
              onClick={onConfirmPayment}
              disabled={isConfirming}
              className="w-full h-14 rounded-[1.25rem] text-sm font-black gap-2 shadow-lg shadow-primary/20"
            >
              {isConfirming ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Confirmando...</>
              ) : (
                <><Check className="h-4 w-4" /> Confirmar Pagamento</>
              )}
            </Button>
          )}

          <p className="text-[9px] text-muted-foreground text-center">
            Ao confirmar, o pagamento sera registrado e a agenda atualizada.
          </p>
        </div>
      </div>
    </div>
  );
}
