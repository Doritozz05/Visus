/**
 * Color Presets defined for the Visus aesthetic.
 */
export const COLOR_PRESETS: Record<string, string> = {
  violet: "#8b5cf6",
  indigo: "#6366f1",
  emerald: "#10b981",
  amber: "#f59e0b",
  rose: "#f43f5e",
  blue: "#3b82f6",
  orange: "#f97316",
  periwinkle: "#c0c1ff",
  white: "#ffffff",
};

/**
 * Resolves a color string. If it is a predefined preset key,
 * returns its hex code. Otherwise, returns the color string as-is.
 */
export function resolveColor(color: string): string {
  if (!color) return "#ffffff";
  const lower = color.toLowerCase();
  if (lower in COLOR_PRESETS) {
    return COLOR_PRESETS[lower];
  }
  return color;
}

/**
 * Converts a hex color string to rgba format with the specified opacity.
 * Supports both 3-digit and 6-digit hex formats, with or without '#'.
 */
export function hexToRgba(hex: string, alpha: number): string {
  if (!hex) return `rgba(255, 255, 255, ${alpha})`;
  
  // Resolve preset keys to hexes first
  const resolvedHex = resolveColor(hex);
  
  let cleaned = resolvedHex.replace("#", "").trim();
  
  if (cleaned.length === 3) {
    cleaned = cleaned[0] + cleaned[0] + cleaned[1] + cleaned[1] + cleaned[2] + cleaned[2];
  }
  
  if (cleaned.length !== 6) {
    // Return fallback if invalid hex
    return resolvedHex;
  }
  
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Converts a hex color string to HSL components.
 * Returns the individual components and a space-separated string format
 * suitable for Tailwind HSL variables ("H S% L%").
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number; stringVal: string } {
  const resolvedHex = resolveColor(hex);
  let cleaned = resolvedHex.replace("#", "").trim();
  
  if (cleaned.length === 3) {
    cleaned = cleaned[0] + cleaned[0] + cleaned[1] + cleaned[1] + cleaned[2] + cleaned[2];
  }
  
  const r = parseInt(cleaned.substring(0, 2), 16) / 255;
  const g = parseInt(cleaned.substring(2, 4), 16) / 255;
  const b = parseInt(cleaned.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  const hDeg = Math.round(h * 360);
  const sPct = Math.round(s * 100);
  const lPct = Math.round(l * 100);

  return {
    h: hDeg,
    s: sPct,
    l: lPct,
    stringVal: `${hDeg} ${sPct}% ${lPct}%`
  };
}
