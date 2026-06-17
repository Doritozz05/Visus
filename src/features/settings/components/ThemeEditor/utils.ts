import type { CustomTheme } from "@/core/entities/settings";
import { resolveColor } from "@/lib/color-utils";
import { BUILTIN_THEMES } from "@/core/config/themes";

export const DEFAULT_NEW_THEME = (id: string): CustomTheme => ({
  id,
  name: "My custom theme",
  isDark: false,
  background: "#f3f4f6",
  foreground: "#1f2937",
  border: "#e5e7eb",
  cardBackground: "#ffffff",
  cardForeground: "#1f2937",
  cardBorder: "#e5e7eb",
  cardRadius: "12px",
  cardShadow: "sm",
  accent: "#8b5cf6",
  accentForeground: "#ffffff",
  muted: "#f9fafb",
  mutedForeground: "#6b7280",
  secondary: "#f3f4f6",
  secondaryForeground: "#1f2937",
  popover: "#ffffff",
  popoverForeground: "#1f2937",
  uiAccent: "#e5e7eb",
  uiAccentForeground: "#8b5cf6",
  overrideSidebar: false,
  bgType: "solid",
  glassmorphism: {
    enabled: false,
    blur: 12,
    opacity: 0.45,
    borderOpacity: 0.1
  },
  glowSettings: {
    enabled: false,
    color: "#8b5cf6",
    brightness: 0.15,
    spread: 0,
    blur: 15
  }
});

/**
 * Scopes custom CSS declarations by prefixing selectors with a wrapper selector.
 * Prevents custom CSS from leaking out of the sandbox and breaking the parent editor UI.
 */
export function scopeCss(css: string, prefix: string): string {
  if (!css) return "";
  // Remove block comments
  let cleanCss = css.replace(/\/\*[\s\S]*?\*\//g, "");

  return cleanCss
    .split("}")
    .map((rule) => {
      const parts = rule.split("{");
      if (parts.length !== 2) return rule;
      const selectors = parts[0];
      const declarations = parts[1];

      const scopedSelectors = selectors
        .split(",")
        .map((sel) => {
          const trimmed = sel.trim();
          if (!trimmed) return "";
          if (trimmed.startsWith("@")) {
            return trimmed;
          }
          return `${prefix} ${trimmed}`;
        })
        .filter(Boolean)
        .join(", ");

      return `${scopedSelectors} {${declarations}`;
    })
    .join("}");
}

export const PRESETS_TEMPLATES = BUILTIN_THEMES.map(t => ({
  ...t,
  glassmorphism: t.glassmorphism || {
    enabled: false,
    blur: 12,
    opacity: 0.45,
    borderOpacity: 0.25
  }
}));

export const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    // Create an initial object URL for the original file
    const originalUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      // Max dimensions: 4096px width/height
      const MAX_DIMENSION = 4096;

      // If the image is already within limits, return original blob URL
      if (img.width <= MAX_DIMENSION && img.height <= MAX_DIMENSION) {
        resolve(originalUrl);
        return;
      }

      // Only resize if necessary
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(originalUrl);
        return;
      }

      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_DIMENSION) {
          height *= MAX_DIMENSION / width;
          width = MAX_DIMENSION;
        }
      } else {
        if (height > MAX_DIMENSION) {
          width *= MAX_DIMENSION / height;
          height = MAX_DIMENSION;
        }
      }

      canvas.width = width;
      canvas.height = height;
      
      // Use high-quality resizing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Export as Blob, then convert to ObjectURL
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Failed to create blob"));
          return;
        }
        URL.revokeObjectURL(originalUrl); // Clean up original URL
        resolve(URL.createObjectURL(blob));
      }, "image/webp", 0.95);
    };
    img.onerror = () => {
      URL.revokeObjectURL(originalUrl);
      reject(new Error("Failed to load image"));
    };
    img.src = originalUrl;
  });
};

export function hexToRgb(hex: string): string {
  const resolved = resolveColor(hex);
  let cleaned = resolved.replace("#", "").trim();
  if (cleaned.length === 3) {
    cleaned = cleaned[0] + cleaned[0] + cleaned[1] + cleaned[1] + cleaned[2] + cleaned[2];
  }
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return isNaN(r) ? "255, 255, 255" : `${r}, ${g}, ${b}`;
}

export function deepCloneTheme(theme: CustomTheme): CustomTheme {
  return JSON.parse(JSON.stringify(theme));
}
