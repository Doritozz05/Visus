"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, AlertOctagon, Info } from "lucide-react";

export type ConfirmDialogVariant = "danger" | "warning" | "info";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmDialogVariant;
  isLoading?: boolean;
}

/**
 * A premium, theme-aware confirmation dialog.
 * Uses React Portals to ensure it always overlays the entire viewport.
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const getIcon = () => {
    switch (variant) {
      case "danger": return <AlertOctagon className="w-6 h-6 text-destructive" />;
      case "warning": return <AlertTriangle className="w-6 h-6 text-amber-500" />;
      case "info": return <Info className="w-6 h-6 text-primary" />;
    }
  };

  const getConfirmButtonClass = () => {
    switch (variant) {
      case "danger": 
        return "bg-destructive text-destructive-foreground hover:brightness-110 shadow-lg shadow-destructive/20";
      case "warning": 
        return "bg-amber-500 text-white hover:brightness-110 shadow-lg shadow-amber-500/20";
      case "info": 
        return "bg-primary text-primary-foreground hover:brightness-110 shadow-lg shadow-primary/20";
    }
  };

  const dialogContent = (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-[6px] transition-opacity animate-in fade-in duration-300"
      />
      
      {/* Dialog Content */}
      <div className="w-full max-w-sm bg-card border border-border/30 rounded-2xl p-6 shadow-2xl relative z-10 liquid-glass overflow-hidden animate-scale-up">
        {/* Visual Decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50 pointer-events-none"></div>
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-start gap-4">
            <div className="mt-1">
              {getIcon()}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold font-heading text-foreground tracking-tight">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-2.5 border border-border/30 rounded-xl text-xs font-mono uppercase tracking-wider text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                if (!isLoading) onClose();
              }}
              disabled={isLoading}
              className={`flex-1 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all ${getConfirmButtonClass()} disabled:opacity-50`}
            >
              {isLoading ? "Processing..." : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(dialogContent, document.body);
}
