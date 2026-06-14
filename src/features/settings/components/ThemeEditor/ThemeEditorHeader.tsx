import * as React from "react";
import { Palette, X, Undo2, Redo2 } from "lucide-react";

interface ThemeEditorHeaderProps {
  themeName: string;
  setThemeName: (name: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onClose: () => void;
}

export function ThemeEditorHeader({
  themeName,
  setThemeName,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onClose,
}: ThemeEditorHeaderProps) {
  return (
    <header className="flex justify-between items-center px-6 py-4 border-b border-border/40 sticky top-0 z-10 shrink-0 transition-all duration-300 glass-surface">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Palette className="h-5 w-5" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <h2 className="text-base font-extrabold font-heading text-foreground">Theme designer</h2>
          <input
            type="text"
            value={themeName}
            onChange={(e) => setThemeName(e.target.value)}
            placeholder="Theme name..."
            className="bg-accent/40 border border-border/30 focus:border-primary/50 focus:outline-none rounded-lg px-2.5 py-1 text-xs font-bold font-heading text-foreground"
          />
        </div>

        {/* History Controls */}
        <div className="h-8 w-px bg-border/30 mx-2 hidden md:block" />
        <div className="flex items-center gap-1.5 bg-accent/10 p-1 rounded-lg border border-border/20">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className={`p-1.5 rounded-md transition-all ${canUndo ? "hover:bg-card hover:text-primary text-foreground shadow-sm" : "text-muted-foreground/30 cursor-not-allowed"}`}
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className={`p-1.5 rounded-md transition-all ${canRedo ? "hover:bg-card hover:text-primary text-foreground shadow-sm" : "text-muted-foreground/30 cursor-not-allowed"}`}
          >
            <Redo2 className="w-4 h-4" />
          </button>
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
