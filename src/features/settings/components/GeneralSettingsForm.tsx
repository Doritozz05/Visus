"use client";

import * as React from "react";
import { Palette, CheckCircle, Check, Settings2 } from "lucide-react";
import { useSettings } from "@/features/settings/context/settings-context";
import type { GeneralSettings } from "@/core/entities/settings";

export function GeneralSettingsForm() {
  const { settings, updateGeneralSettings } = useSettings();
  const {
    theme,
    accentColor,
    uiFont,
    glassmorphism,
    reducedMotion,
    soundEffects,
    readingTimerReminder
  } = settings.general;

  return (
    <div className="space-y-6">
      {/* Visual Themes Module */}
      <div className="bg-card/50 border border-border/20 rounded-xl p-6 shadow-md glass-panel">
        <div className="flex items-center gap-2 mb-6 border-b border-border/30 pb-4">
          <Palette className="text-primary h-5 w-5" />
          <h3 className="text-sm font-bold font-heading text-foreground">Themes</h3>
        </div>

        {/* Predefined Themes Grid */}
        <div className="mb-6">
          <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">Color scheme theme</label>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { id: "dark-violet", name: "Dark Violet", desc: "Original Clinical Navy", preview: "bg-[#0b1326]" },
              { id: "light", name: "Claro Paper", desc: "Warm Minimal Light", preview: "bg-[#f1f3f6]" },
              { id: "matrix-green", name: "Matrix OLED", desc: "Pure Black & Neon Green", preview: "bg-[#000000]" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => updateGeneralSettings({ theme: t.id as GeneralSettings["theme"] })}
                className={`p-2.5 border rounded-lg text-left transition-all relative overflow-hidden flex flex-col justify-between ${theme === t.id
                  ? "border-primary bg-accent/65"
                  : "border-border/30 bg-card hover:border-border/60"
                  }`}
              >
                <div className="flex items-center justify-between mb-2 w-full">
                  <span className="text-[11px] font-bold">{t.name}</span>
                  {theme === t.id && <CheckCircle className="text-primary h-3.5 w-3.5" />}
                </div>
                <div className="flex gap-1.5 items-center">
                  <div className={`w-4 h-4 rounded-full ${t.preview} border border-border/40 shrink-0`}></div>
                  <span className="text-[8px] text-muted-foreground leading-tight truncate">{t.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Accent Highlight Color Selection */}
        <div className="mb-6">
          <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">Accent tint color</label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "indigo", color: "bg-indigo-500" },
              { id: "violet", color: "bg-violet-500" },
              { id: "emerald", color: "bg-emerald-500" },
              { id: "amber", color: "bg-amber-500" },
              { id: "rose", color: "bg-rose-500" },
              { id: "blue", color: "bg-blue-500" },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => updateGeneralSettings({ accentColor: c.id as GeneralSettings["accentColor"] })}
                className={`w-7 h-7 rounded-full ${c.color} border-2 flex items-center justify-center transition-all ${accentColor === c.id ? "border-foreground scale-110 shadow-md" : "border-transparent hover:scale-105"
                  }`}
              >
                {accentColor === c.id && (
                  <Check className="text-white h-3.5 w-3.5 stroke-[3]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* UI Typography */}
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">System UI font family</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "inter", name: "Inter", desc: "Sans-Serif" },
              { id: "outfit", name: "Outfit", desc: "Geometric" },
              { id: "roboto", name: "Hanken", desc: "Grotesk" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => updateGeneralSettings({ uiFont: f.id as GeneralSettings["uiFont"] })}
                className={`p-1.5 border rounded text-center transition-all ${uiFont === f.id
                  ? "border-primary bg-accent/30 text-primary font-bold"
                  : "border-border/30 hover:border-border/60 text-muted-foreground bg-card"
                  }`}
              >
                <span className="block text-[11px] font-semibold">{f.name}</span>
                <span className="block text-[7px] opacity-60 font-mono tracking-widest">{f.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Behavioral & Advanced Configuration */}
      <div className="bg-card/50 border border-border/20 rounded-xl p-6 shadow-md glass-panel">
        <div className="flex items-center gap-2 mb-6 border-b border-border/30 pb-4">
          <Settings2 className="text-primary h-5 w-5" />
          <h3 className="text-sm font-bold font-heading text-foreground">General features</h3>
        </div>

        {/* Settings toggles */}
        <div className="space-y-4">

          {/* Glassmorphism */}
          <div className="flex items-center justify-between py-1">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-foreground font-semibold">Frosted glass panels</label>
              <p className="text-[9px] text-muted-foreground mt-0.5">Enables premium frosted glass styles. Disable on slow hardware.</p>
            </div>
            <button
              onClick={() => updateGeneralSettings({ glassmorphism: !glassmorphism })}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 relative shrink-0 ${glassmorphism ? "bg-primary" : "bg-accent"}`}
            >
              <div className={`w-4 h-4 rounded-full bg-background transition-transform duration-300 ${glassmorphism ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between py-1 border-t border-border/10 pt-3">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-foreground font-semibold">Reduce UI motion</label>
              <p className="text-[9px] text-muted-foreground mt-0.5">Disables transitions for speed loads and pagination changes.</p>
            </div>
            <button
              onClick={() => updateGeneralSettings({ reducedMotion: !reducedMotion })}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 relative shrink-0 ${reducedMotion ? "bg-primary" : "bg-accent"}`}
            >
              <div className={`w-4 h-4 rounded-full bg-background transition-transform duration-300 ${reducedMotion ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>

          {/* Sound Effects */}
          <div className="flex items-center justify-between py-1 border-t border-border/10 pt-3">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-foreground font-semibold">Sound feedbacks</label>
              <p className="text-[9px] text-muted-foreground mt-0.5">Subtle clicks on pacing ticks and chimes on completing sessions.</p>
            </div>
            <button
              onClick={() => updateGeneralSettings({ soundEffects: !soundEffects })}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 relative shrink-0 ${soundEffects ? "bg-primary" : "bg-accent"}`}
            >
              <div className={`w-4 h-4 rounded-full bg-background transition-transform duration-300 ${soundEffects ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>

          {/* Cognitive rest alerts */}
          <div className="py-2 border-t border-border/10 pt-3 flex flex-col justify-between gap-2.5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-foreground font-semibold">Cognitive rest alerts</label>
              <p className="text-[9px] text-muted-foreground mt-0.5">Rest prompts after prolonged speed training sessions.</p>
            </div>
            <div className="flex items-center gap-1.5">
              {[
                { val: 0, label: "Off" },
                { val: 10, label: "10m" },
                { val: 20, label: "20m" },
                { val: 30, label: "30m" },
              ].map((o) => (
                <button
                  key={o.val}
                  onClick={() => updateGeneralSettings({ readingTimerReminder: o.val })}
                  className={`flex-1 py-1.5 text-[9px] font-mono border rounded transition-all ${readingTimerReminder === o.val
                    ? "bg-primary text-primary-foreground font-bold border-primary"
                    : "border-border/30 hover:border-border/60 text-muted-foreground bg-card"
                    }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
