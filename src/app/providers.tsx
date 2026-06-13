"use client";

import * as React from "react";
import { SettingsProvider, useSettings } from "@/features/settings/context/settings-context";
import { LibraryProvider } from "@/features/library/context/library-context";
import { AuthProvider } from "@/features/auth/context/auth-context";
import { Toaster } from "sonner";
import { ContextMenuProvider } from "@/components/ui/ContextMenu";
import { hexToHsl, resolveColor } from "@/lib/color-utils";
import type { CustomTheme } from "@/core/entities/settings";
import { MotionConfig } from "framer-motion";

function ThemeProviderHelper({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const { theme, accentColor, uiFont, reducedMotion, glassmorphism, customThemes = [] } = settings.general;

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    const body = document.body;

    const toHslString = (hex: string) => {
      try {
        return hexToHsl(hex).stringVal;
      } catch (e) {
        return "0 0% 100%";
      }
    };

    const toRgbString = (hex: string) => {
      try {
        const resolved = resolveColor(hex);
        let cleaned = resolved.replace("#", "").trim();
        if (cleaned.length === 3) {
          cleaned = cleaned[0] + cleaned[0] + cleaned[1] + cleaned[1] + cleaned[2] + cleaned[2];
        }
        const r = parseInt(cleaned.substring(0, 2), 16);
        const g = parseInt(cleaned.substring(2, 4), 16);
        const b = parseInt(cleaned.substring(4, 6), 16);
        return `${r}, ${g}, ${b}`;
      } catch (e) {
        return "255, 255, 255";
      }
    };

    const getShadowValue = (style: string | undefined, glowSettings?: CustomTheme['glowSettings']): string => {
      if (style === "glow") {
        if (glowSettings && glowSettings.enabled) {
          const color = toRgbString(glowSettings.color);
          return `0 0 ${glowSettings.blur}px ${glowSettings.spread}px rgba(${color}, ${glowSettings.brightness})`;
        }
        return "0 0 15px var(--primary-shadow, rgba(99, 102, 241, 0.15))";
      }
      switch (style) {
        case "none": return "none";
        case "sm": return "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
        case "md": return "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
        case "lg": return "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
        case "retro": return "4px 4px 0px 0px hsl(var(--border))";
        default: return "none";
      }
    };

    // Clean up dynamic classes and custom style tags
    const classesToRemove: string[] = [];
    root.classList.forEach((className) => {
      if (className.startsWith("theme-")) {
        classesToRemove.push(className);
      }
    });
    classesToRemove.forEach((c) => root.classList.remove(c));
    
    // Clear previous custom styles
    const prevStyleTag = document.getElementById("visus-custom-theme-css");
    if (prevStyleTag) prevStyleTag.remove();

    const customTheme = customThemes.find((t) => t.id === theme);

    if (customTheme) {
      root.classList.add("theme-custom");
      root.classList.add(`theme-${theme}`);

      if (customTheme.isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }

      root.style.setProperty("--background", toHslString(customTheme.background));
      root.style.setProperty("--foreground", toHslString(customTheme.foreground));
      root.style.setProperty("--border", toHslString(customTheme.border));
      root.style.setProperty("--card", toHslString(customTheme.cardBackground));
      root.style.setProperty("--card-foreground", toHslString(customTheme.cardForeground));
      root.style.setProperty("--popover", toHslString(customTheme.popover || customTheme.cardBackground));
      root.style.setProperty("--popover-foreground", toHslString(customTheme.popoverForeground || customTheme.cardForeground));
      root.style.setProperty("--primary", toHslString(customTheme.accent));
      root.style.setProperty("--primary-foreground", toHslString(customTheme.accentForeground));
      root.style.setProperty("--secondary", toHslString(customTheme.secondary || (customTheme.isDark ? "#1e293b" : "#f1f5f9")));
      root.style.setProperty("--secondary-foreground", toHslString(customTheme.secondaryForeground || customTheme.foreground));
      root.style.setProperty("--muted", toHslString(customTheme.muted));
      root.style.setProperty("--muted-foreground", toHslString(customTheme.mutedForeground));
      root.style.setProperty("--accent", toHslString(customTheme.uiAccent || customTheme.muted));
      root.style.setProperty("--accent-foreground", toHslString(customTheme.uiAccentForeground || customTheme.accent));
      root.style.setProperty("--input", toHslString(customTheme.input || customTheme.border));
      root.style.setProperty("--ring", toHslString(customTheme.ring || customTheme.accent));

      // Sidebar overrides
      if (customTheme.overrideSidebar) {
        root.style.setProperty("--sidebar-background", toHslString(customTheme.sidebarBackground || customTheme.cardBackground));
        root.style.setProperty("--sidebar-foreground", toHslString(customTheme.sidebarForeground || customTheme.cardForeground));
        root.style.setProperty("--sidebar-border", toHslString(customTheme.sidebarBorder || customTheme.border));
        root.style.setProperty("--sidebar-active-background", toHslString(customTheme.sidebarActiveBackground || customTheme.accent));
        root.style.setProperty("--sidebar-active-foreground", toHslString(customTheme.sidebarActiveForeground || customTheme.accentForeground));
      } else {
        root.style.setProperty("--sidebar-background", toHslString(customTheme.cardBackground));
        root.style.setProperty("--sidebar-foreground", toHslString(customTheme.cardForeground));
        root.style.setProperty("--sidebar-border", toHslString(customTheme.border));
        root.style.setProperty("--sidebar-active-background", toHslString(customTheme.accent));
        root.style.setProperty("--sidebar-active-foreground", toHslString(customTheme.accentForeground));
      }

      // Reader overrides
      if (customTheme.overrideReader) {
        root.style.setProperty("--reader-background", toHslString(customTheme.readerBackground || customTheme.background));
        root.style.setProperty("--reader-foreground", toHslString(customTheme.readerForeground || customTheme.foreground));
        root.style.setProperty("--reader-border", toHslString(customTheme.readerBorder || customTheme.border));
      } else {
        root.style.setProperty("--reader-background", toHslString(customTheme.background));
        root.style.setProperty("--reader-foreground", toHslString(customTheme.foreground));
        root.style.setProperty("--reader-border", toHslString(customTheme.border));
      }

      root.style.setProperty("--radius", customTheme.cardRadius || "0.75rem");
      root.style.setProperty("--card-shadow", getShadowValue(customTheme.cardShadow, customTheme.glowSettings));
      root.style.setProperty("--primary-shadow", `rgba(${toRgbString(customTheme.accent)}, 0.25)`);

      // Glassmorphism
      if (customTheme.glassmorphism?.enabled) {
        const bgRgb = toRgbString(customTheme.cardBackground);
        const borderRgb = toRgbString(customTheme.border);
        root.style.setProperty("--glass-bg", `rgba(${bgRgb}, ${customTheme.glassmorphism.opacity})`);
        root.style.setProperty("--glass-blur", `blur(${customTheme.glassmorphism.blur}px)`);
        root.style.setProperty("--glass-border", `1px solid rgba(${borderRgb}, ${customTheme.glassmorphism.borderOpacity})`);
      } else {
        root.style.removeProperty("--glass-bg");
        root.style.removeProperty("--glass-blur");
        root.style.removeProperty("--glass-border");
      }

      // Background graphics engine
      if (customTheme.bgType === "image" && customTheme.bgImageUrl) {
        root.style.setProperty("--bg-image", `url("${customTheme.bgImageUrl}")`);
        root.style.setProperty("--bg-image-opacity", (customTheme.bgImageOpacity ?? 1).toString());
        root.style.setProperty("--bg-image-blur", `${customTheme.bgImageBlur ?? 0}px`);
        if (customTheme.bgImageOverlay) {
          const overlayRgb = toRgbString(customTheme.bgImageOverlay);
          root.style.setProperty("--bg-image-overlay", `rgba(${overlayRgb}, ${customTheme.bgImageOverlayOpacity ?? 0})`);
        } else {
          root.style.setProperty("--bg-image-overlay", "transparent");
        }
      } else if (customTheme.bgType === "gradient" && customTheme.bgGradientStart && customTheme.bgGradientEnd) {
        const angle = customTheme.bgGradientAngle ?? 135;
        root.style.setProperty("--bg-image", `linear-gradient(${angle}deg, ${customTheme.bgGradientStart}, ${customTheme.bgGradientEnd})`);
        root.style.setProperty("--bg-image-opacity", "1");
        root.style.setProperty("--bg-image-blur", "0px");
        root.style.setProperty("--bg-image-overlay", "transparent");
      } else {
        root.style.removeProperty("--bg-image");
        root.style.removeProperty("--bg-image-opacity");
        root.style.removeProperty("--bg-image-blur");
        root.style.removeProperty("--bg-image-overlay");
      }

      body.setAttribute("data-accent", "custom");
      body.setAttribute("data-ui-font", customTheme.uiFont || uiFont);
      body.setAttribute("data-glass", customTheme.glassmorphism?.enabled ? "enabled" : "disabled");
      body.setAttribute("data-bg-type", customTheme.bgType);

      if (customTheme.uiFont === "system-ui") {
        root.style.setProperty("--font-sans", "system-ui, -apple-system, sans-serif");
      } else {
        root.style.removeProperty("--font-sans");
      }

      // Injects user CSS custom stylesheet if present
      if (customTheme.customCss) {
        const style = document.createElement("style");
        style.id = "visus-custom-theme-css";
        style.appendChild(document.createTextNode(customTheme.customCss));
        document.head.appendChild(style);
      }
    } else {
      root.classList.remove("theme-custom");
      root.classList.add(`theme-${theme}`);

      if (theme === "dark-violet" || theme === "nord") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }

      const propertiesToClear = [
        "--background", "--foreground", "--border", "--card", "--card-foreground",
        "--popover", "--popover-foreground", "--primary", "--primary-foreground",
        "--secondary", "--secondary-foreground", "--muted", "--muted-foreground",
        "--accent", "--accent-foreground", "--input", "--ring",
        "--sidebar-background", "--sidebar-foreground", "--sidebar-border", "--sidebar-active-background", "--sidebar-active-foreground",
        "--reader-background", "--reader-foreground", "--reader-border",
        "--radius", "--card-shadow", "--primary-shadow",
        "--glass-bg", "--glass-blur", "--glass-border",
        "--bg-image", "--bg-image-opacity", "--bg-image-blur", "--bg-image-overlay",
        "--font-sans"
      ];
      propertiesToClear.forEach((p) => root.style.removeProperty(p));

      body.setAttribute("data-accent", accentColor);
      body.setAttribute("data-ui-font", uiFont);
      body.setAttribute("data-glass", glassmorphism ? "enabled" : "disabled");
      body.setAttribute("data-bg-type", "solid");

      try {
        const hex = resolveColor(accentColor);
        const { stringVal } = hexToHsl(hex);
        root.style.setProperty("--primary", stringVal);
        root.style.setProperty("--ring", stringVal);
      } catch (err) {
        root.style.removeProperty("--primary");
        root.style.removeProperty("--ring");
      }
    }

    if (reducedMotion) {
      root.classList.add("reduced-motion");
    } else {
      root.classList.remove("reduced-motion");
    }
  }, [theme, accentColor, uiFont, reducedMotion, glassmorphism, customThemes]);

  return (
    <MotionConfig reducedMotion={reducedMotion ? "always" : "never"}>
      {children}
    </MotionConfig>
  );
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
          <ContextMenuProvider>
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
          </ContextMenuProvider>
        </LibraryProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
