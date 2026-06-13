export interface CustomTheme {
  id: string; // unique ID, e.g. "theme-custom-171829472"
  name: string;
  isDark: boolean;
  
  // Custom Typography
  uiFont?: "inter" | "roboto" | "outfit" | "system-ui";
  readerFont?: "serif" | "inter" | "atkinson" | "dyslexic" | "sans-serif";

  // Core HSL Color Set (HEX strings)
  background: string;
  foreground: string;
  border: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;

  // Additional UI Colors
  secondary?: string;
  secondaryForeground?: string;
  popover?: string;
  popoverForeground?: string;
  uiAccent?: string;
  uiAccentForeground?: string;
  input?: string;
  ring?: string;

  // Panel & Card Override Styles
  cardBackground: string;
  cardForeground: string;
  cardBorder: string;
  cardRadius?: "0px" | "4px" | "8px" | "12px" | "16px" | "24px" | string;
  cardShadow?: "none" | "sm" | "md" | "lg" | "glow" | "retro" | string;

  // Sidebar Override Toggle & Colors
  overrideSidebar: boolean;
  sidebarBackground?: string;
  sidebarForeground?: string;
  sidebarBorder?: string;
  sidebarActiveBackground?: string;
  sidebarActiveForeground?: string;

  // Reader Room Override Toggle & Colors
  overrideReader: boolean;
  readerBackground?: string;
  readerForeground?: string;
  readerBorder?: string;

  // Background Options (Solid, Gradient, Image)
  bgType: "solid" | "gradient" | "image";
  bgGradientStart?: string;
  bgGradientEnd?: string;
  bgGradientAngle?: number;
  bgImageUrl?: string; // Base64 compressed image or web URL
  bgImageBlur?: number;
  bgImageOpacity?: number;
  bgImageOverlay?: string;
  bgImageOverlayOpacity?: number;

  // Materials & Effects
  glassmorphism?: {
    enabled: boolean;
    blur: number;
    opacity: number;
    borderOpacity: number;
  };
  glowSettings?: {
    enabled: boolean;
    color: string;
    brightness: number; // 0 to 1
    spread: number;
    blur: number;
  };
  customCss?: string;
}

export interface GeneralSettings {
  theme: "dark-violet" | "light" | "sepia" | "nord" | string;
  accentColor: string; // "indigo" | "violet" | "emerald" | "amber" | "rose" | "blue" or custom hex
  uiFont: "inter" | "roboto" | "outfit";
  glassmorphism: boolean;
  reducedMotion: boolean;
  soundEffects: boolean;
  readingTimerReminder: number; // in minutes, 0 = disabled
  autoSync: boolean;
  readerFontSize: number;      // Font size in px
  readerFontFamily: "inter" | "atkinson" | "dyslexic" | "serif";
  readerWordsPerPage: number;  // Target words per page
  telemetryPreference: "cloud" | "anonymous" | "disabled";
  yearlyReadingGoal: number;   // Yearly reading target in books
  savedColors?: string[];      // Custom saved color palette (hex codes)
  customThemes?: CustomTheme[]; // Collection of user created themes
}

export interface RsvpSettings {
  fontSize: number; // in px
  fontFamily: "inter" | "atkinson" | "dyslexic";
  orpColor: string; // "amber" | "orange" | "emerald" | "violet" | "indigo" | "rose" or custom hex
  orpGlow: boolean;
  showFocusGuides: boolean;
  unmarkedOpacity: number;
  unmarkedColor: string; // "foreground" | "primary" | "muted" or custom color
}

export interface ClusterSettings {
  fontSize: number; // in px
  fontFamily: "inter" | "atkinson" | "dyslexic";
  highlightStyle: "spotlight" | "capsule" | "underline" | "bold-only" | "color-only";
  activeColor: string; // "indigo" | "violet" | "emerald" | "amber" | "rose" | "blue" | "white" or custom hex
  inactiveOpacity: number;
  blurAmount: string;
  glowEffect: string; // "indigo" | "amber" | "green" | "none" or custom hex / custom on/off
  algorithm: "dynamic" | "static-2" | "static-3";
}

export interface SettingsState {
  general: GeneralSettings;
  rsvp: RsvpSettings;
  cluster: ClusterSettings;
}

export const DEFAULT_SETTINGS: SettingsState = {
  general: {
    theme: "light",
    accentColor: "violet",
    uiFont: "inter",
    glassmorphism: false,
    reducedMotion: false,
    soundEffects: false,
    readingTimerReminder: 0,
    autoSync: true,
    readerFontSize: 16,
    readerFontFamily: "serif",
    readerWordsPerPage: 300,
    telemetryPreference: "cloud",
    yearlyReadingGoal: 15,
    savedColors: [],
    customThemes: [],
  },
  rsvp: {
    fontSize: 48,
    fontFamily: "inter",
    orpColor: "violet",
    orpGlow: true,
    showFocusGuides: false,
    unmarkedOpacity: 0.3,
    unmarkedColor: "foreground",
  },
  cluster: {
    fontSize: 24,
    fontFamily: "inter",
    highlightStyle: "spotlight",
    activeColor: "white",
    inactiveOpacity: 0.25,
    blurAmount: "0.5px",
    glowEffect: "indigo",
    algorithm: "dynamic",
  },
};
