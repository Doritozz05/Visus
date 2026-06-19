"use client";

import * as React from "react";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: "default" | "ghost" | "primary";
  size?: "sm" | "md";
  isActive?: boolean;
}

const variantStyles: Record<string, string> = {
  default:
    "bg-card hover:bg-accent text-muted-foreground hover:text-primary border border-border/40 shadow-sm liquid-glass",
  ghost:
    "bg-accent hover:bg-accent/80 text-muted-foreground hover:text-foreground border border-border/20",
  primary:
    "bg-primary text-primary-foreground border-primary shadow-[0_0_10px_rgba(var(--primary),0.2)]",
};

const sizeStyles: Record<string, string> = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
};

export function IconButton({
  icon,
  variant = "default",
  size = "md",
  isActive = false,
  className = "",
  ...props
}: IconButtonProps) {
  const base = isActive ? variantStyles.primary : variantStyles[variant];
  const sizeClass = sizeStyles[size];

  return (
    <button
      className={`flex items-center justify-center rounded-lg transition-all shrink-0 cursor-pointer select-none ${base} ${sizeClass} ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
}
