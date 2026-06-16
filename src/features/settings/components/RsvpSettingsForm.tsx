"use client";

import * as React from "react";
import { Zap } from "lucide-react";
import { useSettings } from "@/features/settings/context/settings-context";
import { ColorSelector } from "@/components/ui/ColorSelector";
import { FontSelector } from "@/components/ui/FontSelector";

export function RsvpSettingsForm() {
  const { settings, updateRsvpSettings, customFonts, refreshCustomFonts } = useSettings();
  const rsvp = settings.rsvp;

  return (
    <div className="space-y-6">
      {/* RSVP Layout Controls */}
      <div className="bg-card/50 border border-border/20 rounded-xl p-6 shadow-md liquid-glass">
        <div className="flex items-center gap-2 mb-6 border-b border-border/30 pb-4">
          <Zap className="text-primary h-5 w-5 animate-pulse" />
          <h3 className="text-sm font-bold font-heading text-foreground">RSVP settings</h3>
        </div>

        {/* Size control */}
        <div className="mb-6">
          <div className="flex justify-between items-end mb-3">
            <label className="block text-[10px] font-sans uppercase tracking-wider text-muted-foreground">Focus text optical size</label>
            <span className="text-[11px] font-mono text-primary font-bold bg-accent px-2 py-0.5 rounded border border-border/30">{rsvp.fontSize}px</span>
          </div>
          <input
            className="w-full accent-primary h-1 bg-accent rounded-lg appearance-none cursor-pointer"
            max="80"
            min="24"
            type="range"
            value={rsvp.fontSize}
            onChange={(e) => updateRsvpSettings({ fontSize: Number(e.target.value) })}
          />
          <div className="flex justify-between text-[8px] font-mono text-muted-foreground mt-1">
            <span>24px (Small)</span>
            <span>80px (Super Wide)</span>
          </div>
        </div>

        {/* Typeface */}
        <div className="mb-6">
          <FontSelector
            label="Reading typeface"
            value={rsvp.fontFamily}
            onChange={(val) => updateRsvpSettings({ fontFamily: val })}
            customFonts={customFonts}
            onRefreshCustomFonts={refreshCustomFonts}
            filterType="reader"
          />
        </div>

        {/* Focus Point Colors */}
        <div className="mb-6">
          <ColorSelector
            label="Optimal recognition point (ORP) color"
            value={rsvp.orpColor}
            onChange={(color) => updateRsvpSettings({ orpColor: color })}
          />
        </div>

        {/* Toggle glowing ORP */}
        <div className="flex items-center justify-between py-3 border-t border-border/10">
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-foreground font-semibold">ORP spotlight glow</label>
            <p className="text-[9px] text-muted-foreground mt-0.5">Adds ambient luminous blur under the focus letter anchor point.</p>
          </div>
          <button
            onClick={() => updateRsvpSettings({ orpGlow: !rsvp.orpGlow })}
            className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 relative shrink-0 ${rsvp.orpGlow ? "bg-primary" : "bg-accent"}`}
          >
            <div className={`w-4 h-4 rounded-full bg-background transition-transform duration-300 ${rsvp.orpGlow ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>

        {/* Toggle focus lines */}
        <div className="flex items-center justify-between py-3 border-t border-border/10">
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-foreground font-semibold">Visual guide lines</label>
            <p className="text-[9px] text-muted-foreground mt-0.5">Show central horizontal and vertical lines as reading anchor points.</p>
          </div>
          <button
            onClick={() => updateRsvpSettings({ showFocusGuides: !rsvp.showFocusGuides })}
            className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 relative shrink-0 ${rsvp.showFocusGuides ? "bg-primary" : "bg-accent"}`}
          >
            <div className={`w-4 h-4 rounded-full bg-background transition-transform duration-300 ${rsvp.showFocusGuides ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>

        {/* Unmarked Letter Opacity */}
        <div className="py-3 border-t border-border/10 transition-all duration-300">
          <div className="flex justify-between items-end mb-2">
            <label className="block text-xs font-sans uppercase tracking-wider text-foreground font-semibold">Unmarked text opacity</label>
            <span className="text-[10px] font-mono text-primary font-semibold">{Math.round(rsvp.unmarkedOpacity * 100)}%</span>
          </div>
          <input
            className="w-full accent-primary h-1 bg-accent rounded-lg appearance-none cursor-pointer"
            max="1.0"
            min="0.1"
            step="0.05"
            type="range"
            value={rsvp.unmarkedOpacity}
            onChange={(e) => updateRsvpSettings({ unmarkedOpacity: Number(e.target.value) })}
          />
          <p className="text-[8px] text-muted-foreground mt-1">Adjusts the transparency of the prefix and suffix surrounding the focus letter.</p>
        </div>

        {/* Unmarked Letter Color */}
        <div className="py-3 border-t border-border/10 transition-all duration-300">
          <ColorSelector
            label="Unmarked text color"
            value={rsvp.unmarkedColor}
            onChange={(color) => updateRsvpSettings({ unmarkedColor: color })}
          />
        </div>

        {/* Focal Weighting (Bionic) */}
        <div className="flex items-center justify-between py-3 border-t border-border/10">
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-foreground font-semibold">Focal Weighting</label>
            <p className="text-[9px] text-muted-foreground mt-0.5">Bolds the left side of the word to guide focus.</p>
          </div>
          <button
            onClick={() => updateRsvpSettings({ focalWeighting: !rsvp.focalWeighting })}
            className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 relative shrink-0 ${rsvp.focalWeighting ? "bg-primary" : "bg-accent"}`}
          >
            <div className={`w-4 h-4 rounded-full bg-background transition-transform duration-300 ${rsvp.focalWeighting ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>

        {/* Warmup Ramp */}
        <div className="flex items-center justify-between py-3 border-t border-border/10">
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-foreground font-semibold">Warm-up Ramp</label>
            <p className="text-[9px] text-muted-foreground mt-0.5">Gradually accelerates to target WPM over 2 seconds when starting.</p>
          </div>
          <button
            onClick={() => updateRsvpSettings({ warmupRamp: !rsvp.warmupRamp })}
            className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 relative shrink-0 ${rsvp.warmupRamp ? "bg-primary" : "bg-accent"}`}
          >
            <div className={`w-4 h-4 rounded-full bg-background transition-transform duration-300 ${rsvp.warmupRamp ? "translate-x-5" : "translate-x-0"}`} />
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
                onClick={() => updateRsvpSettings({ algorithm: alg.id as any })}
                className={`flex-1 p-2 border rounded-lg text-left transition-all ${
                  rsvp.algorithm === alg.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/30 hover:border-border/60 text-muted-foreground bg-card"
                }`}
              >
                <div className="text-[10px] font-bold uppercase">{alg.label}</div>
                <div className="text-[8px] leading-tight mt-0.5 opacity-80">{alg.desc}</div>
              </button>
            ))}
          </div>

          {rsvp.algorithm === "custom" && (
            <div className="space-y-4 p-4 rounded-xl bg-background/50 border border-border/20">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold uppercase text-foreground">Custom Multipliers</span>
                <button 
                  onClick={() => updateRsvpSettings({ customDelays: { shortWord: 0.85, longWord: 1.3, comma: 1.5, period: 2.2 } })}
                  className="text-[9px] text-muted-foreground hover:text-primary underline"
                >
                  Reset Defaults
                </button>
              </div>
              
              {[
                { key: "shortWord", label: "Short words (<=3 chars)", min: 0.5, max: 1.5, step: 0.05 },
                { key: "longWord", label: "Long words (>8 chars)", min: 1.0, max: 2.5, step: 0.05 },
                { key: "comma", label: "Commas (,)", min: 1.0, max: 3.0, step: 0.1 },
                { key: "period", label: "Periods (.)", min: 1.0, max: 4.0, step: 0.1 },
              ].map((slider) => (
                <div key={slider.key}>
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                    <span>{slider.label}</span>
                    <span className="font-mono text-primary">{rsvp.customDelays[slider.key as keyof typeof rsvp.customDelays].toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min={slider.min}
                    max={slider.max}
                    step={slider.step}
                    value={rsvp.customDelays[slider.key as keyof typeof rsvp.customDelays]}
                    onChange={(e) => updateRsvpSettings({ 
                      customDelays: { ...rsvp.customDelays, [slider.key]: Number(e.target.value) } 
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

