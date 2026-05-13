import Link from "next/link";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Logo } from "@/components/layout/logo";
import {
  Calendar,
  Users,
  CreditCard,
  Bell,
  Scissors,
  MessageCircle,
  Clock,
  UserX,
  Sparkles,
  ArrowRight,
  Layout,
  TrendingUp,
  Shield,
  Layers,
  Phone,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui";

function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold text-primary uppercase tracking-widest">
      {children}
    </span>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
      {children}
    </h2>
  );
}

const painPoints = [
  {
    icon: MessageCircle,
    title: "Agendamentos pelo WhatsApp",
    description: "Conversas bagunçadas, horários perdidos, double-booking. Gerenciar agenda por mensagem é ineficiente e frustrante.",
  },
  {
    icon: UserX,
    title: "Clientes que somem",
    description: "Sem lembretes automáticos, o no-show se torna rotina. Cada cliente que falta é receita que você não recupera.",
  },
  {
    icon: Clock,
    title: "Confirmação manual",
    description: "Mensagem por mensagem confirmando cada horário do dia seguinte. Tempo que você deveria gastar com seus clientes.",
  },
  {
    icon: AlertTriangle,
    title: "Falta de visibilidade",
    description: "Sem um dashboard centralizado, você não sabe quanto faturou, quem faltou, ou qual serviço vende mais.",
  },
];

const zendaSolutions = [
  {
    icon: Calendar,
    title: "Agenda centralizada",
    description: "Todos os horários em um só lugar. Visão diária, semanal ou mensal. Chega de WhatsApp bagunçado.",
  },
  {
    icon: Bell,
    title: "Lembretes automáticos",
    description: "Confirmações e lembretes enviados automaticamente. Reduza faltas sem levantar um dedo.",
  },
  {
    icon: Users,
    title: "CRM de clientes",
    description: "Histórico completo de cada cliente. Preferências, serviços realizados, frequência. Tudo organizado.",
  },
  {
    icon: CreditCard,
    title: "Pagamentos integrados",
    description: "Pix, dinheiro, cartão. Registro de comissões e faturamento por profissional. Controle financeiro real.",
  },
  {
    icon: Scissors,
    title: "Gestão de equipe",
    description: "Múltiplos profissionais, comissões, horários de cada um. Um espaço compartilhado para toda a barbearia.",
  },
  {
    icon: BarChart3,
    title: "Dashboard completo",
    description: "Receita, comparecimento, serviços mais vendidos, novos clientes. Métricas reais para decisões reais.",
  },
];

const onboardingSteps = [
  {
    step: "01",
    title: "Cadastro simples",
    description: "Preencha informações básicas sobre você e seu negócio. Leva menos de 2 minutos.",
  },
  {
    step: "02",
    title: "Suporte entra em contato",
    description: "Nossa equipe analisa suas necessidades e entra em contato para entender seu negócio de perto.",
  },
  {
    step: "03",
    title: "Configuração personalizada",
    description: "Montamos seu ambiente do zero: serviços, preços, horários, profissionais. Tudo adaptado à sua operação.",
  },
  {
    step: "04",
    title: "Seu negócio ativado",
    description: "Plano ativado, equipe treinada, sistema funcionando. Você começa a operar com tudo organizado.",
  },
];

const benefits = [
  {
    icon: TrendingUp,
    title: "Produtividade real",
    description: "Menos tempo no WhatsApp, mais tempo atendendo. Sua equipe produz mais com menos esforço operacional.",
  },
  {
    icon: Shield,
    title: "Profissionalismo",
    description: "Lembretes automáticos, confirmações, site de agendamento. Seu negócio com cara de empresa grande.",
  },
  {
    icon: Layers,
    title: "Centralização total",
    description: "Agenda, clientes, pagamentos, equipe, serviços — tudo em um só lugar. Chega de planilhas e cadernos.",
  },
  {
    icon: Sparkles,
    title: "Retenção de clientes",
    description: "Histórico, preferências, comunicação automatizada. Clientes voltam mais e indicam seu negócio.",
  },
  {
    icon: Layout,
    title: "Organização operacional",
    description: "Cada profissional com sua agenda, cada cliente com seu histórico. Ordem que gera resultado.",
  },
  {
    icon: TrendingUp,
    title: "Crescimento sustentável",
    description: "Com processos organizados, você escala sem caos. Abra novas unidades com controle total.",
  },
];

const dashboardTabs = [
  { id: "agenda", label: "Agenda", icon: Calendar },
  { id: "clientes", label: "Clientes", icon: Users },
  { id: "pagamentos", label: "Pagamentos", icon: CreditCard },
  { id: "equipe", label: "Equipe", icon: Scissors },
  { id: "lembretes", label: "Lembretes", icon: Bell },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            <Logo height={28} />

            <div className="hidden md:flex items-center gap-8">
              <a href="#recursos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Funcionalidades
              </a>
              <a href="#onboarding" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Onboarding
              </a>
              <a href="#beneficios" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Benefícios
              </a>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="ghost" className="text-sm font-semibold">Entrar</Button>
              </Link>
              <Link href="/signup" className="hidden sm:block">
                <Button className="text-sm font-semibold h-9 rounded-lg">Solicitar acesso</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-primary/15 rounded-full blur-3xl" />
           <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-zinc-500/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-zinc-600/5 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-background" />
        </div>

        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Onboarding assistido e personalizado
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08]">
              Pare de perder clientes por{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-800 via-zinc-500 to-zinc-300 dark:from-zinc-200 dark:via-zinc-400 dark:to-zinc-500">
                desorganização
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Gerencie sua barbearia ou salão em um só lugar. Agenda, clientes, pagamentos,
              equipe e lembretes automáticos — com onboarding personalizado para o seu negócio.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/signup">
                <Button size="lg" className="h-12 px-10 text-base font-bold rounded-xl shadow-lg shadow-primary/25">
                  Solicitar acesso
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#onboarding">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base font-bold rounded-xl">
                  <Phone className="mr-2 h-4 w-4" />
                  Como funciona
                </Button>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground pt-2">
              Planos personalizados conforme a necessidade do seu negócio
            </p>
          </div>
        </div>
      </section>

      {/* Product Showcase Section */}
      <section id="recursos" className="py-24 md:py-32 border-t border-border/40 bg-muted/10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <SectionBadge>Plataforma</SectionBadge>
            <SectionHeading>
              Tudo que sua barbearia precisa em{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-zinc-200 dark:to-zinc-400">um só lugar</span>
            </SectionHeading>
            <p className="text-lg text-muted-foreground">
              Um painel completo para gerenciar cada aspecto da sua operação diária.
            </p>
          </div>

          {/* Dashboard Mockup */}
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-zinc-500/10 to-primary/20 rounded-2xl blur-lg opacity-70" />
            <div className="relative rounded-2xl border border-border/50 bg-card/90 backdrop-blur-sm shadow-2xl shadow-primary/5 overflow-hidden">
              {/* Title Bar */}
              <div className="p-3 bg-muted/40 border-b border-border/40 flex items-center gap-2">
                <div className="flex gap-1.5 px-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-green-400/80" />
                </div>
                <div className="flex items-center gap-2 flex-1 justify-center -ml-8">
                  {dashboardTabs.map((tab) => (
                    <div
                      key={tab.id}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                        tab.id === "agenda"
                          ? "bg-primary/15 text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      <tab.icon className="h-3.5 w-3.5" />
                      {tab.label}
                    </div>
                  ))}
                </div>
                <div className="w-16" />
              </div>

              {/* Dashboard Content */}
              <div className="p-6 md:p-8 bg-muted/5">
                {/* Metrics Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Receita Hoje", value: "R$ 480,00", color: "text-emerald-400", trend: "+12%" },
                    { label: "Agendamentos", value: "12", color: "text-primary", trend: "hoje" },
                    { label: "Novos Clientes", value: "5", color: "text-zinc-400", trend: "esta semana" },
                    { label: "Comparecimento", value: "94%", color: "text-amber-400", trend: "+3%" },
                  ].map((stat) => (
                    <div key={stat.label} className="p-4 rounded-xl bg-card border border-border/40">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                          {stat.label}
                        </p>
                        <span className="text-[10px] font-medium text-muted-foreground">{stat.trend}</span>
                      </div>
                      <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Two-column layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Calendar Column */}
                  <div className="md:col-span-2 p-4 rounded-xl bg-card border border-border/40">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        Agenda — Quinta-feira, 15 Jun
                      </p>
                      <span className="text-[10px] font-medium text-primary">12 horários</span>
                    </div>
                    <div className="space-y-2">
                      {[
                        { time: "09:00", client: "João Silva", service: "Corte degradê", status: "confirmado", color: "bg-emerald-500" },
                        { time: "09:40", client: "Pedro Lima", service: "Barba completa", status: "confirmado", color: "bg-emerald-500" },
                        { time: "10:30", client: "Lucas Costa", service: "Corte + barba", status: "aguardando", color: "bg-amber-400" },
                        { time: "11:00", client: "—", service: "Horário livre", status: "livre", color: "bg-muted-foreground/30" },
                        { time: "14:00", client: "Maria Santos", service: "Corte feminino", status: "confirmado", color: "bg-emerald-500" },
                        { time: "15:00", client: "Gabriel Reis", service: "Corte tesoura", status: "confirmado", color: "bg-emerald-500" },
                      ].map((apt) => (
                        <div key={apt.time} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-border/20 hover:border-primary/20 transition-colors">
                          <span className="text-xs font-bold text-muted-foreground w-10">{apt.time}</span>
                          <div className={`w-2 h-2 rounded-full ${apt.color} shrink-0`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{apt.client}</p>
                            <p className="text-xs text-muted-foreground truncate">{apt.service}</p>
                          </div>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            apt.status === "confirmado"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : apt.status === "aguardando"
                                ? "bg-amber-500/10 text-amber-400"
                                : "bg-muted-foreground/10 text-muted-foreground"
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Clients & Reminders Column */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-card border border-border/40">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                        Clientes Recentes
                      </p>
                      <div className="space-y-3">
                        {[
                          { name: "João Silva", visits: "12 visitas", last: "15/06" },
                          { name: "Pedro Lima", visits: "8 visitas", last: "14/06" },
                          { name: "Lucas Costa", visits: "3 visitas", last: "12/06" },
                        ].map((c) => (
                          <div key={c.name} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                              {c.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold truncate">{c.name}</p>
                              <p className="text-[10px] text-muted-foreground">{c.visits} · última {c.last}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-card border border-border/40">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                        Lembretes Enviados
                      </p>
                      <div className="space-y-2">
                        {[
                          { client: "João Silva", time: "Enviado 08:00" },
                          { client: "Pedro Lima", time: "Confirmado 08:15" },
                          { client: "Maria Santos", time: "Enviado 13:00" },
                        ].map((r) => (
                          <div key={r.client} className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                              <span className="text-xs font-medium">{r.client}</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground">{r.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <SectionBadge>Problema</SectionBadge>
            <SectionHeading>
              Desorganização custa{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-zinc-200 dark:to-zinc-400">caro</span>
            </SectionHeading>
            <p className="text-lg text-muted-foreground">
              Esses são os problemas que tiram o sono de quem gerencia barbearias e salões.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {painPoints.map((item) => (
              <div
                key={item.title}
                className="group flex gap-4 p-6 rounded-2xl border border-border/30 bg-card/40 hover:border-red-500/10 hover:bg-card transition-all duration-300"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400 group-hover:bg-red-500/15 transition-colors">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold mb-1.5">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 md:py-32 bg-muted/10 border-y border-border/40">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <SectionBadge>Solução</SectionBadge>
            <SectionHeading>
              Como a Zenda{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-zinc-200 dark:to-zinc-400">resolve</span>
            </SectionHeading>
            <p className="text-lg text-muted-foreground">
              Cada funcionalidade foi pensada para resolver um problema real do dia a dia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {zendaSolutions.map((item) => (
              <div
                key={item.title}
                className="group p-6 rounded-2xl border border-border/30 bg-card/40 hover:border-primary/20 hover:bg-card hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assisted Onboarding Section */}
      <section id="onboarding" className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <SectionBadge>Onboarding</SectionBadge>
            <SectionHeading>
              Você não está{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-zinc-200 dark:to-zinc-400">sozinho</span>
            </SectionHeading>
            <p className="text-lg text-muted-foreground">
              Nosso time configura tudo para você. Onboarding assistido e personalizado conforme
              a realidade do seu negócio.
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
            {onboardingSteps.map((item, idx) => (
              <div key={item.step} className="relative group">
                {idx < onboardingSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px bg-border/60 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent" />
                  </div>
                )}
                <div className="p-6 rounded-2xl border border-border/30 bg-card/40 hover:border-primary/20 hover:bg-card transition-all duration-300 h-full">
                  <span className="text-sm font-black text-primary/30 mb-3 block">{item.step}</span>
                  <h3 className="text-base font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Info Card */}
          <div className="max-w-3xl mx-auto p-8 rounded-2xl border border-primary/15 bg-primary/5">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Atendimento humano, do início ao fim</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Nada de formulários infinitos ou configurações complicadas. Você se cadastra,
                  nosso time entra em contato, entende seu negócio e prepara tudo para você.
                  Cada barbearia tem suas particularidades — e nosso processo respeita isso.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-24 md:py-32 bg-muted/10 border-y border-border/40">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <SectionBadge>Benefícios</SectionBadge>
            <SectionHeading>
              Sua operação no{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-zinc-200 dark:to-zinc-400">controle</span>
            </SectionHeading>
            <p className="text-lg text-muted-foreground">
              Resultados reais que uma gestão organizada traz para o dia a dia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {benefits.map((item, idx) => (
              <div
                key={item.title}
                className={`group p-6 rounded-2xl border transition-all duration-300 hover:border-primary/20 hover:bg-card hover:shadow-lg hover:shadow-primary/5 ${
                  idx === 0 || idx === 3
                    ? "bg-card/60 border-border/40"
                    : idx === 1 || idx === 4
                      ? "bg-card/40 border-border/30"
                      : "bg-card/20 border-border/20"
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-zinc-500/5 to-zinc-600/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-6">
          <div className="relative rounded-3xl overflow-hidden bg-card border border-primary/10">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-600 dark:from-zinc-200 dark:via-zinc-300 dark:to-zinc-400 opacity-90" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />

            <div className="relative z-10 px-6 py-16 md:px-16 md:py-24 text-center max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                Pronto para organizar o seu negócio?
              </h2>
              <p className="text-lg text-white/70">
                Cadastre-se e nossa equipe entra em contato para configurar tudo conforme
                a sua necessidade. Sem compromisso, sem custo inicial.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/signup">
                  <Button size="lg" className="h-14 px-10 text-base font-bold rounded-xl bg-white text-primary hover:bg-white/90 shadow-xl">
                    Solicitar onboarding
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a href="mailto:contato@zenda.com">
                  <Button variant="outline" size="lg" className="h-14 px-8 text-base font-bold rounded-xl border-white/20 text-white hover:bg-white/10 bg-transparent">
                    Falar com suporte
                  </Button>
                </a>
              </div>
              <p className="text-xs text-white/40 pt-2">
                Planos personalizados. Ativação manual pela nossa equipe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo height={28} />
            <div className="flex items-center gap-6">
              <a href="#recursos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Funcionalidades
              </a>
              <a href="#onboarding" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Onboarding
              </a>
              <a href="#beneficios" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Benefícios
              </a>
              <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Entrar
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 Zenda. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
