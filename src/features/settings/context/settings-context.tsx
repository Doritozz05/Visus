"use client";

import * as React from "react";
import { SettingsState, GeneralSettings, RsvpSettings, ClusterSettings, DEFAULT_SETTINGS } from "@/core/entities/settings";

interface SettingsContextType {
  settings: SettingsState;
  updateGeneralSettings: (settings: Partial<GeneralSettings>) => void;
  updateRsvpSettings: (settings: Partial<RsvpSettings>) => void;
  updateClusterSettings: (settings: Partial<ClusterSettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = React.createContext<SettingsContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "visus_settings";

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState<SettingsState>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Load settings from localStorage on mount
  React.useEffect(() => {
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
  }, []);

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
