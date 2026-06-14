"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Check, Plus, X, Pipette, ChevronDown, RotateCcw } from "lucide-react";
import { useSettings } from "@/features/settings/context/settings-context";
import { COLOR_PRESETS, resolveColor, hexToHsl, THEME_DEFAULTS } from "@/lib/color-utils";

export interface ColorSelectorProps {
  value?: string;
  onChange: (color: string) => void;
  onChangeComplete?: (color: string) => void;
  initialValue?: string;
  label?: string;
  showWhitePreset?: boolean;
  presets?: Array<{ id: string; hex: string; name?: string }>;
  menuZIndex?: number;
  useFactoryDefaults?: boolean;
}

// Helper to convert HSL to Hex
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function ColorSelector({
  value,
  onChange,
  onChangeComplete,
  initialValue,
  label,
  showWhitePreset = false,
  presets,
  menuZIndex = 160,
  useFactoryDefaults = false,
}: ColorSelectorProps) {
  const { settings, updateGeneralSettings } = useSettings();
  const [isOpen, setIsOpen] = React.useState(false);
  const [hexInput, setHexInput] = React.useState("");
  
  // Resolve current theme colors for quick picking
  const themeColors = React.useMemo(() => {
    const { theme, customThemes = [], accentColor } = settings.general;
    
    // If it's a built-in theme
    if (THEME_DEFAULTS[theme]) {
      const colors = { ...THEME_DEFAULTS[theme] };
      
      if (!useFactoryDefaults && accentColor && accentColor.startsWith("#")) {
        colors.primary = accentColor;
      }

      return [
        { id: "foreground", hex: colors.fg, name: "Theme Text" },
        { id: "primary", hex: colors.primary, name: useFactoryDefaults ? "Original Accent" : "Active Accent" },
        { id: "muted", hex: colors.muted, name: "Theme Dimmed" },
      ];
    }

    // If it's a custom theme
    const custom = customThemes.find(t => t.id === theme);
    if (custom) {
      return [
        { id: "foreground", hex: custom.foreground, name: "Theme Text" },
        { id: "primary", hex: custom.accent, name: "Theme Accent" },
        { id: "muted", hex: custom.mutedForeground, name: "Theme Dimmed" },
      ];
    }

    return [];
  }, [settings.general, useFactoryDefaults]);

  // Track internal HSL to avoid rounding drift during slider interaction
  const [internalHsl, setInternalHsl] = React.useState<{h: number, s: number, l: number} | null>(null);
  const isInteracting = React.useRef(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [menuStyle, setMenuStyle] = React.useState<React.CSSProperties>({});
  const [isMenuPositioned, setIsMenuPositioned] = React.useState(false);

  const savedColors = settings.general.savedColors || [];

  // Source of truth for resolving the color: 
  // If 'value' is missing, we use the theme's primary color from THEME_DEFAULTS
  const resolvedHex = React.useMemo(() => {
    if (value && value !== "primary" && value !== "foreground") return resolveColor(value);
    
    const themeId = settings.general.theme;
    const currentTheme = THEME_DEFAULTS[themeId];
    
    if (value === "foreground") return currentTheme?.fg || "#000000";
    return currentTheme?.primary || "#8b5cf6";
  }, [value, settings.general.theme]);

  // Derive HSL for sliders
  const { h, s, l } = React.useMemo(() => {
    if (internalHsl) return internalHsl;
    try {
      // Don't try to parse 'var()' or semantic keys directly in hexToHsl
      const hex = resolvedHex.startsWith("#") ? resolvedHex : "#8b5cf6";
      return hexToHsl(hex);
    } catch (e) {
      return { h: 0, s: 0, l: 100 };
    }
  }, [resolvedHex, internalHsl]);

  // Sync state with value prop
  React.useEffect(() => {
    setHexInput(resolvedHex.startsWith("#") ? resolvedHex : "");
  }, [resolvedHex]);

  // Logic to calculate position relative to the DOCUMENT (natural scrolling)
  const updateMenuPosition = React.useCallback(() => {
    const triggerEl = triggerRef.current;
    if (!triggerEl) return;

    const rect = triggerEl.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const viewportHeight = window.innerHeight;
    
    const menuWidth = Math.max(280, rect.width);
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const preferAbove = spaceBelow < 400 && spaceAbove > spaceBelow;

    const style: React.CSSProperties = {
      position: "absolute", // Absolute relative to body
      left: rect.left + scrollX,
      width: menuWidth,
      zIndex: menuZIndex,
    };

    if (preferAbove) {
      style.bottom = (viewportHeight - rect.top) - scrollY + 8;
    } else {
      style.top = rect.bottom + scrollY + 8;
    }

    // Only update if something actually changed to prevent render loops
    setMenuStyle(prev => {
      if (JSON.stringify(prev) === JSON.stringify(style)) return prev;
      return style;
    });
    setIsMenuPositioned(true);
  }, [menuZIndex]);

  React.useLayoutEffect(() => {
    if (!isOpen) return;
    
    // Initial position
    updateMenuPosition();

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (containerRef.current?.contains(target) || dropdownRef.current?.contains(target)) return;
      setIsOpen(false);
    };

    // We only need to reposition on resize (absolute positioning handles scroll naturally)
    const handleResize = () => {
      window.requestAnimationFrame(updateMenuPosition);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen, updateMenuPosition]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    
    // Validate hex format: # followed by 3 or 6 hex digits
    if (/^#[0-9A-Fa-f]{6}$/.test(val) || /^#[0-9A-Fa-f]{3}$/.test(val)) {
      onChange(val);
      onChangeComplete?.(val);
    }
  };

  const handleHslSliderChange = (type: 'h' | 's' | 'l', newVal: number) => {
    const nextHsl = {
      h: type === 'h' ? newVal : h,
      s: type === 's' ? newVal : s,
      l: type === 'l' ? newVal : l
    };
    
    setInternalHsl(nextHsl);
    const newHex = hslToHex(nextHsl.h, nextHsl.s, nextHsl.l);
    onChange(newHex);
  };

  const handleInteractionStart = () => {
    isInteracting.current = true;
  };

  const handleInteractionEnd = () => {
    if (!isInteracting.current) return;
    isInteracting.current = false;
    
    // When interaction ends, push to history
    const currentHex = hslToHex(h, s, l);
    onChangeComplete?.(currentHex);
  };

  // Sync internal HSL when external value changes to something different
  React.useEffect(() => {
    if (internalHsl) {
      const currentInternalHex = hslToHex(internalHsl.h, internalHsl.s, internalHsl.l);
      if ((resolvedHex?.toLowerCase() || "") !== currentInternalHex.toLowerCase()) {
        setInternalHsl(null);
      }
    }
  }, [resolvedHex, internalHsl]);

  const triggerNativePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleNativePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    onChangeComplete?.(val);
  };

  const saveCurrentColor = () => {
    const currentHex = resolveColor(value || resolvedHex);
    if (!savedColors.includes(currentHex)) {
      const updated = [...savedColors, currentHex];
      updateGeneralSettings({ savedColors: updated });
    }
  };

  const removeSavedColor = (colorToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent choosing the color when deleting
    const updated = savedColors.filter((c) => c.toLowerCase() !== colorToRemove.toLowerCase());
    updateGeneralSettings({ savedColors: updated });
  };

  const revertToInitial = () => {
    const resetColor = initialValue || value || resolvedHex;
    onChange(resetColor);
    onChangeComplete?.(resetColor);
    setInternalHsl(null);
  };

  // Build the list of preset items
  const presetsList = presets || Object.entries(COLOR_PRESETS)
    .filter(([key]) => key !== "white" || showWhitePreset)
    .map(([key, hex]) => ({ id: key, hex, name: key }));

  const isActivePreset = (presetId: string, hex: string) => {
    const activeHex = resolvedHex.toLowerCase();
    const presetHex = resolveColor(hex).toLowerCase();
    
    // Active if the HEX codes match (visual sync) OR the semantic ID matches (logical sync)
    return activeHex === presetHex || (value?.toLowerCase() || "") === presetId.toLowerCase();
  };

  const isActiveSaved = (hex: string) => {
    if (!value) return false;
    const currentHex = resolveColor(value).toLowerCase();
    const presetKeys = presetsList.map((p) => p.id.toLowerCase());
    return currentHex === hex.toLowerCase() && !presetKeys.includes(value.toLowerCase());
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
          {label}
        </label>
      )}

      {/* Main Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2.5 bg-card/40 border border-border/30 hover:border-border/60 hover:bg-accent/10 rounded-xl transition-all font-mono text-xs text-left"
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-5 h-5 rounded-full border border-border/40 shadow-inner shrink-0"
            style={{ backgroundColor: resolvedHex }}
          />
          <div className="flex flex-col">
            <span className="font-semibold text-foreground capitalize">
              {value === "primary" ? "Theme Accent" : 
               value === "foreground" ? "Theme Text" :
               presetsList.find(p => p.id === value || p.hex === value)?.name || 
               (value && (value in COLOR_PRESETS) ? value : (!value ? "Theme Default" : "Custom Color"))}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase">{resolvedHex}</span>
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Panel - Solid Opaque bg-card for readability */}
      {isOpen && typeof document !== "undefined" && createPortal(
        <div 
          ref={dropdownRef}
          style={{
            ...menuStyle,
            visibility: isMenuPositioned ? "visible" : "hidden",
          }}
          className="p-4 bg-card border border-border/40 rounded-xl shadow-2xl animate-slide-in-top flex flex-col gap-4"
          onMouseUp={handleInteractionEnd}
          onMouseLeave={handleInteractionEnd}
          onTouchEnd={handleInteractionEnd}
        >
          
          {/* Custom HSL Sliders */}
          <div className="space-y-3 p-3 bg-accent/5 rounded-xl border border-border/20">
            {/* Hue Slider */}
            <div>
              <div className="flex justify-between text-[8px] font-mono uppercase text-muted-foreground mb-1">
                <span>Hue</span>
                <span>{h}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={h}
                onMouseDown={handleInteractionStart}
                onTouchStart={handleInteractionStart}
                onChange={(e) => handleHslSliderChange('h', parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
                }}
              />
            </div>

            {/* Saturation Slider */}
            <div>
              <div className="flex justify-between text-[8px] font-mono uppercase text-muted-foreground mb-1">
                <span>Saturation</span>
                <span>{s}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={s}
                onMouseDown={handleInteractionStart}
                onTouchStart={handleInteractionStart}
                onChange={(e) => handleHslSliderChange('s', parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${hslToHex(h, 0, l)}, ${hslToHex(h, 100, l)})`
                }}
              />
            </div>

            {/* Lightness Slider */}
            <div>
              <div className="flex justify-between text-[8px] font-mono uppercase text-muted-foreground mb-1">
                <span>Lightness</span>
                <span>{l}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={l}
                onMouseDown={handleInteractionStart}
                onTouchStart={handleInteractionStart}
                onChange={(e) => handleHslSliderChange('l', parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #000000, ${hslToHex(h, s, 50)}, #ffffff)`
                }}
              />
            </div>
          </div>

          {/* HEX Input & Controls */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={hexInput}
                onChange={handleHexChange}
                placeholder="#HEXCODE"
                className="w-full bg-accent/40 border border-border/30 focus:border-primary/50 focus:outline-none rounded-lg px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-foreground placeholder-muted-foreground/45"
              />
            </div>
            
            {/* Revert Button */}
            {(initialValue ? value !== initialValue : false) && (
              <button
                type="button"
                onClick={revertToInitial}
                title="Revert to initial color"
                className="p-2 border border-border/30 hover:border-primary hover:text-primary rounded-lg transition-colors bg-accent/20 shrink-0 text-muted-foreground flex items-center justify-center"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}

            {/* Hidden Input Color Picker */}
            <input
              type="color"
              ref={fileInputRef}
              value={resolvedHex.startsWith("#") ? resolvedHex : "#8b5cf6"}
              onChange={handleNativePickerChange}
              className="sr-only"
            />
            
            <button
              type="button"
              onClick={triggerNativePicker}
              title="Open full color spectrum picker"
              className="p-2 border border-border/30 hover:border-primary hover:text-primary rounded-lg transition-colors bg-accent/20 shrink-0 text-muted-foreground flex items-center justify-center"
            >
              <Pipette className="h-4 w-4" />
            </button>

            {/* Save Custom Color Button */}
            {!savedColors.includes(resolvedHex) && (
              <button
                type="button"
                onClick={saveCurrentColor}
                className="px-2.5 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-[10px] font-mono uppercase tracking-wider font-semibold transition-all shrink-0 flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Save
              </button>
            )}
          </div>

          {/* Theme Specific Presets */}
          <div className="flex flex-col gap-2">
            <span className="block text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Dynamic Theme Colors</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  onChange("primary");
                  onChangeComplete?.("primary");
                }}
                className={`flex-1 flex items-center gap-2 p-1.5 border rounded-lg transition-all ${
                  value === "primary" ? "border-primary bg-primary/10" : "border-border/30 hover:border-border/60"
                }`}
              >
                <div className="w-4 h-4 rounded-full border border-border/40" style={{ backgroundColor: THEME_DEFAULTS[settings.general.theme]?.primary }} />
                <span className="text-[9px] font-bold">Theme Accent</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange("foreground");
                  onChangeComplete?.("foreground");
                }}
                className={`flex-1 flex items-center gap-2 p-1.5 border rounded-lg transition-all ${
                  value === "foreground" ? "border-primary bg-primary/10" : "border-border/30 hover:border-border/60"
                }`}
              >
                <div className="w-4 h-4 rounded-full border border-border/40" style={{ backgroundColor: THEME_DEFAULTS[settings.general.theme]?.fg }} />
                <span className="text-[9px] font-bold">Theme Text</span>
              </button>
            </div>
          </div>

          {/* Theme Specific Quick Picks */}
          {themeColors.length > 0 && (
            <div>
              <span className="block text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-2">Current Theme Colors</span>
              <div className="flex flex-wrap gap-2">
                {themeColors.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      onChange(preset.hex);
                      onChangeComplete?.(preset.hex);
                    }}
                    style={{ backgroundColor: preset.hex }}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                      isActivePreset(preset.id, preset.hex)
                        ? "border-foreground scale-110 shadow-md ring-2 ring-primary/45"
                        : "border-transparent hover:scale-105"
                    }`}
                    title={preset.name}
                  >
                    {isActivePreset(preset.id, preset.hex) && (
                      <Check className="text-white h-3.5 w-3.5 stroke-[3] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Standard Presets */}
          <div>
            <span className="block text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-2">Default Presets</span>
            <div className="flex flex-wrap gap-2">
              {presetsList.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    onChange(preset.id);
                    onChangeComplete?.(preset.id);
                  }}
                  style={{ backgroundColor: preset.hex }}
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                    isActivePreset(preset.id, preset.hex)
                      ? "border-foreground scale-110 shadow-md ring-2 ring-primary/45"
                      : "border-transparent hover:scale-105"
                  }`}
                  title={preset.name || preset.id}
                >
                  {isActivePreset(preset.id, preset.hex) && (
                    <Check className="text-white h-3.5 w-3.5 stroke-[3] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Saved Palette */}
          {savedColors.length > 0 && (
            <div>
              <span className="block text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-2">Saved Palette</span>
              <div className="flex flex-wrap gap-2">
                {savedColors.map((color) => (
                  <div key={color} className="relative group/color">
                    <button
                      type="button"
                      onClick={() => {
                        onChange(color);
                        onChangeComplete?.(color);
                      }}
                      style={{ backgroundColor: color }}
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                        isActiveSaved(color)
                          ? "border-foreground scale-110 shadow-md ring-2 ring-primary/45"
                          : "border-transparent hover:scale-105"
                      }`}
                      title={color}
                    >
                      {isActiveSaved(color) && (
                        <Check className="text-white h-3.5 w-3.5 stroke-[3] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => removeSavedColor(color, e)}
                      className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center justify-center opacity-0 group-hover/color:opacity-100 transition-opacity duration-200"
                      title="Remove saved color"
                    >
                      <X className="w-2.5 h-2.5 stroke-[2]" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>,
        document.body
      )}
    </div>
  );
}
