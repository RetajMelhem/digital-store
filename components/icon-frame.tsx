import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function IconFrame({
  children,
  tone = "brand",
  size = "md",
  className
}: {
  children: ReactNode;
  tone?: "brand" | "success" | "whatsapp" | "warm" | "neutral";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizes = {
    sm: "h-8 w-8 rounded-lg",
    md: "h-10 w-10 rounded-xl",
    lg: "h-12 w-12 rounded-2xl",
    xl: "h-16 w-16 rounded-2xl"
  };

  const tones = {
    brand: "icon-shell icon-shell-brand",
    success: "icon-shell icon-shell-success",
    whatsapp: "icon-shell icon-shell-whatsapp",
    warm: "icon-shell icon-shell-warm",
    neutral: "icon-shell"
  };

  return <span className={cn("shrink-0", sizes[size], tones[tone], className)}>{children}</span>;
}

