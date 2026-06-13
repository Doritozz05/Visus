import * as React from "react";
import type { CustomTheme } from "@/core/entities/settings";
import { ColorSelector } from "@/components/ui/ColorSelector";

interface DecoupledSectionsTabProps {
  themeState: CustomTheme;
  setThemeState: (updater: CustomTheme | ((prev: CustomTheme) => CustomTheme), push?: boolean) => void;
}

export function DecoupledSectionsTab({ themeState, setThemeState }: DecoupledSectionsTabProps) {
  const handleToggleOverride = (key: "overrideSidebar" | "overrideReader", checked: boolean) => {
    setThemeState((prev) => ({
      ...prev,
      [key]: checked,
    }));
  };

  const handleColorChange = (key: keyof CustomTheme, value: string) => {
    setThemeState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Sidebar Component Override */}
      <div className="p-4 border border-border/30 bg-accent/5 rounded-2xl">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-border/20">
          <div className="flex flex-col">
            <span className="text-xs font-bold">Decoupled sidebar styles</span>
            <span className="text-[9px] text-muted-foreground">Override background and text colors specifically for the sidebar panel</span>
          </div>
          <input
            type="checkbox"
            checked={themeState.overrideSidebar}
            onChange={(e) => handleToggleOverride("overrideSidebar", e.target.checked)}
            className="w-4 h-4 accent-primary rounded border border-border cursor-pointer"
          />
        </div>
        <p className="text-[9px] text-muted-foreground mb-3 leading-normal">
          Useful for creating Spotify-style themes (dark sidebar paired with a light content layout) or custom accent sidebars.
        </p>

        {themeState.overrideSidebar && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-scale-up">
            {/* Sidebar background */}
            <div className="flex flex-col gap-2 p-3 bg-card border border-border/30 rounded-xl">
              <span className="text-[11px] font-bold">Sidebar background</span>
              <ColorSelector
                value={themeState.sidebarBackground || themeState.cardBackground}
                onChange={(color) => handleColorChange("sidebarBackground", color)}
              />
            </div>
            {/* Sidebar foreground */}
            <div className="flex flex-col gap-2 p-3 bg-card border border-border/30 rounded-xl">
              <span className="text-[11px] font-bold">Sidebar text color</span>
              <ColorSelector
                value={themeState.sidebarForeground || themeState.cardForeground}
                onChange={(color) => handleColorChange("sidebarForeground", color)}
              />
            </div>
            {/* Sidebar Border */}
            <div className="flex flex-col gap-2 p-3 bg-card border border-border/30 rounded-xl">
              <span className="text-[11px] font-bold">Sidebar line border</span>
              <ColorSelector
                value={themeState.sidebarBorder || themeState.border}
                onChange={(color) => handleColorChange("sidebarBorder", color)}
              />
            </div>
            {/* Sidebar Active Background */}
            <div className="flex flex-col gap-2 p-3 bg-card border border-border/30 rounded-xl">
              <span className="text-[11px] font-bold">Active item tag background</span>
              <ColorSelector
                value={themeState.sidebarActiveBackground || themeState.accent}
                onChange={(color) => handleColorChange("sidebarActiveBackground", color)}
              />
            </div>
            {/* Sidebar Active Foreground */}
            <div className="flex flex-col gap-2 p-3 bg-card border border-border/30 rounded-xl">
              <span className="text-[11px] font-bold">Active item text color</span>
              <ColorSelector
                value={themeState.sidebarActiveForeground || themeState.accentForeground}
                onChange={(color) => handleColorChange("sidebarActiveForeground", color)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Reader Component Override */}
      <div className="p-4 border border-border/30 bg-accent/5 rounded-2xl">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-border/20">
          <div className="flex flex-col">
            <span className="text-xs font-bold">Decoupled reader room styles</span>
            <span className="text-[9px] text-muted-foreground">Apply custom parchment/screen backgrounds specifically inside the reading canvas</span>
          </div>
          <input
            type="checkbox"
            checked={themeState.overrideReader}
            onChange={(e) => handleToggleOverride("overrideReader", e.target.checked)}
            className="w-4 h-4 accent-primary rounded border border-border cursor-pointer"
          />
        </div>
        <p className="text-[9px] text-muted-foreground mb-3 leading-normal">
          Overrides the background, text, and border colors specifically when reading a book. Allows you to set a sepia or black page background while keeping the rest of the application light.
        </p>

        {themeState.overrideReader && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-scale-up">
            {/* Reader background */}
            <div className="flex flex-col gap-2 p-3 bg-card border border-border/30 rounded-xl">
              <span className="text-[11px] font-bold">Reading page background</span>
              <ColorSelector
                value={themeState.readerBackground || themeState.background}
                onChange={(color) => handleColorChange("readerBackground", color)}
              />
            </div>
            {/* Reader foreground */}
            <div className="flex flex-col gap-2 p-3 bg-card border border-border/30 rounded-xl">
              <span className="text-[11px] font-bold">Reading text color</span>
              <ColorSelector
                value={themeState.readerForeground || themeState.foreground}
                onChange={(color) => handleColorChange("readerForeground", color)}
              />
            </div>
            {/* Reader border */}
            <div className="flex flex-col gap-2 p-3 bg-card border border-border/30 rounded-xl">
              <span className="text-[11px] font-bold">Reading canvas border</span>
              <ColorSelector
                value={themeState.readerBorder || themeState.border}
                onChange={(color) => handleColorChange("readerBorder", color)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
