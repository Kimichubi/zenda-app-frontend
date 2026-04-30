"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Star, CheckCircle2, AlertCircle } from "lucide-react";
import { Button, Card, CardContent, Textarea, useToast } from "@/components/ui";
import { cn } from "@/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function StarRating({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            aria-label={`${star} estrelas`}
          >
            <Star
              className={cn(
                "h-7 w-7 transition-colors",
                (hover || value) >= star
                  ? "fill-primary text-primary"
                  : "fill-transparent text-gray-300"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AvaliarPage() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const appointmentId = searchParams.get("appointmentId");
  const clientId = searchParams.get("clientId");
  const businessId = searchParams.get("businessId");
  const serviceName = searchParams.get("serviceName");
  const professionalName = searchParams.get("professionalName");

  const [rating, setRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [professionalRating, setProfessionalRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const isValid = useMemo(
    () => !!appointmentId && !!clientId && !!businessId,
    [appointmentId, clientId, businessId]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValid) {
      setError("Link de avaliação inválido.");
      return;
    }

    if (rating < 1) {
      setError("Selecione uma nota geral.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId,
          clientId,
          businessId,
          rating,
          comment: comment.trim() || undefined,
          serviceRating: serviceRating || undefined,
          professionalRating: professionalRating || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ message: "Erro ao enviar avaliação" }));
        throw new Error(data.message);
      }

      setSuccess(true);
      showToast("Avaliação enviada com sucesso!", "success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao enviar avaliação";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isValid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
            <AlertCircle className="h-8 w-8 text-rose-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Link inválido</h1>
          <p className="text-sm text-gray-500">
            O link de avaliação está incompleto ou expirado.
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md text-center space-y-4 animate-in fade-in zoom-in duration-500">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Obrigado pela sua avaliação!</h1>
          <p className="text-sm text-gray-500">
            Sua opinião é muito importante para continuarmos melhorando.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-xl shadow-slate-200/50">
          <CardContent className="p-8 space-y-8">
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">Avalie seu atendimento</h1>
              {serviceName && (
                <p className="text-sm text-gray-500">
                  {serviceName}
                  {professionalName && ` • ${professionalName}`}
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">{error}</span>
                  </div>
                </div>
              )}

              <StarRating label="Nota geral" value={rating} onChange={setRating} />
              <StarRating label="Avaliação do serviço" value={serviceRating} onChange={setServiceRating} />
              <StarRating label="Avaliação do profissional" value={professionalRating} onChange={setProfessionalRating} />

              <Textarea
                label="Comentário (opcional)"
                placeholder="Conte-nos como foi sua experiência..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />

              <Button type="submit" className="w-full h-11 text-sm font-bold" loading={loading}>
                Enviar avaliação
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
