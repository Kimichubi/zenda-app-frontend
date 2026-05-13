"use client";

import { useState } from "react";
import { useAdminChatSessions, useChatLogs, useChatStats } from "@/hooks/use-admin";
import { Card, CardContent, Badge, Button, Modal } from "@/components/ui";
import { Bot, Search, Loader2, MessageCircle, BarChart3 } from "lucide-react";
import { cn, formatDate } from "@/utils";

export default function ConversasPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const { data: sessionsData, isLoading: sessionsLoading } = useAdminChatSessions({ search: debouncedSearch, page, limit: 20 });
  const { data: logs, isLoading: logsLoading } = useChatLogs(selectedSession);
  const { data: stats } = useChatStats();

  const handleSearch = (value: string) => {
    setSearch(value);
    setTimeout(() => setDebouncedSearch(value), 300);
    setPage(1);
  };

  const sessions = sessionsData?.data ?? [];
  const totalPages = Math.ceil((sessionsData?.total ?? 0) / 20);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Conversas Bot</h1>
        <p className="text-sm text-muted-foreground mt-1">Monitoramento de sessoes do WhatsApp bot</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Sessoes Totais" value={stats?.totalSessions ?? 0} icon={Bot} />
        <StatCard label="Ativas Este Mes" value={stats?.activeSessionsThisMonth ?? 0} icon={MessageCircle} />
        <StatCard label="Logs Totais" value={stats?.totalLogs ?? 0} icon={BarChart3} />
      </div>

      {/* Intent Distribution */}
      {stats?.intentDistribution && stats.intentDistribution.length > 0 && (
        <Card className="border-border/50 bg-card rounded-xl">
          <CardContent className="p-5">
            <h3 className="text-sm font-bold mb-4">Distribuicao de Intents</h3>
            <div className="flex flex-wrap gap-2">
              {stats.intentDistribution.map((intent: any) => (
                <Badge key={intent.intent} variant="secondary" className="text-xs px-3 py-1">
                  {intent.intent}: {intent.count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Buscar por telefone..."
          className="w-full h-10 pl-9 pr-4 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      {sessionsLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <>
          <Card className="border-border/50 bg-card rounded-xl overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/30">
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Telefone</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Estado</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Logs</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Ultima Mensagem</th>
                      <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Acao</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {sessions.map((session: any) => (
                      <tr key={session.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 font-medium">{session.phoneNumber}</td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="text-[10px]">{session.state}</Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{session._count?.logs ?? 0}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{formatDate(session.lastMessageAt)}</td>
                        <td className="px-4 py-3 text-right">
                          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setSelectedSession(session.id)}>
                            Ver Logs
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {sessions.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                          <Bot className="h-8 w-8 mx-auto mb-2 opacity-30" />
                          Nenhuma sessao encontrada.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Pagina {page} de {totalPages}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Anterior</Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Proxima</Button>
              </div>
            </div>
          )}
        </>
      )}

      <Modal open={!!selectedSession} onClose={() => setSelectedSession(null)} title="Logs da Conversa" className="max-w-2xl">
        <div className="p-2 space-y-3 max-h-[60vh] overflow-y-auto">
          {logsLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            (logs ?? []).map((log: any) => (
              <div key={log.id} className="space-y-2 p-3 rounded-xl bg-muted/30 border border-border/30">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px]">{log.intent}</Badge>
                  <span className="text-[10px] text-muted-foreground">{formatDate(log.createdAt)}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Entrada</p>
                  <p className="text-sm">{log.incoming}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-primary uppercase font-semibold">Resposta</p>
                  <p className="text-sm">{log.outgoing}</p>
                </div>
                <div className="text-[10px] text-muted-foreground">Confianca: {(log.confidence * 100).toFixed(0)}%</div>
              </div>
            ))
          )}
          {(!logs || logs.length === 0) && !logsLoading && (
            <p className="text-center text-muted-foreground py-8">Nenhum log encontrado.</p>
          )}
        </div>
      </Modal>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
  return (
    <Card className="border-border/50 bg-card rounded-xl">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
          <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
