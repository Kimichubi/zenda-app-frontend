"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, Copy, CreditCard, Loader2, Landmark, User, Scissors, DollarSign } from "lucide-react";
import { Button, Card, CardContent, useToast } from "@/components/ui";
import { formatCurrency } from "@/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function PublicPaymentPage() {
  const params = useParams();
  const { id } = params;
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await fetch(`${API_URL}/public/payments/${id}`);
        if (!response.ok) throw new Error("Failed to fetch payment");
        const data = await response.json();
        setPayment(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPayment();
  }, [id]);

  const handleCopy = () => {
    if (payment?.pixCode) {
      navigator.clipboard.writeText(payment.pixCode);
      showToast("Código Pix copiado!", "success");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Carregando informações de pagamento...</p>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-6">
          <CreditCard className="h-10 w-10 text-rose-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Pagamento não encontrado</h1>
        <p className="text-slate-500 max-w-xs">O link que você acessou pode estar expirado ou incorreto.</p>
      </div>
    );
  }

  const isPaid = payment.status === "PAID";

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header/Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 text-white shadow-xl mb-2 font-black italic text-xl">
            Z
          </div>
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary">{payment.businessName}</h2>
          <p className="text-slate-400 text-xs font-medium">Checkout Seguro via Pix</p>
        </div>

        <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
          <CardContent className="p-0">
            {/* Amount Banner */}
            <div className="bg-slate-900 p-10 text-center text-white space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 text-white">Total a Pagar</p>
              <h1 className="text-4xl font-black tracking-tighter">
                {formatCurrency(payment.amount)}
              </h1>
            </div>

            <div className="p-8 space-y-8">
              {isPaid ? (
                <div className="py-10 text-center space-y-4 animate-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900">Pagamento Confirmado</h3>
                    <p className="text-slate-500 text-sm">Obrigado! Seu agendamento já está garantido.</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* QR Code Container */}
                  <div className="flex flex-col items-center gap-6">
                    <div className="p-6 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                      {payment.pixCode ? (
                        <QRCodeSVG value={payment.pixCode} size={200} level="H" includeMargin={true} />
                      ) : (
                        <div className="w-[200px] h-[200px] flex items-center justify-center text-slate-300 italic text-xs text-center p-4">
                          QR Code indisponível no momento
                        </div>
                      )}
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-sm font-bold text-slate-900">Escaneie o QR Code</p>
                      <p className="text-xs text-slate-400">Abra o app do seu banco e escolha "Pagar via Pix"</p>
                    </div>
                  </div>

                  {/* Copy and Paste */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pix Copia e Cola</p>
                    <div className="relative group">
                      <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pr-12 text-[10px] font-mono text-slate-500 break-all leading-relaxed">
                        {payment.pixCode || "Código não gerado"}
                      </div>
                      <button 
                        onClick={handleCopy}
                        className="absolute right-3 top-3 p-2 bg-white shadow-sm border border-slate-100 rounded-xl text-primary hover:bg-primary hover:text-white transition-all active:scale-95"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Appointment Details */}
              <div className="pt-8 border-t border-slate-50 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-400 font-medium">
                    <User className="h-3.5 w-3.5" />
                    Cliente
                  </div>
                  <span className="font-bold text-slate-900">{payment.clientName}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-400 font-medium">
                    <Scissors className="h-3.5 w-3.5" />
                    Serviço
                  </div>
                  <span className="font-bold text-slate-900">{payment.serviceName || "Serviço"}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="flex flex-col items-center gap-4 text-center opacity-50">
          <div className="flex items-center gap-2 grayscale brightness-0">
            <Landmark className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Sistema de Pagamento Zenda</span>
          </div>
          <p className="text-[9px] text-slate-400 max-w-[200px]">
            Sua transação é processada de forma segura e direta para a conta do profissional.
          </p>
        </div>
      </div>
    </div>
  );
}
