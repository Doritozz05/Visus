import * as React from "react";
import { Trash2 } from "lucide-react";

interface ThemeEditorFooterProps {
  themeName: string;
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function ThemeEditorFooter({
  themeName,
  isEditing,
  onSave,
  onCancel,
  onDelete,
}: ThemeEditorFooterProps) {
  return (
    <footer className="border-t border-border/30 p-4 bg-accent/5 flex justify-between items-center shrink-0">
      <div>
        {isEditing && onDelete && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Are you sure you want to permanently delete the theme "${themeName}"?`)) {
                onDelete();
              }
            }}
            className="py-2.5 px-4 bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" /> Delete Theme
          </button>
        )}
      </div>
      <div className="flex gap-3.5">
        <button
          type="button"
          onClick={onCancel}
          className="py-2.5 px-6 border border-border/30 hover:bg-accent/20 rounded-xl text-xs font-bold transition-all text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          className="py-2.5 px-7 bg-primary text-primary-foreground hover:brightness-110 font-extrabold rounded-xl text-xs transition-all shadow-[0_0_15px_rgba(var(--primary),0.2)]"
        >
          Save & Apply Theme
        </button>
      </div>
    </footer>
  );
}
