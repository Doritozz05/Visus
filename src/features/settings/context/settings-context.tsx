"use client";

import * as React from "react";
import { SettingsState, GeneralSettings, RsvpSettings, ClusterSettings, DEFAULT_SETTINGS } from "@/core/entities/settings";
import type { CustomFont } from "@/lib/typography";
import { getCustomFonts, deleteCustomFont } from "@/lib/services/font-storage";

interface SettingsContextType {
  settings: SettingsState;
  updateGeneralSettings: (settings: Partial<GeneralSettings>) => void;
  updateRsvpSettings: (settings: Partial<RsvpSettings>) => void;
  updateClusterSettings: (settings: Partial<ClusterSettings>) => void;
  resetSettings: () => void;
  customFonts: CustomFont[];
  refreshCustomFonts: () => Promise<void>;
  deleteCustomFontAndCleanup: (fontId: string) => Promise<void>;
}

const SettingsContext = React.createContext<SettingsContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "visus_settings";

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState<SettingsState>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [customFonts, setCustomFonts] = React.useState<CustomFont[]>([]);

  const refreshCustomFonts = React.useCallback(async () => {
    const fonts = await getCustomFonts();
    setCustomFonts(fonts);
  }, []);

  // Load settings from localStorage on mount
  React.useEffect(() => {
    refreshCustomFonts();
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored && stored.trim() !== "") {
        const parsed = JSON.parse(stored);
        
        if (parsed && typeof parsed === "object") {
          // Dynamic theme migration for legacy configurations in local development
          if (parsed.general && parsed.general.theme) {
            const t = parsed.general.theme;
            if (t === "dark" || t === "midnight" || t === "sepia" || t === "nordic" || t === "forest" || t === "light" || t === "matrix-green") {
              if (t === "dark" || t === "midnight") {
                parsed.general.theme = "dark-violet";
              } else if (t === "forest" || t === "matrix-green") {
                parsed.general.theme = "dark-violet";
              } else if (t === "light") {
                parsed.general.theme = "light";
              } else {
                parsed.general.theme = "dark-violet"; // safe default
              }
            }
          }

          // Deep merge with defaults to avoid errors if new settings are added later
          const merged: SettingsState = {
            general: { ...DEFAULT_SETTINGS.general, ...parsed.general },
            rsvp: { ...DEFAULT_SETTINGS.rsvp, ...parsed.rsvp },
            cluster: { ...DEFAULT_SETTINGS.cluster, ...parsed.cluster },
          };
          setSettings(merged);
        }
      }
    } catch (err) {
      console.warn("Could not parse settings from localStorage (corrupt data). Resetting to default configuration.");
      // Clean corrupt storage keys automatically
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch (_) {}
    } finally {
      setIsLoaded(true);
    }
  }, [refreshCustomFonts]);

  // Save settings to localStorage on change
  React.useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
    } catch (err) {
      console.warn("Could not save settings to localStorage:", err);
    }
  }, [settings, isLoaded]);

  const updateGeneralSettings = React.useCallback((newGeneral: Partial<GeneralSettings>) => {
    setSettings((prev) => ({
      ...prev,
      general: { ...prev.general, ...newGeneral },
    }));
  }, []);

  const updateRsvpSettings = React.useCallback((newRsvp: Partial<RsvpSettings>) => {
    setSettings((prev) => ({
      ...prev,
      rsvp: { ...prev.rsvp, ...newRsvp },
    }));
  }, []);

  const updateClusterSettings = React.useCallback((newCluster: Partial<ClusterSettings>) => {
    setSettings((prev) => ({
      ...prev,
      cluster: { ...prev.cluster, ...newCluster },
    }));
  }, []);

  const deleteCustomFontAndCleanup = React.useCallback(async (fontId: string) => {
    try {
      await deleteCustomFont(fontId);
      
      // Auto-fallback settings if deleted font was active
      setSettings(prev => {
        const next = { ...prev };
        let changed = false;

        if (next.general.uiFont === fontId) {
          next.general.uiFont = "inter";
          changed = true;
        }
        if (next.general.readerFontFamily === fontId) {
          next.general.readerFontFamily = "serif";
          changed = true;
        }
        if (next.rsvp.fontFamily === fontId) {
          next.rsvp.fontFamily = "inter";
          changed = true;
        }
        if (next.cluster.fontFamily === fontId) {
          next.cluster.fontFamily = "inter";
          changed = true;
        }

        // Custom themes cleanup
        if (next.general.customThemes && next.general.customThemes.length > 0) {
          next.general.customThemes = next.general.customThemes.map(t => {
            let tChanged = false;
            const nt = { ...t };
            if (nt.uiFont === fontId) {
              nt.uiFont = "inter";
              tChanged = true;
            }
            if (nt.readerFont === fontId) {
              nt.readerFont = "serif";
              tChanged = true;
            }
            if (tChanged) changed = true;
            return nt;
          });
        }

        return changed ? next : prev;
      });

      await refreshCustomFonts();
    } catch (err) {
      console.error("Failed to delete font and cleanup settings:", err);
      throw err;
    }
  }, [refreshCustomFonts]);

  const resetSettings = React.useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateGeneralSettings,
        updateRsvpSettings,
        updateClusterSettings,
        resetSettings,
        customFonts,
        refreshCustomFonts,
        deleteCustomFontAndCleanup,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = React.useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
