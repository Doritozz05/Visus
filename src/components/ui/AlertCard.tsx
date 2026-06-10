"use client";

import * as React from "react";
import { AlertOctagon, Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type AlertVariant = "error" | "warning" | "info" | "success";

interface AlertCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  variant?: AlertVariant;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const variantStyles: Record<AlertVariant, { bg: string; border: string; iconColor: string; icon: any }> = {
  error: {
    bg: "bg-destructive/10",
    border: "border-destructive/20",
    iconColor: "text-destructive",
    icon: AlertOctagon,
  },
  warning: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    iconColor: "text-amber-500",
    icon: AlertTriangle,
  },
  info: {
    bg: "bg-primary/10",
    border: "border-primary/20",
    iconColor: "text-primary",
    icon: Info,
  },
  success: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    iconColor: "text-emerald-500",
    icon: CheckCircle2,
  },
};

/**
 * A beautiful, standardized alert/error card using the project's glassmorphism style.
 */
export function AlertCard({
  title,
  description,
  icon,
  variant = "error",
  action,
  className,
}: AlertCardProps) {
  const styles = variantStyles[variant];
  const IconComponent = icon || <styles.icon className="w-8 h-8" />;

  return (
    <div className={cn(
      "max-w-md w-full bg-card border border-border/30 rounded-2xl p-8 text-center shadow-2xl glass-panel flex flex-col items-center justify-center gap-6",
      styles.border,
      className
    )}>
      <div className={cn(
        "w-16 h-16 rounded-full flex items-center justify-center border",
        styles.bg,
        styles.border,
        styles.iconColor
      )}>
        {IconComponent}
      </div>
      <div>
        <h2 className="text-xl font-bold font-heading text-foreground mb-3">{title}</h2>
        {description && (
          <p className="text-xs text-muted-foreground font-sans max-w-xs leading-relaxed mx-auto">
            {description}
          </p>
        )}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 border border-border/30 rounded text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
