import * as React from "react";
import { ShieldAlert, Copy, Check, Download } from "lucide-react";
import type { CustomTheme } from "@/core/entities/settings";

interface AdvancedCssTabProps {
  themeState: CustomTheme;
  setThemeState: React.Dispatch<React.SetStateAction<CustomTheme>>;
  copied: boolean;
  handleCopyJson: () => void;
  handleExportFile: () => void;
  importJson: string;
  setImportJson: (val: string) => void;
  handleImportJson: () => void;
  importError: string | null;
}

export function AdvancedCssTab({
  themeState,
  setThemeState,
  copied,
  handleCopyJson,
  handleExportFile,
  importJson,
  setImportJson,
  handleImportJson,
  importError,
}: AdvancedCssTabProps) {
  return (
    <div className="space-y-6">
      {/* Advanced CSS Injection */}
      <div>
        <h3 className="text-xs font-bold font-heading mb-1.5 flex items-center gap-1.5">
          Custom CSS playground <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[8px] uppercase font-mono border border-amber-500/20">Developer Mode</span>
        </h3>
        <p className="text-[10px] text-muted-foreground mb-3">
          Write raw CSS declarations. Targets classes: <code>aside</code> (sidebar), <code>.liquid-glass</code> (cards), <code>.reader-columns-canvas</code> (reader text).
        </p>
        <textarea
          value={themeState.customCss || ""}
          onChange={(e) => setThemeState(prev => ({ ...prev, customCss: e.target.value }))}
          placeholder="/* Example override */&#10;aside {&#10;  background: linear-gradient(180deg, #111827, #1f2937) !important;&#10;}&#10;.liquid-glass {&#10;  border-width: 2px !important;&#10;}"
          className="w-full h-44 bg-accent/15 border border-border/30 focus:border-primary/50 focus:outline-none rounded-xl p-3 text-[10px] font-mono text-foreground leading-normal"
        />
      </div>

      {/* Import / Export JSON Block */}
      <div className="border-t border-border/20 pt-6">
        <h3 className="text-xs font-bold font-heading mb-3">Import / Export Theme</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Share Output */}
          <div className="space-y-3 p-4 border border-border/30 bg-accent/5 rounded-2xl">
            <span className="block text-[11px] font-bold">Share Theme File</span>
            <p className="text-[9px] text-muted-foreground">Export your theme settings configuration to share with other users or backup offline.</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopyJson}
                className="flex-1 py-2 px-3 bg-card border border-border/30 hover:border-primary/45 rounded-xl text-[10px] font-bold font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500 animate-scale-up" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-primary" />
                    Copy Config
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleExportFile}
                className="flex-1 py-2 px-3 bg-primary text-primary-foreground hover:brightness-110 rounded-xl text-[10px] font-bold font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
          </div>

          {/* Import Area */}
          <div className="space-y-3 p-4 border border-border/30 bg-accent/5 rounded-2xl">
            <span className="block text-[11px] font-bold">Import Custom Theme</span>
            <textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder="Paste exported theme JSON code here..."
              className="w-full h-[60px] bg-card border border-border/30 focus:border-primary/50 focus:outline-none rounded-xl p-2 text-[9px] font-mono text-foreground placeholder-muted-foreground/60 leading-normal"
            />
            <button
              type="button"
              onClick={handleImportJson}
              disabled={!importJson.trim()}
              className="w-full py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-[10px] font-bold font-mono uppercase tracking-wider transition-all"
            >
              Load JSON Theme
            </button>
            {importError && (
              <p className="text-[9px] text-destructive font-mono mt-1">{importError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Local Storage warning */}
      <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-xl flex gap-3 text-[10px] leading-relaxed">
        <ShieldAlert className="w-5 h-5 shrink-0 text-amber-500" />
        <div>
          <span className="font-bold block mb-0.5">Offline Storage Warning</span>
          Custom backgrounds utilizing local image uploads convert to base64 which occupies storage space. We recommend uploading optimized images (under 250KB) to prevent exceeding browser storage quotas.
        </div>
      </div>
    </div>
  );
}
