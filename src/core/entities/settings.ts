export interface GeneralSettings {
  theme: "dark-violet" | "light" | "matrix-green";
  accentColor: "indigo" | "violet" | "emerald" | "amber" | "rose" | "blue";
  uiFont: "inter" | "roboto" | "outfit";
  glassmorphism: boolean;
  reducedMotion: boolean;
  soundEffects: boolean;
  readingTimerReminder: number; // in minutes, 0 = disabled
  autoSync: boolean;
  readerFontSize: number;      // Font size in px
  readerFontFamily: "inter" | "atkinson" | "dyslexic" | "serif";
  readerWordsPerPage: number;  // Target words per page
}

export interface RsvpSettings {
  fontSize: number; // in px
  fontFamily: "inter" | "atkinson" | "dyslexic";
  orpColor: "amber" | "orange" | "emerald" | "violet" | "indigo" | "rose";
  orpGlow: boolean;
  showFocusGuides: boolean;
  unmarkedOpacity: number;
  unmarkedColor: "foreground" | "primary" | "muted";
}

export interface ClusterSettings {
  fontSize: number; // in px
  fontFamily: "inter" | "atkinson" | "dyslexic";
  highlightStyle: "spotlight" | "capsule" | "underline" | "bold-only" | "color-only";
  activeColor: "indigo" | "violet" | "emerald" | "amber" | "rose" | "blue" | "white";
  inactiveOpacity: number;
  blurAmount: string;
  glowEffect: "indigo" | "amber" | "green" | "none";
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
