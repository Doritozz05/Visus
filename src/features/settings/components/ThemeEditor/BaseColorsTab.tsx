import * as React from "react";
import type { CustomTheme } from "@/core/entities/settings";
import { ColorSelector } from "@/components/ui/ColorSelector";
import { useSettings } from "@/features/settings/context/settings-context";
import { FontSelector } from "@/components/ui/FontSelector";

interface BaseColorsTabProps {
  themeState: CustomTheme;
  setThemeState: (updater: CustomTheme | ((prev: CustomTheme) => CustomTheme), push?: boolean) => void;
  initialTheme: CustomTheme;
  portalContainer?: HTMLElement | null;
}

export function BaseColorsTab({ themeState, setThemeState, initialTheme, portalContainer }: BaseColorsTabProps) {
  const { customFonts, refreshCustomFonts } = useSettings();

  const handleColorChange = (key: keyof CustomTheme, value: string, push: boolean = false) => {
    setThemeState((prev) => ({
      ...prev,
      [key]: value,
    }), push);
  };

  const surfaceColors = [
    { label: "App background", key: "background" as const },
    { label: "Primary text", key: "foreground" as const },
    { label: "Card background", key: "cardBackground" as const },
    { label: "Card text", key: "cardForeground" as const },
    { label: "Card & container borders", key: "cardBorder" as const },
    { label: "General borders & lines", key: "border" as const },
  ];

  const interactiveColors = [
    { label: "Primary accent highlight", key: "accent" as const },
    { label: "Accent button text", key: "accentForeground" as const },
    { label: "Interactive elements (UI)", key: "uiAccent" as const },
    { label: "Interactive text highlight", key: "uiAccentForeground" as const },
    { label: "Focus & selection rings", key: "ring" as const },
    { label: "Input fields background", key: "input" as const },
  ];

  const secondaryColors = [
    { label: "Surface overlays (Secondary)", key: "secondary" as const },
    { label: "Overlay text color", key: "secondaryForeground" as const },
    { label: "Popover & menu background", key: "popover" as const },
    { label: "Popover & menu text", key: "popoverForeground" as const },
    { label: "Subtle backgrounds", key: "muted" as const },
    { label: "Dimmed text (Muted)", key: "mutedForeground" as const },
  ];

  const renderColorGrid = (fields: { label: string; key: keyof CustomTheme }[], title: string) => (
    <div className="mb-6">
      <h3 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3 pb-1.5 border-b border-border/20">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {fields.map((field) => {
          const hexVal = (themeState[field.key] as string) || 
            ((field.key as string) === "cardBorder" ? themeState.border :
             (field.key as string) === "input" ? themeState.border :
             (field.key as string) === "ring" ? themeState.accent : "");

          const initialHexVal = (initialTheme[field.key] as string) || 
            ((field.key as string) === "cardBorder" ? initialTheme.border :
             (field.key as string) === "input" ? initialTheme.border :
             (field.key as string) === "ring" ? initialTheme.accent : "");

          return (
            <div key={field.key} className="flex flex-col gap-2 p-3 bg-accent/5 border border-border/20 rounded-xl transition-colors hover:border-border/40">
              <span className="text-[11px] font-bold">{field.label}</span>
              <ColorSelector
                value={hexVal}
                initialValue={initialHexVal}
                onChange={(color) => handleColorChange(field.key, color, false)}
                onChangeComplete={(color) => handleColorChange(field.key, color, true)}
                portalContainer={portalContainer}
              />
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Mode Select */}
      <div className="bg-accent/5 p-4 rounded-2xl border border-border/20">
        <div className="flex justify-between items-center mb-3">
          <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Base color model</label>
          <span className="text-[8px] font-mono text-muted-foreground">Tells Visus if this theme is light or dark</span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setThemeState((prev) => ({ ...prev, isDark: false }))}
            className={`flex-1 py-2.5 rounded-xl border text-[11px] font-bold transition-all ${!themeState.isDark ? "border-primary bg-primary/10 text-primary shadow-sm" : "border-border/30 bg-card/40 hover:border-border/60"}`}
          >
            Light mode
          </button>
          <button
            type="button"
            onClick={() => setThemeState((prev) => ({ ...prev, isDark: true }))}
            className={`flex-1 py-2.5 rounded-xl border text-[11px] font-bold transition-all ${themeState.isDark ? "border-primary bg-primary/10 text-primary shadow-sm" : "border-border/30 bg-card/40 hover:border-border/60"}`}
          >
            Dark mode
          </button>
        </div>
        <p className="text-[9px] text-muted-foreground mt-2 leading-normal">
          This toggle sets default browser scrollbar rendering, default glass overlays, and triggers Tailwind&apos;s `dark:` classes inside components.
        </p>
      </div>

      {/* Color Groups */}
      <div>
        {renderColorGrid(surfaceColors, "Core Surfaces")}
        {renderColorGrid(interactiveColors, "Interactive Elements")}
        {renderColorGrid(secondaryColors, "Text & Overlays")}
        
        <p className="text-[9px] text-muted-foreground mt-4 leading-normal bg-accent/5 p-3 rounded-xl border border-border/20 italic">
          <strong>Tip:</strong> Sublte/Muted colors are used for badges, tags, and helper texts throughout the library and shelves. Surface Overlays are used for status bars and specialized headers.
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

