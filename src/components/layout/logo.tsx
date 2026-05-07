"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/utils";

interface LogoProps {
  size?: number;
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ size = 32, className, iconOnly = false }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={cn("bg-primary rounded-lg", className)} style={{ width: size, height: size }} />;
  }

  const isDark = resolvedTheme === "dark";
  const src = iconOnly
    ? isDark ? "/zenda-logo/icons_dark_panel.png" : "/zenda-logo/icons_light_panel.png"
    : isDark ? "/zenda-logo/logo_full_dark.png" : "/zenda-logo/logo_full_light.png";

  return (
    <Image
      src={src}
      alt="Zenda"
      width={iconOnly ? size : size * 3}
      height={size}
      className={cn("object-contain", className)}
      priority
    />
  );
}
