"use client";

import * as React from "react";
import { SettingsProvider, useSettings } from "@/context/settings-context";

function ThemeProviderHelper({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const { theme, accentColor, uiFont, reducedMotion, glassmorphism } = settings.general;

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    const body = document.body;

    // 1. Theme handler
    // Remove any existing theme- classes
    const classesToRemove: string[] = [];
    root.classList.forEach((className) => {
      if (className.startsWith("theme-")) {
        classesToRemove.push(className);
      }
    });
    classesToRemove.forEach((c) => root.classList.remove(c));

    // Add new theme class
    root.classList.add(`theme-${theme}`);

    // Toggle classic Tailwind dark utilities
    if (theme === "dark-violet" || theme === "matrix-green") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // 2. Set dynamic theme attributes on body for target styling
    body.setAttribute("data-accent", accentColor);
    body.setAttribute("data-ui-font", uiFont);
    body.setAttribute("data-glass", glassmorphism ? "enabled" : "disabled");

    // 3. Motion preferences
    if (reducedMotion) {
      root.classList.add("reduced-motion");
    } else {
      root.classList.remove("reduced-motion");
    }
  }, [theme, accentColor, uiFont, reducedMotion, glassmorphism]);

  return <>{children}</>;
}

/**
 * Global application-wide React Context provider shell.
 * Integrates global state settings, hydration, offline support, and PWA management.
 * 
 * @param props - Children components inside the layout hierarchy.
 * @returns React node wrapped in all global providers.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  // Base configuration for PWA - Registering Service Worker on client load
  React.useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      (window as any).workbox === undefined
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("Visus Service Worker successfully registered. Scope:", reg.scope);
        })
        .catch((error) => {
          console.error("Error registering Visus Service Worker:", error);
        });
    }
  }, []);

  return (
    <SettingsProvider>
      <ThemeProviderHelper>{children}</ThemeProviderHelper>
    </SettingsProvider>
  );
}
