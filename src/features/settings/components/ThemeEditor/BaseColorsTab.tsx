import * as React from "react";
import type { CustomTheme } from "@/core/entities/settings";
import { ColorSelector } from "@/components/ui/ColorSelector";
import { useSettings } from "@/features/settings/context/settings-context";
import { FontSelector } from "@/components/ui/FontSelector";

interface BaseColorsTabProps {
  themeState: CustomTheme;
  setThemeState: (updater: CustomTheme | ((prev: CustomTheme) => CustomTheme), push?: boolean) => void;
  initialTheme: CustomTheme;
}

export function BaseColorsTab({ themeState, setThemeState, initialTheme }: BaseColorsTabProps) {
  const { customFonts, refreshCustomFonts } = useSettings();

  const handleColorChange = (key: keyof CustomTheme, value: string, push: boolean = false) => {
    setThemeState((prev) => ({
      ...prev,
      [key]: value,
    }), push);
  };

  const colorFields = [
    { label: "App background", key: "background" as const },
    { label: "Primary text", key: "foreground" as const },
    { label: "Secondary background", key: "secondary" as const },
    { label: "Secondary text", key: "secondaryForeground" as const },
    { label: "Popover/Menu background", key: "popover" as const },
    { label: "Popover/Menu text", key: "popoverForeground" as const },
    { label: "Card background", key: "cardBackground" as const },
    { label: "Card text", key: "cardForeground" as const },
    { label: "Card border color", key: "cardBorder" as const },
    { label: "Borders & Lines", key: "border" as const },
    { label: "Accent highlight (brand)", key: "accent" as const },
    { label: "Accent button text", key: "accentForeground" as const },
    { label: "UI Accent highlight", key: "uiAccent" as const },
    { label: "UI Accent text", key: "uiAccentForeground" as const },
    { label: "Muted background", key: "muted" as const },
    { label: "Muted text", key: "mutedForeground" as const },
    { label: "Input fields background", key: "input" as const },
    { label: "Focus ring highlight", key: "ring" as const },
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
            const hexVal = (themeState[field.key] as string) || 
              (field.key === "cardBorder" ? themeState.border :
               field.key === "input" ? themeState.border :
               field.key === "ring" ? themeState.accent : "");

            const initialHexVal = (initialTheme[field.key] as string) || 
              (field.key === "cardBorder" ? initialTheme.border :
               field.key === "input" ? initialTheme.border :
               field.key === "ring" ? initialTheme.accent : "");

            return (
              <div key={field.key} className="flex flex-col gap-2 p-3 bg-accent/15 border border-border/30 rounded-xl">
                <span className="text-[11px] font-bold">{field.label}</span>
                <ColorSelector
                  value={hexVal}
                  initialValue={initialHexVal}
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
        <h3 className="text-xs font-bold font-heading mb-3 pb-1.5 border-b border-border/30">Theme typography</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FontSelector
            label="User interface UI font"
            value={themeState.uiFont || ""}
            onChange={(val) => setThemeState(prev => ({ ...prev, uiFont: val || undefined }))}
            customFonts={customFonts}
            onRefreshCustomFonts={refreshCustomFonts}
            filterType="ui"
          />
        </div>
      </div>
    </div>
  );
}

