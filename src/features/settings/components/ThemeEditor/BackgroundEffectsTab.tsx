import * as React from "react";
import { Upload, Trash2, Sparkles } from "lucide-react";
import type { CustomTheme } from "@/core/entities/settings";
import { resolveColor } from "@/lib/color-utils";
import { FancyDropdown } from "@/components/ui/FancyDropdown";
import { ColorSelector } from "@/components/ui/ColorSelector";

interface BackgroundEffectsTabProps {
  themeState: CustomTheme;
  setThemeState: (updater: CustomTheme | ((prev: CustomTheme) => CustomTheme), push?: boolean) => void;
  initialTheme: CustomTheme;
  imageError: string | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  portalContainer?: HTMLElement | null;
}

export function BackgroundEffectsTab({
  themeState,
  setThemeState,
  initialTheme,
  imageError,
  handleImageUpload,
  portalContainer,
}: BackgroundEffectsTabProps) {
  const updateGlow = (updates: Partial<NonNullable<CustomTheme['glowSettings']>>, push: boolean = false) => {
    setThemeState(prev => ({
      ...prev,
      glowSettings: {
        ...(prev.glowSettings || {
          color: prev.accent,
          brightness: 0.15,
          spread: 0,
          blur: 15
        }),
        ...updates,
        enabled: true // Always ensure enabled when updating
      }
    }), push);
  };

  return (
    <div className="space-y-6">
      {/* Background Type */}
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2.5">Custom layout background type</label>
        <div className="flex gap-2">
          {["solid", "gradient", "image"].map((type) => (
            <button
              key={type}
              type="button"
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
          <span className="block text-xs font-bold mb-2">Configure gradient</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-2.5 bg-card border border-border/30 rounded-xl">
              <span className="text-[11px] font-bold">Start gradient color</span>
              <ColorSelector
                value={themeState.bgGradientStart || "#ffffff"}
                initialValue={initialTheme.bgGradientStart || "#ffffff"}
                onChange={(color) => setThemeState(prev => ({ ...prev, bgGradientStart: color }), false)}
                onChangeComplete={(color) => setThemeState(prev => ({ ...prev, bgGradientStart: color }), true)}
                portalContainer={portalContainer}
              />
            </div>
            <div className="flex items-center justify-between p-2.5 bg-card border border-border/30 rounded-xl">
              <span className="text-[11px] font-bold">End gradient color</span>
              <ColorSelector
                value={themeState.bgGradientEnd || "#eaeaea"}
                initialValue={initialTheme.bgGradientEnd || "#eaeaea"}
                onChange={(color) => setThemeState(prev => ({ ...prev, bgGradientEnd: color }), false)}
                onChangeComplete={(color) => setThemeState(prev => ({ ...prev, bgGradientEnd: color }), true)}
                portalContainer={portalContainer}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground mb-1.5">
              <span>Gradient angle</span>
              <span>{themeState.bgGradientAngle ?? 135}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={themeState.bgGradientAngle ?? 135}
              onChange={(e) => setThemeState(prev => ({ ...prev, bgGradientAngle: parseInt(e.target.value) }), false)}
              onMouseUp={() => setThemeState(prev => ({ ...prev }), true)}
              className="w-full h-1.5 bg-accent/35 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        </div>
      )}

      {/* Image Config */}
      {themeState.bgType === "image" && (
        <div className="space-y-4 border border-border/30 p-4 bg-accent/5 rounded-2xl animate-scale-up">
          <span className="block text-xs font-bold mb-2">Configure background image</span>

          {/* URL Input */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Web image URL</label>
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
            <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Or upload local image (compressed on-the-fly)</label>
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
                  className="w-full py-1.5 px-3 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Clear background image
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
                <span>Image opacity</span>
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
                <span>Image blur</span>
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
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold">Overlay tint</span>
              <ColorSelector
                value={themeState.bgImageOverlay || "#000000"}
                onChange={(color) => setThemeState(prev => ({ ...prev, bgImageOverlay: color }))}
                portalContainer={portalContainer}
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
            <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">Border radius (corners)</label>
            <FancyDropdown
              ariaLabel="Border radius (corners)"
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
            <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">Box shadow (card depth)</label>
            <FancyDropdown
              ariaLabel="Box shadow (card depth)"
              value={themeState.cardShadow || "none"}
              placeholder="Flat (None)"
              menuZIndex={150}
              onChange={(val) => {
                setThemeState(prev => ({
                  ...prev,
                  cardShadow: val as any,
                  glowSettings: val === 'glow' 
                    ? {
                        ...(prev.glowSettings || {
                          color: prev.accent,
                          brightness: 0.15,
                          spread: 0,
                          blur: 15
                        }),
                        enabled: true
                      }
                    : prev.glowSettings
                }));
              }}
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

        {/* Individual Glow Settings */}
        {themeState.cardShadow === 'glow' && (
          <div className="mt-4 p-4 border border-border/30 bg-primary/5 rounded-2xl animate-scale-up space-y-4">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold">Glow Configuration</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono uppercase text-muted-foreground">Glow color</span>
                <ColorSelector
                  value={themeState.glowSettings?.color || themeState.accent}
                  initialValue={initialTheme.glowSettings?.color || initialTheme.accent}
                  onChange={(color) => updateGlow({ color }, false)}
                  onChangeComplete={(color) => updateGlow({ color }, true)}
                  portalContainer={portalContainer}
                />
              </div>

              <div className="space-y-4">
                {/* Brightness */}
                <div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground mb-1.5">
                    <span>Glow brightness</span>
                    <span>{Math.round((themeState.glowSettings?.brightness ?? 0.15) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={themeState.glowSettings?.brightness ?? 0.15}
                    onChange={(e) => updateGlow({ brightness: parseFloat(e.target.value) }, false)}
                    onMouseUp={() => setThemeState(prev => ({ ...prev }), true)}
                    className="w-full h-1.5 bg-accent/35 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                {/* Blur */}
                <div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground mb-1.5">
                    <span>Glow thickness (blur)</span>
                    <span>{themeState.glowSettings?.blur ?? 15}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={themeState.glowSettings?.blur ?? 15}
                    onChange={(e) => updateGlow({ blur: parseInt(e.target.value) }, false)}
                    onMouseUp={() => setThemeState(prev => ({ ...prev }), true)}
                    className="w-full h-1.5 bg-accent/35 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                {/* Spread */}
                <div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground mb-1.5">
                    <span>Glow spread</span>
                    <span>{themeState.glowSettings?.spread ?? 0}px</span>
                  </div>
                  <input
                    type="range"
                    min="-20"
                    max="20"
                    step="1"
                    value={themeState.glowSettings?.spread ?? 0}
                    onChange={(e) => updateGlow({ spread: parseInt(e.target.value) }, false)}
                    onMouseUp={() => setThemeState(prev => ({ ...prev }), true)}
                    className="w-full h-1.5 bg-accent/35 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Glassmorphism Configuration */}
      <div className="p-4 border border-border/30 bg-accent/5 rounded-2xl">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/20">
          <div className="flex flex-col">
            <span className="text-xs font-bold">Liquid glass</span>
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
                  <span>Glass transparency</span>
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
                  }), false)}
                  onMouseUp={() => setThemeState(prev => ({ ...prev }), true)}
                  className="w-full h-1.5 bg-accent/35 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
              {/* Blur */}
              <div>
                <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground mb-1.5">
                  <span>Backdrop blur strength</span>
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
                  }), false)}
                  onMouseUp={() => setThemeState(prev => ({ ...prev }), true)}
                  className="w-full h-1.5 bg-accent/35 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
              {/* Border opacity */}
              <div>
                <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground mb-1.5">
                  <span>Border visibility</span>
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
                  }), false)}
                  onMouseUp={() => setThemeState(prev => ({ ...prev }), true)}
                  className="w-full h-1.5 bg-accent/35 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
