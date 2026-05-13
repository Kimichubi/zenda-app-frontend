"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { adminService, type BusinessDetail } from "@/services/admin";
import { useToast, Card, CardContent, Badge, Button } from "@/components/ui";
import {
  Building2, ArrowLeft, ExternalLink, Users, Scissors, ShoppingBag,
  Calendar, Settings, Loader2, Mail, ShieldCheck, Clock,
} from "lucide-react";
import { cn, formatDate, formatCurrency } from "@/utils";

type TabKey = "overview" | "staff" | "services" | "products" | "appointments";

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "overview", label: "Visao Geral", icon: Building2 },
  { key: "staff", label: "Equipe", icon: Users },
  { key: "services", label: "Servicos", icon: Scissors },
  { key: "products", label: "Produtos", icon: ShoppingBag },
  { key: "appointments", label: "Agendamentos", icon: Calendar },
];

export default function BusinessDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params.id);
  const { showToast } = useToast();

  const [business, setBusiness] = useState<BusinessDetail | null>(null);
  const [appointments, setAppointments] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [biz, appts] = await Promise.all([
          adminService.getBusiness(id),
          adminService.getBusinessAppointments(id),
        ]);
        setBusiness(biz);
        setAppointments(appts);
      } catch {
        showToast("Erro ao carregar negocio", "error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, showToast]);

  const handleUpdate = async (data: Partial<{ status: string; plan: string; name: string; slug: string }>) => {
    if (!business) return;
    setUpdating(true);
    try {
      await adminService.updateBusiness(business.id, data);
      showToast("Negocio atualizado!", "success");
      const updated = await adminService.getBusiness(id);
      setBusiness(updated);
    } catch {
      showToast("Erro ao atualizar", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleAccess = async () => {
    try {
      const response = await adminService.accessBusiness(id);
      if (response?.accessToken) {
        localStorage.setItem("zenda_token", response.accessToken);
        localStorage.setItem("zenda_refresh_token", response.refreshToken || "");
        window.location.href = "/dashboard";
      }
    } catch {
      showToast("Erro ao acessar negocio", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-muted-foreground">
        <Building2 className="h-10 w-10 opacity-30" />
        <p>Negocio nao encontrado.</p>
        <Button variant="outline" onClick={() => router.push("/admin/businesses")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
        </Button>
      </div>
    );
  }

  const statusConfig: Record<string, { label: string; className: string }> = {
    ACTIVE: { label: "Ativo", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
    PENDING: { label: "Pendente", className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
    SUSPENDED: { label: "Suspenso", className: "bg-red-500/10 text-red-500 border-red-500/20" },
  };
  const s = statusConfig[business.status] ?? { label: business.status, className: "bg-muted text-muted-foreground" };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Breadcrumb + Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => router.push("/admin/businesses")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{business.name}</h1>
              <Badge variant="outline" className={cn("text-[10px] font-bold uppercase", s.className)}>{s.label}</Badge>
              <Badge variant="outline" className={cn("text-[10px] font-bold uppercase", business.plan === "PRO" ? "border-emerald-500/20 text-emerald-500" : "border-foreground/10 text-muted-foreground")}>
                {business.plan}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">/{business.slug} · Criado em {formatDate(business.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5" onClick={handleAccess}>
            <ExternalLink className="h-3.5 w-3.5" /> Acessar Negocio
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Equipe" value={(business.staff ?? []).length} icon={Users} />
        <StatCard label="Servicos" value={(business.services ?? []).length} icon={Scissors} />
        <StatCard label="Produtos" value={(business.products ?? []).length} icon={ShoppingBag} />
        <StatCard label="Agendamentos" value={appointments.length} icon={Calendar} />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl border border-border/40 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all",
              activeTab === tab.key
                ? "bg-background text-foreground shadow-sm border border-border/40"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-border/50 bg-card rounded-xl lg:col-span-2">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-sm font-bold">Informacoes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Nome</p>
                  <p className="text-sm font-medium">{business.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Slug</p>
                  <p className="text-sm font-medium">/{business.slug}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Plano</p>
                  <div className="flex items-center gap-2">
                    <select
                      value={business.plan}
                      disabled={updating}
                      onChange={(e) => handleUpdate({ plan: e.target.value })}
                      className="h-9 rounded-lg border border-border bg-background px-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary/20"
                    >
                      <option value="PRO">PRO</option>
                      <option value="ENTERPRISE">ENTERPRISE</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Status</p>
                  <div className="flex items-center gap-2">
                    <select
                      value={business.status}
                      disabled={updating}
                      onChange={(e) => handleUpdate({ status: e.target.value })}
                      className="h-9 rounded-lg border border-border bg-background px-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary/20"
                    >
                      <option value="ACTIVE">Ativo</option>
                      <option value="PENDING">Pendente</option>
                      <option value="SUSPENDED">Suspenso</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border/40">
                <h4 className="text-sm font-bold mb-3">Owner</h4>
                {business.staff?.find((s) => s.role === "OWNER") ? (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold">
                      {String(business.staff.find((s) => s.role === "OWNER")?.name).charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{business.staff.find((s) => s.role === "OWNER")?.name}</p>
                      <p className="text-xs text-muted-foreground">{business.staff.find((s) => s.role === "OWNER")?.email}</p>
                    </div>
                    <Badge variant="outline" className="ml-auto text-[10px]">OWNER</Badge>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Sem owner definido.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card rounded-xl">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-sm font-bold">Resumo</h3>
              <div className="space-y-3">
                <SummaryRow label="Profissionais" value={String((business.staff ?? []).length)} />
                <SummaryRow label="Servicos" value={String((business.services ?? []).length)} />
                <SummaryRow label="Produtos" value={String((business.products ?? []).length)} />
                <SummaryRow label="Agendamentos Recentes" value={String(appointments.length)} />
              </div>
              <div className="pt-4 border-t border-border/40">
                <Button onClick={handleAccess} className="w-full h-10 rounded-xl text-xs font-bold gap-2">
                  <ExternalLink className="h-4 w-4" /> Acessar como Negocio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "staff" && (
        <Card className="border-border/50 bg-card rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Nome</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Email</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Role</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Comissao Base</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {(business.staff ?? []).map((member) => (
                    <tr key={member.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold">{member.name.charAt(0)}</div>
                          <span className="font-medium">{member.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{member.email}</td>
                      <td className="px-4 py-3"><Badge variant="outline" className="text-[10px]">{member.role}</Badge></td>
                      <td className="px-4 py-3 text-muted-foreground">{member.baseCommission}%</td>
                    </tr>
                  ))}
                  {(business.staff ?? []).length === 0 && (
                    <tr><td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">Nenhum membro na equipe.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "services" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {(business.services ?? []).map((svc) => (
            <Card key={svc.id} className="border-border/50 bg-card rounded-xl">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-bold">{svc.name}</p>
                  <Badge variant="outline" className="text-[10px]">{svc.duration}min</Badge>
                </div>
                <p className="text-lg font-bold text-primary">{formatCurrency(svc.price)}</p>
              </CardContent>
            </Card>
          ))}
          {(business.services ?? []).length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              <Scissors className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>Nenhum servico cadastrado.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "products" && (
        <Card className="border-border/50 bg-card rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Produto</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Preco</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Estoque</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {(business.products ?? []).map((prod) => (
                    <tr key={prod.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-medium">{prod.name}</td>
                      <td className="px-4 py-3">{formatCurrency(prod.price)}</td>
                      <td className="px-4 py-3">
                        <span className={cn("text-xs font-bold", (prod.stock ?? 0) <= 0 ? "text-red-500" : "text-muted-foreground")}>
                          {prod.stock ?? 0} unidades
                        </span>
                      </td>
                    </tr>
                  ))}
                  {(business.products ?? []).length === 0 && (
                    <tr><td colSpan={3} className="px-4 py-12 text-center text-muted-foreground">Nenhum produto cadastrado.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "appointments" && (
        <Card className="border-border/50 bg-card rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Cliente</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Servico</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Profissional</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Data</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {appointments.map((apt) => (
                    <tr key={String(apt.id)} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-medium">{String((apt.client as Record<string, unknown>)?.name || "—")}</td>
                      <td className="px-4 py-3 text-muted-foreground">{String((apt.service as Record<string, unknown>)?.name || "—")}</td>
                      <td className="px-4 py-3 text-muted-foreground">{String((apt.professional as Record<string, unknown>)?.name || "—")}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(String(apt.date))}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-[10px]">{String(apt.status)}</Badge>
                      </td>
                    </tr>
                  ))}
                  {appointments.length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">Nenhum agendamento recente.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
  return (
    <Card className="border-border/50 bg-card rounded-xl">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xl font-bold">{value}</p>
          <p className="text-[10px] text-muted-foreground font-medium uppercase">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}
