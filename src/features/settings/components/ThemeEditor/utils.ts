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
  overrideSidebar: false,
  overrideReader: false,
  bgType: "solid",
  glassmorphism: {
    enabled: false,
    blur: 12,
    opacity: 0.45,
    borderOpacity: 0.1
  }
});

export const getFontFamilyStyle = (font?: string) => {
  switch (font) {
    case "inter": return "var(--font-sans), sans-serif";
    case "outfit": return "var(--font-heading), sans-serif";
    case "roboto": return "'Hanken Grotesk', sans-serif";
    case "system-ui": return "system-ui, -apple-system, sans-serif";
    default: return "inherit";
  }
};

export const PRESETS_TEMPLATES = [
  {
    name: "Light minimal",
    isDark: false,
    background: "#f1f3f6",
    foreground: "#111827",
    border: "#e5e7eb",
    cardBackground: "#ffffff",
    cardForeground: "#111827",
    accent: "#6366f1",
    accentForeground: "#ffffff",
    muted: "#f9fafb",
    mutedForeground: "#6b7280",
    cardRadius: "12px",
    cardShadow: "sm"
  },
  {
    name: "Dark violet",
    isDark: true,
    background: "#0b1326",
    foreground: "#dae2fd",
    border: "#464554",
    cardBackground: "#171f33",
    cardForeground: "#dae2fd",
    accent: "#c0c1ff",
    accentForeground: "#0b1326",
    muted: "#222a3d",
    mutedForeground: "#c7c4d7",
    cardRadius: "12px",
    cardShadow: "glow"
  },
  {
    name: "Nord arctic",
    isDark: true,
    background: "#2e3440",
    foreground: "#d8dee9",
    border: "#4c566a",
    cardBackground: "#3b4252",
    cardForeground: "#d8dee9",
    accent: "#88c0d0",
    accentForeground: "#2e3440",
    muted: "#434c5e",
    mutedForeground: "#e5e9f0",
    cardRadius: "8px",
    cardShadow: "none"
  },
  {
    name: "Warm sepia",
    isDark: false,
    background: "#f4ecd8",
    foreground: "#5b4636",
    border: "#e4dcd3",
    cardBackground: "#faf6eb",
    cardForeground: "#5b4636",
    accent: "#b45309",
    accentForeground: "#ffffff",
    muted: "#eae1cb",
    mutedForeground: "#785f4c",
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
