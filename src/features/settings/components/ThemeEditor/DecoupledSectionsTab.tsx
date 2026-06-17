import * as React from "react";
import type { CustomTheme } from "@/core/entities/settings";
import { ColorSelector } from "@/components/ui/ColorSelector";

interface DecoupledSectionsTabProps {
  themeState: CustomTheme;
  setThemeState: (updater: CustomTheme | ((prev: CustomTheme) => CustomTheme), push?: boolean) => void;
  portalContainer?: HTMLElement | null;
}

export function DecoupledSectionsTab({ themeState, setThemeState, portalContainer }: DecoupledSectionsTabProps) {
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
                portalContainer={portalContainer}
              />
            </div>
            {/* Sidebar foreground */}
            <div className="flex flex-col gap-2 p-3 bg-card border border-border/30 rounded-xl">
              <span className="text-[11px] font-bold">Sidebar text color</span>
              <ColorSelector
                value={themeState.sidebarForeground || themeState.foreground}
                onChange={(color) => handleColorChange("sidebarForeground", color)}
                portalContainer={portalContainer}
              />
            </div>
            {/* Sidebar Border */}
            <div className="flex flex-col gap-2 p-3 bg-card border border-border/30 rounded-xl">
              <span className="text-[11px] font-bold">Sidebar line border</span>
              <ColorSelector
                value={themeState.sidebarBorder || themeState.border}
                onChange={(color) => handleColorChange("sidebarBorder", color)}
                portalContainer={portalContainer}
              />
            </div>
            {/* Sidebar Active Background */}
            <div className="flex flex-col gap-2 p-3 bg-card border border-border/30 rounded-xl">
              <span className="text-[11px] font-bold">Active item tag background</span>
              <ColorSelector
                value={themeState.sidebarActiveBackground || themeState.accent}
                onChange={(color) => handleColorChange("sidebarActiveBackground", color)}
                portalContainer={portalContainer}
              />
            </div>
            {/* Sidebar Active Foreground */}
            <div className="flex flex-col gap-2 p-3 bg-card border border-border/30 rounded-xl">
              <span className="text-[11px] font-bold">Active item text color</span>
              <ColorSelector
                value={themeState.sidebarActiveForeground || themeState.accentForeground}
                onChange={(color) => handleColorChange("sidebarActiveForeground", color)}
                portalContainer={portalContainer}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
