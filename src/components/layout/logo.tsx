import { cn } from "@/utils";

interface LogoProps {
  height?: number;
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ className, iconOnly = false }: LogoProps) {
  if (iconOnly) {
    return (
      <div className={cn(
        "flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/20",
        className
      )}>
        <span className="text-xs font-black text-primary-foreground tracking-tight">Z</span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/20">
        <span className="text-xs font-black text-primary-foreground tracking-tight">Z</span>
      </div>
      <div className="flex items-baseline gap-0.5">
        <span className="text-lg font-black tracking-tight text-foreground">Zenda</span>
        <span className="text-[10px] font-bold text-muted-foreground/50 tracking-[0.2em] uppercase hidden sm:inline">App</span>
      </div>
    </div>
  );
}
