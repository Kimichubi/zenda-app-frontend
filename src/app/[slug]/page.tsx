"use client";

import { usePublicSettings } from "@/hooks/use-site-settings";
import { useParams } from "next/navigation";
import { Loader2, Calendar, MapPin, Instagram, Facebook, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui";

export default function PublicSitePage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data, isLoading, error } = usePublicSettings(slug);

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
        <h1 className="text-3xl font-bold">Página não encontrada</h1>
        <p className="text-muted-foreground">O profissional que você procura não existe ou o endereço está incorreto.</p>
      </div>
    );
  }

  const { barber, settings, services } = data;
  const themeColor = settings?.themeColor || "#000000";

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <div 
        className="w-full h-2" 
        style={{ backgroundColor: themeColor }}
      />
      
      <header className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-border/40">
        <div className="flex items-center gap-4">
          {settings?.logoUrl ? (
            <img src={settings.logoUrl} alt={barber.businessName} className="h-16 w-16 rounded-full object-cover border border-border" />
          ) : (
            <div 
              className="h-16 w-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: themeColor }}
            >
              {barber.businessName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{barber.businessName}</h1>
            <p className="text-sm text-muted-foreground">{barber.name}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          {settings?.instagramUrl && (
            <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="p-2 bg-muted/50 rounded-full hover:bg-muted transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
          )}
          {settings?.facebookUrl && (
            <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="p-2 bg-muted/50 rounded-full hover:bg-muted transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
          )}
          {settings?.whatsappUrl && (
            <a href={settings.whatsappUrl} target="_blank" rel="noreferrer" className="p-2 bg-muted/50 rounded-full hover:bg-muted transition-colors">
              <MessageCircle className="h-5 w-5" />
            </a>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-24">
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            {settings?.heroTitle || "Agende seu horário"}
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {settings?.heroSubtitle || "O melhor serviço da região. Escolha seu serviço e reserve seu momento."}
          </p>
          <div className="pt-8">
            <Button 
              size="lg" 
              className="px-8 h-14 text-base font-bold rounded-full shadow-xl transition-transform hover:scale-105"
              style={{ backgroundColor: themeColor, color: "#fff" }}
              onClick={() => {
                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Agendar Agora
            </Button>
          </div>
        </section>

        {settings?.aboutText && (
          <section className="bg-muted/30 rounded-3xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row gap-8 items-center border border-border/50">
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-bold">Sobre nós</h3>
              <p className="text-muted-foreground leading-relaxed">
                {settings.aboutText}
              </p>
            </div>
          </section>
        )}

        <section id="services" className="space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-3xl font-bold tracking-tight">Nossos Serviços</h3>
            <p className="text-muted-foreground">Escolha o serviço ideal para você</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services?.map((service) => (
              <div key={service.id} className="p-6 border border-border/50 rounded-2xl bg-card hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                <div className="space-y-2 mb-6">
                  <h4 className="text-xl font-bold">{service.name}</h4>
                  <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {service.duration} min
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/40">
                  <span className="text-2xl font-bold tracking-tight text-foreground">
                    R$ {service.price.toFixed(2).replace('.', ',')}
                  </span>
                  <Button 
                    className="font-bold rounded-xl"
                    style={{ backgroundColor: themeColor, color: "#fff" }}
                  >
                    Reservar
                  </Button>
                </div>
              </div>
            ))}
            
            {(!services || services.length === 0) && (
              <div className="col-span-full py-12 text-center border-2 border-dashed border-border/50 rounded-2xl">
                <p className="text-muted-foreground font-medium">Nenhum serviço disponível no momento.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-12 mt-12 bg-muted/10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-muted-foreground font-medium">
            <MapPin className="h-5 w-5" />
            <span>{barber.businessName}</span>
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            Desenvolvido por <span className="font-bold text-foreground">Zenda</span>
          </p>
        </div>
      </footer>
    </div>
  );
}