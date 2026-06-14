"use client";

import * as React from "react";
import { Zap } from "lucide-react";
import { useSettings } from "@/features/settings/context/settings-context";
import { ColorSelector } from "@/components/ui/ColorSelector";
import { BUILTIN_FONTS, getFontFamilyStyle } from "@/lib/typography";

export function RsvpSettingsForm() {
  const { settings, updateRsvpSettings, customFonts } = useSettings();
  const rsvp = settings.rsvp;

  const fontOptions = React.useMemo(() => {
    return [
      ...BUILTIN_FONTS.filter(f => f.type === "reader" || f.type === "both"),
      ...customFonts.map(cf => ({
        id: cf.id,
        name: cf.name,
        desc: "Custom Font",
        description: "User uploaded font"
      }))
    ];
  }, [customFonts]);

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
          <label className="block text-[10px] font-sans uppercase tracking-wider text-muted-foreground mb-3">Reading typeface</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {fontOptions.map((tf) => (
              <button
                key={tf.id}
                onClick={() => updateRsvpSettings({ fontFamily: tf.id })}
                style={{ fontFamily: getFontFamilyStyle(tf.id, customFonts) }}
                className={`p-2 border rounded-lg text-left transition-all ${rsvp.fontFamily === tf.id
                    ? "border-primary bg-accent/40 text-primary font-bold"
                    : "border-border/30 hover:border-border/60 text-muted-foreground bg-card"
                  }`}
              >
                <span className="block text-[11px] font-semibold truncate">{tf.name}</span>
                <span className="block text-[7px] opacity-60 font-sans tracking-widest truncate">{tf.desc}</span>
              </button>
            ))}
          </div>
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
            presets={[
              { id: "foreground", hex: "var(--foreground)", name: "Standard" },
              { id: "primary", hex: "var(--primary)", name: "Accent" },
              { id: "muted", hex: "var(--muted-foreground)", name: "Dimmed" },
              { id: "violet", hex: "#8b5cf6", name: "Violet" },
              { id: "indigo", hex: "#6366f1", name: "Indigo" },
              { id: "emerald", hex: "#10b981", name: "Emerald" },
              { id: "amber", hex: "#f59e0b", name: "Amber" },
              { id: "rose", hex: "#f43f5e", name: "Rose" },
              { id: "blue", hex: "#3b82f6", name: "Blue" },
              { id: "orange", hex: "#f97316", name: "Orange" },
              { id: "periwinkle", hex: "#c0c1ff", name: "Periwinkle" },
              { id: "white", hex: "#ffffff", name: "White" },
            ]}
          />
        </div>

      </div>
    </div>
  );
}

