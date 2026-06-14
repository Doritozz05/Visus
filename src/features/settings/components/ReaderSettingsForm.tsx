"use client";

import * as React from "react";
import { Glasses } from "lucide-react";
import { useSettings } from "@/features/settings/context/settings-context";
import type { GeneralSettings } from "@/core/entities/settings";

export function ReaderSettingsForm() {
  const { settings, updateGeneralSettings } = useSettings();
  const {
    readerFontSize,
    readerFontFamily,
    readerWordsPerPage
  } = settings.general;

  return (
    <div className="space-y-6">
      {/* Pages Reader */}
      <div className="bg-card/50 border border-border/20 rounded-xl p-6 shadow-md liquid-glass">
        <div className="flex items-center gap-2 mb-6 border-b border-border/30 pb-4">
          <Glasses className="text-primary h-5 w-5" />
          <h3 className="text-sm font-bold font-heading text-foreground">Traditional pages</h3>
        </div>

        {/* Font size */}
        <div className="mb-6">
          <div className="flex justify-between items-end mb-3">
            <label className="block text-[10px] font-sans uppercase tracking-wider text-muted-foreground">Reader font size</label>
            <span className="text-[11px] font-mono text-primary font-bold bg-accent px-2 py-0.5 rounded border border-border/30">{readerFontSize || 16}px</span>
          </div>
          <input
            data-testid="reader-font-size"
            className="w-full accent-primary h-1 bg-accent rounded-lg appearance-none cursor-pointer"
            max="26"
            min="14"
            type="range"
            value={readerFontSize || 16}
            onChange={(e) => updateGeneralSettings({ readerFontSize: Number(e.target.value) })}
          />
          <div className="flex justify-between text-[8px] font-mono text-muted-foreground mt-1">
            <span>14px (Compact)</span>
            <span>26px (Large)</span>
          </div>
        </div>

        {/* Words per page density */}
        <div className="mb-6">
          <div className="flex justify-between items-end mb-3">
            <label className="block text-[10px] font-sans uppercase tracking-wider text-muted-foreground">Page text density (words)</label>
            <span className="text-[11px] font-mono text-primary font-bold bg-accent px-2 py-0.5 rounded border border-border/30">{readerWordsPerPage || 300} words</span>
          </div>
          <input
            data-testid="reader-words-per-page"
            className="w-full accent-primary h-1 bg-accent rounded-lg appearance-none cursor-pointer"
            max="500"
            min="200"
            step="25"
            type="range"
            value={readerWordsPerPage || 300}
            onChange={(e) => updateGeneralSettings({ readerWordsPerPage: Number(e.target.value) })}
          />
          <div className="flex justify-between text-[8px] font-mono text-muted-foreground mt-1">
            <span>200 (Low density)</span>
            <span>500 (High density)</span>
          </div>
        </div>

        {/* Reading Typeface */}
        <div>
          <label className="block text-[10px] font-sans uppercase tracking-wider text-muted-foreground mb-3">Reader typeface</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "inter", name: "Standard Sans", desc: "Inter UI" },
              { id: "atkinson", name: "Atkinson", desc: "Hyperlegible" },
              { id: "dyslexic", name: "Dyslexic", desc: "Accessibility" },
              { id: "serif", name: "Lora Serif", desc: "Book Classic" },
            ].map((tf) => (
              <button
                key={tf.id}
                data-testid={`font-family-button-${tf.id}`}
                onClick={() => updateGeneralSettings({ readerFontFamily: tf.id as GeneralSettings["readerFontFamily"] })}
                className={`p-2 border rounded-lg text-left transition-all ${readerFontFamily === tf.id
                    ? "border-primary bg-accent/40 text-primary font-bold"
                    : "border-border/30 hover:border-border/60 text-muted-foreground bg-card"
                  }`}
              >
                <span className="block text-[11px] font-semibold">{tf.name}</span>
                <span className="block text-[7px] opacity-60 font-sans tracking-widest">{tf.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
