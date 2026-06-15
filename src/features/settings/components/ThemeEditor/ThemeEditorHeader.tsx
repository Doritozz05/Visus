import * as React from "react";
import { Palette, X, Undo2, Redo2, Eye, Settings2 } from "lucide-react";

interface ThemeEditorHeaderProps {
  themeName: string;
  setThemeName: (name: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onClose: () => void;
  mobileMode?: "preview" | "edit";
  onToggleMobileMode?: () => void;
}

export function ThemeEditorHeader({
  themeName,
  setThemeName,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onClose,
  mobileMode,
  onToggleMobileMode,
}: ThemeEditorHeaderProps) {
  return (
    <header className="flex justify-between items-center px-4 md:px-6 py-3 md:py-4 border-b border-border/40 sticky top-0 z-[200] shrink-0 transition-all duration-300 bg-card">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
          <Palette className="h-5 w-5" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 overflow-hidden">
          <h2 className="text-sm md:text-base font-extrabold font-heading text-foreground truncate">Theme designer</h2>
          <input
            type="text"
            value={themeName}
            onChange={(e) => setThemeName(e.target.value)}
            placeholder="Theme name..."
            className="bg-accent/40 border border-border/30 focus:border-primary/50 focus:outline-none rounded-lg px-2.5 py-1 text-[10px] md:text-xs font-bold font-heading text-foreground w-full max-w-[120px] md:max-w-none"
          />
        </div>

        {/* History Controls - Hidden on very small screens to make space for toggle */}
        <div className="h-8 w-px bg-border/30 mx-1 md:mx-2 hidden sm:block" />
        <div className="hidden sm:flex items-center gap-1.5 bg-accent/10 p-1 rounded-lg border border-border/20">
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

      <div className="flex items-center gap-2">
        {/* Mobile Mode Toggle Button */}
        {onToggleMobileMode && (
          <button
            onClick={onToggleMobileMode}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-full text-[10px] font-bold shadow-lg animate-in fade-in zoom-in duration-300"
          >
            {mobileMode === "preview" ? (
              <>
                <Settings2 className="w-3.5 h-3.5" /> Configure
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" /> Preview
              </>
            )}
          </button>
        )}

        <button
          onClick={onClose}
          className="p-1.5 hover:bg-accent/30 rounded-lg text-muted-foreground hover:text-foreground transition-all"
          aria-label="Close theme designer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
