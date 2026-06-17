"use client";

import * as React from "react";
import { SettingsProvider, useSettings } from "@/features/settings/context/settings-context";
import { LibraryProvider } from "@/features/library/context/library-context";
import { ReadingListProvider } from "@/features/library/context/reading-list-context";
import { AuthProvider } from "@/features/auth/context/auth-context";
import { Toaster } from "sonner";
import { ContextMenuProvider } from "@/components/ui/ContextMenu";
import { hexToHsl, resolveColor, THEME_DEFAULTS } from "@/lib/color-utils";
import { BUILTIN_THEMES } from "@/core/config/themes";
import type { CustomTheme } from "@/core/entities/settings";
import { MotionConfig } from "framer-motion";
import { getFontFamilyStyle } from "@/lib/typography";

function ThemeProviderHelper({ children }: { children: React.ReactNode }) {
  const { settings, customFonts, isLoaded } = useSettings();
  const { theme, accentColor, uiFont, reducedMotion, glassmorphism, customThemes = [] } = settings.general;

  React.useEffect(() => {
    if (typeof window === "undefined" || !isLoaded) return;

    const root = document.documentElement;
    const body = document.body;

    // Injects custom fonts stylesheet dynamically
    let customStyleTag = document.getElementById("visus-custom-fonts-style") as HTMLStyleElement;
    if (!customStyleTag) {
      customStyleTag = document.createElement("style");
      customStyleTag.id = "visus-custom-fonts-style";
      document.head.appendChild(customStyleTag);
    }
    let css = "";
    customFonts.forEach((font) => {
      const format = font.fileType.includes("woff2") ? "woff2" : font.fileType.includes("woff") ? "woff" : font.fileType.includes("ttf") ? "truetype" : font.fileType.includes("otf") ? "opentype" : "truetype";
      css += `
@font-face {
  font-family: '${font.name}';
  src: url('data:${font.fileType};base64,${font.dataBase64}') format('${format}');
  font-display: swap;
}
`;
    });
    customStyleTag.innerHTML = css;

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

    // Look for active theme in all sources
    const allThemes = [...BUILTIN_THEMES, ...customThemes];
    const activeTheme = allThemes.find((t) => t.id === theme) || BUILTIN_THEMES[0];

    const isCustom = customThemes.some(t => t.id === theme);
    if (isCustom) {
      root.classList.add("theme-custom");
    }
    
    root.classList.add(`theme-${theme}`);

    if (activeTheme.isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Apply primary colors from theme
    root.style.setProperty("--background", toHslString(activeTheme.background));
    root.style.setProperty("--foreground", toHslString(activeTheme.foreground));
    root.style.setProperty("--border", toHslString(activeTheme.border));
    root.style.setProperty("--card", toHslString(activeTheme.cardBackground));
    root.style.setProperty("--card-foreground", toHslString(activeTheme.cardForeground));
    root.style.setProperty("--popover", toHslString(activeTheme.popover || activeTheme.cardBackground));
    root.style.setProperty("--popover-foreground", toHslString(activeTheme.popoverForeground || activeTheme.cardForeground));
    
    // Primary/Accent logic: Built-in themes can be tinted by user accentColor
    // We exempt "obsidian" and "nord" from this if they should maintain their specific brand colors
    const resolvedAccent = (!isCustom && accentColor && theme !== "obsidian") ? accentColor : activeTheme.accent;
    root.style.setProperty("--primary", toHslString(resolvedAccent));
    root.style.setProperty("--primary-foreground", toHslString(activeTheme.accentForeground));
    root.style.setProperty("--ring", toHslString(resolvedAccent));

    root.style.setProperty("--secondary", toHslString(activeTheme.secondary || (activeTheme.isDark ? "#1e293b" : "#f1f5f9")));
    root.style.setProperty("--secondary-foreground", toHslString(activeTheme.secondaryForeground || activeTheme.foreground));
    root.style.setProperty("--muted", toHslString(activeTheme.muted));
    root.style.setProperty("--muted-foreground", toHslString(activeTheme.mutedForeground));
    root.style.setProperty("--accent", toHslString(activeTheme.uiAccent || activeTheme.muted));
    root.style.setProperty("--accent-foreground", toHslString(activeTheme.uiAccentForeground || activeTheme.accent));
    root.style.setProperty("--input", toHslString(activeTheme.input || activeTheme.border));

    if (activeTheme.destructive) {
      root.style.setProperty("--destructive", toHslString(activeTheme.destructive));
      root.style.setProperty("--destructive-foreground", toHslString(activeTheme.destructiveForeground || "#ffffff"));
    }

    // Sidebar overrides
    if (activeTheme.overrideSidebar) {
      root.style.setProperty("--sidebar-background", toHslString(activeTheme.sidebarBackground || activeTheme.cardBackground));
      root.style.setProperty("--sidebar-foreground", toHslString(activeTheme.sidebarForeground || activeTheme.cardForeground));
      root.style.setProperty("--sidebar-border", toHslString(activeTheme.sidebarBorder || activeTheme.border));
      root.style.setProperty("--sidebar-active-background", toHslString(activeTheme.sidebarActiveBackground || resolvedAccent));
      root.style.setProperty("--sidebar-active-foreground", toHslString(activeTheme.sidebarActiveForeground || activeTheme.accentForeground));
    } else {
      root.style.setProperty("--sidebar-background", toHslString(activeTheme.cardBackground));
      root.style.setProperty("--sidebar-foreground", toHslString(activeTheme.cardForeground));
      root.style.setProperty("--sidebar-border", toHslString(activeTheme.border));
      root.style.setProperty("--sidebar-active-background", toHslString(resolvedAccent));
      root.style.setProperty("--sidebar-active-foreground", toHslString(activeTheme.accentForeground));
    }

    // Set default reader variables to follow general theme
    root.style.setProperty("--reader-background", toHslString(activeTheme.background));
    root.style.setProperty("--reader-foreground", toHslString(activeTheme.foreground));
    root.style.setProperty("--reader-border", toHslString(activeTheme.border));

    root.style.setProperty("--radius", activeTheme.cardRadius || "0.75rem");
    root.style.setProperty("--card-shadow", getShadowValue(activeTheme.cardShadow, activeTheme.glowSettings));
    root.style.setProperty("--primary-shadow", `rgba(${toRgbString(resolvedAccent)}, 0.25)`);

    // Glassmorphism (Global toggle for built-in, theme-specific for custom)
    const glassEnabled = isCustom ? activeTheme.glassmorphism?.enabled : glassmorphism;
    if (glassEnabled) {
      const bgRgb = toRgbString(activeTheme.cardBackground);
      const borderRgb = toRgbString(activeTheme.border);
      const opacity = isCustom ? (activeTheme.glassmorphism?.opacity ?? 0.45) : 0.45;
      const blur = isCustom ? (activeTheme.glassmorphism?.blur ?? 12) : 12;
      const bOpacity = isCustom ? (activeTheme.glassmorphism?.borderOpacity ?? 0.1) : (activeTheme.isDark ? 0.1 : 0.25);
      
      root.style.setProperty("--glass-bg", `rgba(${bgRgb}, ${opacity})`);
      root.style.setProperty("--glass-blur", `blur(${blur}px)`);
      root.style.setProperty("--glass-border", `1px solid rgba(${borderRgb}, ${bOpacity})`);
    } else {
      root.style.removeProperty("--glass-bg");
      root.style.removeProperty("--glass-blur");
      root.style.removeProperty("--glass-border");
    }

    // Background graphics engine
    let objectUrlToRevoke: string | null = null;
    
    if (activeTheme.bgType === "image" && activeTheme.bgImageUrl) {
      root.style.setProperty("--bg-image-opacity", (activeTheme.bgImageOpacity ?? 1).toString());
      root.style.setProperty("--bg-image-blur", `${activeTheme.bgImageBlur ?? 0}px`);
      if (activeTheme.bgImageOverlay) {
        const overlayRgb = toRgbString(activeTheme.bgImageOverlay);
        root.style.setProperty("--bg-image-overlay", `rgba(${overlayRgb}, ${activeTheme.bgImageOverlayOpacity ?? 0})`);
      } else {
        root.style.setProperty("--bg-image-overlay", "transparent");
      }

      if (activeTheme.bgImageUrl.startsWith("idb://")) {
        import("@/lib/services/image-storage").then(({ getBackgroundImageUrl }) => {
          getBackgroundImageUrl(activeTheme.bgImageUrl!).then(url => {
            if (url) {
              objectUrlToRevoke = url;
              root.style.setProperty("--bg-image", `url("${url}")`);
            }
          });
        });
      } else {
        root.style.setProperty("--bg-image", `url("${activeTheme.bgImageUrl}")`);
      }
    } else if (activeTheme.bgType === "gradient") {
      const angle = activeTheme.bgGradientAngle ?? 135;
      const startColor = activeTheme.bgGradientStart || activeTheme.background;
      const endColor = activeTheme.bgGradientEnd || activeTheme.background;
      root.style.setProperty("--bg-image", `linear-gradient(${angle}deg, ${startColor}, ${endColor})`);
      root.style.setProperty("--bg-image-opacity", "1");
      root.style.setProperty("--bg-image-blur", "0px");
      root.style.setProperty("--bg-image-overlay", "transparent");
    } else {
      root.style.removeProperty("--bg-image");
      root.style.removeProperty("--bg-image-opacity");
      root.style.removeProperty("--bg-image-blur");
      root.style.removeProperty("--bg-image-overlay");
    }

    body.setAttribute("data-accent", isCustom ? "custom" : (accentColor || "default"));
    body.setAttribute("data-ui-font", activeTheme.uiFont || uiFont);
    body.setAttribute("data-glass", glassEnabled ? "enabled" : "disabled");
    body.setAttribute("data-bg-type", activeTheme.bgType);

    // Injects user CSS custom stylesheet if present
    if (activeTheme.customCss) {
      const style = document.createElement("style");
      style.id = "visus-custom-theme-css";
      style.appendChild(document.createTextNode(activeTheme.customCss));
      document.head.appendChild(style);
    }

    // Apply active UI font family globally via CSS variables
    const activeUiFont = activeTheme.uiFont || uiFont;
    const resolvedUiFont = getFontFamilyStyle(activeUiFont, customFonts);

    if (resolvedUiFont.includes("var(--font-sans)")) {
      root.style.setProperty("--font-sans-override", "var(--font-sans)");
    } else if (resolvedUiFont.includes("var(--font-heading)")) {
      root.style.setProperty("--font-sans-override", "var(--font-heading)");
    } else if (resolvedUiFont.includes("'Hanken Grotesk'")) {
      root.style.setProperty("--font-sans-override", "'Hanken Grotesk'");
    } else {
      root.style.setProperty("--font-sans-override", resolvedUiFont);
    }
    
    // Total sync: inject the same font into all UI families to avoid inconsistencies
    root.style.setProperty("--font-heading-override", resolvedUiFont);
    root.style.setProperty("--font-mono-override", resolvedUiFont);
    root.style.setProperty("--font-serif-override", resolvedUiFont);

    if (reducedMotion) {
      root.classList.add("reduced-motion");
    } else {
      root.classList.remove("reduced-motion");
    }

    // Cleanup object URLs to avoid memory leaks
    return () => {
      if (objectUrlToRevoke) {
        URL.revokeObjectURL(objectUrlToRevoke);
      }
    };
  }, [theme, accentColor, uiFont, reducedMotion, glassmorphism, customThemes, customFonts, isLoaded]);

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
      "serviceWorker" in navigator
    ) {
      const registerSW = async () => {
        try {
          // Use updateViaCache: 'none' to ensure the browser always checks the server for a new SW script
          const reg = await navigator.serviceWorker.register("/sw.js", {
            updateViaCache: 'none'
          });
          console.log("Visus Service Worker successfully registered. Scope:", reg.scope);

          // Force update check on every page load
          reg.update();

          // Check for updates periodically (every 10 minutes)
          setInterval(() => {
            reg.update();
          }, 10 * 60 * 1000);

          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            newWorker?.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log("New content available, preparing to update...");
                // The new SW is ready. sw.js has skipWaiting(), so it will 
                // activate and trigger 'controllerchange' automatically.
              }
            });
          });
        } catch (error) {
          console.error("Error registering Visus Service Worker:", error);
        }
      };

      registerSW();

      // Handle the refresh when the new service worker takes control
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        console.log("Service Worker updated, reloading page...");
        window.location.reload();
      });
    }
  }, []);

  return (
    <AuthProvider>
      <SettingsProvider>
        <LibraryProvider>
          <ReadingListProvider>
            <ContextMenuProvider>
              <ThemeProviderHelper>
                {children}
                <Toaster 
                  position="bottom-right" 
                  closeButton 
                  expand={true}
                  visibleToasts={5}
                  toastOptions={{
                    className: "!bg-card !border-border !text-foreground",
                    classNames: {
                      toast: "!bg-card shadow-lg !border-border !text-foreground",
                      title: "!text-foreground font-bold font-heading text-sm",
                      description: "!text-muted-foreground font-sans text-xs",
                      actionButton: "bg-primary text-primary-foreground hover:bg-primary/90",
                      cancelButton: "bg-muted text-muted-foreground hover:bg-muted/90",
                      closeButton: "text-muted-foreground hover:text-foreground bg-transparent border-0",
                      success: "!border-primary/50 text-primary",
                      error: "!border-destructive/50 text-destructive",
                      warning: "!border-amber-500/50 text-amber-500",
                      info: "!border-blue-500/50 text-blue-500"
                    }
                  }}
                />
              </ThemeProviderHelper>
            </ContextMenuProvider>
          </ReadingListProvider>
        </LibraryProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
