"use client";

import * as React from "react";
import { Palette } from "lucide-react";

const HIGHLIGHT_COLORS = [
  { label: "Yellow", value: "#fef08a" },
  { label: "Green", value: "#bbf7d0" },
  { label: "Blue", value: "#bfdbfe" },
  { label: "Pink", value: "#fbcfe8" },
  { label: "Orange", value: "#fed7aa" },
  { label: "Purple", value: "#e9d5ff" },
  { label: "Red", value: "#fecaca" },
  { label: "Teal", value: "#99f6e4" },
];

const LS_KEY = "visus:lastAnnotationColor";

function getLastColor(): string {
  if (typeof window === "undefined") return HIGHLIGHT_COLORS[0].value;
  try {
    return localStorage.getItem(LS_KEY) || HIGHLIGHT_COLORS[0].value;
  } catch {
    return HIGHLIGHT_COLORS[0].value;
  }
}

function saveLastColor(color: string) {
  try {
    localStorage.setItem(LS_KEY, color);
  } catch {}
}

interface QuickColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  size?: "sm" | "md";
}

export function QuickColorPicker({ value, onChange, size = "md" }: QuickColorPickerProps) {
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);
  const [hexInput, setHexInput] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const swatchSize = size === "sm" ? "w-5 h-5" : "w-6 h-6";
  const activeColor = value || getLastColor();

  React.useEffect(() => {
    if (!isPopupOpen) return;
    setHexInput(activeColor);
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsPopupOpen(false);
      }
    };
    const timer = setTimeout(() => document.addEventListener("mousedown", handleClickOutside), 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupOpen]);

  const handleSwatchClick = (color: string) => {
    saveLastColor(color);
    onChange(color);
  };

  const handleHexSubmit = () => {
    const raw = hexInput.trim();
    const hex = raw.startsWith("#") ? raw : `#${raw}`;
    if (/^#[0-9A-Fa-f]{6}$/.test(hex) || /^#[0-9A-Fa-f]{3}$/.test(hex)) {
      saveLastColor(hex);
      onChange(hex);
      setIsPopupOpen(false);
    }
  };

  const handleHexKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleHexSubmit();
    if (e.key === "Escape") setIsPopupOpen(false);
  };

  return (
    <div ref={containerRef} className="relative flex items-center gap-1">
      {HIGHLIGHT_COLORS.map((c) => (
        <button
          key={c.label}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleSwatchClick(c.value)}
          className={`${swatchSize} rounded-full border-2 border-white/20 ring-1 ring-black/10 transition-transform hover:scale-110 flex-shrink-0 ${
            activeColor.toLowerCase() === c.value.toLowerCase() ? "scale-110 ring-2 ring-white/60" : ""
          }`}
          style={{ backgroundColor: c.value }}
          title={c.label}
        />
      ))}

      <div className="w-px h-5 bg-zinc-600 mx-0.5" />

      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setIsPopupOpen(!isPopupOpen)}
        className={`${swatchSize} rounded-full bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center transition-colors flex-shrink-0`}
        title="Custom color"
      >
        <Palette className="w-3 h-3 text-zinc-300" />
      </button>

      {isPopupOpen && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-zinc-900 dark:bg-zinc-800 rounded-xl border border-white/10 shadow-xl z-50 flex flex-col gap-2 min-w-[180px]"
          onMouseDown={(e) => e.preventDefault()}
        >
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Hex Color</span>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full border border-white/10 shrink-0"
              style={{ backgroundColor: hexInput }}
            />
            <input
              type="text"
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value)}
              onKeyDown={handleHexKeyDown}
              placeholder="#HEX"
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs font-mono uppercase tracking-wider text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
            />
          </div>
          <div className="flex justify-end gap-2 mt-1">
            <button
              onClick={() => setIsPopupOpen(false)}
              className="px-3 py-1 text-[10px] font-mono uppercase text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleHexSubmit}
              className="px-3 py-1 text-[10px] font-mono uppercase bg-zinc-100 text-zinc-900 rounded-lg hover:bg-white transition-colors font-semibold"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
