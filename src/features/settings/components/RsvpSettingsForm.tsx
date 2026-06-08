"use client";

import * as React from "react";
import { useSettings } from "@/features/settings/context/settings-context";

export function RsvpSettingsForm() {
  const { settings, updateRsvpSettings } = useSettings();
  const rsvp = settings.rsvp;

  return (
    <div className="space-y-6">
      {/* RSVP Layout Controls */}
      <div className="bg-card/50 border border-border/20 rounded-xl p-6 shadow-md glass-panel">
        <div className="flex items-center gap-2 mb-6 border-b border-border/30 pb-4">
          <span className="material-symbols-outlined text-primary">bolt</span>
          <h3 className="text-sm font-bold font-heading text-foreground">RSVP calibration engine</h3>
        </div>

        {/* Size control */}
        <div className="mb-6">
          <div className="flex justify-between items-end mb-3">
            <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Focus text optical size</label>
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
          <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">Reading typeface</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "inter", name: "Standard Sans", desc: "Inter Default" },
              { id: "atkinson", name: "Atkinson", desc: "Hyperlegible" },
              { id: "dyslexic", name: "Dyslexic", desc: "Accessibility" },
            ].map((tf) => (
              <button
                key={tf.id}
                onClick={() => updateRsvpSettings({ fontFamily: tf.id as any })}
                className={`p-2 border rounded text-center transition-all ${
                  rsvp.fontFamily === tf.id
                    ? "border-primary bg-accent/40 text-primary font-bold"
                    : "border-border/30 hover:border-border/60 text-muted-foreground bg-card"
                }`}
              >
                <span className="block text-[11px] font-semibold">{tf.name}</span>
                <span className="block text-[7px] opacity-60 font-mono tracking-widest">{tf.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Focus Point Colors */}
        <div className="mb-6">
          <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">Optimal recognition point (ORP) color</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { id: "orange", name: "Classic Orange", css: "bg-orange-400" },
              { id: "amber", name: "Liquid Amber", css: "bg-amber-400" },
              { id: "emerald", name: "Mint Emerald", css: "bg-emerald-400" },
              { id: "violet", name: "Neon Violet", css: "bg-violet-400" },
              { id: "indigo", name: "Cobalt Indigo", css: "bg-indigo-400" },
              { id: "rose", name: "Luminous Rose", css: "bg-rose-400" },
            ].map((oc) => (
              <button
                key={oc.id}
                onClick={() => updateRsvpSettings({ orpColor: oc.id as any })}
                className={`p-2 border rounded flex items-center justify-center gap-1.5 transition-all text-[10px] ${
                  rsvp.orpColor === oc.id
                    ? "border-primary bg-accent/40 text-primary font-semibold"
                    : "border-border/30 hover:border-border/60 text-muted-foreground bg-card"
                }`}
              >
                <span className={`w-3 h-3 rounded-full ${oc.css} border border-border/20 inline-block`}></span>
                <span className="capitalize text-[10px]">{oc.id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Toggle glowing ORP */}
        <div className="flex items-center justify-between py-3 border-t border-border/10">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-foreground font-semibold">ORP spotlight glow</label>
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
            <label className="block text-xs font-mono uppercase tracking-wider text-foreground font-semibold">Visual guide lines</label>
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
            <label className="block text-xs font-mono uppercase tracking-wider text-foreground font-semibold">Unmarked text opacity</label>
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
          <label className="block text-xs font-mono uppercase tracking-wider text-foreground font-semibold mb-3">Unmarked text color</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "foreground", name: "Standard", desc: "Solid contrast" },
              { id: "primary", name: "Accent", desc: "Brand theme" },
              { id: "muted", name: "Dimmed", desc: "Subtle blend" },
            ].map((col) => (
              <button
                key={col.id}
                type="button"
                onClick={() => updateRsvpSettings({ unmarkedColor: col.id as any })}
                className={`p-2 border rounded text-center transition-all ${
                  rsvp.unmarkedColor === col.id
                    ? "border-primary bg-accent/40 text-primary font-bold"
                    : "border-border/30 hover:border-border/60 text-muted-foreground bg-card"
                }`}
              >
                <span className="block text-[10px] font-semibold">{col.name}</span>
                <span className="block text-[7px] opacity-60 font-mono tracking-wider">{col.desc}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
