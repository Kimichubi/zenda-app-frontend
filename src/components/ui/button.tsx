"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
}

const variantClasses: Record<string, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/15 hover:shadow-md hover:shadow-primary/20 active:shadow-sm",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
  outline:
    "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/70",
  ghost:
    "hover:bg-accent hover:text-accent-foreground active:bg-accent/70",
  danger:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm shadow-destructive/15",
  link:
    "text-primary underline-offset-4 hover:underline",
};

const sizeClasses: Record<string, string> = {
  sm: "h-8 rounded-lg px-3 text-xs font-semibold gap-1.5",
  md: "h-10 rounded-xl px-4 text-sm font-semibold gap-2",
  lg: "h-12 rounded-xl px-6 text-sm font-bold gap-2",
  icon: "h-9 w-9 rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", loading, disabled, children, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            data-testid="button-spinner"
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
