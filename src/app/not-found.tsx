import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-muted border border-border/50">
          <span className="text-4xl font-black text-muted-foreground">404</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Pagina nao encontrada
          </h1>
          <p className="text-muted-foreground">
            O endereco que voce acessou nao existe ou foi removido.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          Voltar ao inicio
        </Link>
      </div>
    </div>
  );
}
