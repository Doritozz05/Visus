"use client";

import * as React from "react";
import { useSettings } from "@/features/settings/context/settings-context";
import { Columns } from "lucide-react";
import { ColorSelector } from "@/components/ui/ColorSelector";
import { FontSelector } from "@/components/ui/FontSelector";
import { resolveColor, hexToRgba, THEME_DEFAULTS } from "@/lib/color-utils";

export function ClusterSettingsForm() {
  const { settings, updateClusterSettings, customFonts, refreshCustomFonts } = useSettings();
  const cluster = settings.cluster;

  const resolvedColor = React.useMemo(() => {
    const color = cluster.activeColor;
    if (color && color !== "primary" && color !== "foreground" && color !== "muted") return resolveColor(color);
    
    // Resolve theme colors
    const themeId = settings.general.theme;
    const currentTheme = THEME_DEFAULTS[themeId];
    
    if (color === "foreground") return currentTheme?.fg || "#000000";
    if (color === "muted") return currentTheme?.muted || "#94a3b8";
    return currentTheme?.primary || "#8b5cf6";
  }, [cluster.activeColor, settings.general.theme]);

  return (
    <div className="space-y-6">
      {/* Cluster Layout Controls */}
      <div className="bg-card/50 border border-border/20 rounded-xl p-6 shadow-md liquid-glass">
        <div className="flex items-center gap-2 mb-6 border-b border-border/30 pb-4">
          <Columns className="text-primary h-5 w-5" />
          <h3 className="text-sm font-bold font-heading text-foreground">Cluster settings</h3>
        </div>

        {/* Size control */}
        <div className="mb-6">
          <div className="flex justify-between items-end mb-3">
            <label className="block text-[10px] font-sans uppercase tracking-wider text-muted-foreground">Active line optical font size</label>
            <span className="text-[11px] font-mono text-primary font-bold bg-accent px-2 py-0.5 rounded border border-border/30">{cluster.fontSize}px</span>
          </div>
          <input
            className="w-full accent-primary h-1 bg-accent rounded-lg appearance-none cursor-pointer"
            max="48"
            min="14"
            type="range"
            value={cluster.fontSize}
            onChange={(e) => updateClusterSettings({ fontSize: Number(e.target.value) })}
          />
          <div className="flex justify-between text-[8px] font-mono text-muted-foreground mt-1">
            <span>14px (Standard)</span>
            <span>48px (Jumbo Display)</span>
          </div>
        </div>

        {/* Typeface */}
        <div className="mb-6">
          <FontSelector
            label="Cluster canvas font family"
            value={cluster.fontFamily}
            onChange={(val) => updateClusterSettings({ fontFamily: val })}
            customFonts={customFonts}
            onRefreshCustomFonts={refreshCustomFonts}
            filterType="reader"
          />
        </div>

        {/* Highlight Styles */}
        <div className="mb-6">
          <label className="block text-[10px] font-sans uppercase tracking-wider text-muted-foreground mb-3">Highlight visual style</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "spotlight", render: () => {
                const resolvedGlowColor = cluster.glowEffect === "none" ? "none" : (cluster.glowEffect === "primary" ? resolvedColor : resolveColor(cluster.glowEffect));
                return (
                  <span 
                    style={{
                      color: resolvedColor,
                      textShadow: resolvedGlowColor !== "none" 
                        ? `0 0 8px ${hexToRgba(resolvedGlowColor, 0.55)}, 0 0 2px ${hexToRgba(resolvedGlowColor, 0.3)}` 
                        : undefined
                    }}
                    className="font-medium"
                  >
                    Spotlight
                  </span>
                );
              }},
              { id: "capsule", render: () => (
                <span 
                  style={{
                    color: resolvedColor,
                    backgroundColor: hexToRgba(resolvedColor, 0.1),
                    borderColor: hexToRgba(resolvedColor, 0.2),
                  }}
                  className="px-2 py-0.5 rounded border text-[11px] inline-block font-medium"
                >
                  Capsule Bubble
                </span>
              )},
              { id: "underline", render: () => (
                <span 
                  style={{
                    color: resolvedColor,
                    borderBottom: `2px solid ${resolvedColor}`
                  }}
                  className="px-0.5 font-medium"
                >
                  Underline
                </span>
              )},
              { id: "bold-only", render: () => (
                <span 
                  style={{ 
                    color: resolvedColor, 
                    WebkitTextStroke: "0.04em currentColor",
                    textShadow: "0.02em 0 0 currentColor, -0.02em 0 0 currentColor" 
                  }} 
                  className="font-normal"
                >
                  Bold text
                </span>
              )},
              { id: "color-only", render: () => (
                <span style={{ color: resolvedColor }} className="font-medium">
                  Pure color
                </span>
              )},
            ].map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => updateClusterSettings({ highlightStyle: style.id as any })}
                className={`p-3 border rounded-xl text-center transition-all flex items-center justify-center min-h-[48px] ${
                  cluster.highlightStyle === style.id
                    ? "border-primary bg-accent/45 shadow-sm"
                    : "border-border/20 hover:border-border/45 bg-card/40 hover:bg-card"
                }`}
              >
                {style.render()}
              </button>
            ))}
          </div>
        </div>

        {/* Active Highlight Color Selection */}
        <div className="mb-6">
          <ColorSelector
            label="Active cluster color"
            value={cluster.activeColor}
            onChange={(color) => updateClusterSettings({ activeColor: color })}
            showWhitePreset={true}
          />
        </div>

        {/* Inactive Line settings */}
        <div className="grid grid-cols-1 gap-6 py-4 border-t border-border/10">
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-[10px] font-sans uppercase tracking-wider text-muted-foreground">Inactive lines opacity</label>
              <span className="text-[10px] font-mono text-primary font-semibold">{Math.round(cluster.inactiveOpacity * 100)}%</span>
            </div>
            <input
              className="w-full accent-primary h-1 bg-accent rounded-lg appearance-none cursor-pointer"
              max="0.7"
              min="0.1"
              step="0.05"
              type="range"
              value={cluster.inactiveOpacity}
              onChange={(e) => updateClusterSettings({ inactiveOpacity: Number(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-[10px] font-sans uppercase tracking-wider text-muted-foreground mb-3">Inactive blur amount</label>
            <div className="flex gap-1.5">
              {[
                { val: "0px", label: "Sharp" },
                { val: "0.5px", label: "Soft" },
                { val: "1px", label: "Medium" },
                { val: "2px", label: "Strong" },
              ].map((b) => (
                <button
                  key={b.val}
                  onClick={() => updateClusterSettings({ blurAmount: b.val })}
                  className={`flex-1 py-1.5 text-[9px] font-sans border rounded transition-all ${cluster.blurAmount === b.val
                    ? "bg-primary text-primary-foreground font-bold border-primary"
                    : "border-border/30 hover:border-border/60 text-muted-foreground bg-card"
                    }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Spotlight Glow controls - Conditionally rendered */}
        {cluster.highlightStyle === "spotlight" && (
          <div className="py-4 border-t border-border/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-sans uppercase tracking-wider text-foreground font-semibold">Spotlight glow</label>
                <p className="text-[9px] text-muted-foreground mt-0.5">Adds subtle ambient glow under the highlighted line.</p>
              </div>
              <button
                type="button"
                onClick={() => updateClusterSettings({ glowEffect: cluster.glowEffect === "none" ? "primary" : "none" })}
                className={`px-3 py-1.5 rounded-lg border font-mono text-[9px] uppercase tracking-widest transition-all ${
                  cluster.glowEffect !== "none"
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-[0_0_15px_rgba(var(--primary),0.1)]"
                    : "border-border/30 bg-card/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                {cluster.glowEffect !== "none" ? "Enabled" : "Disabled"}
              </button>
            </div>

            {cluster.glowEffect !== "none" && (
              <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                <ColorSelector
                  label="Glow color"
                  value={cluster.glowEffect}
                  onChange={(color) => updateClusterSettings({ glowEffect: color })}
                  showWhitePreset={true}
                />
              </div>
            )}
          </div>
        )}

        {/* Warmup Ramp */}
        <div className="flex items-center justify-between py-4 border-t border-border/10">
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-foreground font-semibold">Warm-up Ramp</label>
            <p className="text-[9px] text-muted-foreground mt-0.5">Gradually accelerates to target WPM over 2 seconds when starting.</p>
          </div>
          <button
            onClick={() => updateClusterSettings({ warmupRamp: !cluster.warmupRamp })}
            className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 relative shrink-0 ${cluster.warmupRamp ? "bg-primary" : "bg-accent"}`}
          >
            <div className={`w-4 h-4 rounded-full bg-background transition-transform duration-300 ${cluster.warmupRamp ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>

        {/* Algorithm Profile */}
        <div className="py-4 border-t border-border/10">
          <label className="block text-xs font-sans uppercase tracking-wider text-foreground font-semibold mb-3">Pacing Rhythm</label>
          <div className="flex gap-2 mb-4">
            {[
              { id: "metronome", label: "Metronome", desc: "Constant strict pacing" },
              { id: "dynamic", label: "Dynamic", desc: "Natural cognitive pauses" },
              { id: "custom", label: "Custom", desc: "User-defined delays" },
            ].map((alg) => (
              <button
                key={alg.id}
                onClick={() => updateClusterSettings({ algorithm: alg.id as any })}
                className={`flex-1 p-2 border rounded-lg text-left transition-all ${
                  cluster.algorithm === alg.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/30 hover:border-border/60 text-muted-foreground bg-card"
                }`}
              >
                <div className="text-[10px] font-bold uppercase">{alg.label}</div>
                <div className="text-[8px] leading-tight mt-0.5 opacity-80">{alg.desc}</div>
              </button>
            ))}
          </div>

          {cluster.algorithm === "custom" && (
            <div className="space-y-4 p-4 rounded-xl bg-background/50 border border-border/20">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold uppercase text-foreground">Custom Multipliers</span>
                <button 
                  onClick={() => updateClusterSettings({ customDelays: { shortWord: 0.85, longWord: 1.2, comma: 1.3, period: 1.6 } })}
                  className="text-[9px] text-muted-foreground hover:text-primary underline"
                >
                  Reset Defaults
                </button>
              </div>
              
              {[
                { key: "shortWord", label: "Short clusters", min: 0.5, max: 1.5, step: 0.05 },
                { key: "longWord", label: "Complex words penalty", min: 1.0, max: 2.5, step: 0.05 },
                { key: "comma", label: "Commas (,)", min: 1.0, max: 3.0, step: 0.1 },
                { key: "period", label: "Periods (.)", min: 1.0, max: 4.0, step: 0.1 },
              ].map((slider) => (
                <div key={slider.key}>
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                    <span>{slider.label}</span>
                    <span className="font-mono text-primary">{cluster.customDelays[slider.key as keyof typeof cluster.customDelays].toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min={slider.min}
                    max={slider.max}
                    step={slider.step}
                    value={cluster.customDelays[slider.key as keyof typeof cluster.customDelays]}
                    onChange={(e) => updateClusterSettings({ 
                      customDelays: { ...cluster.customDelays, [slider.key]: Number(e.target.value) } 
                    })}
                    className="w-full h-1 bg-border rounded-full appearance-none accent-primary"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

