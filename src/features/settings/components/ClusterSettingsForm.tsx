"use client";

import * as React from "react";
import { useSettings } from "@/features/settings/context/settings-context";
import { Columns } from "lucide-react";

export function ClusterSettingsForm() {
  const { settings, updateClusterSettings } = useSettings();
  const cluster = settings.cluster;

  return (
    <div className="space-y-6">
      {/* Cluster Layout Controls */}
      <div className="bg-card/50 border border-border/20 rounded-xl p-6 shadow-md glass-panel">
        <div className="flex items-center gap-2 mb-6 border-b border-border/30 pb-4">
          <Columns className="text-primary h-5 w-5" />
          <h3 className="text-sm font-bold font-heading text-foreground">Cluster settings</h3>
        </div>

        {/* Size control */}
        <div className="mb-6">
          <div className="flex justify-between items-end mb-3">
            <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Active line optical font size</label>
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
          <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">Cluster canvas font family</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "inter", name: "Standard Sans", desc: "Inter Default" },
              { id: "atkinson", name: "Atkinson", desc: "Hyperlegible" },
              { id: "dyslexic", name: "Dyslexic", desc: "Accessibility" },
            ].map((tf) => (
              <button
                key={tf.id}
                onClick={() => updateClusterSettings({ fontFamily: tf.id as any })}
                className={`p-2 border rounded text-center transition-all ${cluster.fontFamily === tf.id
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

        {/* Highlight Styles */}
        <div className="mb-6">
          <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">Highlight visual style</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "spotlight", label: "Spotlight" },
              { id: "capsule", label: "Capsule Bubble" },
              { id: "underline", label: "Underline" },
              { id: "bold-only", label: "Bold text" },
              { id: "color-only", label: "Pure color" },
            ].map((style) => (
              <button
                key={style.id}
                onClick={() => updateClusterSettings({ highlightStyle: style.id as any })}
                className={`p-2 border rounded text-center transition-all text-xs ${cluster.highlightStyle === style.id
                  ? "border-primary bg-accent/45 text-primary font-bold"
                  : "border-border/20 hover:border-border/50 text-muted-foreground bg-card"
                  }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Highlight Color Selection */}
        <div className="mb-6">
          <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">Active cluster color</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { id: "white", css: "bg-foreground" },
              { id: "indigo", css: "bg-indigo-500" },
              { id: "violet", css: "bg-violet-500" },
              { id: "emerald", css: "bg-emerald-500" },
              { id: "amber", css: "bg-amber-500" },
              { id: "rose", css: "bg-rose-500" },
              { id: "blue", css: "bg-blue-500" },
            ].map((col) => (
              <button
                key={col.id}
                onClick={() => updateClusterSettings({ activeColor: col.id as any })}
                className={`p-1.5 border rounded flex items-center justify-center gap-1 transition-all text-[10px] capitalize ${cluster.activeColor === col.id
                  ? "border-primary bg-accent/40 text-primary font-bold"
                  : "border-border/30 hover:border-border/60 text-muted-foreground bg-card"
                  }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${col.css} inline-block border border-border/20`}></span>
                {col.id}
              </button>
            ))}
          </div>
        </div>

        {/* Inactive Line settings */}
        <div className="grid grid-cols-1 gap-6 py-4 border-t border-border/10">
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Inactive lines opacity</label>
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
            <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">Inactive blur amount</label>
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
                  className={`flex-1 py-1.5 text-[9px] font-mono border rounded transition-all ${cluster.blurAmount === b.val
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

        {/* Dynamic glow effect */}
        <div className="flex items-center justify-between py-4 border-t border-border/10">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-foreground font-semibold">Spotlight glow</label>
            <p className="text-[9px] text-muted-foreground mt-0.5">Adds subtle ambient glow under highlighted line.</p>
          </div>
          <div className="flex gap-1">
            {[
              { id: "none", label: "None" },
              { id: "indigo", label: "Indigo" },
              { id: "amber", label: "Amber" },
              { id: "green", label: "Green" },
            ].map((glow) => (
              <button
                key={glow.id}
                onClick={() => updateClusterSettings({ glowEffect: glow.id as any })}
                className={`px-2 py-1 text-[9px] font-mono border rounded transition-all ${cluster.glowEffect === glow.id
                  ? "bg-primary text-primary-foreground font-bold border-primary"
                  : "border-border/30 hover:border-border/60 text-muted-foreground bg-card"
                  }`}
              >
                {glow.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
