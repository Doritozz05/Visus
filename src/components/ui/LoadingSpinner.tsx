"use client";

import * as React from "react";
import { Eye } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  message = "Calibrating visual elements...",
  className = "",
  fullScreen = false,
}: LoadingSpinnerProps) {
  const containerClass = fullScreen
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-foreground animate-fade-in"
    : `flex flex-col items-center justify-center min-h-[250px] w-full p-6 text-center animate-fade-in ${className}`;

  return (
    <div className={containerClass}>
      <div className="relative flex items-center justify-center mb-5">
        {/* Glow backdrop ring */}
        <div className="absolute w-14 h-14 rounded-full border-4 border-primary/10 blur-[3px] pointer-events-none" />
        {/* Spinning tracker track */}
        <div className="w-14 h-14 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        {/* Inner foveal core guide symbol */}
        <Eye className="absolute text-primary/70 w-5 h-5 animate-pulse" />
      </div>
      {message && (
        <p className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
