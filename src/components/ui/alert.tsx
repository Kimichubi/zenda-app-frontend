"use client";

import { type ReactNode } from "react";
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/utils";
import { Button } from "./button";

const variantConfig: Record<string, { icon: typeof Info; color: string; bg: string; border: string }> = {
  info: { icon: Info, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  success: { icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  warning: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  error: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30" },
};

export interface AlertProps {
  title: string;
  description?: string;
  variant?: "info" | "success" | "warning" | "error";
  onDismiss?: () => void;
  children?: ReactNode;
  className?: string;
}

export function Alert({
  title,
  description,
  variant = "info",
  onDismiss,
  children,
  className,
}: AlertProps) {
  const { icon: Icon, color, bg, border } = variantConfig[variant];

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4",
        bg,
        border,
        className,
      )}
    >
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", color)} />
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-semibold", color)}>{title}</p>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
        {children}
      </div>
      {onDismiss && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className={cn("h-6 w-6 shrink-0", color)}
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
