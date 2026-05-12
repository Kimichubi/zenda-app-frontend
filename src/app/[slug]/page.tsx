"use client";

import { usePublicSettings } from "@/hooks/use-site-settings";
import { useTodaySlots } from "@/hooks/use-booking";
import { useParams } from "next/navigation";
import { Loader2, Calendar, MapPin, Instagram, Facebook, MessageCircle, Clock, Users, Scissors, Zap, Star, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui";
import { cn, formatCurrency, getAvatarUrl } from "@/utils";
import { Logo } from "@/components/layout/logo";

export default function PublicSitePage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data, isLoading, error } = usePublicSettings(slug);
  const { data: todaySlots = [] } = useTodaySlots(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background flex-col gap-4">
        <h1 className="text-3xl font-bold">Pagina nao encontrada</h1>
        <p className="text-muted-foreground">O profissional que voce procura nao existe ou o endereco esta incorreto.</p>
      </div>
    );
  }

  const { barber, settings, services, staff, products } = data;
  const themeColor = settings?.themeColor && settings.themeColor !== "#000000" ? settings.themeColor : "#4f46e5";
  const heroTitle = settings?.heroTitle || "Agende seu horario";
  const heroSubtitle = settings?.heroSubtitle || "O melhor servico da regiao. Escolha seu servico e reserve seu momento.";
  const whatsappLink = settings?.whatsappUrl || `https://wa.me/${barber.phone.replace(/\D/g, "")}`;

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {settings?.logoUrl ? (
              <img src={settings.logoUrl} alt={barber.businessName} className="h-10 w-10 rounded-full object-cover border border-border" />
            ) : (
              <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: themeColor }}>
                {barber.businessName.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-bold text-sm">{barber.businessName}</p>
              <p className="text-[10px] text-muted-foreground">{barber.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
              <a href="#services" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">Servicos</a>
              {staff.length > 0 && <a href="#team" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">Equipe</a>}
              {products.length > 0 && <a href="#products" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">Produtos</a>}
              {settings?.aboutText && <a href="#about" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">Sobre</a>}
            </nav>

            <div className="flex gap-1.5">
              {settings?.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="p-2 rounded-full hover:bg-muted transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {settings?.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="p-2 rounded-full hover:bg-muted transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              <a href={whatsappLink} target="_blank" rel="noreferrer" className="p-2 rounded-full hover:bg-muted transition-colors">
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: themeColor }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: themeColor, opacity: 0.5 }} />
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/40 text-xs font-medium">
                <Star className="h-3 w-3" style={{ color: themeColor }} />
                Profissional verificado
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                {heroTitle}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                {heroSubtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="h-14 px-8 text-base font-bold rounded-2xl shadow-xl transition-all hover:scale-105"
                  style={{ backgroundColor: themeColor, color: "#fff" }}
                  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Agendar Agora
                </Button>
                <a href={whatsappLink} target="_blank" rel="noreferrer">
                  <Button variant="outline" size="lg" className="h-14 px-8 text-base font-bold rounded-2xl">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    WhatsApp
                  </Button>
                </a>
              </div>
            </div>

            <div className="flex-1 relative w-full max-w-md">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-muted to-muted/20 border border-border/40 p-6 flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Horarios de Hoje</p>
                  {todaySlots.length > 0 ? (
                    todaySlots.map((slot) => (
                      <div key={slot.time} className="flex items-center gap-3 p-2.5 rounded-xl bg-background/50 border border-border/20">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-sm font-medium">{slot.time}   Livre</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-background/50 border border-border/20">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-sm font-medium text-muted-foreground">Sem horarios hoje</span>
                    </div>
                  )}
                </div>
                <Button
                  className="w-full h-12 rounded-xl font-bold text-sm"
                  style={{ backgroundColor: themeColor, color: "#fff" }}
                  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Reservar Horario
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 space-y-24 pb-24">
        {/* Services Section */}
        <section id="services" className="scroll-mt-24">
          <div className="text-center mb-12 space-y-3">
            <p className="text-sm font-bold uppercase tracking-widest" style={{ color: themeColor }}>Servicos</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">O que oferecemos</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Escolha o servico ideal para voce com precos transparentes e qualidade garantida.
            </p>
          </div>

          {services.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-border/50 rounded-3xl">
              <Scissors className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">Nenhum servico disponivel no momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service, i) => (
                <div key={service.id} className="group p-6 rounded-2xl border border-border/40 bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-300 flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-12 w-12 rounded-xl flex items-center justify-center text-lg transition-colors" style={{ backgroundColor: `${themeColor}15`, color: themeColor }}>
                      <Scissors className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg">{service.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {service.duration} min
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/30">
                    <span className="text-2xl font-black">{formatCurrency(service.price)}</span>
                    <a
                      href={`/agendamento/${slug}?service=${service.id}`}
                      className="h-10 px-5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:scale-105"
                      style={{ backgroundColor: themeColor, color: "#fff" }}
                    >
                      Reservar
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Team Section */}
        {staff.length > 0 && (
          <section id="team" className="scroll-mt-24">
            <div className="text-center mb-12 space-y-3">
              <p className="text-sm font-bold uppercase tracking-widest" style={{ color: themeColor }}>Equipe</p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">Nossos Profissionais</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Conheca os profissionais que farao seu atendimento.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {staff.map((member) => (
                <a
                  key={member.id}
                  href={`/agendamento/${slug}?professional=${member.id}`}
                  className="text-center p-6 rounded-2xl border border-border/40 bg-card/50 hover:shadow-md hover:border-primary/20 transition-all group"
                >
                  {member.avatarPath ? (
                    <img
                      src={getAvatarUrl(member.avatarPath) ?? undefined}
                      alt={member.name}
                      className="h-20 w-20 rounded-full object-cover mx-auto mb-3 border-2 border-border group-hover:border-primary/30 transition-colors"
                    />
                  ) : (
                    <div
                      className="h-20 w-20 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3"
                      style={{ backgroundColor: themeColor }}
                    >
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <p className="font-bold text-sm">{member.name}</p>
                  {member.bio && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{member.bio}</p>
                  )}
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                    {member.role === "OWNER" ? "Proprietario" : member.role === "MANAGER" ? "Gerente" : "Profissional"}
                  </p>
                  {member.instagramUrl && (
                    <a
                      href={member.instagramUrl.startsWith("http") ? member.instagramUrl : `https://instagram.com/${member.instagramUrl.replace("@", "")}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 mt-2 text-[10px] text-rose-500 hover:text-rose-600 transition-colors font-medium"
                    >
                      <Instagram className="h-3 w-3" />
                      @{member.instagramUrl.replace(/^@/, "").replace(/https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "")}
                    </a>
                  )}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Products Section */}
        {products.length > 0 && (
          <section id="products" className="scroll-mt-24">
            <div className="text-center mb-12 space-y-3">
              <p className="text-sm font-bold uppercase tracking-widest" style={{ color: themeColor }}>Produtos</p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">Disponiveis na Loja</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Produtos profissionais disponiveis para compra.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="group p-5 rounded-2xl border border-border/40 bg-card/50 hover:shadow-md hover:border-primary/20 transition-all flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${themeColor}10`, color: themeColor }}>
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{product.name}</p>
                    <p className="text-lg font-black" style={{ color: themeColor }}>{formatCurrency(product.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* About Section */}
        {settings?.aboutText && (
          <section id="about" className="scroll-mt-24">
            <div className="rounded-3xl p-8 md:p-12 border border-border/30 bg-muted/20">
              <div className="text-center mb-8">
                <p className="text-sm font-bold uppercase tracking-widest" style={{ color: themeColor }}>Sobre</p>
                <h2 className="text-3xl font-black tracking-tight mt-2">Nossa Historia</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto">
                {settings.aboutText}
              </p>
            </div>
          </section>
        )}

        {/* Schedule Info */}
        <section className="text-center py-8">
          <div className="inline-flex items-center gap-3 p-4 rounded-2xl bg-muted/20 border border-border/30">
            <Calendar className="h-5 w-5" style={{ color: themeColor }} />
            <div className="text-left">
              <p className="text-sm font-bold">Agende seu horario</p>
              <p className="text-xs text-muted-foreground">
                Clique em qualquer servico e escolha o melhor horario para voce.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/10">
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: themeColor }}>
                {barber.businessName.charAt(0)}
              </div>
              <div>
                <p className="font-bold">{barber.businessName}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {barber.name}
                </p>
              </div>
            </div>

            <div className="flex gap-14 text-sm">
              <div className="space-y-2">
                <p className="font-bold mb-1">Contato</p>
                <a href={whatsappLink} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors block">
                  WhatsApp
                </a>
                {settings?.instagramUrl && (
                  <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors block">
                    Instagram
                  </a>
                )}
                {settings?.facebookUrl && (
                  <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors block">
                    Facebook
                  </a>
                )}
              </div>
              <div className="space-y-2">
                <p className="font-bold mb-1">Links</p>
                <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors block">Servicos</a>
                {staff.length > 0 && <a href="#team" className="text-muted-foreground hover:text-foreground transition-colors block">Equipe</a>}
                {products.length > 0 && <a href="#products" className="text-muted-foreground hover:text-foreground transition-colors block">Produtos</a>}
              </div>
            </div>
          </div>

          <div className="text-center pt-6 border-t border-border/30">
            <p className="text-sm text-muted-foreground">
              Isso foi feito automaticamente pelo{" "}
              <span className="font-bold text-foreground">Zenda</span>
              . Se voce deseja uma landing page dedicada,{" "}
              <span className="font-semibold">contate o suporte</span>.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
