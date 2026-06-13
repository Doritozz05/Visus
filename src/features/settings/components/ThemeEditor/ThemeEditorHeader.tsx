import * as React from "react";
import { Palette, X } from "lucide-react";

interface ThemeEditorHeaderProps {
  themeName: string;
  setThemeName: (name: string) => void;
  onClose: () => void;
}

export function ThemeEditorHeader({
  themeName,
  setThemeName,
  onClose,
}: ThemeEditorHeaderProps) {
  return (
    <header className="flex justify-between items-center px-6 py-4 border-b border-border/40 bg-card/60 backdrop-blur-md sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Palette className="h-5 w-5" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <h2 className="text-base font-extrabold font-heading text-foreground">Theme Designer</h2>
          <input
            type="text"
            value={themeName}
            onChange={(e) => setThemeName(e.target.value)}
            placeholder="Theme name..."
            className="bg-accent/40 border border-border/30 focus:border-primary/50 focus:outline-none rounded-lg px-2.5 py-1 text-xs font-bold font-heading text-foreground"
          />
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-1.5 hover:bg-accent/30 rounded-lg text-muted-foreground hover:text-foreground transition-all"
        aria-label="Close theme designer"
      >
        <X className="h-5 w-5" />
      </button>
    </header>
  );
}
