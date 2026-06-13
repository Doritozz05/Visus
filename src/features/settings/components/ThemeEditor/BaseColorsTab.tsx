import * as React from "react";
import type { CustomTheme } from "@/core/entities/settings";
import { ColorSelector } from "@/components/ui/ColorSelector";
import { FancyDropdown } from "@/components/ui/FancyDropdown";

interface BaseColorsTabProps {
  themeState: CustomTheme;
  setThemeState: (updater: CustomTheme | ((prev: CustomTheme) => CustomTheme), push?: boolean) => void;
  initialTheme: CustomTheme;
}

export function BaseColorsTab({ themeState, setThemeState, initialTheme }: BaseColorsTabProps) {
  const handleColorChange = (key: keyof CustomTheme, value: string, push: boolean = false) => {
    setThemeState((prev) => ({
      ...prev,
      [key]: value,
    }), push);
  };

  const handleFontChange = (val: string) => {
    setThemeState((prev) => ({
      ...prev,
      uiFont: (val || undefined) as any,
    }));
  };

  const colorFields = [
    { label: "App background", key: "background" as const },
    { label: "Primary text", key: "foreground" as const },
    { label: "Card background", key: "cardBackground" as const },
    { label: "Card text", key: "cardForeground" as const },
    { label: "Borders & Lines", key: "border" as const },
    { label: "Accent highlight", key: "accent" as const },
    { label: "Accent button text", key: "accentForeground" as const },
    { label: "Muted background", key: "muted" as const },
    { label: "Muted text", key: "mutedForeground" as const },
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
            Light-mode
          </button>
          <button
            type="button"
            onClick={() => setThemeState((prev) => ({ ...prev, isDark: true }))}
            className={`flex-1 py-2 rounded-xl border text-[11px] font-bold transition-all ${themeState.isDark ? "border-primary bg-primary/10 text-primary" : "border-border/30 bg-card/40 hover:border-border/60"}`}
          >
            Dark-mode
          </button>
        </div>
        <p className="text-[9px] text-muted-foreground mt-1.5 leading-normal">
          This toggle sets default browser scrollbar rendering, default glass overlays, and triggers Tailwind&apos;s `dark:` classes inside components.
        </p>
      </div>

      {/* Base Colors Grid */}
      <div>
        <h3 className="text-xs font-bold font-heading mb-3 pb-1.5 border-b border-border/30">Base colors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {colorFields.map((field) => {
            const hexVal = themeState[field.key] as string;
            return (
              <div key={field.key} className="flex flex-col gap-2 p-3 bg-accent/15 border border-border/30 rounded-xl">
                <span className="text-[11px] font-bold">{field.label}</span>
                <ColorSelector
                  value={hexVal}
                  initialValue={initialTheme[field.key] as string}
                  onChange={(color) => handleColorChange(field.key, color, false)}
                  onChangeComplete={(color) => handleColorChange(field.key, color, true)}
                />
              </div>
            );
          })}
        </div>
        <p className="text-[9px] text-muted-foreground mt-2 leading-normal">
          <strong>Muted colors:</strong> Used for badges, tags, subtle card backgrounds, helper texts, metadata, and placeholder elements throughout the library and shelves.
        </p>
      </div>

      {/* Fonts */}
      <div>
        <h3 className="text-xs font-bold font-heading mb-3 pb-1.5 border-b border-border/30">System typography</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">User interface UI font</label>
            <FancyDropdown
              ariaLabel="System UI font family"
              value={themeState.uiFont || ""}
              placeholder="Default (inherit settings)"
              menuZIndex={150}
              onChange={handleFontChange}
              options={[
                { value: "", label: "Default (inherit settings)", description: "Inherits the global configuration font" },
                { value: "inter", label: "Inter", description: "Sleek and clean neo-grotesque sans-serif" },
                { value: "outfit", label: "Outfit", description: "Modern, warm geometric design" },
                { value: "roboto", label: "Hanken Grotesk", description: "Sophisticated grotesque typeface" },
                { value: "system-ui", label: "System default", description: "Default operating system font stack" },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
