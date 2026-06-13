import * as React from "react";
import type { CustomTheme } from "@/core/entities/settings";
import { resolveColor } from "@/lib/color-utils";

interface DecoupledSectionsTabProps {
  themeState: CustomTheme;
  setThemeState: React.Dispatch<React.SetStateAction<CustomTheme>>;
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
            <div className="flex items-center justify-between p-2.5 bg-card border border-border/30 rounded-xl">
              <span className="text-[11px] font-bold">Sidebar background</span>
              <input
                type="color"
                value={resolveColor(themeState.sidebarBackground || themeState.cardBackground)}
                onChange={(e) => handleColorChange("sidebarBackground", e.target.value)}
                className="w-8 h-8 rounded border shrink-0 bg-transparent cursor-pointer"
              />
            </div>
            {/* Sidebar foreground */}
            <div className="flex items-center justify-between p-2.5 bg-card border border-border/30 rounded-xl">
              <span className="text-[11px] font-bold">Sidebar text color</span>
              <input
                type="color"
                value={resolveColor(themeState.sidebarForeground || themeState.cardForeground)}
                onChange={(e) => handleColorChange("sidebarForeground", e.target.value)}
                className="w-8 h-8 rounded border shrink-0 bg-transparent cursor-pointer"
              />
            </div>
            {/* Sidebar Border */}
            <div className="flex items-center justify-between p-2.5 bg-card border border-border/30 rounded-xl">
              <span className="text-[11px] font-bold">Sidebar line border</span>
              <input
                type="color"
                value={resolveColor(themeState.sidebarBorder || themeState.border)}
                onChange={(e) => handleColorChange("sidebarBorder", e.target.value)}
                className="w-8 h-8 rounded border shrink-0 bg-transparent cursor-pointer"
              />
            </div>
            {/* Sidebar Active Background */}
            <div className="flex items-center justify-between p-2.5 bg-card border border-border/30 rounded-xl">
              <span className="text-[11px] font-bold">Active item tag background</span>
              <input
                type="color"
                value={resolveColor(themeState.sidebarActiveBackground || themeState.accent)}
                onChange={(e) => handleColorChange("sidebarActiveBackground", e.target.value)}
                className="w-8 h-8 rounded border shrink-0 bg-transparent cursor-pointer"
              />
            </div>
            {/* Sidebar Active Foreground */}
            <div className="flex items-center justify-between p-2.5 bg-card border border-border/30 rounded-xl">
              <span className="text-[11px] font-bold">Active item text color</span>
              <input
                type="color"
                value={resolveColor(themeState.sidebarActiveForeground || themeState.accentForeground)}
                onChange={(e) => handleColorChange("sidebarActiveForeground", e.target.value)}
                className="w-8 h-8 rounded border shrink-0 bg-transparent cursor-pointer"
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
            <div className="flex items-center justify-between p-2.5 bg-card border border-border/30 rounded-xl">
              <span className="text-[11px] font-bold">Reading page background</span>
              <input
                type="color"
                value={resolveColor(themeState.readerBackground || themeState.background)}
                onChange={(e) => handleColorChange("readerBackground", e.target.value)}
                className="w-8 h-8 rounded border shrink-0 bg-transparent cursor-pointer"
              />
            </div>
            {/* Reader foreground */}
            <div className="flex items-center justify-between p-2.5 bg-card border border-border/30 rounded-xl">
              <span className="text-[11px] font-bold">Reading text color</span>
              <input
                type="color"
                value={resolveColor(themeState.readerForeground || themeState.foreground)}
                onChange={(e) => handleColorChange("readerForeground", e.target.value)}
                className="w-8 h-8 rounded border shrink-0 bg-transparent cursor-pointer"
              />
            </div>
            {/* Reader border */}
            <div className="flex items-center justify-between p-2.5 bg-card border border-border/30 rounded-xl">
              <span className="text-[11px] font-bold">Reading canvas border</span>
              <input
                type="color"
                value={resolveColor(themeState.readerBorder || themeState.border)}
                onChange={(e) => handleColorChange("readerBorder", e.target.value)}
                className="w-8 h-8 rounded border shrink-0 bg-transparent cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
