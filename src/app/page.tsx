import Link from "next/link";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Logo } from "@/components/layout/logo";
import {
  Calendar,
  Users,
  CreditCard,
  Bot,
  Check,
  ArrowRight,
  BarChart3,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui";

const features = [
  {
    icon: Calendar,
    title: "Agenda Inteligente",
    description: "Gerencie seus horários com lembretes automáticos e visão semanal completa.",
  },
  {
    icon: Users,
    title: "Gestão de Clientes",
    description: "CRM completo com histórico de atendimentos, preferências e comunicação integrada.",
  },
  {
    icon: CreditCard,
    title: "Pagamentos via Pix",
    description: "Receba pagamentos com QR Code Pix e confirmação em tempo real.",
  },
  {
    icon: Bot,
    title: "Assistente IA",
    description: "Em breve: IA que atende seus clientes pelo WhatsApp 24/7.",
    badge: "Em breve",
  },
  {
    icon: BarChart3,
    title: "Dashboard em Tempo Real",
    description: "Métricas de faturamento, taxa de comparecimento e performance num só lugar.",
  },
  {
    icon: Smartphone,
    title: "Página de Agendamento",
    description: "Site profissional personalizado para seus clientes agendarem online.",
  },
];

const plans = [
  {
    name: "Essencial",
    price: "R$ 49",
    period: "/mês",
    description: "Para profissionais em crescimento",
    features: [
      "Agendamentos ilimitados",
      "Pagamentos via Pix automático",
      "Página de agendamento personalizada",
      "CRM de clientes completo",
      "Dashboard com métricas",
      "Suporte prioritário",
    ],
    cta: "Começar agora",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "R$ 149",
    period: "/mês",
    description: "Para equipes e franquias",
    features: [
      "Tudo do plano Essencial",
      "Múltiplos profissionais",
      "Gestão de comissões",
      "Controle de inventário",
      "PDV integrado",
      "API personalizada",
      "Gerente de conta dedicado",
    ],
    cta: "Falar com vendas",
    highlighted: false,
  },
];

const stats = [
  { value: "2.000+", label: "Profissionais ativos" },
  { value: "150.000+", label: "Agendamentos realizados" },
  { value: "99.9%", label: "Uptime garantido" },
  { value: "4.9/5", label: "Avaliação média" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Logo size={32} iconOnly />
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Recursos</a>
              <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Preços</a>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="ghost" className="text-sm font-semibold">Entrar</Button>
              </Link>
              <Link href="/signup">
                <Button className="text-sm font-semibold h-9 rounded-lg">Começar agora</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]">
              Gestão inteligente para o seu{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">negócio</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Agendamentos, pagamentos, gestão de clientes e muito mais — tudo em uma plataforma simples para profissionais que querem crescer.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/signup">
                <Button size="lg" className="h-12 px-10 text-base font-bold rounded-xl shadow-lg shadow-primary/20">
                  Experimentar agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base font-bold rounded-xl">
                  Já tenho conta
                </Button>
              </Link>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 md:mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm shadow-2xl shadow-primary/5 overflow-hidden">
              <div className="p-2 bg-muted/30 border-b border-border/40 flex items-center gap-2">
                <div className="flex gap-1.5 px-3">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-green-400/80" />
                </div>
                <div className="flex-1 text-center text-xs text-muted-foreground font-medium">app.zenda.com/dashboard</div>
              </div>
              <div className="p-6 md:p-8 bg-muted/10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Receita Hoje", value: "R$ 480,00", color: "text-emerald-500" },
                    { label: "Agendamentos", value: "12", color: "text-primary" },
                    { label: "Novos Clientes", value: "5", color: "text-purple-500" },
                    { label: "Taxa Presença", value: "94%", color: "text-amber-500" },
                  ].map((stat) => (
                    <div key={stat.label} className="p-4 rounded-xl bg-card border border-border/40">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                      <p className={`text-xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-card border border-border/40">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Próximos Horários</p>
                    <div className="space-y-2">
                      {["09:00 - João Silva", "10:30 - Maria Santos", "14:00 - Pedro Lima"].map((apt) => (
                        <div key={apt} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span className="text-sm font-medium">{apt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-card border border-border/40">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Atividade Recente</p>
                    <div className="space-y-2">
                      {["Novo agendamento", "Pix confirmado - R$ 85,00", "Cliente confirmou horário"].map((act) => (
                        <div key={act} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-sm font-medium">{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-border/40 bg-muted/20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-black text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <p className="text-sm font-bold text-primary uppercase tracking-widest">Recursos</p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">
              Tudo que você precisa em{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">um só lugar</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Ferramentas poderosas e simples que transformam a gestão do seu negócio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="relative group p-6 rounded-2xl border border-border/40 bg-card/50 hover:bg-card hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                {feature.badge && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">
                    {feature.badge}
                  </span>
                )}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-32 bg-muted/20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <p className="text-sm font-bold text-primary uppercase tracking-widest">Preços</p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">Plano ideal para você</h2>
            <p className="text-lg text-muted-foreground">
              Comece seu onboarding guiado e escolha o plano ideal para seu negócio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-2xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-6 md:p-8 rounded-2xl border transition-all duration-300 ${
                  plan.highlighted
                    ? "border-primary/40 bg-card shadow-xl shadow-primary/10 scale-[1.02]"
                    : "border-border/40 bg-card/50 hover:border-primary/20"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-white text-xs font-bold">
                    Mais popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button
                    variant={plan.highlighted ? "primary" : "outline"}
                    className={`w-full h-11 font-bold rounded-xl ${plan.highlighted ? "shadow-lg shadow-primary/20" : ""}`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative rounded-3xl overflow-hidden bg-primary px-6 py-16 md:px-16 md:py-24 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-indigo-600 to-purple-700" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">Pronto para transformar seu negócio?</h2>
              <p className="text-lg text-white/80">
                Junte-se a mais de 2.000 profissionais que já usam a Zenda para crescer.
              </p>
              <Link href="/signup">
                <Button size="lg" className="h-14 px-10 text-base font-bold rounded-xl bg-white text-primary hover:bg-white/90 shadow-xl">
                  Começar agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-muted/20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Logo size={32} iconOnly />
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Recursos</a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Preços</a>
              <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Entrar</Link>
            </div>
            <p className="text-sm text-muted-foreground">© 2026 Zenda. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
