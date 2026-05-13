"use client";

import { useState } from "react";
import { useAdminReviews, useToggleReviewPublic, useReplyReview } from "@/hooks/use-admin";
import { useToast, Button, Modal, Card, CardContent, Badge } from "@/components/ui";
import { Search, MessageSquareQuote, Star, Loader2, Eye, EyeOff, Reply } from "lucide-react";
import { cn } from "@/utils";

export default function AvaliacoesPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const { showToast } = useToast();

  const { data, isLoading } = useAdminReviews({ search: debouncedSearch, page, limit: 20 });
  const togglePublic = useToggleReviewPublic();
  const replyReview = useReplyReview();

  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [replyText, setReplyText] = useState("");

  const handleSearch = (value: string) => {
    setSearch(value);
    setTimeout(() => setDebouncedSearch(value), 300);
    setPage(1);
  };

  const handleTogglePublic = (id: string) => {
    togglePublic.mutate(id, {
      onSuccess: () => showToast("Visibilidade atualizada!", "success"),
      onError: () => showToast("Erro ao atualizar", "error"),
    });
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    replyReview.mutate({ id: selectedReview.id, reply: replyText }, {
      onSuccess: () => {
        showToast("Resposta enviada!", "success");
        setReplyModalOpen(false);
        setReplyText("");
        setSelectedReview(null);
      },
      onError: () => showToast("Erro ao enviar resposta", "error"),
    });
  };

  const reviews = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Avaliacoes</h1>
        <p className="text-sm text-muted-foreground mt-1">{total} avaliacoes na plataforma</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Buscar avaliacoes..."
          className="w-full h-10 pl-9 pr-4 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {reviews.map((review: any) => (
              <Card key={review.id} className="border-border/50 bg-card rounded-xl overflow-hidden">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-4 w-4 fill-amber-500" />
                        <span className="text-sm font-bold">{review.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{review.client?.name}</span>
                    </div>
                    <Badge variant="outline" className={cn("text-[10px]", review.isPublic ? "text-emerald-500 border-emerald-500/20" : "text-muted-foreground")}>
                      {review.isPublic ? "Publico" : "Oculto"}
                    </Badge>
                  </div>

                  <p className="text-sm text-foreground leading-relaxed">{review.comment || "Sem comentario"}</p>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{review.business?.name}</span>
                    <span>·</span>
                    <span>{review.appointment?.service?.name ?? "Servico"}</span>
                  </div>

                  {review.reply && (
                    <div className="p-3 rounded-lg bg-muted/40 text-sm">
                      <span className="text-xs font-semibold text-muted-foreground uppercase">Resposta:</span>
                      <p className="mt-1">{review.reply}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs gap-1.5"
                      onClick={() => handleTogglePublic(review.id)}
                      loading={togglePublic.isPending}
                    >
                      {review.isPublic ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      {review.isPublic ? "Ocultar" : "Publicar"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs gap-1.5"
                      onClick={() => { setSelectedReview(review); setReplyText(review.reply || ""); setReplyModalOpen(true); }}
                    >
                      <Reply className="h-3 w-3" />
                      Responder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {reviews.length === 0 && (
              <div className="col-span-full py-20 text-center text-muted-foreground">
                <MessageSquareQuote className="h-10 w-10 mx-auto mb-3 opacity-30" />
                Nenhuma avaliacao encontrada.
              </div>
            )}
          </div>

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

      <Modal open={replyModalOpen} onClose={() => setReplyModalOpen(false)} title="Responder avaliacao">
        <div className="space-y-4 p-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Escreva sua resposta..."
            rows={4}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
          <Button onClick={handleReply} className="w-full h-12 rounded-xl font-bold" loading={replyReview.isPending}>
            Enviar Resposta
          </Button>
        </div>
      </Modal>
    </div>
  );
}
