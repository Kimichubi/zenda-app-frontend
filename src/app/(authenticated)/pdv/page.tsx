"use client";

import { useState, useCallback, useEffect } from "react";
import { useToast, Button, Badge } from "@/components/ui";
import {
  usePosAppointments,
  usePosProfessionals,
  usePosServices,
  useCreatePosAppointment,
  usePosCheckout,
  usePosUpdateStatus,
  usePosDailySummary,
} from "@/hooks/use-pos";
import { paymentsService } from "@/services/payments";
import { ClientSearch } from "@/features/pos/client-search";
import { ServiceGrid } from "@/features/pos/service-grid";
import { ProfessionalSelect } from "@/features/pos/professional-select";
import { AgendaPanel } from "@/features/pos/agenda-panel";
import { PixModal } from "@/features/pos/pix-modal";
import { DailySummary } from "@/features/pos/daily-summary";
import { formatCurrency, cn } from "@/utils";
import {
  Loader2,
  ShoppingCart,
  Trash2,
  CreditCard,
  Banknote,
  QrCode,
  ArrowRight,
  CheckCircle2,
  User,
  Clock,
  Maximize2,
  Minimize2,
  Keyboard,
  X,
  Monitor,
  Tablet,
} from "lucide-react";

interface CartService {
  serviceId: string;
  name: string;
  price: number;
  duration: number;
}

export default function PosPage() {
  const { showToast } = useToast();
  const { data: todayAppointments = [], isLoading: isLoadingAgenda } = usePosAppointments();
  const { data: professionals = [], isLoading: isLoadingProfs } = usePosProfessionals();
  const { data: services = [], isLoading: isLoadingServices } = usePosServices();
  const { data: dailySummary, isLoading: isLoadingSummary } = usePosDailySummary();
  const createAppointment = useCreatePosAppointment();
  const checkout = usePosCheckout();
  const updateStatus = usePosUpdateStatus();

  const [selectedClient, setSelectedClient] = useState<{ id: string; name: string; phone: string } | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<{ id: string; name: string } | null>(null);
  const [selectedService, setSelectedService] = useState<CartService | null>(null);
  const [cart, setCart] = useState<CartService[]>([]);
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<string>("PIX");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // PIX Modal state
  const [pixModalOpen, setPixModalOpen] = useState(false);
  const [pixCode, setPixCode] = useState("");
  const [pixAmount, setPixAmount] = useState(0);
  const [currentAppointmentId, setCurrentAppointmentId] = useState<string | null>(null);
  const [selectedAgendaAppointment, setSelectedAgendaAppointment] = useState<string | undefined>(undefined);

  const addServiceToCart = useCallback((service: { id: string; name: string; price: number; duration: number }) => {
    setCart((prev) => [...prev, { serviceId: service.id, name: service.name, price: service.price, duration: service.duration }]);
    showToast(`${service.name} adicionado`, "success");
  }, [showToast]);

  const removeFromCart = useCallback((index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setSelectedClient(null);
    setSelectedProfessional(null);
    setSelectedAgendaAppointment(undefined);
  }, []);

  const loadAppointmentToCart = useCallback((appointment: any) => {
    setSelectedAgendaAppointment(appointment.id);
    if (appointment.client) {
      setSelectedClient({ id: appointment.client.id, name: appointment.client.name, phone: appointment.client.phone });
    }
    if (appointment.professional) {
      setSelectedProfessional({ id: appointment.professional.id, name: appointment.professional.name });
    }
    if (appointment.service) {
      setCart([{
        serviceId: appointment.service.id,
        name: appointment.service.name,
        price: appointment.price || appointment.service.price,
        duration: appointment.service.duration,
      }]);
    }
    setCurrentAppointmentId(appointment.id);
    if (appointment.payment?.pixCode) {
      setPixCode(appointment.payment.pixCode);
    }
  }, []);

  const quickStatusChange = useCallback((id: string, status: string) => {
    updateStatus.mutate({ id, status }, {
      onSuccess: () => showToast(`Agendamento ${status === "CONFIRMED" ? "confirmado" : status === "COMPLETED" ? "concluido" : "atualizado"}`, "success"),
      onError: () => showToast("Erro ao atualizar status", "error"),
    });
  }, [updateStatus, showToast]);

  const cartTotal = cart.reduce((acc, item) => acc + item.price, 0);
  const totalDuration = cart.reduce((acc, item) => acc + item.duration, 0);

  const handleGeneratePix = useCallback(async (appointmentId: string, amount: number) => {
    try {
      setCheckoutPaymentMethod("PIX");
      const payment = await paymentsService.generatePix(appointmentId);
      setPixCode(payment.pixCode || "");
      setPixAmount(amount);
      setCurrentAppointmentId(appointmentId);
      setPixModalOpen(true);
    } catch {
      showToast("Erro ao gerar PIX. Configure a chave PIX do negocio.", "error");
    }
  }, [showToast]);

  const handleConfirmPayment = useCallback(async () => {
    if (!currentAppointmentId) return;
    checkout.mutate({
      id: currentAppointmentId,
      data: {
        paymentMethod: "PIX",
        splitEnabled: true,
      },
    }, {
      onSuccess: () => {
        showToast("Pagamento confirmado! Agenda atualizada.", "success");
        setPixModalOpen(false);
        clearCart();
        setCurrentAppointmentId(null);
      },
      onError: () => showToast("Erro ao confirmar pagamento", "error"),
    });
  }, [currentAppointmentId, checkout, showToast, clearCart]);

  const handlePixPayment = useCallback(async () => {
    if (!selectedClient || !selectedProfessional || cart.length === 0) return;
    const firstService = cart[0];
    try {
      setCheckoutPaymentMethod("PIX");
      const appt = await createAppointment.mutateAsync({
        professionalId: selectedProfessional.id,
        clientId: selectedClient.id,
        serviceId: firstService.serviceId,
        price: cartTotal,
      });
      setCurrentAppointmentId(appt.id);

      const payment = await paymentsService.generatePix(appt.id);
      setPixCode(payment.pixCode || "");
      setPixAmount(cartTotal);
      setPixModalOpen(true);
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Erro ao processar PIX", "error");
    }
  }, [selectedClient, selectedProfessional, cart, cartTotal, createAppointment, showToast]);

  const handleDirectPayment = useCallback(async () => {
    if (!selectedClient || !selectedProfessional || cart.length === 0) return;
    const firstService = cart[0];
    const method = checkoutPaymentMethod;

    try {
      const appt = await createAppointment.mutateAsync({
        professionalId: selectedProfessional.id,
        clientId: selectedClient.id,
        serviceId: firstService.serviceId,
        price: cartTotal,
      });

      checkout.mutate({
        id: appt.id,
        data: {
          paymentMethod: method,
          splitEnabled: true,
        },
      }, {
        onSuccess: () => {
          showToast("Venda finalizada com sucesso!", "success");
          clearCart();
          setCurrentAppointmentId(null);
        },
        onError: () => showToast("Erro ao finalizar venda", "error"),
      });
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Erro ao processar", "error");
    }
  }, [selectedClient, selectedProfessional, cart, cartTotal, checkoutPaymentMethod, createAppointment, checkout, showToast, clearCart]);

  const canCreate = selectedClient && selectedProfessional && cart.length > 0;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (pixModalOpen) setPixModalOpen(false);
        else if (showShortcuts) setShowShortcuts(false);
        else if (isFullscreen) setIsFullscreen(false);
      }
      if (e.key === "F11" || (e.key === "f" && e.ctrlKey)) {
        e.preventDefault();
        setIsFullscreen((prev) => !prev);
      }
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        setShowShortcuts((prev) => !prev);
      }
      if (e.key === "s" && e.ctrlKey) {
        e.preventDefault();
        setShowSummary((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pixModalOpen, showShortcuts, isFullscreen]);

  const isLoading = isLoadingAgenda || isLoadingProfs || isLoadingServices;

  if (isLoading) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center gap-4",
        isFullscreen ? "fixed inset-0 z-40 bg-background" : "h-[60vh]"
      )}>
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Inicializando terminal...</p>
      </div>
    );
  }

  const pageContent = (
    <div className="flex flex-col h-full gap-6">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em]">Terminal Ativo</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            POS <span className="text-primary">Zenda</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSummary(!showSummary)}
            className="h-10 w-10 rounded-xl"
            title="Resumo do dia (Ctrl+S)"
          >
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowShortcuts(true)}
            className="h-10 w-10 rounded-xl"
            title="Atalhos (?)"
          >
            <Keyboard className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-10 w-10 rounded-xl"
            title="Tela cheia (F11)"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Maximize2 className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>

      {/* Daily Summary (togglable) */}
      {showSummary && (
        <div className="animate-in slide-in-from-top-2 fade-in duration-300">
          <DailySummary summary={dailySummary} isLoading={isLoadingSummary} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr_380px] gap-6 min-h-0">
        {/* Left: Agenda */}
        <div className="hidden lg:block border-r border-border/30 pr-4 overflow-hidden">
          <AgendaPanel
            appointments={todayAppointments}
            onSelectAppointment={loadAppointmentToCart}
            selectedAppointmentId={selectedAgendaAppointment}
            onQuickStatusChange={quickStatusChange}
            isLoading={isLoadingAgenda}
          />
        </div>

        {/* Center: Service Selection + Client + Professional */}
        <div className="overflow-y-auto space-y-6 pr-2">
          <ClientSearch
            onSelectClient={(c) => setSelectedClient(c)}
            selectedClientId={selectedClient?.id}
          />

          <ProfessionalSelect
            professionals={professionals}
            selectedId={selectedProfessional?.id}
            onSelect={(p) => setSelectedProfessional(p)}
          />

          <ServiceGrid
            services={services}
            selectedServiceId={cart[cart.length - 1]?.serviceId}
            onSelect={addServiceToCart}
          />
        </div>

        {/* Right: Cart + Checkout */}
        <div className="flex flex-col border border-border/40 bg-card/30 backdrop-blur-sm rounded-[2rem] p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Carrinho
            </h2>
            <Badge variant="outline" className="text-[9px] font-black">
              {cart.length} {cart.length === 1 ? "item" : "itens"}
            </Badge>
          </div>

          {/* Selected Info */}
          <div className="space-y-2 mb-4">
            {selectedClient && (
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
                <User className="h-3.5 w-3.5 text-primary" />
                <span className="truncate">{selectedClient.name}</span>
                <button onClick={() => setSelectedClient(null)} className="ml-auto">
                  <X className="h-3 w-3 hover:text-foreground" />
                </button>
              </div>
            )}
            {selectedProfessional && (
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
                <User className="h-3.5 w-3.5 text-primary" />
                <span className="truncate">{selectedProfessional.name}</span>
                <button onClick={() => setSelectedProfessional(null)} className="ml-auto">
                  <X className="h-3 w-3 hover:text-foreground" />
                </button>
              </div>
            )}
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                <ShoppingCart className="h-16 w-16 mb-3" />
                <p className="text-[10px] font-black uppercase tracking-widest text-center">Selecione um servico</p>
                <p className="text-[9px] text-center mt-1">ou clique em um agendamento</p>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-primary/5 p-3 rounded-xl border border-primary/5 group">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{item.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" /> {item.duration}min
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-black text-primary shrink-0">{formatCurrency(item.price)}</span>
                  <button
                    onClick={() => removeFromCart(idx)}
                    className="p-1 hover:bg-rose-500/10 rounded-lg transition-colors text-muted-foreground hover:text-rose-500 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Totals + Checkout */}
          {cart.length > 0 && (
            <div className="pt-4 border-t border-border/20 space-y-4 shrink-0">
              <div className="flex items-center justify-between">
                <div className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Total</div>
                <div>
                  <p className="text-2xl font-black tracking-tight">{formatCurrency(cartTotal)}</p>
                  <p className="text-[9px] font-medium text-muted-foreground text-right">{totalDuration}min</p>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "PIX", icon: QrCode, label: "PIX" },
                  { id: "DINHEIRO", icon: Banknote, label: "Dinheiro" },
                  { id: "CARTAO", icon: CreditCard, label: "Cartao" },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setCheckoutPaymentMethod(method.id)}
                    className={cn(
                      "p-3 rounded-xl border text-center transition-all",
                      checkoutPaymentMethod === method.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/30 hover:border-primary/20 text-muted-foreground"
                    )}
                  >
                    <method.icon className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-[9px] font-black uppercase tracking-wider">{method.label}</span>
                  </button>
                ))}
              </div>

              {checkoutPaymentMethod === "PIX" && !currentAppointmentId && (
                <Button
                  onClick={handlePixPayment}
                  disabled={!canCreate || createAppointment.isPending}
                  className="w-full h-14 rounded-[1.25rem] text-sm font-black gap-2 shadow-xl shadow-primary/20"
                >
                  {createAppointment.isPending ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Criando...</>
                  ) : (
                    <><QrCode className="h-5 w-5" /> Criar e Gerar PIX <ArrowRight className="h-4 w-4 ml-1" /></>
                  )}
                </Button>
              )}

              {checkoutPaymentMethod === "PIX" && currentAppointmentId && (
                <div className="space-y-2">
                  <Button
                    onClick={() => handleGeneratePix(currentAppointmentId, cartTotal)}
                    className="w-full h-14 rounded-[1.25rem] text-sm font-black gap-2 shadow-xl shadow-primary/20"
                  >
                    <QrCode className="h-5 w-5" /> Mostrar QR Code PIX
                  </Button>
                  <Button
                    onClick={handleConfirmPayment}
                    disabled={checkout.isPending}
                    variant="outline"
                    className="w-full h-12 rounded-xl text-xs font-bold gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Confirmar Pagamento Manual
                  </Button>
                </div>
              )}

              {(checkoutPaymentMethod === "DINHEIRO" || checkoutPaymentMethod === "CARTAO") && (
                <Button
                  onClick={handleDirectPayment}
                  disabled={!canCreate || createAppointment.isPending || checkout.isPending}
                  className="w-full h-14 rounded-[1.25rem] text-sm font-black gap-2 shadow-xl shadow-primary/20"
                >
                  {createAppointment.isPending || checkout.isPending ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Processando...</>
                  ) : (
                    <><CheckCircle2 className="h-5 w-5" /> Finalizar Venda ({checkoutPaymentMethod === "DINHEIRO" ? "Dinheiro" : "Cartao"})</>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Fullscreen wrapper */}
      <div className={cn(
        isFullscreen ? "fixed inset-0 z-40 bg-background overflow-auto p-6 md:p-8" : "h-full"
      )}>
        {pageContent}
      </div>

      {/* PIX Modal */}
      <PixModal
        isOpen={pixModalOpen}
        onClose={() => setPixModalOpen(false)}
        pixCode={pixCode}
        amount={pixAmount}
        clientName={selectedClient?.name}
        serviceName={cart[0]?.name}
        onConfirmPayment={handleConfirmPayment}
        isConfirming={checkout.isPending}
      />

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border/40 rounded-[2rem] w-full max-w-sm shadow-2xl p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Keyboard className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-black">Atalhos</h3>
              </div>
              <button onClick={() => setShowShortcuts(false)} className="p-2 hover:bg-muted rounded-xl">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { key: "F11", desc: "Tela cheia" },
                { key: "Esc", desc: "Sair / Fechar modal" },
                { key: "?", desc: "Mostrar atalhos" },
                { key: "Ctrl+S", desc: "Resumo do dia" },
              ].map((shortcut) => (
                <div key={shortcut.key} className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">{shortcut.desc}</span>
                  <kbd className="px-2.5 py-1 rounded-lg bg-muted border border-border/30 text-[10px] font-black font-mono">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
