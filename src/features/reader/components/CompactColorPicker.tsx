"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Palette, Pipette, X } from "lucide-react";

const RECENT_COLORS_KEY = "visus:recentAnnotationColors";
const MAX_RECENT = 8;

const PRESET_COLORS = [
  { label: "Yellow", value: "#fef08a" },
  { label: "Green", value: "#bbf7d0" },
  { label: "Blue", value: "#bfdbfe" },
  { label: "Pink", value: "#fbcfe8" },
  { label: "Orange", value: "#fed7aa" },
  { label: "Purple", value: "#e9d5ff" },
  { label: "Red", value: "#fecaca" },
  { label: "Teal", value: "#99f6e4" },
];

function hsvToHex(h: number, s: number, v: number): string {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  };
  const r = Math.round(f(5) * 255);
  const g = Math.round(f(3) * 255);
  const b = Math.round(f(1) * 255);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function hexToHsv(hex: string): { h: number; s: number; v: number } {
  let cleaned = hex.replace('#', '');
  if (cleaned.length === 3) {
    cleaned = cleaned[0] + cleaned[0] + cleaned[1] + cleaned[1] + cleaned[2] + cleaned[2];
  }
  if (cleaned.length !== 6) return { h: 0, s: 0, v: 100 };

  const r = parseInt(cleaned.substring(0, 2), 16) / 255;
  const g = parseInt(cleaned.substring(2, 4), 16) / 255;
  const b = parseInt(cleaned.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  const v = Math.round(max * 100);
  const s = max === 0 ? 0 : Math.round((d / max) * 100);

  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }

  return { h: Math.round(h), s, v };
}

function getRecentColors(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_COLORS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.slice(0, MAX_RECENT);
    return [];
  } catch {
    return [];
  }
}

function saveRecentColor(color: string) {
  try {
    const existing = getRecentColors().filter(c => c.toLowerCase() !== color.toLowerCase());
    existing.unshift(color);
    localStorage.setItem(RECENT_COLORS_KEY, JSON.stringify(existing.slice(0, MAX_RECENT)));
  } catch {}
}

interface CompactColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function CompactColorPicker({ value, onChange }: CompactColorPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const squareRef = React.useRef<HTMLDivElement>(null);
  const svRef = React.useRef<{ s: number; v: number } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const initialHsv = React.useMemo(() => hexToHsv(value), [value]);
  const [hue, setHue] = React.useState(initialHsv.h);
  const [sat, setSat] = React.useState(initialHsv.s);
  const [val, setVal] = React.useState(initialHsv.v);
  const [hexInput, setHexInput] = React.useState(value);
  const [recentColors, setRecentColors] = React.useState<string[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);

  const activeHex = hsvToHex(hue, sat / 100, val / 100);

  React.useEffect(() => {
    if (!isOpen) return;
    setRecentColors(getRecentColors());
    const hsv = hexToHsv(value);
    setHue(hsv.h);
    setSat(hsv.s);
    setVal(hsv.v);
    setHexInput(value);
    svRef.current = { s: hsv.s, v: hsv.v };
  }, [isOpen, value]);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const commitColor = React.useCallback((color: string) => {
    saveRecentColor(color);
    onChange(color);
    setIsOpen(false);
  }, [onChange]);

  const handleSwatchClick = React.useCallback((color: string) => {
    const hsv = hexToHsv(color);
    setHue(hsv.h);
    setSat(hsv.s);
    setVal(hsv.v);
    setHexInput(color);
    svRef.current = { s: hsv.s, v: hsv.v };
    commitColor(color);
  }, [commitColor]);

  const handleHexSubmit = React.useCallback(() => {
    const raw = hexInput.trim();
    const hex = raw.startsWith("#") ? raw : `#${raw}`;
    if (/^#[0-9A-Fa-f]{6}$/.test(hex) || /^#[0-9A-Fa-f]{3}$/.test(hex)) {
      const expanded = hex.length === 4
        ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
        : hex;
      setHexInput(expanded);
      const hsv = hexToHsv(expanded);
      setHue(hsv.h);
      setSat(hsv.s);
      setVal(hsv.v);
      svRef.current = { s: hsv.s, v: hsv.v };
      commitColor(expanded);
    }
  }, [hexInput, commitColor]);

  const handleHueChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newHue = parseInt(e.target.value, 10);
    setHue(newHue);
  }, []);

  const handleHueCommit = React.useCallback(() => {
    if (svRef.current) {
      const color = hsvToHex(hue, svRef.current.s / 100, svRef.current.v / 100);
      setHexInput(color);
    }
  }, [hue]);

  const handleNativePickerChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    const hsv = hexToHsv(color);
    setHue(hsv.h);
    setSat(hsv.s);
    setVal(hsv.v);
    setHexInput(color);
    svRef.current = { s: hsv.s, v: hsv.v };
    commitColor(color);
  }, [commitColor]);

  const getSquarePos = React.useCallback((clientX: number, clientY: number) => {
    const el = squareRef.current;
    if (!el) return { s: sat, v: val };
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    return { s: Math.round(x * 100), v: Math.round((1 - y) * 100) };
  }, [sat, val]);

  const handleSquarePointerDown = React.useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    const el = squareRef.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    setIsDragging(true);
    const pos = getSquarePos(e.clientX, e.clientY);
    setSat(pos.s);
    setVal(pos.v);
    svRef.current = { s: pos.s, v: pos.v };
  }, [getSquarePos]);

  const handleSquarePointerMove = React.useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const pos = getSquarePos(e.clientX, e.clientY);
    setSat(pos.s);
    setVal(pos.v);
    svRef.current = { s: pos.s, v: pos.v };
  }, [isDragging, getSquarePos]);

  const handleSquarePointerUp = React.useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const el = squareRef.current;
    if (el) el.releasePointerCapture(e.pointerId);
    if (svRef.current) {
      const color = hsvToHex(hue, svRef.current.s / 100, svRef.current.v / 100);
      setHexInput(color);
    }
  }, [isDragging, hue]);

  const pureHueHex = hsvToHex(hue, 1, 1);

  const toolbarBtnClass = "w-5 h-5 rounded-full border-2 border-border/40 ring-1 ring-foreground/10 transition-transform hover:scale-110 flex-shrink-0";

  return (
    <div ref={containerRef} className="relative flex items-center gap-1">
      {PRESET_COLORS.map((c) => (
        <button
          key={c.label}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleSwatchClick(c.value)}
          className={toolbarBtnClass}
          style={{ backgroundColor: c.value }}
          title={c.label}
        />
      ))}

      <div className="w-px h-5 bg-border/40 mx-0.5" />

      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setIsOpen(!isOpen)}
        className="w-5 h-5 rounded-full bg-muted/60 hover:bg-muted flex items-center justify-center transition-colors flex-shrink-0"
        title="Custom color"
      >
        <Palette className="w-3 h-3 text-muted-foreground" />
      </button>

      {isOpen && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[10001] flex items-center justify-center"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="fixed inset-0" onMouseDown={() => setIsOpen(false)} />
          <div
            className="relative bg-card border border-border/40 rounded-xl shadow-2xl p-4 flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-150"
            style={{ width: 280 }}
            onMouseDown={(e) => e.preventDefault()}
          >
            {/* Sat/Brightness Square */}
            <div
              ref={squareRef}
              className="relative w-full rounded-lg overflow-hidden cursor-crosshair select-none"
              style={{
                height: 200,
                background: `
                  linear-gradient(to top, #000, transparent),
                  linear-gradient(to right, #fff, ${pureHueHex})
                `,
              }}
              onPointerDown={handleSquarePointerDown}
              onPointerMove={handleSquarePointerMove}
              onPointerUp={handleSquarePointerUp}
              onPointerCancel={handleSquarePointerUp}
            >
              <div
                className="absolute w-3.5 h-3.5 rounded-full border-2 border-white pointer-events-none"
                style={{
                  left: `${sat}%`,
                  top: `${100 - val}%`,
                  transform: "translate(-50%, -50%)",
                  boxShadow: "0 0 0 1px rgba(0,0,0,0.3), 0 0 4px rgba(0,0,0,0.5)",
                }}
              />
            </div>

            {/* Hue Slider */}
            <input
              type="range"
              min="0"
              max="360"
              value={hue}
              onChange={handleHueChange}
              onMouseUp={handleHueCommit}
              onTouchEnd={handleHueCommit}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
              }}
            />

            {/* Hex Input + Preview + Native picker */}
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg border border-border/30 shrink-0"
                style={{ backgroundColor: activeHex }}
              />
              <input
                type="text"
                value={hexInput}
                onChange={(e) => setHexInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleHexSubmit();
                  if (e.key === "Escape") setIsOpen(false);
                }}
                placeholder="#HEX"
                className="flex-1 bg-muted/30 border border-border/30 rounded-lg px-2.5 py-1.5 text-xs font-mono uppercase tracking-wider text-foreground placeholder-muted-foreground/60 focus:outline-none focus:border-primary/50"
              />
              <input
                type="color"
                ref={fileInputRef}
                value={activeHex}
                onChange={handleNativePickerChange}
                className="sr-only"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Open native color picker"
                className="p-1.5 rounded-md hover:bg-accent/50 transition-colors text-muted-foreground hover:text-foreground"
              >
                <Pipette className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Recent Colors + Actions */}
            <div className="flex items-center justify-between gap-3">
              {recentColors.length > 0 ? (
                <div className="flex items-center gap-1 flex-wrap flex-1 min-w-0">
                  {recentColors.map((color) => (
                    <button
                      key={color}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSwatchClick(color)}
                      className="w-4 h-4 rounded-full border border-border/20 hover:scale-110 transition-transform flex-shrink-0"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex-1" />
              )}

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => {
                    if (svRef.current) {
                      const color = hsvToHex(hue, svRef.current.s / 100, svRef.current.v / 100);
                      saveRecentColor(color);
                      onChange(color);
                    }
                    setIsOpen(false);
                  }}
                  className="px-3 py-1 text-[10px] font-mono uppercase bg-primary text-primary-foreground rounded-lg hover:brightness-110 transition-all font-semibold"
                >
                  Apply
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md hover:bg-accent/50 transition-colors text-muted-foreground hover:text-foreground"
                  title="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
