import * as React from "react";
import type { CustomTheme } from "@/core/entities/settings";
import { resolveColor } from "@/lib/color-utils";
import { FancyDropdown } from "@/components/ui/FancyDropdown";

interface BaseColorsTabProps {
  themeState: CustomTheme;
  setThemeState: React.Dispatch<React.SetStateAction<CustomTheme>>;
}

export function BaseColorsTab({ themeState, setThemeState }: BaseColorsTabProps) {
  const handleColorChange = (key: keyof CustomTheme, value: string) => {
    setThemeState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFontChange = (val: string) => {
    setThemeState((prev) => ({
      ...prev,
      uiFont: (val || undefined) as any,
    }));
  };

  const colorFields = [
    { label: "App Background", key: "background" as const },
    { label: "Primary Text", key: "foreground" as const },
    { label: "Card Background", key: "cardBackground" as const },
    { label: "Card Text", key: "cardForeground" as const },
    { label: "Borders & Lines", key: "border" as const },
    { label: "Accent Highlight", key: "accent" as const },
    { label: "Accent Button Text", key: "accentForeground" as const },
    { label: "Muted Background", key: "muted" as const },
    { label: "Muted Text", key: "mutedForeground" as const },
  ];

  return (
    <div className="space-y-6">
      {/* Mode Select */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Base color model</label>
          <span className="text-[8px] font-mono text-muted-foreground">Tells Visus if this theme is light or dark</span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setThemeState((prev) => ({ ...prev, isDark: false }))}
            className={`flex-1 py-2 rounded-xl border text-[11px] font-bold transition-all ${!themeState.isDark ? "border-primary bg-primary/10 text-primary" : "border-border/30 bg-card/40 hover:border-border/60"}`}
          >
            ☀️ Light-mode Base
          </button>
          <button
            type="button"
            onClick={() => setThemeState((prev) => ({ ...prev, isDark: true }))}
            className={`flex-1 py-2 rounded-xl border text-[11px] font-bold transition-all ${themeState.isDark ? "border-primary bg-primary/10 text-primary" : "border-border/30 bg-card/40 hover:border-border/60"}`}
          >
            🌙 Dark-mode Base
          </button>
        </div>
        <p className="text-[9px] text-muted-foreground mt-1.5 leading-normal">
          This toggle sets default browser scrollbar rendering, default glass overlays, and triggers Tailwind&apos;s `dark:` classes inside components.
        </p>
      </div>

      {/* Base Colors Grid */}
      <div>
        <h3 className="text-xs font-bold font-heading mb-3 pb-1.5 border-b border-border/30">Base Colors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {colorFields.map((field) => {
            const hexVal = themeState[field.key] as string;
            return (
              <div key={field.key} className="flex items-center justify-between p-2.5 bg-accent/15 border border-border/30 rounded-xl">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold">{field.label}</span>
                  <span className="text-[9px] text-muted-foreground font-mono uppercase">{hexVal}</span>
                </div>
                <input
                  type="color"
                  value={resolveColor(hexVal)}
                  onChange={(e) => handleColorChange(field.key, e.target.value)}
                  className="w-8 h-8 rounded border border-border/50 cursor-pointer overflow-hidden bg-transparent shrink-0"
                />
              </div>
            );
          })}
        </div>
        <p className="text-[9px] text-muted-foreground mt-2 leading-normal">
          <strong>Muted Colors:</strong> Used for badges, tags, subtle card backgrounds, helper texts, metadata, and placeholder elements throughout the library and shelves.
        </p>
      </div>

      {/* Fonts */}
      <div>
        <h3 className="text-xs font-bold font-heading mb-3 pb-1.5 border-b border-border/30">System Typography</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">User Interface UI font</label>
            <FancyDropdown
              ariaLabel="System UI font family"
              value={themeState.uiFont || ""}
              placeholder="Default (Inherit Settings)"
              menuZIndex={150}
              onChange={handleFontChange}
              options={[
                { value: "", label: "Default (Inherit Settings)", description: "Inherits the global configuration font" },
                { value: "inter", label: "Inter", description: "Sleek and clean neo-grotesque sans-serif" },
                { value: "outfit", label: "Outfit", description: "Modern, warm geometric design" },
                { value: "roboto", label: "Hanken Grotesk", description: "Sophisticated grotesque typeface" },
                { value: "system-ui", label: "System Default", description: "Default operating system font stack" },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
