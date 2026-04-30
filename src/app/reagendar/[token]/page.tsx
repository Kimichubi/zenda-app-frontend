"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Calendar, Clock, Loader2, Scissors, User, X, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button, Card, CardContent, Input, useToast } from "@/components/ui";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function ReagendarPage() {
  const params = useParams();
  const token = params.token as string;
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState<any>(null);
  const [error, setError] = useState(false);

  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [canceling, setCanceling] = useState(false);

  const [success, setSuccess] = useState<"reschedule" | "cancel" | null>(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await fetch(`${API_URL}/self-service/reschedule/${token}`);
        if (!response.ok) throw new Error("Failed to fetch appointment");
        const data = await response.json();
        setAppointment(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchAppointment();
  }, [token]);

  const handleReschedule = async () => {
    if (!newDate || !newTime) {
      showToast("Preencha a data e o horário.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/self-service/reschedule/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: newDate, startTime: newTime }),
      });

      if (!response.ok) throw new Error("Failed to reschedule");

      setSuccess("reschedule");
    } catch (err) {
      console.error(err);
      showToast("Não foi possível remarcar. Tente novamente.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    setCanceling(true);
    try {
      const response = await fetch(`${API_URL}/self-service/cancel/${token}`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to cancel");

      setSuccess("cancel");
      setShowCancelConfirm(false);
    } catch (err) {
      console.error(err);
      showToast("Não foi possível cancelar. Tente novamente.", "error");
    } finally {
      setCanceling(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Carregando informações do agendamento...</p>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="h-10 w-10 text-rose-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Agendamento não encontrado</h1>
        <p className="text-slate-500 max-w-xs">O link que você acessou pode estar expirado ou incorreto.</p>
      </div>
    );
  }

  if (success === "reschedule") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <div className="max-w-md mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900">Agendamento Remarcado</h1>
            <p className="text-slate-500">Seu agendamento foi atualizado com sucesso.</p>
          </div>
        </div>
      </div>
    );
  }

  if (success === "cancel") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <div className="max-w-md mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
            <X className="h-10 w-10 text-slate-600" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900">Agendamento Cancelado</h1>
            <p className="text-slate-500">Seu agendamento foi cancelado com sucesso.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 text-white shadow-xl mb-2 font-black italic text-xl">
            Z
          </div>
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary">{appointment.businessName}</h2>
          <p className="text-slate-400 text-xs font-medium">Gerenciar Agendamento</p>
        </div>

        <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
          <CardContent className="p-0">
            <div className="bg-slate-900 p-10 text-center text-white space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 text-white">Serviço Agendado</p>
              <h1 className="text-2xl font-black tracking-tighter">{appointment.serviceName}</h1>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-400 font-medium">
                    <User className="h-4 w-4" />
                    Profissional
                  </div>
                  <span className="font-bold text-slate-900">{appointment.professionalName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-400 font-medium">
                    <Calendar className="h-4 w-4" />
                    Data
                  </div>
                  <span className="font-bold text-slate-900">{formatDate(appointment.date)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-400 font-medium">
                    <Clock className="h-4 w-4" />
                    Horário
                  </div>
                  <span className="font-bold text-slate-900">{appointment.startTime}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-400 font-medium">
                    <Scissors className="h-4 w-4" />
                    Serviço
                  </div>
                  <span className="font-bold text-slate-900">{appointment.serviceName}</span>
                </div>
              </div>

              {isRescheduling && (
                <div className="pt-6 border-t border-slate-50 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <button
                    onClick={() => setIsRescheduling(false)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Voltar
                  </button>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label htmlFor="date" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Nova Data
                      </label>
                      <Input
                        id="date"
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="rounded-2xl border-slate-100 bg-slate-50 h-12"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="time" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Novo Horário
                      </label>
                      <Input
                        id="time"
                        type="time"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="rounded-2xl border-slate-100 bg-slate-50 h-12"
                      />
                    </div>
                    <Button
                      onClick={handleReschedule}
                      disabled={submitting}
                      className="w-full h-12 rounded-2xl font-bold text-sm"
                    >
                      {submitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Confirmar Remarcação"
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {showCancelConfirm && (
                <div className="pt-6 border-t border-slate-50 space-y-4 animate-in fade-in zoom-in duration-300">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto">
                      <AlertCircle className="h-6 w-6 text-rose-600" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">Tem certeza?</h3>
                    <p className="text-xs text-slate-500">Esta ação não pode ser desfeita.</p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowCancelConfirm(false)}
                      className="flex-1 h-12 rounded-2xl font-bold text-sm border-slate-200"
                    >
                      Voltar
                    </Button>
                    <Button
                      variant="danger"
                      onClick={handleCancel}
                      disabled={canceling}
                      className="flex-1 h-12 rounded-2xl font-bold text-sm"
                    >
                      {canceling ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Sim, Cancelar"
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {!isRescheduling && !showCancelConfirm && (
                <div className="pt-6 border-t border-slate-50 flex flex-col gap-3">
                  <Button
                    onClick={() => setIsRescheduling(true)}
                    className="w-full h-12 rounded-2xl font-bold text-sm"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Remarcar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCancelConfirm(true)}
                    className="w-full h-12 rounded-2xl font-bold text-sm border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
