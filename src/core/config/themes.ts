import type { CustomTheme } from "@/core/entities/settings";

/**
 * Built-in themes for Visus.
 * This is the single source of truth for all "standard" themes.
 * Values are synchronized with the original globals.css definitions.
 */
export const BUILTIN_THEMES: CustomTheme[] = [
  {
    id: "light",
    name: "Light Paper",
    isDark: false,
    background: "#f7f8fa", // 220 20% 97%
    foreground: "#0f131a", // 222 47% 11%
    cardBackground: "#ffffff",
    cardForeground: "#0f131a",
    popover: "#ffffff",
    popoverForeground: "#0f131a",
    accent: "#8b5cf6", // violet
    accentForeground: "#ffffff",
    secondary: "#eef0f3", // 220 20% 92%
    secondaryForeground: "#0f131a",
    muted: "#ebedf5", // 244 30% 92%
    mutedForeground: "#a8a2f8", // distinct from accent
    uiAccent: "#eef0f3",
    uiAccentForeground: "#8b5cf6",
    border: "#d8dce6", // 220 20% 85%
    input: "#d8dce6",
    ring: "#8b5cf6",
    cardRadius: "12px",
    cardShadow: "sm",
    cardBorder: "#d8dce6",
    overrideSidebar: false,
    bgType: "solid"
  },
  {
    id: "dark-violet",
    name: "Dark Violet",
    isDark: true,
    background: "#0b1326", // 222 55% 10%
    foreground: "#dae2fd", // 227 90% 93%
    cardBackground: "#171f33", // 223 38% 15%
    cardForeground: "#dae2fd",
    popover: "#171f33",
    popoverForeground: "#dae2fd",
    accent: "#c0c1ff", // 239 100% 88%
    accentForeground: "#0b1326",
    secondary: "#222a3d", // 222 28% 19%
    secondaryForeground: "#dae2fd",
    muted: "#222a3d",
    mutedForeground: "#c7c4d7", // 250 15% 81%
    uiAccent: "#222a3d",
    uiAccentForeground: "#c0c1ff",
    destructive: "#7f1212", // 0 62.8% 30.6%
    destructiveForeground: "#f8f9fc",
    border: "#464554", // 248 9% 30%
    input: "#464554",
    ring: "#c0c1ff",
    cardRadius: "12px",
    cardShadow: "none",
    cardBorder: "#464554",
    overrideSidebar: false,
    bgType: "solid"
  },
  {
    id: "sepia",
    name: "Sepia Warm",
    isDark: false,
    background: "#f3ebd8", // 42 54% 90%
    foreground: "#5a4535", // 26 26% 28%
    cardBackground: "#f8f3e7", // 42 54% 94%
    cardForeground: "#5a4535",
    popover: "#f8f3e7",
    popoverForeground: "#5a4535",
    accent: "#ac6b39", // 26 50% 45%
    accentForeground: "#fdfbf7", // 42 54% 98%
    secondary: "#e4ddcd", // 42 30% 85%
    secondaryForeground: "#5a4535",
    muted: "#e4ddcd",
    mutedForeground: "#5c4735", // 26 26% 40% (approx)
    uiAccent: "#e4ddcd",
    uiAccentForeground: "#ac6b39",
    border: "#dcd2bc", // 42 30% 80%
    input: "#dcd2bc",
    ring: "#ac6b39",
    cardRadius: "16px",
    cardShadow: "md",
    cardBorder: "#dcd2bc",
    overrideSidebar: false,
    bgType: "solid"
  },
  {
    id: "nord",
    name: "Nord Arctic",
    isDark: true,
    background: "#2e3440", // 220 16% 22%
    foreground: "#eceff4", // 218 27% 94%
    cardBackground: "#394050", // 222 17% 27%
    cardForeground: "#eceff4",
    popover: "#394050",
    popoverForeground: "#eceff4",
    accent: "#88c0d0", // 193 43% 67%
    accentForeground: "#2e3440",
    secondary: "#434c5e", // 220 17% 32%
    secondaryForeground: "#eceff4",
    muted: "#434c5e",
    mutedForeground: "#b6bdc9", // 218 15% 75%
    uiAccent: "#434c5e",
    uiAccentForeground: "#88c0d0",
    border: "#4c566a", // 220 16% 36%
    input: "#4c566a",
    ring: "#88c0d0",
    cardRadius: "8px",
    cardShadow: "none",
    cardBorder: "#4c566a",
    overrideSidebar: false,
    bgType: "solid"
  }
];

export const BUILTIN_THEME_DETAILS: Record<string, { desc: string, preview: string }> = {
  "light": { desc: "Warm Minimal Light", preview: "bg-[#f6f7f9]" },
  "dark-violet": { desc: "Original Clinical Navy", preview: "bg-[#0b1428]" },
  "sepia": { desc: "Parchment Reading", preview: "bg-[#f3ebd8]" },
  "nord": { desc: "Snowy Blue Cold", preview: "bg-[#2e3440]" }
};
