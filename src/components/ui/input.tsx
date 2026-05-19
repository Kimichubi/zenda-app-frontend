"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, type, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const errorId = inputId ? `${inputId}-error` : undefined;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "flex h-10 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm ring-offset-background transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:border-ring/40 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive/60 focus-visible:ring-destructive/20 focus-visible:border-destructive/60",
            className,
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-xs font-medium text-destructive/80" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
