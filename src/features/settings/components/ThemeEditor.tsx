"use client";

import * as React from "react";
import { 
  X, Palette, Eye, Layout, Type, ShieldAlert, 
  Sparkles, RefreshCw, Upload, Download, Copy, Check, Trash2 
} from "lucide-react";
import type { CustomTheme } from "@/core/entities/settings";
import { COLOR_PRESETS, resolveColor } from "@/lib/color-utils";
import { FancyDropdown } from "@/components/ui/FancyDropdown";

interface ThemeEditorProps {
  themeToEdit?: CustomTheme | null;
  onSave: (theme: CustomTheme) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

const DEFAULT_NEW_THEME = (id: string): CustomTheme => ({
  id,
  name: "My Custom Theme",
  isDark: false,
  background: "#f3f4f6",
  foreground: "#1f2937",
  border: "#e5e7eb",
  cardBackground: "#ffffff",
  cardForeground: "#1f2937",
  cardBorder: "#e5e7eb",
  cardRadius: "12px",
  cardShadow: "sm",
  accent: "#8b5cf6",
  accentForeground: "#ffffff",
  muted: "#f9fafb",
  mutedForeground: "#6b7280",
  overrideSidebar: false,
  overrideReader: false,
  bgType: "solid",
  glassmorphism: {
    enabled: false,
    blur: 12,
    opacity: 0.45,
    borderOpacity: 0.1
  }
});

const getFontFamilyStyle = (font?: string) => {
  switch (font) {
    case "inter": return "var(--font-sans), sans-serif";
    case "outfit": return "var(--font-heading), sans-serif";
    case "roboto": return "'Hanken Grotesk', sans-serif";
    case "system-ui": return "system-ui, -apple-system, sans-serif";
    default: return "inherit";
  }
};

const PRESETS_TEMPLATES = [
  {
    name: "Light Minimal",
    isDark: false,
    background: "#f1f3f6",
    foreground: "#111827",
    border: "#e5e7eb",
    cardBackground: "#ffffff",
    cardForeground: "#111827",
    accent: "#6366f1",
    accentForeground: "#ffffff",
    muted: "#f9fafb",
    mutedForeground: "#6b7280",
    cardRadius: "12px",
    cardShadow: "sm"
  },
  {
    name: "Dark Violet",
    isDark: true,
    background: "#0b1326",
    foreground: "#dae2fd",
    border: "#464554",
    cardBackground: "#171f33",
    cardForeground: "#dae2fd",
    accent: "#c0c1ff",
    accentForeground: "#0b1326",
    muted: "#222a3d",
    mutedForeground: "#c7c4d7",
    cardRadius: "12px",
    cardShadow: "glow"
  },
  {
    name: "Nord Arctic",
    isDark: true,
    background: "#2e3440",
    foreground: "#d8dee9",
    border: "#4c566a",
    cardBackground: "#3b4252",
    cardForeground: "#d8dee9",
    accent: "#88c0d0",
    accentForeground: "#2e3440",
    muted: "#434c5e",
    mutedForeground: "#e5e9f0",
    cardRadius: "8px",
    cardShadow: "none"
  },
  {
    name: "Warm Sepia",
    isDark: false,
    background: "#f4ecd8",
    foreground: "#5b4636",
    border: "#e4dcd3",
    cardBackground: "#faf6eb",
    cardForeground: "#5b4636",
    accent: "#b45309",
    accentForeground: "#ffffff",
    muted: "#eae1cb",
    mutedForeground: "#785f4c",
    cardRadius: "16px",
    cardShadow: "md"
  }
];

export function ThemeEditor({ themeToEdit, onSave, onDelete, onClose }: ThemeEditorProps) {
  const [activeTab, setActiveTab] = React.useState<"colors" | "components" | "background" | "advanced">("colors");
  const [themeState, setThemeState] = React.useState<CustomTheme>(() => {
    if (themeToEdit) return { ...themeToEdit };
    const randId = `theme-custom-${Date.now()}`;
    return DEFAULT_NEW_THEME(randId);
  });
  
  const [previewDevice, setPreviewDevice] = React.useState<"desktop" | "mobile">("desktop");
  const [imageError, setImageError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [importJson, setImportJson] = React.useState("");
  const [importError, setImportError] = React.useState<string | null>(null);

  // Resize and compress image helper
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setImageError("Image size too large (max 8MB file size allowed before compression)");
      return;
    }

    setImageError(null);
    try {
      const base64Str = await compressImage(file);
      setThemeState(prev => ({
        ...prev,
        bgType: "image",
        bgImageUrl: base64Str
      }));
    } catch (err) {
      setImageError("Failed to compress and load background image.");
    }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }

          // Max dimensions: 800px width/height
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Quality 0.7 JPEG gives great results with minimal size
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = event.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const applyPresetTemplate = (preset: typeof PRESETS_TEMPLATES[0]) => {
    setThemeState(prev => ({
      ...prev,
      isDark: preset.isDark,
      background: preset.background,
      foreground: preset.foreground,
      border: preset.border,
      cardBackground: preset.cardBackground,
      cardForeground: preset.cardForeground,
      accent: preset.accent,
      accentForeground: preset.accentForeground,
      muted: preset.muted,
      mutedForeground: preset.mutedForeground,
      cardRadius: preset.cardRadius,
      cardShadow: preset.cardShadow,
      overrideSidebar: false,
      overrideReader: false,
      bgType: "solid"
    }));
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(themeState, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportFile = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(themeState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${themeState.name.toLowerCase().replace(/\s+/g, "_")}_theme.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = () => {
    try {
      setImportError(null);
      const parsed = JSON.parse(importJson);
      if (!parsed.name || !parsed.background || !parsed.foreground) {
        setImportError("Invalid theme JSON. Required fields name, background, foreground are missing.");
        return;
      }
      // Keep existing theme ID unless it is missing
      const importedTheme: CustomTheme = {
        ...DEFAULT_NEW_THEME(themeState.id),
        ...parsed,
        id: themeState.id // keep current ID to save over
      };
      setThemeState(importedTheme);
      setImportJson("");
    } catch (err) {
      setImportError("Invalid JSON structure. Please check the syntax.");
    }
  };

  // Build values for sandbox render
  const previewBg = themeState.bgType === "gradient" 
    ? `linear-gradient(${themeState.bgGradientAngle ?? 135}deg, ${themeState.bgGradientStart ?? "#ffffff"}, ${themeState.bgGradientEnd ?? "#eaeaea"})`
    : themeState.bgType === "image" && themeState.bgImageUrl
      ? `url(${themeState.bgImageUrl})`
      : themeState.background;

  const sidebarBg = themeState.overrideSidebar ? (themeState.sidebarBackground || themeState.cardBackground) : themeState.cardBackground;
  const sidebarFg = themeState.overrideSidebar ? (themeState.sidebarForeground || themeState.cardForeground) : themeState.cardForeground;
  const sidebarBorder = themeState.overrideSidebar ? (themeState.sidebarBorder || themeState.border) : themeState.border;
  const sidebarActiveBg = themeState.overrideSidebar ? (themeState.sidebarActiveBackground || themeState.accent) : themeState.accent;
  const sidebarActiveFg = themeState.overrideSidebar ? (themeState.sidebarActiveForeground || themeState.accentForeground) : themeState.accentForeground;

  const cardRadius = themeState.cardRadius || "12px";
  const getShadowStyle = (shadow: string | undefined) => {
    switch (shadow) {
      case "none": return "none";
      case "sm": return "0 1px 2px rgba(0,0,0,0.05)";
      case "md": return "0 4px 6px rgba(0,0,0,0.08)";
      case "lg": return "0 10px 15px rgba(0,0,0,0.1)";
      case "glow": return `0 0 12px ${themeState.accent}40`;
      case "retro": return `4px 4px 0px ${themeState.border}`;
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

  function hexToRgb(hex: string): string {
    const resolved = resolveColor(hex);
    let cleaned = resolved.replace("#", "").trim();
    if (cleaned.length === 3) {
      cleaned = cleaned[0] + cleaned[0] + cleaned[1] + cleaned[1] + cleaned[2] + cleaned[2];
    }
    const r = parseInt(cleaned.substring(0, 2), 16);
    const g = parseInt(cleaned.substring(2, 4), 16);
    const b = parseInt(cleaned.substring(4, 6), 16);
    return isNaN(r) ? "255, 255, 255" : `${r}, ${g}, ${b}`;
  }

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-[100] flex flex-col font-sans animate-fade-in">
      {/* Editor Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-border/40 bg-card/60 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Palette className="h-5 w-5" />
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <h2 className="text-base font-extrabold font-heading text-foreground">Theme Designer</h2>
            <input
              type="text"
              value={themeState.name}
              onChange={(e) => setThemeState(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Theme name..."
              className="bg-accent/40 border border-border/30 focus:border-primary/50 focus:outline-none rounded-lg px-2.5 py-1 text-xs font-bold font-heading text-foreground"
            />
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-accent/30 rounded-lg text-muted-foreground hover:text-foreground transition-all"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      {/* Editor Main Content Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Left Column: Dynamic App Preview Sandbox (5 cols) */}
        <section className="lg:col-span-5 bg-accent/10 border-r border-border/20 p-6 flex flex-col justify-between overflow-y-auto min-h-[400px]">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-primary" /> Live Preview sandbox
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

                  {/* Mock Info Card (decoupled properties test) */}
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
                      <div className="font-bold">Interactive Card Component</div>
                      <span 
                        className="px-1.5 py-0.5 rounded text-[7px] font-bold font-mono uppercase border"
                        style={{
                          backgroundColor: themeState.muted,
                          color: themeState.mutedForeground,
                          borderColor: themeState.border
                        }}
                      >
                        Muted Tag
                      </span>
                    </div>
                    <div className="text-[9px] mb-2" style={{ color: themeState.mutedForeground }}>
                      This panel adapts dynamically to border radii, glass blur, and shadow glow.
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <button 
                        className="px-2.5 py-1 rounded text-[8px] font-bold font-mono uppercase transition-all hover:opacity-90 active:scale-95"
                        style={{
                          backgroundColor: themeState.accent,
                          color: themeState.accentForeground
                        }}
                      >
                        Action Button
                      </button>
                      <span className="text-[7.5px] font-mono" style={{ color: themeState.mutedForeground }}>
                        Radius: {themeState.cardRadius || "12px"}
                      </span>
                    </div>
                  </div>

                  {/* Mock Text Reader Panel (contrast test) */}
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

        {/* Right Column: Custom Styling Dashboard (7 cols) */}
        <section className="lg:col-span-7 flex flex-col h-full overflow-hidden bg-card">
          
          {/* Tab Navigation */}
          <nav className="flex border-b border-border/30 bg-accent/15">
            {[
              { id: "colors", label: "Colors & Typography", icon: Palette },
              { id: "components", label: "Decoupled sections", icon: Layout },
              { id: "background", label: "Backgrounds & Effects", icon: Sparkles },
              { id: "advanced", label: "JSON & Custom CSS", icon: Type }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-[10px] font-bold font-mono uppercase tracking-wider border-b-2 transition-all ${activeTab === tab.id ? "border-primary text-primary bg-card" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/5"}`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Tab Content Panels */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Tab 1: Base Colors & Typography */}
            {activeTab === "colors" && (
              <div className="space-y-6">
                
                {/* Mode Select */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Base color model</label>
                    <span className="text-[8px] font-mono text-muted-foreground">Tells Visus if this theme is light or dark</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setThemeState(prev => ({ ...prev, isDark: false }))}
                      className={`flex-1 py-2 rounded-xl border text-[11px] font-bold transition-all ${!themeState.isDark ? "border-primary bg-primary/10 text-primary" : "border-border/30 bg-card/40 hover:border-border/60"}`}
                    >
                      ☀️ Light-mode Base
                    </button>
                    <button
                      onClick={() => setThemeState(prev => ({ ...prev, isDark: true }))}
                      className={`flex-1 py-2 rounded-xl border text-[11px] font-bold transition-all ${themeState.isDark ? "border-primary bg-primary/10 text-primary" : "border-border/30 bg-card/40 hover:border-border/60"}`}
                    >
                      🌙 Dark-mode Base
                    </button>
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-1.5 leading-normal">
                    This toggle sets default browser scrollbar rendering, default glass overlays, and triggers Tailwind's `dark:` classes inside components.
                  </p>
                </div>

                {/* Base Colors Grid */}
                <div>
                  <h3 className="text-xs font-bold font-heading mb-3 pb-1.5 border-b border-border/30">Base Colors</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Background */}
                    <div className="flex items-center justify-between p-2.5 bg-accent/15 border border-border/30 rounded-xl">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold">App Background</span>
                        <span className="text-[9px] text-muted-foreground font-mono uppercase">{themeState.background}</span>
                      </div>
                      <input
                        type="color"
                        value={resolveColor(themeState.background)}
                        onChange={(e) => setThemeState(prev => ({ ...prev, background: e.target.value }))}
                        className="w-8 h-8 rounded border border-border/50 cursor-pointer overflow-hidden bg-transparent shrink-0"
                      />
                    </div>
                    {/* Foreground */}
                    <div className="flex items-center justify-between p-2.5 bg-accent/15 border border-border/30 rounded-xl">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold">Primary Text</span>
                        <span className="text-[9px] text-muted-foreground font-mono uppercase">{themeState.foreground}</span>
                      </div>
                      <input
                        type="color"
                        value={resolveColor(themeState.foreground)}
                        onChange={(e) => setThemeState(prev => ({ ...prev, foreground: e.target.value }))}
                        className="w-8 h-8 rounded border border-border/50 cursor-pointer overflow-hidden bg-transparent shrink-0"
                      />
                    </div>
                    {/* Card background */}
                    <div className="flex items-center justify-between p-2.5 bg-accent/15 border border-border/30 rounded-xl">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold">Card Background</span>
                        <span className="text-[9px] text-muted-foreground font-mono uppercase">{themeState.cardBackground}</span>
                      </div>
                      <input
                        type="color"
                        value={resolveColor(themeState.cardBackground)}
                        onChange={(e) => setThemeState(prev => ({ ...prev, cardBackground: e.target.value }))}
                        className="w-8 h-8 rounded border border-border/50 cursor-pointer overflow-hidden bg-transparent shrink-0"
                      />
                    </div>
                    {/* Card foreground */}
                    <div className="flex items-center justify-between p-2.5 bg-accent/15 border border-border/30 rounded-xl">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold">Card Text</span>
                        <span className="text-[9px] text-muted-foreground font-mono uppercase">{themeState.cardForeground}</span>
                      </div>
                      <input
                        type="color"
                        value={resolveColor(themeState.cardForeground)}
                        onChange={(e) => setThemeState(prev => ({ ...prev, cardForeground: e.target.value }))}
                        className="w-8 h-8 rounded border border-border/50 cursor-pointer overflow-hidden bg-transparent shrink-0"
                      />
                    </div>
                    {/* Border */}
                    <div className="flex items-center justify-between p-2.5 bg-accent/15 border border-border/30 rounded-xl">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold">Borders & Lines</span>
                        <span className="text-[9px] text-muted-foreground font-mono uppercase">{themeState.border}</span>
                      </div>
                      <input
                        type="color"
                        value={resolveColor(themeState.border)}
                        onChange={(e) => setThemeState(prev => ({ ...prev, border: e.target.value }))}
                        className="w-8 h-8 rounded border border-border/50 cursor-pointer overflow-hidden bg-transparent shrink-0"
                      />
                    </div>
                    {/* Accent / Primary */}
                    <div className="flex items-center justify-between p-2.5 bg-accent/15 border border-border/30 rounded-xl">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold">Accent Highlight</span>
                        <span className="text-[9px] text-muted-foreground font-mono uppercase">{themeState.accent}</span>
                      </div>
                      <input
                        type="color"
                        value={resolveColor(themeState.accent)}
                        onChange={(e) => setThemeState(prev => ({ ...prev, accent: e.target.value }))}
                        className="w-8 h-8 rounded border border-border/50 cursor-pointer overflow-hidden bg-transparent shrink-0"
                      />
                    </div>
                    {/* Accent text */}
                    <div className="flex items-center justify-between p-2.5 bg-accent/15 border border-border/30 rounded-xl">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold">Accent Button Text</span>
                        <span className="text-[9px] text-muted-foreground font-mono uppercase">{themeState.accentForeground}</span>
                      </div>
                      <input
                        type="color"
                        value={resolveColor(themeState.accentForeground)}
                        onChange={(e) => setThemeState(prev => ({ ...prev, accentForeground: e.target.value }))}
                        className="w-8 h-8 rounded border border-border/50 cursor-pointer overflow-hidden bg-transparent shrink-0"
                      />
                    </div>
                    {/* Muted */}
                    <div className="flex items-center justify-between p-2.5 bg-accent/15 border border-border/30 rounded-xl">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold">Muted Background</span>
                        <span className="text-[9px] text-muted-foreground font-mono uppercase">{themeState.muted}</span>
                      </div>
                      <input
                        type="color"
                        value={resolveColor(themeState.muted)}
                        onChange={(e) => setThemeState(prev => ({ ...prev, muted: e.target.value }))}
                        className="w-8 h-8 rounded border border-border/50 cursor-pointer overflow-hidden bg-transparent shrink-0"
                      />
                    </div>
                    {/* Muted foreground */}
                    <div className="flex items-center justify-between p-2.5 bg-accent/15 border border-border/30 rounded-xl">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold">Muted Text</span>
                        <span className="text-[9px] text-muted-foreground font-mono uppercase">{themeState.mutedForeground}</span>
                      </div>
                      <input
                        type="color"
                        value={resolveColor(themeState.mutedForeground)}
                        onChange={(e) => setThemeState(prev => ({ ...prev, mutedForeground: e.target.value }))}
                        className="w-8 h-8 rounded border border-border/50 cursor-pointer overflow-hidden bg-transparent shrink-0"
                      />
                    </div>
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
                        onChange={(val) => setThemeState(prev => ({ ...prev, uiFont: (val || undefined) as any }))}
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
            )}

            {/* Tab 2: Decoupled Sections (Sidebar & Reader) */}
            {activeTab === "components" && (
              <div className="space-y-6">
                
                {/* Sidebar Component Override */}
                <div className="p-4 border border-border/30 bg-accent/5 rounded-2xl">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-border/20">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">Decoupled Sidebar Styles</span>
                      <span className="text-[9px] text-muted-foreground">Override background and text colors specifically for the sidebar panel</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={themeState.overrideSidebar}
                      onChange={(e) => setThemeState(prev => ({ ...prev, overrideSidebar: e.target.checked }))}
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
                        <span className="text-[11px] font-bold">Sidebar Background</span>
                        <input
                          type="color"
                          value={resolveColor(themeState.sidebarBackground || themeState.cardBackground)}
                          onChange={(e) => setThemeState(prev => ({ ...prev, sidebarBackground: e.target.value }))}
                          className="w-8 h-8 rounded border shrink-0 bg-transparent cursor-pointer"
                        />
                      </div>
                      {/* Sidebar foreground */}
                      <div className="flex items-center justify-between p-2.5 bg-card border border-border/30 rounded-xl">
                        <span className="text-[11px] font-bold">Sidebar Text Color</span>
                        <input
                          type="color"
                          value={resolveColor(themeState.sidebarForeground || themeState.cardForeground)}
                          onChange={(e) => setThemeState(prev => ({ ...prev, sidebarForeground: e.target.value }))}
                          className="w-8 h-8 rounded border shrink-0 bg-transparent cursor-pointer"
                        />
                      </div>
                      {/* Sidebar Border */}
                      <div className="flex items-center justify-between p-2.5 bg-card border border-border/30 rounded-xl">
                        <span className="text-[11px] font-bold">Sidebar Line Border</span>
                        <input
                          type="color"
                          value={resolveColor(themeState.sidebarBorder || themeState.border)}
                          onChange={(e) => setThemeState(prev => ({ ...prev, sidebarBorder: e.target.value }))}
                          className="w-8 h-8 rounded border shrink-0 bg-transparent cursor-pointer"
                        />
                      </div>
                      {/* Sidebar Active Background */}
                      <div className="flex items-center justify-between p-2.5 bg-card border border-border/30 rounded-xl">
                        <span className="text-[11px] font-bold">Active Item Tag Background</span>
                        <input
                          type="color"
                          value={resolveColor(themeState.sidebarActiveBackground || themeState.accent)}
                          onChange={(e) => setThemeState(prev => ({ ...prev, sidebarActiveBackground: e.target.value }))}
                          className="w-8 h-8 rounded border shrink-0 bg-transparent cursor-pointer"
                        />
                      </div>
                      {/* Sidebar Active Foreground */}
                      <div className="flex items-center justify-between p-2.5 bg-card border border-border/30 rounded-xl">
                        <span className="text-[11px] font-bold">Active Item Text Color</span>
                        <input
                          type="color"
                          value={resolveColor(themeState.sidebarActiveForeground || themeState.accentForeground)}
                          onChange={(e) => setThemeState(prev => ({ ...prev, sidebarActiveForeground: e.target.value }))}
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
                      <span className="text-xs font-bold">Decoupled Reader Room Styles</span>
                      <span className="text-[9px] text-muted-foreground">Apply custom parchment/screen backgrounds specifically inside the reading canvas</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={themeState.overrideReader}
                      onChange={(e) => setThemeState(prev => ({ ...prev, overrideReader: e.target.checked }))}
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
                        <span className="text-[11px] font-bold">Reading Page Background</span>
                        <input
                          type="color"
                          value={resolveColor(themeState.readerBackground || themeState.background)}
                          onChange={(e) => setThemeState(prev => ({ ...prev, readerBackground: e.target.value }))}
                          className="w-8 h-8 rounded border shrink-0 bg-transparent cursor-pointer"
                        />
                      </div>
                      {/* Reader foreground */}
                      <div className="flex items-center justify-between p-2.5 bg-card border border-border/30 rounded-xl">
                        <span className="text-[11px] font-bold">Reading Text Color</span>
                        <input
                          type="color"
                          value={resolveColor(themeState.readerForeground || themeState.foreground)}
                          onChange={(e) => setThemeState(prev => ({ ...prev, readerForeground: e.target.value }))}
                          className="w-8 h-8 rounded border shrink-0 bg-transparent cursor-pointer"
                        />
                      </div>
                      {/* Reader border */}
                      <div className="flex items-center justify-between p-2.5 bg-card border border-border/30 rounded-xl">
                        <span className="text-[11px] font-bold">Reading Canvas Border</span>
                        <input
                          type="color"
                          value={resolveColor(themeState.readerBorder || themeState.border)}
                          onChange={(e) => setThemeState(prev => ({ ...prev, readerBorder: e.target.value }))}
                          className="w-8 h-8 rounded border shrink-0 bg-transparent cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Background Engine & Effects */}
            {activeTab === "background" && (
              <div className="space-y-6">
                
                {/* Background Type */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2.5">Custom layout background type</label>
                  <div className="flex gap-2">
                    {["solid", "gradient", "image"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setThemeState(prev => ({ ...prev, bgType: type as any }))}
                        className={`flex-1 py-2 capitalize rounded-xl border text-xs font-bold transition-all ${themeState.bgType === type ? "border-primary bg-primary/10 text-primary" : "border-border/30 bg-card/40 hover:border-border/60"}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Solid Option Note */}
                {themeState.bgType === "solid" && (
                  <p className="text-[10px] text-muted-foreground bg-accent/5 p-3 rounded-xl border border-border/20">
                    Solid background uses the general <strong>App Background</strong> color configured in the Colors tab.
                  </p>
                )}

                {/* Gradient Config */}
                {themeState.bgType === "gradient" && (
                  <div className="space-y-4 border border-border/30 p-4 bg-accent/5 rounded-2xl animate-scale-up">
                    <span className="block text-xs font-bold mb-2">Configure Gradient</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-2.5 bg-card border border-border/30 rounded-xl">
                        <span className="text-[11px] font-bold">Start Gradient Color</span>
                        <input
                          type="color"
                          value={themeState.bgGradientStart || "#ffffff"}
                          onChange={(e) => setThemeState(prev => ({ ...prev, bgGradientStart: e.target.value }))}
                          className="w-8 h-8 rounded border shrink-0 bg-transparent cursor-pointer"
                        />
                      </div>
                      <div className="flex items-center justify-between p-2.5 bg-card border border-border/30 rounded-xl">
                        <span className="text-[11px] font-bold">End Gradient Color</span>
                        <input
                          type="color"
                          value={themeState.bgGradientEnd || "#eaeaea"}
                          onChange={(e) => setThemeState(prev => ({ ...prev, bgGradientEnd: e.target.value }))}
                          className="w-8 h-8 rounded border shrink-0 bg-transparent cursor-pointer"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground mb-1.5">
                        <span>Gradient Angle</span>
                        <span>{themeState.bgGradientAngle ?? 135}°</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={themeState.bgGradientAngle ?? 135}
                        onChange={(e) => setThemeState(prev => ({ ...prev, bgGradientAngle: parseInt(e.target.value) }))}
                        className="w-full h-1.5 bg-accent/35 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                  </div>
                )}

                {/* Image Config */}
                {themeState.bgType === "image" && (
                  <div className="space-y-4 border border-border/30 p-4 bg-accent/5 rounded-2xl animate-scale-up">
                    <span className="block text-xs font-bold mb-2">Configure Background Image</span>
                    
                    {/* URL Input */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Web Image URL</label>
                      <input
                        type="text"
                        value={themeState.bgImageUrl || ""}
                        onChange={(e) => setThemeState(prev => ({ ...prev, bgImageUrl: e.target.value }))}
                        placeholder="https://example.com/background.jpg"
                        className="w-full bg-card border border-border/30 focus:border-primary/50 focus:outline-none rounded-xl px-3 py-2 text-xs text-foreground"
                      />
                    </div>

                    {/* Local Image Uploader */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Or Upload Local Image (Compressed on-the-fly)</label>
                      <div className="flex flex-col gap-2">
                        <label className="flex flex-col items-center justify-center border border-dashed border-border/40 bg-card/60 hover:bg-accent/15 cursor-pointer p-4 rounded-xl text-center transition-colors">
                          <Upload className="h-5 w-5 text-muted-foreground mb-1.5" />
                          <span className="text-[10px] font-semibold">Click to select image file</span>
                          <span className="text-[8px] text-muted-foreground opacity-85 mt-0.5">JPEG, PNG, WEBP (Autocompressed &lt; 150KB)</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                        {themeState.bgImageUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setThemeState(prev => ({
                                ...prev,
                                bgImageUrl: undefined,
                                bgType: "solid"
                              }));
                            }}
                            className="w-full py-1.5 px-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Clear Background Image
                          </button>
                        )}
                      </div>
                      {imageError && (
                        <p className="text-[9px] text-destructive font-mono mt-1">{imageError}</p>
                      )}
                    </div>

                    {/* Image Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {/* Opacity */}
                      <div>
                        <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground mb-1.5">
                          <span>Image Opacity</span>
                          <span>{Math.round((themeState.bgImageOpacity ?? 1) * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={themeState.bgImageOpacity ?? 1}
                          onChange={(e) => setThemeState(prev => ({ ...prev, bgImageOpacity: parseFloat(e.target.value) }))}
                          className="w-full h-1.5 bg-accent/35 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>
                      {/* Blur */}
                      <div>
                        <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground mb-1.5">
                          <span>Image Blur</span>
                          <span>{themeState.bgImageBlur ?? 0}px</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          step="1"
                          value={themeState.bgImageBlur ?? 0}
                          onChange={(e) => setThemeState(prev => ({ ...prev, bgImageBlur: parseInt(e.target.value) }))}
                          className="w-full h-1.5 bg-accent/35 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>
                    </div>

                    {/* Overlay Tint Color & Opacity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border/20 pt-4">
                      {/* Color */}
                      <div className="flex items-center justify-between p-2.5 bg-card border border-border/30 rounded-xl">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold">Overlay Tint</span>
                          <span className="text-[8px] text-muted-foreground">Add color contrast overlay</span>
                        </div>
                        <input
                          type="color"
                          value={themeState.bgImageOverlay || "#000000"}
                          onChange={(e) => setThemeState(prev => ({ ...prev, bgImageOverlay: e.target.value }))}
                          className="w-8 h-8 rounded border shrink-0 bg-transparent cursor-pointer"
                        />
                      </div>
                      {/* Overlay Opacity */}
                      <div className="flex flex-col justify-center">
                        <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground mb-1.5">
                          <span>Tint Opacity</span>
                          <span>{Math.round((themeState.bgImageOverlayOpacity ?? 0) * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="0.95"
                          step="0.05"
                          value={themeState.bgImageOverlayOpacity ?? 0}
                          onChange={(e) => setThemeState(prev => ({ ...prev, bgImageOverlayOpacity: parseFloat(e.target.value) }))}
                          className="w-full h-1.5 bg-accent/35 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Card Corners and Shadows */}
                <div>
                  <h3 className="text-xs font-bold font-heading mb-3 pb-1.5 border-b border-border/30">Materials & Surfaces</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Radius selector */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">Border Radius (Corners)</label>
                      <FancyDropdown
                        ariaLabel="Border Radius (Corners)"
                        value={themeState.cardRadius || "12px"}
                        placeholder="Standard 12px"
                        menuZIndex={150}
                        onChange={(val) => setThemeState(prev => ({ ...prev, cardRadius: val as any }))}
                        options={[
                          { value: "0px", label: "Sharp 0px", description: "Completely flat corner layout" },
                          { value: "4px", label: "Extra Small 4px", description: "Subtle corner rounding" },
                          { value: "8px", label: "Small 8px", description: "Compact card corner styling" },
                          { value: "12px", label: "Standard 12px", description: "Visus default container rounding" },
                          { value: "16px", label: "Large 16px", description: "Soft organic container corners" },
                          { value: "24px", label: "Extra Large 24px", description: "Pronounced aesthetic curves" },
                        ]}
                      />
                    </div>

                    {/* Shadow Selector */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">Box Shadow (Card Depth)</label>
                      <FancyDropdown
                        ariaLabel="Box Shadow (Card Depth)"
                        value={themeState.cardShadow || "none"}
                        placeholder="Flat (None)"
                        menuZIndex={150}
                        onChange={(val) => setThemeState(prev => ({ ...prev, cardShadow: val as any }))}
                        options={[
                          { value: "none", label: "Flat (None)", description: "No elevation shadow outline" },
                          { value: "sm", label: "Subtle shadow (sm)", description: "Thin, clean card bottom edge shadow" },
                          { value: "md", label: "Modern elevation (md)", description: "Balanced depth drop shadow" },
                          { value: "lg", label: "Heavy drop shadow (lg)", description: "Deep visual layered shadow" },
                          { value: "glow", label: "Accent Glow", description: "Neon backlight primary shadow effect" },
                          { value: "retro", label: "Borders offset", description: "Thick lines offsets for retro layouts" },
                        ]}
                      />
                    </div>
                  </div>
                </div>

                {/* Glassmorphism Configuration */}
                <div className="p-4 border border-border/30 bg-accent/5 rounded-2xl">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/20">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">Dynamic Glassmorphism Controls</span>
                      <span className="text-[9px] text-muted-foreground">Adjust transparency backdrop filters globally on cards</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={themeState.glassmorphism?.enabled || false}
                      onChange={(e) => setThemeState(prev => ({ 
                        ...prev, 
                        glassmorphism: {
                          enabled: e.target.checked,
                          blur: prev.glassmorphism?.blur ?? 12,
                          opacity: prev.glassmorphism?.opacity ?? 0.45,
                          borderOpacity: prev.glassmorphism?.borderOpacity ?? 0.1
                        }
                      }))}
                      className="w-4 h-4 accent-primary rounded border border-border cursor-pointer"
                    />
                  </div>

                  {themeState.glassmorphism?.enabled && (
                    <div className="space-y-4 animate-scale-up">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Opacity */}
                        <div>
                          <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground mb-1.5">
                            <span>Glass Transparency</span>
                            <span>{Math.round((themeState.glassmorphism?.opacity ?? 0.45) * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0.05"
                            max="0.95"
                            step="0.05"
                            value={themeState.glassmorphism?.opacity ?? 0.45}
                            onChange={(e) => setThemeState(prev => ({ 
                              ...prev, 
                              glassmorphism: { ...prev.glassmorphism!, opacity: parseFloat(e.target.value) } 
                            }))}
                            className="w-full h-1.5 bg-accent/35 rounded-lg appearance-none cursor-pointer accent-primary"
                          />
                        </div>
                        {/* Blur */}
                        <div>
                          <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground mb-1.5">
                            <span>Backdrop Blur strength</span>
                            <span>{themeState.glassmorphism?.blur ?? 12}px</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="24"
                            step="1"
                            value={themeState.glassmorphism?.blur ?? 12}
                            onChange={(e) => setThemeState(prev => ({ 
                              ...prev, 
                              glassmorphism: { ...prev.glassmorphism!, blur: parseInt(e.target.value) } 
                            }))}
                            className="w-full h-1.5 bg-accent/35 rounded-lg appearance-none cursor-pointer accent-primary"
                          />
                        </div>
                        {/* Border opacity */}
                        <div>
                          <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground mb-1.5">
                            <span>Border Visibility</span>
                            <span>{Math.round((themeState.glassmorphism?.borderOpacity ?? 0.1) * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0.01"
                            max="0.8"
                            step="0.02"
                            value={themeState.glassmorphism?.borderOpacity ?? 0.1}
                            onChange={(e) => setThemeState(prev => ({ 
                              ...prev, 
                              glassmorphism: { ...prev.glassmorphism!, borderOpacity: parseFloat(e.target.value) } 
                            }))}
                            className="w-full h-1.5 bg-accent/35 rounded-lg appearance-none cursor-pointer accent-primary"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 4: JSON Share / Custom CSS */}
            {activeTab === "advanced" && (
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
                    placeholder="/* Example override */&#10;aside {&#10;  background: linear-gradient(180deg, #111827, #1f2937) !important;&#10;}&noded;.liquid-glass {&#10;  border-width: 2px !important;&#10;}"
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
            )}
          </div>

          {/* Footer Actions */}
          <footer className="border-t border-border/30 p-4 bg-accent/5 flex justify-between items-center">
            <div>
              {themeToEdit && onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to permanently delete the theme "${themeState.name}"?`)) {
                      onDelete(themeState.id);
                    }
                  }}
                  className="py-2.5 px-4 bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" /> Delete Theme
                </button>
              )}
            </div>
            <div className="flex gap-3.5">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-6 border border-border/30 hover:bg-accent/20 rounded-xl text-xs font-bold transition-all text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!themeState.name.trim()) {
                    themeState.name = "My Custom Theme";
                  }
                  onSave(themeState);
                }}
                className="py-2.5 px-7 bg-primary text-primary-foreground hover:brightness-110 font-extrabold rounded-xl text-xs transition-all shadow-[0_0_15px_rgba(var(--primary),0.2)]"
              >
                Save & Apply Theme
              </button>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
}
