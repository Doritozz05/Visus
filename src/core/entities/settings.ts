export interface GeneralSettings {
  theme: "dark-violet" | "light" | "sepia" | "nord";
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
