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
  overrideReader: false,
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

export const getFontFamilyStyle = (font?: string) => {
  switch (font) {
    case "inter": return "var(--font-sans), sans-serif";
    case "outfit": return "var(--font-heading), sans-serif";
    case "roboto": return "'Hanken Grotesk', sans-serif";
    case "system-ui": return "system-ui, -apple-system, sans-serif";
    case "serif": return "var(--font-serif), Georgia, serif";
    case "atkinson": return "'Atkinson Hyperlegible', sans-serif";
    case "dyslexic": return "'OpenDyslexic', sans-serif";
    case "sans-serif": return "sans-serif";
    default: return "inherit";
  }
};

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
    border: "#d1d6e0",
    cardBackground: "#ffffff",
    cardForeground: "#0f1729",
    cardBorder: "#d1d6e0",
    accent: "#5048e5",
    accentForeground: "#f8f9fc",
    muted: "#e7e9ef",
    mutedForeground: "#365396",
    secondary: "#e7e9ef",
    secondaryForeground: "#0f1729",
    popover: "#ffffff",
    popoverForeground: "#0f1729",
    uiAccent: "#e7e9ef",
    uiAccentForeground: "#5048e5",
    cardRadius: "12px",
    cardShadow: "sm"
  },
  {
    name: "Dark violet",
    isDark: true,
    background: "#0b1428",
    foreground: "#dde4fd",
    border: "#474653",
    cardBackground: "#182035",
    cardForeground: "#dde4fd",
    cardBorder: "#474653",
    accent: "#c2c3ff",
    accentForeground: "#0b1428",
    muted: "#232b3e",
    mutedForeground: "#cac7d6",
    secondary: "#232b3e",
    secondaryForeground: "#dde4fd",
    popover: "#182035",
    popoverForeground: "#dde4fd",
    uiAccent: "#232b3e",
    uiAccentForeground: "#c2c3ff",
    cardRadius: "12px",
    cardShadow: "none"
  },
  {
    name: "Nord arctic",
    isDark: true,
    background: "#2f3541",
    foreground: "#e5e9f0",
    border: "#4d576a",
    cardBackground: "#383f4d",
    cardForeground: "#e5e9f0",
    cardBorder: "#4d576a",
    accent: "#87bfcf",
    accentForeground: "#2f3541",
    muted: "#454d5f",
    mutedForeground: "#b6bdc9",
    secondary: "#454d5f",
    secondaryForeground: "#e5e9f0",
    popover: "#383f4d",
    popoverForeground: "#e5e9f0",
    uiAccent: "#454d5f",
    uiAccentForeground: "#87bfcf",
    cardRadius: "8px",
    cardShadow: "none"
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
    cardShadow: "md"
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
