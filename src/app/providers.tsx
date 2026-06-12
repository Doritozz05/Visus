"use client";

import * as React from "react";
import { SettingsProvider, useSettings } from "@/features/settings/context/settings-context";
import { LibraryProvider } from "@/features/library/context/library-context";
import { AuthProvider } from "@/features/auth/context/auth-context";
import { Toaster } from "sonner";

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
      process.env.NODE_ENV === "production" &&
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      (window as any).workbox === undefined
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("Visus Service Worker successfully registered. Scope:", reg.scope);
          
          // Check for updates periodically or on registration
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            newWorker?.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // At this point, the old service worker is still in control, 
                // but a new one is waiting. SkipWaiting in sw.js will trigger controllerchange.
                console.log("New content available, preparing to update...");
              }
            });
          });
        })
        .catch((error) => {
          console.error("Error registering Visus Service Worker:", error);
        });

      // Handle the refresh when the new service worker takes control
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });
    }
  }, []);

  return (
    <AuthProvider>
      <SettingsProvider>
        <LibraryProvider>
          <ThemeProviderHelper>
            {children}
            <Toaster 
              position="bottom-right" 
              richColors 
              closeButton 
              expand={true}
              visibleToasts={5}
            />
          </ThemeProviderHelper>
        </LibraryProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
