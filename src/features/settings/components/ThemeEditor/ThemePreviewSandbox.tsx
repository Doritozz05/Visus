import * as React from "react";
import { Eye } from "lucide-react";
import type { CustomTheme } from "@/core/entities/settings";
import { resolveColor, hexToRgba } from "@/lib/color-utils";
import { getFontFamilyStyle, hexToRgb, PRESETS_TEMPLATES } from "./utils";

interface ThemePreviewSandboxProps {
  themeState: CustomTheme;
  previewDevice: "desktop" | "mobile";
  setPreviewDevice: (device: "desktop" | "mobile") => void;
  applyPresetTemplate: (preset: typeof PRESETS_TEMPLATES[0]) => void;
}

export function ThemePreviewSandbox({
  themeState,
  previewDevice,
  setPreviewDevice,
  applyPresetTemplate,
}: ThemePreviewSandboxProps) {
  // Build values for sandbox render
  const previewBg = themeState.bgType === "gradient" 
    ? `linear-gradient(${themeState.bgGradientAngle ?? 135}deg, ${resolveColor(themeState.bgGradientStart || "#ffffff")}, ${resolveColor(themeState.bgGradientEnd || "#eaeaea")})`
    : themeState.bgType === "image" && themeState.bgImageUrl
      ? `url(${themeState.bgImageUrl})`
      : resolveColor(themeState.background);

  const sidebarBg = resolveColor(themeState.overrideSidebar ? (themeState.sidebarBackground || themeState.cardBackground) : themeState.cardBackground);
  const sidebarFg = resolveColor(themeState.overrideSidebar ? (themeState.sidebarForeground || themeState.cardForeground) : themeState.cardForeground);
  const sidebarBorder = resolveColor(themeState.overrideSidebar ? (themeState.sidebarBorder || themeState.border) : themeState.border);
  const sidebarActiveBg = resolveColor(themeState.overrideSidebar ? (themeState.sidebarActiveBackground || themeState.accent) : themeState.accent);
  const sidebarActiveFg = resolveColor(themeState.overrideSidebar ? (themeState.sidebarActiveForeground || themeState.accentForeground) : themeState.accentForeground);

  const cardRadius = themeState.cardRadius || "12px";
  const getShadowStyle = (shadow: string | undefined) => {
    if (shadow === "glow") {
      if (themeState.glowSettings && themeState.glowSettings.enabled) {
        // Boost opacity for better visibility. Brightness 0.15 becomes ~0.45 opacity.
        const opacity = Math.min(1, (themeState.glowSettings.brightness || 0.15) * 3);
        const glowColor = hexToRgba(themeState.glowSettings.color || themeState.accent, opacity);
        return `0 0 ${themeState.glowSettings.blur}px ${themeState.glowSettings.spread}px ${glowColor}`;
      }
      return `0 0 15px ${hexToRgba(themeState.accent, 0.4)}`;
    }
    switch (shadow) {
      case "none": return "none";
      case "sm": return "0 1px 2px rgba(0,0,0,0.05)";
      case "md": return "0 4px 6px rgba(0,0,0,0.08)";
      case "lg": return "0 10px 15px rgba(0,0,0,0.1)";
      case "retro": return `4px 4px 0px ${resolveColor(themeState.border)}`;
      default: return "none";
    }
  };

  const glassBg = themeState.glassmorphism?.enabled 
    ? `rgba(${hexToRgb(themeState.cardBackground)}, ${themeState.glassmorphism.opacity})` 
    : themeState.cardBackground;
  const glassBlur = themeState.glassmorphism?.enabled ? `blur(${themeState.glassmorphism.blur}px)` : "none";
  const glassBorder = themeState.glassmorphism?.enabled 
    ? `1px solid rgba(${hexToRgb(themeState.border)}, ${themeState.glassmorphism.borderOpacity})` 
    : `1px solid ${themeState.border}`;

  return (
    <section className="lg:col-span-5 bg-accent/10 border-r border-border/20 p-6 flex flex-col justify-between overflow-y-auto min-h-[400px]">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-primary" /> Live preview sandbox
          </span>
          <div className="flex bg-card border border-border/30 rounded-lg p-0.5 text-[10px]">
            <button
              onClick={() => setPreviewDevice("desktop")}
              className={`px-2 py-1 rounded-md font-medium transition-all ${previewDevice === "desktop" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
            >
              Desktop
            </button>
            <button
              onClick={() => setPreviewDevice("mobile")}
              className={`px-2 py-1 rounded-md font-medium transition-all ${previewDevice === "mobile" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
            >
              Mobile
            </button>
          </div>
        </div>

        {/* Mock Application Container */}
        <div 
          className={`border border-border/30 rounded-2xl w-full h-[360px] overflow-hidden flex flex-col relative transition-all duration-300 ${themeState.isDark ? "dark" : ""} ${previewDevice === "mobile" ? "max-w-[260px] mx-auto" : ""}`}
          style={{
            backgroundColor: themeState.background,
            backgroundImage: themeState.bgType === "gradient" || themeState.bgType === "image" ? previewBg : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            fontFamily: getFontFamilyStyle(themeState.uiFont)
          }}
        >
          {/* Blur Overlay & Overlay Color */}
          {themeState.bgType === "image" && (
            <>
              <div 
                className="absolute inset-0 z-0 pointer-events-none transition-all duration-300" 
                style={{ 
                  backdropFilter: `blur(${themeState.bgImageBlur ?? 0}px)`,
                  opacity: themeState.bgImageOpacity ?? 1
                }} 
              />
              {themeState.bgImageOverlay && (
                <div 
                  className="absolute inset-0 z-0 pointer-events-none transition-all duration-300"
                  style={{ 
                    backgroundColor: themeState.bgImageOverlay, 
                    opacity: themeState.bgImageOverlayOpacity ?? 0 
                  }} 
                />
              )}
            </>
          )}

          {/* Inner Layout */}
          <div className="flex flex-1 h-full w-full relative z-10 text-[11px] overflow-hidden">
            
            {/* Desktop Sidebar Mockup */}
            {previewDevice === "desktop" && (
              <aside 
                className="w-32 border-r flex flex-col p-2.5 transition-all duration-300"
                style={{
                  backgroundColor: sidebarBg,
                  color: sidebarFg,
                  borderColor: `${sidebarBorder}40`
                }}
              >
                <div className="font-extrabold text-[12px] tracking-tight mb-4 flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: themeState.accent }} />
                  Visus
                </div>
                <nav className="flex-1 space-y-1">
                  <div 
                    className="p-1.5 rounded font-mono text-[8px] uppercase tracking-wider font-bold transition-all border-l-2" 
                    style={{ 
                      backgroundColor: `${sidebarActiveBg}15`, 
                      color: sidebarActiveBg,
                      borderLeftColor: sidebarActiveBg
                    }}
                  >
                    Library
                  </div>
                  <div className="p-1.5 opacity-60 font-mono text-[8px] uppercase tracking-wider">Reader</div>
                  <div className="p-1.5 opacity-60 font-mono text-[8px] uppercase tracking-wider">Stats</div>
                </nav>
                <div 
                  className="p-1.5 rounded text-center text-[8px] font-bold uppercase transition-all font-mono shadow-sm"
                  style={{
                    backgroundColor: themeState.accent,
                    color: themeState.accentForeground
                  }}
                >
                  Session
                </div>
              </aside>
            )}

            {/* Main Workspace Mockup */}
            <main className="flex-1 p-3.5 flex flex-col gap-2.5 overflow-y-auto">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-[13px] font-heading" style={{ color: themeState.foreground }}>Library</h4>
                {previewDevice === "mobile" && (
                  <div className="w-5 h-5 rounded-full" style={{ backgroundColor: themeState.accent }} />
                )}
              </div>

              {/* Mock Info Card */}
              <div 
                className="p-3 transition-all duration-300 relative"
                style={{
                  backgroundColor: glassBg,
                  backdropFilter: glassBlur,
                  border: glassBorder,
                  borderRadius: cardRadius,
                  boxShadow: getShadowStyle(themeState.cardShadow),
                  color: themeState.cardForeground
                }}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-bold">Interactive card component</div>
                  <span 
                    className="px-1.5 py-0.5 rounded text-[7px] font-bold font-mono uppercase border"
                    style={{
                      backgroundColor: themeState.muted,
                      color: themeState.mutedForeground,
                      borderColor: themeState.border
                    }}
                  >
                    Muted tag
                  </span>
                </div>
                <div className="text-[9px] mb-2" style={{ color: themeState.mutedForeground }}>
                  This panel adapts dynamically to border radii, glass blur, and shadow glow.
                </div>
                <div className="flex justify-between items-center mt-1">
                  <button 
                    className="px-2.5 py-1 rounded text-[8px] font-bold font-mono uppercase transition-all hover:opacity-90 active:scale-95 animate-none"
                    style={{
                      backgroundColor: themeState.accent,
                      color: themeState.accentForeground
                    }}
                  >
                    Action button
                  </button>
                  <span className="text-[7.5px] font-mono" style={{ color: themeState.mutedForeground }}>
                    Radius: {themeState.cardRadius || "12px"}
                  </span>
                </div>
              </div>

              {/* Mock Text Reader Panel */}
              <div 
                className="p-3 border rounded-xl flex flex-col gap-1 transition-all duration-300"
                style={{
                  backgroundColor: themeState.overrideReader ? themeState.readerBackground : themeState.background,
                  color: themeState.overrideReader ? themeState.readerForeground : themeState.foreground,
                  borderColor: themeState.overrideReader ? themeState.readerBorder : themeState.border
                }}
              >
                <div className="font-bold font-heading text-[10px] opacity-90 border-b pb-1 mb-1" style={{ borderColor: themeState.border }}>Reader contrast test</div>
                <p className="font-serif leading-relaxed text-[9px] text-justify">
                  The quick brown fox jumps over the lazy dog. A high-contrast font makes reading comfortable and reduces fatigue.
                </p>
              </div>
            </main>
          </div>

          {/* Mobile Navigation bar Mockup */}
          {previewDevice === "mobile" && (
            <nav 
              className="h-10 border-t flex justify-around items-center px-2 z-10 transition-all duration-300"
              style={{
                backgroundColor: sidebarBg,
                color: sidebarFg,
                borderColor: `${sidebarBorder}40`
              }}
            >
              <div className="font-bold text-[8px]" style={{ color: sidebarActiveBg }}>Library</div>
              <div className="opacity-60 text-[8px]">Reader</div>
              <div className="opacity-60 text-[8px]">Stats</div>
              <div className="opacity-60 text-[8px]">Settings</div>
            </nav>
          )}
        </div>
      </div>

      {/* Quick presets templates selector */}
      <div className="mt-4 pt-4 border-t border-border/20 space-y-2.5">
        <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Load preset templates</label>
        <div className="grid grid-cols-2 gap-1.5">
          {PRESETS_TEMPLATES.map((p, idx) => (
            <button
              key={idx}
              onClick={() => applyPresetTemplate(p)}
              className="px-2.5 py-1.5 border border-border/30 bg-card/50 hover:bg-accent/40 rounded-lg text-left text-[10px] font-semibold flex items-center justify-between transition-all"
            >
              <span>{p.name}</span>
              <div className="w-3.5 h-3.5 rounded-full border border-border/40 shrink-0" style={{ backgroundColor: p.background }} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
