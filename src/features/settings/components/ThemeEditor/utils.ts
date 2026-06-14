import type { CustomTheme } from "@/core/entities/settings";
import { resolveColor } from "@/lib/color-utils";

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

export const PRESETS_TEMPLATES = [
  {
    name: "Light minimal",
    isDark: false,
    background: "#f6f7f9",
    foreground: "#0f1729",
    border: "#ced3d9",
    cardBackground: "#ffffff",
    cardForeground: "#0f1729",
    cardBorder: "#ced3d9",
    accent: "#4f46e5",
    accentForeground: "#ffffff",
    muted: "#ececf9",
    mutedForeground: "#a8a2f8",
    secondary: "#e5e7eb",
    secondaryForeground: "#0f1729",
    popover: "#ffffff",
    popoverForeground: "#0f1729",
    uiAccent: "#e5e7eb",
    uiAccentForeground: "#4f46e5",
    cardRadius: "12px",
    cardShadow: "sm",
    glassmorphism: {
      enabled: false,
      blur: 12,
      opacity: 0.45,
      borderOpacity: 0.25
    }
  },
  {
    name: "Dark violet",
    isDark: true,
    background: "#0b1428",
    foreground: "#dae2fd",
    border: "#464554",
    cardBackground: "#182035",
    cardForeground: "#dae2fd",
    cardBorder: "#464554",
    accent: "#c2c3ff",
    accentForeground: "#0b1428",
    muted: "#222a3d",
    mutedForeground: "#cac7d6",
    secondary: "#222a3d",
    secondaryForeground: "#dae2fd",
    popover: "#182035",
    popoverForeground: "#dae2fd",
    uiAccent: "#222a3d",
    uiAccentForeground: "#c2c3ff",
    cardRadius: "12px",
    cardShadow: "none",
    glassmorphism: {
      enabled: false,
      blur: 12,
      opacity: 0.45,
      borderOpacity: 0.1
    }
  },
  {
    name: "Nord",
    isDark: true,
    background: "#2e3440",
    foreground: "#eceff4",
    border: "#4c566a",
    cardBackground: "#394050",
    cardForeground: "#eceff4",
    cardBorder: "#4c566a",
    accent: "#88c0d0",
    accentForeground: "#2e3440",
    muted: "#434c5e",
    mutedForeground: "#b6bdc9",
    secondary: "#434c5e",
    secondaryForeground: "#eceff4",
    popover: "#394050",
    popoverForeground: "#eceff4",
    uiAccent: "#434c5e",
    uiAccentForeground: "#88c0d0",
    cardRadius: "8px",
    cardShadow: "none",
    glassmorphism: {
      enabled: false,
      blur: 12,
      opacity: 0.45,
      borderOpacity: 0.1
    }
  },
  {
    name: "Warm sepia",
    isDark: false,
    background: "#f3ebd8",
    foreground: "#5a4535",
    border: "#dbd2bd",
    cardBackground: "#f8f3e7",
    cardForeground: "#5a4535",
    cardBorder: "#dbd2bd",
    accent: "#ac6b39",
    accentForeground: "#fdfbf7",
    muted: "#e4ddcd",
    mutedForeground: "#81624b",
    secondary: "#e4ddcd",
    secondaryForeground: "#5a4535",
    popover: "#f8f3e7",
    popoverForeground: "#5a4535",
    uiAccent: "#e4ddcd",
    uiAccentForeground: "#ac6b39",
    cardRadius: "16px",
    cardShadow: "md",
    glassmorphism: {
      enabled: false,
      blur: 12,
      opacity: 0.45,
      borderOpacity: 0.1
    }
  }
];

export const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        // Max dimensions: 800px width/height
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Quality 0.7 JPEG gives great results with minimal size
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
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
