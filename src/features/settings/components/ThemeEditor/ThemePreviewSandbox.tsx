import * as React from "react";
import { Eye, Plus, Minus, Settings2, BarChart2, Flame, Search } from "lucide-react";
import type { CustomTheme } from "@/core/entities/settings";
import { resolveColor, hexToRgba } from "@/lib/color-utils";
import { hexToRgb, PRESETS_TEMPLATES, scopeCss } from "./utils";
import { getFontFamilyStyle } from "@/lib/typography";
import { getBackgroundImageUrl } from "@/lib/services/image-storage";

interface ThemePreviewSandboxProps {
  themeState: CustomTheme;
  previewDevice: "desktop" | "mobile";
  setPreviewDevice: (device: "desktop" | "mobile") => void;
  applyPresetTemplate: (preset: typeof PRESETS_TEMPLATES[0]) => void;
  lastChangedKey?: string | null;
}

export function ThemePreviewSandbox({
  themeState,
  previewDevice,
  setPreviewDevice,
  applyPresetTemplate,
  lastChangedKey,
}: ThemePreviewSandboxProps) {
  const [activeLayout, setActiveLayout] = React.useState<"library" | "performance" | "settings">("library");
  const [selectedBook, setSelectedBook] = React.useState<number | null>(null);
  const [mockSync, setMockSync] = React.useState(false);
  const [streakActive, setStreakActive] = React.useState(true);
  const [showFontPopover, setShowFontPopover] = React.useState(false);
  const [resolvedBgUrl, setResolvedBgUrl] = React.useState<string | null>(null);

  // Resolve background image URL from IndexedDB
  React.useEffect(() => {
    let isActive = true;
    
    if (themeState.bgType === "image" && themeState.bgImageUrl) {
      if (themeState.bgImageUrl.startsWith("idb://")) {
        getBackgroundImageUrl(themeState.bgImageUrl).then(url => {
          if (isActive && url) setResolvedBgUrl(url);
        });
      } else {
        setResolvedBgUrl(themeState.bgImageUrl);
      }
    } else {
      setResolvedBgUrl(null);
    }
    
    return () => { isActive = false; };
  }, [themeState.bgType, themeState.bgImageUrl]);

  // Auto-switch based on what changed
  React.useEffect(() => {
    if (!lastChangedKey) return;

    // Sidebar overrides -> Switch to desktop
    if (lastChangedKey.startsWith("sidebar") || lastChangedKey === "overrideSidebar") {
      setPreviewDevice("desktop");
    }

    // Secondary/Popover -> Switch to settings to see them
    if (["popover", "popoverForeground", "secondary", "secondaryForeground", "input", "ring"].includes(lastChangedKey)) {
      setActiveLayout("settings");
    }
  }, [lastChangedKey, setPreviewDevice]);

  // Mock book catalog database
  const mockBooks = [
    { title: "Don Quixote", author: "Miguel de Cervantes", progress: 65, category: "Fiction", color: "#f59e0b" },
    { title: "One Hundred Years of Solitude", author: "G. García Márquez", progress: 20, category: "Classic", color: "#3b82f6" },
    { title: "Atomic Habits", author: "James Clear", progress: 90, category: "Self-help", color: "#10b981" },
  ];

  // Resolve styles for mock frames
  const previewBg = themeState.bgType === "gradient" 
    ? `linear-gradient(${themeState.bgGradientAngle ?? 135}deg, ${resolveColor(themeState.bgGradientStart || themeState.background)}, ${resolveColor(themeState.bgGradientEnd || themeState.background)})`
    : themeState.bgType === "image" && resolvedBgUrl
      ? `url(${resolvedBgUrl})`
      : resolveColor(themeState.background);

  const sidebarBg = resolveColor(themeState.overrideSidebar ? (themeState.sidebarBackground || themeState.cardBackground) : themeState.cardBackground);
  const sidebarFg = resolveColor(themeState.overrideSidebar ? (themeState.sidebarForeground || themeState.cardForeground) : themeState.cardForeground);
  const sidebarBorder = resolveColor(themeState.overrideSidebar ? (themeState.sidebarBorder || themeState.border) : themeState.border);
  const sidebarActiveBg = resolveColor(themeState.overrideSidebar ? (themeState.sidebarActiveBackground || themeState.accent) : themeState.accent);
  const sidebarActiveFg = resolveColor(themeState.overrideSidebar ? (themeState.sidebarActiveForeground || themeState.accentForeground) : themeState.accentForeground);

  const popoverBg = resolveColor(themeState.popover || themeState.cardBackground);
  const popoverFg = resolveColor(themeState.popoverForeground || themeState.cardForeground);
  const secondaryBg = resolveColor(themeState.secondary || (themeState.isDark ? "#1e293b" : "#f1f5f9"));
  const secondaryFg = resolveColor(themeState.secondaryForeground || themeState.foreground);
  const uiAccent = resolveColor(themeState.uiAccent || themeState.muted);
  const uiAccentFg = resolveColor(themeState.uiAccentForeground || themeState.accent);

  const cardRadius = themeState.cardRadius || "12px";

  const getShadowStyle = (shadow: string | undefined) => {
    if (shadow === "glow") {
      if (themeState.glowSettings && themeState.glowSettings.enabled) {
        const brightness = themeState.glowSettings.brightness ?? 0.15;
        const opacity = Math.min(1, brightness * 3);
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
      case "retro": return `4px 4px 0px ${resolveColor(themeState.cardBorder || themeState.border)}`;
      default: return "none";
    }
  };

  const glassBg = themeState.glassmorphism?.enabled 
    ? `rgba(${hexToRgb(themeState.cardBackground)}, ${themeState.glassmorphism.opacity})` 
    : themeState.cardBackground;
  const glassBlur = themeState.glassmorphism?.enabled ? `blur(${themeState.glassmorphism.blur}px)` : "none";
  const glassBorder = themeState.glassmorphism?.enabled 
    ? `1px solid rgba(${hexToRgb(themeState.cardBorder || themeState.border)}, ${themeState.glassmorphism.borderOpacity})` 
    : `1px solid ${resolveColor(themeState.cardBorder || themeState.border)}`;

  const getPulseClass = (keys: string[]) => {
    return lastChangedKey && keys.includes(lastChangedKey) ? "ring-1 ring-primary/20 rounded-sm z-50 transition-all duration-300" : "";
  };

  // Content Layout switcher
  const renderLibrary = () => {
    const isDesktop = previewDevice === "desktop";
    return (
      <div className="flex flex-col flex-1 overflow-hidden gap-2">
        {/* Search Input Mock */}
        <div className={`relative shrink-0 ${getPulseClass(["input", "ring"])}`}>
          <Search className="w-3.5 h-3.5 absolute left-2 top-2 opacity-50" style={{ color: themeState.foreground }} />
          <input 
            type="text" 
            placeholder="Search books..." 
            className="w-full pl-7 pr-3 py-1.5 border text-[9px] focus:outline-none transition-all"
            style={{
              backgroundColor: themeState.input || glassBg,
              borderColor: themeState.border,
              color: themeState.foreground,
              borderRadius: `calc(${cardRadius} * 0.8)`,
              boxShadow: `0 0 0 1px ${resolveColor(themeState.ring || themeState.accent)}20`
            }}
            disabled
          />
        </div>

        {/* Books catalog grid */}
        <div 
          className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 scrollbar-none"
          style={{ maxHeight: isDesktop ? "none" : "290px" }}
        >
          {mockBooks.map((book, idx) => {
            const isSelected = selectedBook === idx;
            const isPulse = lastChangedKey && ["cardBackground", "cardForeground", "cardBorder", "cardRadius", "cardShadow", "glassmorphism", "glowSettings", "accent"].includes(lastChangedKey);
            
            return (
              <div
                key={idx}
                onClick={() => setSelectedBook(isSelected ? null : idx)}
                className={`p-2 border cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col gap-0.5 relative ${isPulse ? "ring-1 ring-primary/20 shadow-sm" : ""}`}
                style={{
                  backgroundColor: glassBg,
                  backdropFilter: glassBlur,
                  border: isSelected ? `1.5px solid ${resolveColor(themeState.ring || themeState.accent)}` : glassBorder,
                  boxShadow: isSelected ? `0 0 10px ${hexToRgba(themeState.ring || themeState.accent, 0.4)}` : getShadowStyle(themeState.cardShadow),
                  color: themeState.cardForeground,
                  borderRadius: cardRadius
                }}
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-[10px] truncate max-w-[110px]">{book.title}</span>
                  <span 
                    className={`px-1 py-0.5 rounded text-[6px] font-bold font-mono uppercase ${getPulseClass(["uiAccent", "uiAccentForeground"])}`}
                    style={{
                      backgroundColor: themeState.uiAccent || `${book.color}15`,
                      color: themeState.uiAccentForeground || book.color
                    }}
                  >
                    {book.category}
                  </span>
                </div>
                <span className={`text-[7px] opacity-70 ${getPulseClass(["mutedForeground"])}`} style={{ color: themeState.mutedForeground }}>By {book.author}</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-0.75 rounded-full overflow-hidden" style={{ backgroundColor: `${themeState.accent}20` }}>
                    <div className="h-full rounded-full" style={{ backgroundColor: themeState.accent, width: `${book.progress}%` }} />
                  </div>
                  <span className="text-[6.5px] font-mono font-bold">{book.progress}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderPerformance = () => {
    const isDesktop = previewDevice === "desktop";
    return (
      <div className="flex flex-col flex-1 overflow-hidden gap-2">
        {/* Stats header card */}
        <div className="grid grid-cols-2 gap-2 shrink-0">
          <div 
            className="p-2 border flex flex-col gap-0.5"
            style={{
              backgroundColor: glassBg,
              backdropFilter: glassBlur,
              border: glassBorder,
              boxShadow: getShadowStyle(themeState.cardShadow),
              borderRadius: cardRadius,
              color: themeState.cardForeground
            }}
          >
            <span className="text-[7.5px] text-muted-foreground uppercase font-mono" style={{ color: themeState.mutedForeground }}>Daily progress</span>
            <span className="text-[10px] font-bold">45 / 50 min</span>
          </div>
          
          <div 
            onClick={() => setStreakActive(!streakActive)}
            className="p-2 border items-center gap-2 cursor-pointer transition-all duration-300 select-none hidden sm:flex"
            style={{ 
              backgroundColor: glassBg, 
              backdropFilter: glassBlur,
              border: streakActive ? `1px solid ${resolveColor(themeState.ring || themeState.accent)}` : glassBorder,
              boxShadow: streakActive ? `0 0 10px ${hexToRgba(themeState.ring || themeState.accent, 0.15)}` : getShadowStyle(themeState.cardShadow),
              borderRadius: cardRadius,
              color: themeState.cardForeground
            }}
          >
            <Flame className={`w-5 h-5 transition-all duration-300 ${streakActive ? "text-orange-500 animate-pulse" : "text-muted-foreground opacity-35"}`} style={{ color: streakActive ? undefined : themeState.mutedForeground }} />
            <div className="flex flex-col gap-0.5">
              <span className="text-[7.5px] text-muted-foreground uppercase font-mono" style={{ color: themeState.mutedForeground }}>Streak days</span>
              <span className="text-[10px] font-bold">{streakActive ? "12 days" : "0 days"}</span>
            </div>
          </div>
        </div>

        {/* CSS weekly activity chart */}
        <div 
          className="p-3 border flex flex-col gap-2 flex-1 min-h-[140px]"
          style={{
            backgroundColor: glassBg,
            backdropFilter: glassBlur,
            border: glassBorder,
            boxShadow: getShadowStyle(themeState.cardShadow),
            borderRadius: cardRadius,
            color: themeState.cardForeground,
            maxHeight: isDesktop ? "none" : "180px"
          }}
        >
          <div className="flex justify-between items-center text-[7.5px] font-mono text-muted-foreground shrink-0 border-b pb-1.5" style={{ borderColor: themeState.border }}>
            <span className="font-bold uppercase flex items-center gap-1"><BarChart2 className="w-3 h-3" style={{ color: themeState.accent }} /> Weekly read time</span>
            <span style={{ color: themeState.mutedForeground }}>Total: 4.8 hr</span>
          </div>

          <div className="flex-1 flex items-end justify-between gap-1 px-1 h-[80px] mt-2">
            {[
              { day: "M", val: 30 },
              { day: "T", val: 55 },
              { day: "W", val: 80 },
              { day: "T", val: 40 },
              { day: "F", val: 65 },
              { day: "S", val: 90 },
              { day: "S", val: 25 }
            ].map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                <div className={`w-full rounded-t-sm relative flex items-end overflow-hidden ${getPulseClass(["uiAccent"])}`} style={{ height: "65px", backgroundColor: themeState.uiAccent || themeState.muted || "rgba(0,0,0,0.05)" }}>
                  <div 
                    className={`w-full rounded-t-sm transition-all duration-500 ${getPulseClass(["accent"])}`} 
                    style={{ 
                      backgroundColor: themeState.accent, 
                      height: `${item.val}%` 
                    }} 
                  />
                </div>
                <span className="text-[7px] font-mono font-bold" style={{ color: themeState.mutedForeground }}>{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSettings = () => {
    const isDesktop = previewDevice === "desktop";
    return (
      <div className="flex flex-col flex-1 overflow-hidden gap-2">
        <div 
          className="p-3 border flex flex-col gap-3 flex-1 overflow-y-auto"
          style={{
            backgroundColor: glassBg,
            backdropFilter: glassBlur,
            border: glassBorder,
            boxShadow: getShadowStyle(themeState.cardShadow),
            borderRadius: cardRadius,
            color: themeState.cardForeground,
            maxHeight: isDesktop ? "none" : "300px"
          }}
        >
          <div className="text-[7.5px] font-mono uppercase text-muted-foreground border-b pb-1" style={{ borderColor: themeState.border, color: themeState.mutedForeground }}>
            App preferences
          </div>

          {/* Auto sync toggle */}
          <div className={`flex items-center justify-between select-none ${getPulseClass(["accent", "accentForeground", "muted", "border"])}`}>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold" style={{ color: themeState.cardForeground }}>Auto-sync</span>
              <span className="text-[7px] text-muted-foreground leading-tight" style={{ color: themeState.mutedForeground }}>Sync readings in background</span>
            </div>
            <button
              onClick={() => setMockSync(!mockSync)}
              className="w-7 h-4 rounded-full p-0.5 transition-all duration-300 relative border"
              style={{
                backgroundColor: mockSync ? themeState.accent : (themeState.muted || "transparent"),
                borderColor: mockSync ? themeState.accent : themeState.border
              }}
            >
              <div 
                className="w-2.5 h-2.5 rounded-full shadow-sm transition-all duration-300"
                style={{
                  backgroundColor: mockSync ? themeState.accentForeground : (themeState.mutedForeground || themeState.border),
                  transform: mockSync ? "translateX(12px)" : "translateX(0px)"
                }}
              />
            </button>
          </div>

          {/* Font selection mockup dropdown */}
          <div className={`flex flex-col gap-1 mt-1 relative ${getPulseClass(["popover", "popoverForeground", "input"])}`}>
            <span className="text-[8px] font-bold" style={{ color: themeState.cardForeground }}>Interface font</span>
            <div 
              onClick={() => setShowFontPopover(!showFontPopover)}
              className="p-1.5 border rounded-lg text-[8px] font-mono flex justify-between items-center bg-card/40 cursor-pointer select-none"
              style={{ 
                borderColor: themeState.border, 
                color: themeState.cardForeground,
                backgroundColor: themeState.input || "rgba(0,0,0,0.02)"
              }}
            >
              <span>
                {themeState.uiFont === "inter" ? "Inter (default)" :
                 themeState.uiFont === "outfit" ? "Outfit (heading)" :
                 themeState.uiFont === "roboto" ? "Hanken Grotesk" :
                 themeState.uiFont === "system-ui" ? "System UI" : "Default"}
              </span>
              <Settings2 className="w-2.5 h-2.5 opacity-60" style={{ color: themeState.accent }} />
            </div>

            {/* Mock Popover menu */}
            {showFontPopover && (
              <div 
                className="absolute right-0 bottom-8 z-30 w-36 p-1 border rounded-lg shadow-lg flex flex-col gap-0.5 animate-scale-up"
                style={{
                  backgroundColor: popoverBg,
                  color: popoverFg,
                  borderColor: themeState.border
                }}
              >
                <div className="px-2 py-1 text-[7px] font-mono uppercase opacity-55 border-b pb-1 mb-1" style={{ borderColor: themeState.border }}>Select font</div>
                {["Inter", "Outfit", "Hanken Grotesk", "System UI"].map((font) => (
                  <div 
                    key={font}
                    onClick={() => setShowFontPopover(false)}
                    className="px-2 py-1 text-[8px] rounded hover:bg-accent/15 cursor-pointer font-sans"
                    style={{ color: popoverFg }}
                  >
                    {font}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderLayoutContent = () => {
    switch (activeLayout) {
      case "library": return renderLibrary();
      case "performance": return renderPerformance();
      case "settings": return renderSettings();
      default: return null;
    }
  };

  return (
    <section className="bg-accent/10 md:border-r border-border/20 p-4 md:p-5 flex flex-col justify-between overflow-y-auto h-full">
      <div className="space-y-4 flex flex-col h-full overflow-hidden">
        {/* Sandbox header navigation toggle */}
        <div className="flex justify-between items-center shrink-0">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 select-none">
            <Eye className="w-3.5 h-3.5 text-primary" /> Live preview
          </span>
          
          <div className="flex bg-card border border-border/30 rounded-lg p-0.5 text-[9px] select-none">
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

        {/* View Switcher Tabs inside Mockup Device */}
        <div className="flex bg-card/60 border border-border/30 rounded-lg p-0.5 text-[9px] font-mono uppercase tracking-wider shrink-0 select-none">
          {[
            { id: "library", label: "Library" },
            { id: "performance", label: "Stats" },
            { id: "settings", label: "Prefs" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveLayout(tab.id as any);
              }}
              className={`flex-1 py-1 rounded text-center transition-all ${
                activeLayout === tab.id 
                  ? "bg-primary text-primary-foreground font-bold shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mock Application Container Viewport - CENTERED VERTICALLY AND HORIZONTALLY */}
        <div className="flex-1 flex items-center justify-center p-2 md:p-3 overflow-hidden bg-accent/5 rounded-2xl border border-border/20">
          <div className="scale-[0.85] sm:scale-100 transition-all duration-300 w-full h-full flex items-center justify-center">
          {previewDevice === "desktop" ? (
            /* Desktop Mockup Screen */
            <div 
              data-glass={themeState.glassmorphism?.enabled ? "enabled" : "disabled"}
              className={`preview-sandbox-root border border-border/30 rounded-2xl w-[320px] md:w-full h-[380px] md:h-full md:max-h-[580px] overflow-hidden flex flex-col relative transition-all duration-300 shadow-xl ${themeState.isDark ? "dark" : ""}`}
              style={{
                backgroundColor: resolveColor(themeState.background),
                fontFamily: getFontFamilyStyle(themeState.uiFont),
                // Inject CSS Variables for Tailwind classes and custom CSS overrides
                "--background": resolveColor(themeState.background),
                "--foreground": resolveColor(themeState.foreground),
                "--border": resolveColor(themeState.border),
                "--card": resolveColor(themeState.cardBackground),
                "--card-foreground": resolveColor(themeState.cardForeground),
                "--primary": resolveColor(themeState.accent),
                "--primary-foreground": resolveColor(themeState.accentForeground),
                "--secondary": secondaryBg,
                "--secondary-foreground": secondaryFg,
                "--muted": resolveColor(themeState.muted),
                "--muted-foreground": resolveColor(themeState.mutedForeground),
                "--accent": resolveColor(themeState.uiAccent || themeState.muted),
                "--accent-foreground": resolveColor(themeState.uiAccentForeground || themeState.accent),
                "--input": resolveColor(themeState.input || themeState.border),
                "--ring": resolveColor(themeState.ring || themeState.accent),
                "--radius": cardRadius,
                "--card-shadow": getShadowStyle(themeState.cardShadow),
              } as React.CSSProperties}
            >
              {/* Custom CSS style tag scoped inside this mockup screen */}
              {themeState.customCss && (
                <style dangerouslySetInnerHTML={{ __html: scopeCss(themeState.customCss, ".preview-sandbox-root") }} />
              )}

              {/* Top Navbar mockup showing secondary color */}
              <div 
                className={`h-10 px-4 flex items-center justify-between z-20 relative border-b transition-all ${getPulseClass(["secondary", "secondaryForeground"])}`}
                style={{
                  backgroundColor: secondaryBg,
                  color: secondaryFg,
                  borderColor: `${themeState.border}20`
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[10px]">VISUS</span>
                  <div className="flex gap-2 opacity-70">
                    <span className="text-[8px]">Guides</span>
                    <span className="text-[8px]">GitHub</span>
                  </div>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-foreground/10 text-[8px] font-bold">Launch App</div>
              </div>

              {/* Background layers */}
              {(themeState.bgType === "gradient" || themeState.bgType === "image") && (
                <div 
                  className={`absolute inset-0 z-0 pointer-events-none transition-all duration-300 ${getPulseClass(["bgType", "bgGradientStart", "bgGradientEnd", "bgImageUrl", "bgImageBlur", "bgImageOpacity"])}`}
                  style={{
                    backgroundImage: previewBg,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: themeState.bgType === "gradient" ? 1 : (themeState.bgImageOpacity ?? 1),
                    filter: themeState.bgType === "image" ? `blur(${themeState.bgImageBlur ?? 0}px)` : "none"
                  }}
                />
              )}
              {themeState.bgType === "image" && themeState.bgImageOverlay && (
                <div 
                  className="absolute inset-0 z-1 pointer-events-none transition-all duration-300"
                  style={{ 
                    backgroundColor: resolveColor(themeState.bgImageOverlay), 
                    opacity: themeState.bgImageOverlayOpacity ?? 0 
                  }} 
                />
              )}

              {/* Inner layouts */}
              <div className="flex flex-1 h-full w-full relative z-10 text-[11px] overflow-hidden">
                {/* Desktop mock sidebar */}
                <aside 
                className={`w-24 md:w-32 border-r flex flex-col p-2.5 transition-all duration-300 shrink-0 select-none ${themeState.glassmorphism?.enabled && themeState.sidebarLiquidGlass ? 'liquid-glass' : ''} ${getPulseClass(["sidebarBackground", "sidebarForeground", "sidebarBorder", "overrideSidebar"])}`}
                style={{
                  backgroundColor: themeState.glassmorphism?.enabled && themeState.sidebarLiquidGlass ? glassBg : sidebarBg,
                  backdropFilter: themeState.glassmorphism?.enabled && themeState.sidebarLiquidGlass ? glassBlur : 'none',
                  borderColor: `${sidebarBorder}40`
                }}
                >
                  <nav className="flex-1 space-y-1">
                    {[
                      { id: "library", label: "Library" },
                      { id: "performance", label: "Stats" },
                      { id: "settings", label: "Prefs" }
                    ].map((item) => {
                      const isActive = activeLayout === item.id;
                      const isPulse = lastChangedKey && isActive && ["sidebarActiveBackground", "sidebarActiveForeground", "accent"].includes(lastChangedKey);

                      return (
                        <div 
                          key={item.id}
                          onClick={() => {
                            setActiveLayout(item.id as any);
                          }}
                          className={`p-1.5 rounded cursor-pointer font-mono text-[7px] md:text-[8px] uppercase tracking-wider font-bold transition-all border-l-2 ${
                            isActive ? "border-l-primary" : "border-l-transparent opacity-60 hover:opacity-100"
                          } ${isPulse ? "ring-1 ring-primary/20" : ""}`}
                          style={{ 
                            backgroundColor: isActive ? `${sidebarActiveBg}15` : "transparent", 
                            color: isActive ? sidebarActiveBg : sidebarFg,
                            borderLeftColor: isActive ? sidebarActiveBg : "transparent"
                          }}
                        >
                          {item.label}
                        </div>
                      );
                    })}
                  </nav>

                  <div 
                    className={`p-1.5 rounded text-center text-[7.5px] font-bold uppercase transition-all font-mono shadow-sm ${getPulseClass(["accent", "accentForeground"])}`}
                    style={{
                      backgroundColor: themeState.accent,
                      color: themeState.accentForeground
                    }}
                  >
                    Session
                  </div>
                </aside>

                {/* Content window */}
                <main className="flex-1 p-3 md:p-3.5 flex flex-col gap-2.5 overflow-hidden">
                  <div className="flex justify-between items-center shrink-0">
                    <h4 className={`font-bold text-[10px] md:text-[12px] font-heading uppercase tracking-wide ${getPulseClass(["foreground"])}`} style={{ color: themeState.foreground }}>
                      {activeLayout}
                    </h4>
                  </div>
                  <div className="flex-1 flex flex-col overflow-hidden">
                    {renderLayoutContent()}
                  </div>
                </main>
              </div>
            </div>
          ) : (
            /* Mobile Mockup Screen - Centered and Enlarged */
            <div 
              data-glass={themeState.glassmorphism?.enabled ? "enabled" : "disabled"}
              className={`preview-sandbox-root border border-border/30 rounded-[2.2rem] w-[260px] md:w-[280px] h-[480px] md:h-[520px] overflow-hidden flex flex-col relative transition-all duration-300 shadow-2xl ${themeState.isDark ? "dark" : ""}`}
              style={{
                backgroundColor: resolveColor(themeState.background),
                fontFamily: getFontFamilyStyle(themeState.uiFont),
                // Inject CSS Variables for Tailwind classes and custom CSS overrides
                "--background": resolveColor(themeState.background),
                "--foreground": resolveColor(themeState.foreground),
                "--border": resolveColor(themeState.border),
                "--card": resolveColor(themeState.cardBackground),
                "--card-foreground": resolveColor(themeState.cardForeground),
                "--primary": resolveColor(themeState.accent),
                "--primary-foreground": resolveColor(themeState.accentForeground),
                "--secondary": secondaryBg,
                "--secondary-foreground": secondaryFg,
                "--muted": resolveColor(themeState.muted),
                "--muted-foreground": resolveColor(themeState.mutedForeground),
                "--accent": resolveColor(themeState.uiAccent || themeState.muted),
                "--accent-foreground": resolveColor(themeState.uiAccentForeground || themeState.accent),
                "--input": resolveColor(themeState.input || themeState.border),
                "--ring": resolveColor(themeState.ring || themeState.accent),
                "--radius": cardRadius,
                "--card-shadow": getShadowStyle(themeState.cardShadow),
              } as React.CSSProperties}
            >
              {/* Custom CSS style tag scoped inside this mockup screen */}
              {themeState.customCss && (
                <style dangerouslySetInnerHTML={{ __html: scopeCss(themeState.customCss, ".preview-sandbox-root") }} />
              )}

              {/* Phone status bar */}
              <div 
                className={`h-6 px-5 pt-2 flex justify-between items-center text-[8px] font-mono z-25 relative select-none border-b transition-all ${getPulseClass(["secondary", "secondaryForeground"])}`}
                style={{
                  backgroundColor: secondaryBg,
                  color: secondaryFg,
                  borderColor: `${themeState.border}20`
                }}
              >
                <span>18:15</span>
                <div className="flex items-center gap-1">
                  <span>5G</span>
                  <div className="w-3.5 h-1.5 border border-foreground/60 rounded-xs p-px flex items-center"><div className="w-full h-full bg-foreground/60 rounded-[1px]" /></div>
                </div>
              </div>

              {/* Background layers */}
              {(themeState.bgType === "gradient" || themeState.bgType === "image") && (
                <div 
                  className="absolute inset-0 z-0 pointer-events-none transition-all duration-300"
                  style={{
                    backgroundImage: previewBg,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: themeState.bgType === "gradient" ? 1 : (themeState.bgImageOpacity ?? 1),
                    filter: themeState.bgType === "image" ? `blur(${themeState.bgImageBlur ?? 0}px)` : "none"
                  }}
                />
              )}
              {themeState.bgType === "image" && themeState.bgImageOverlay && (
                <div 
                  className="absolute inset-0 z-1 pointer-events-none transition-all duration-300"
                  style={{ 
                    backgroundColor: resolveColor(themeState.bgImageOverlay), 
                    opacity: themeState.bgImageOverlayOpacity ?? 0 
                  }} 
                />
              )}

              {/* Mobile Main Contents */}
              <main className="flex-1 p-4 flex flex-col gap-2.5 overflow-hidden relative z-10">
                <div className="flex justify-between items-center shrink-0">
                  <h4 className="font-bold text-[12px] font-heading uppercase tracking-wide" style={{ color: themeState.foreground }}>
                    {activeLayout}
                  </h4>
                  <div className="w-4.5 h-4.5 rounded-full" style={{ backgroundColor: themeState.accent }} />
                </div>
                <div className="flex-1 flex flex-col overflow-hidden">
                  {renderLayoutContent()}
                </div>
              </main>

              {/* Mobile bottom navigation bar mockup */}
              <nav 
                className={`h-12 border-t flex justify-around items-center px-2 pb-1 z-10 transition-all duration-300 shrink-0 select-none ${getPulseClass(["sidebarBackground", "sidebarForeground", "sidebarBorder", "overrideSidebar"])}`}
                style={{
                  backgroundColor: sidebarBg,
                  color: sidebarFg,
                  borderColor: `${sidebarBorder}40`
                }}
              >
                {[
                  { id: "library", label: "Library" },
                  { id: "performance", label: "Stats" },
                  { id: "settings", label: "Prefs" }
                ].map((item) => {
                  const isActive = activeLayout === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveLayout(item.id as any);
                      }}
                      className="flex flex-col items-center justify-center transition-all py-1 px-2 rounded-lg"
                      style={{ 
                        color: isActive ? themeState.accent : sidebarFg,
                        opacity: isActive ? 1 : 0.55
                      }}
                    >
                      <div 
                        className="p-1 px-3 rounded-full transition-all flex items-center justify-center"
                        style={{
                          backgroundColor: isActive ? `${themeState.accent}15` : "transparent"
                        }}
                      >
                        <span className="text-[7.5px] font-bold font-mono uppercase tracking-wider">{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Preset template Quick selector footer inside sidebar */}
      <div className="mt-4 pt-4 border-t border-border/20 space-y-2 shrink-0 select-none">
        <label className="block text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Load preset templates</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 gap-1.5 max-h-[100px] md:max-h-none overflow-y-auto pr-1 scrollbar-thin">
          {PRESETS_TEMPLATES.map((p, idx) => (
            <button
              key={idx}
              onClick={() => applyPresetTemplate(p)}
              className="px-2.5 py-1.5 border border-border/30 bg-card/50 hover:bg-accent/40 rounded-xl text-left text-[9px] font-bold flex items-center justify-between transition-all"
            >
              <span className="truncate mr-1">{p.name}</span>
              <div className="w-3 h-3 rounded-full border border-border/40 shrink-0" style={{ backgroundColor: p.background }} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
