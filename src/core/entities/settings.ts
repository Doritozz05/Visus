export interface CustomTheme {
  id: string; // unique ID, e.g. "theme-custom-171829472"
  name: string;
  isDark: boolean;
  
  // Custom Typography
  uiFont?: string;

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
  destructive?: string;
  destructiveForeground?: string;

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

  // Reader Override Toggle & Colors
  readerFont?: string;

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
  accentColor?: string; // Optional: theme default used if undefined
  uiFont: string;
  glassmorphism: boolean;
  reducedMotion: boolean;
  autoSync: boolean;
  readerFontSize: number;      // Font size in px
  readerFontFamily: string;
  readerWordsPerPage: number;  // Target words per page
  telemetryPreference: "cloud" | "anonymous" | "disabled";
  yearlyReadingGoal: number;   // Yearly reading target in books
  lastUsedWpm?: number;        // Last speed used in RSVP/Cluster
  lastUsedMode?: "rsvp" | "cluster" | "normal"; // Last mode used
  savedColors?: string[];      // Custom saved color palette (hex codes)
  customThemes?: CustomTheme[]; // Collection of user created themes
}

export interface RsvpSettings {
  fontSize: number; // in px
  fontFamily: string;
  orpColor: string; // "primary" | "amber" | "orange" | "emerald" | "violet" | "indigo" | "rose" or custom hex
  orpGlow: boolean;
  showFocusGuides: boolean;
  unmarkedOpacity: number;
  unmarkedColor: string; // "foreground" | "primary" | "muted" or custom color
  algorithm: "dynamic" | "metronome" | "custom";
  customDelays: {
    shortWord: number;
    longWord: number;
    comma: number;
    period: number;
  };
  warmupRamp: boolean;
  focalWeighting: boolean;
}

export interface ClusterSettings {
  fontSize: number; // in px
  fontFamily: string;
  highlightStyle: "spotlight" | "capsule" | "underline" | "bold-only" | "color-only";
  activeColor: string; // "primary" | "indigo" | "violet" | "emerald" | "amber" | "rose" | "blue" | "white" or custom hex
  inactiveOpacity: number;
  blurAmount: string;
  glowEffect: string; // "indigo" | "amber" | "green" | "none" or custom hex / custom on/off
  algorithm: "dynamic" | "metronome" | "custom";
  customDelays: {
    shortWord: number;
    longWord: number;
    comma: number;
    period: number;
  };
  warmupRamp: boolean;
}

export interface SettingsState {
  general: GeneralSettings;
  rsvp: RsvpSettings;
  cluster: ClusterSettings;
}

export const DEFAULT_SETTINGS: SettingsState = {
  general: {
    theme: "sepia",
    accentColor: undefined, // Let theme primary take over
    uiFont: "inter",
    glassmorphism: false,
    reducedMotion: false,
    autoSync: true,
    readerFontSize: 16,
    readerFontFamily: "serif",
    readerWordsPerPage: 300,
    telemetryPreference: "cloud",
    yearlyReadingGoal: 15,
    lastUsedWpm: 250,
    lastUsedMode: "normal",
    savedColors: [],
    customThemes: [],
  },
  rsvp: {
    fontSize: 48,
    fontFamily: "inter",
    orpColor: "primary",
    orpGlow: false,
    showFocusGuides: false,
    unmarkedOpacity: 0.3,
    unmarkedColor: "foreground",
    algorithm: "dynamic",
    customDelays: {
      shortWord: 0.85,
      longWord: 1.3,
      comma: 1.5,
      period: 2.2,
    },
    warmupRamp: true,
    focalWeighting: false,
  },
  cluster: {
    fontSize: 24,
    fontFamily: "inter",
    highlightStyle: "spotlight",
    activeColor: "primary",
    inactiveOpacity: 0.25,
    blurAmount: "0.5px",
    glowEffect: "indigo",
    algorithm: "dynamic",
    customDelays: {
      shortWord: 0.85,
      longWord: 1.2,
      comma: 1.3,
      period: 1.6,
    },
    warmupRamp: true,
  },
};
