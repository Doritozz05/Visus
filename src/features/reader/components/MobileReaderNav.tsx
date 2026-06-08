"use client";

import * as React from "react";
import { Settings } from "lucide-react";

interface MobileReaderNavProps {
  onOpenSettings: () => void;
}

export function MobileReaderNav({ onOpenSettings }: MobileReaderNavProps) {
  return (
    <nav className="md:hidden bg-card border-b border-border/50 flex justify-between items-center w-full px-6 py-4 z-40 sticky top-0 transition-all duration-300">
      <div className="text-xl font-bold tracking-tight text-foreground">Visus</div>
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSettings}
          className="w-9 h-9 rounded-full bg-accent flex items-center justify-center border border-border/30 hover:text-primary transition-all text-muted-foreground"
          aria-label="Open Reader Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-accent border border-border/30 overflow-hidden">
          <div className="w-full h-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
            VP
          </div>
        </div>
      </div>
    </nav>
  );
}
