"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/utils";

interface LogoProps {
  height?: number;
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ height = 32, className, iconOnly = false }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={cn("bg-primary rounded-lg", className)} style={{ width: height, height }} />;
  }

  const isDark = resolvedTheme === "dark";
  const src = iconOnly
    ? isDark ? "/zenda-logo/logo_zenda_dark_icon.png" : "/zenda-logo/logo_zenda_light_icon.png"
    : isDark ? "/zenda-logo/logo_zenda_dark.png" : "/zenda-logo/logo_zenda_light.png";

  return (
    <Image
      src={src}
      alt="Zenda"
      width={iconOnly ? height : height * 4}
      height={height}
      className={cn("object-contain", className)}
      priority
    />
  );
}
