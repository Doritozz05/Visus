import * as React from "react";
import { RsvpSettings } from "@/core/entities/settings";
import { RSVPWord } from "@/core/entities/text";
import { useReadingStore } from "../../stores/reading-store";
import { hexToRgba } from "@/lib/color-utils";
import { BUILTIN_THEMES } from "@/core/config/themes";
import { useSettings } from "@/features/settings/context/settings-context";
import { getFontFamilyStyle, getReaderFontClass } from "@/lib/typography";

interface RsvpVisualBoxProps {
  rsvpSequence: RSVPWord[];
  settings: RsvpSettings;
}

export function RsvpVisualBox({
  rsvpSequence,
  settings,
}: RsvpVisualBoxProps) {
  const { settings: globalSettings, customFonts } = useSettings();
  const localWordIndex = useReadingStore((state) => state.wordIndex);

  // Resolve semantic colors based on current theme
  const getThemeColor = (key: string) => {
    const themeId = globalSettings.general.theme;
    const customThemes = globalSettings.general.customThemes || [];

    // Check built-in themes first
    const builtIn = BUILTIN_THEMES.find(t => t.id === themeId);
    if (builtIn) {
      if (key === "primary") return builtIn.accent;
      if (key === "foreground") return builtIn.foreground;
      if (key === "muted") return builtIn.mutedForeground;
    }

    // Check custom themes
    const custom = customThemes.find(t => t.id === themeId);
    if (custom) {
      if (key === "primary") return custom.accent;
      if (key === "foreground") return custom.foreground;
      if (key === "muted") return custom.mutedForeground;
    }

    return key; // Fallback
  };

  const currentWordObj = rsvpSequence[localWordIndex] || { text: "Ready", orpIndex: 1, delayMultiplier: 1.0 };
  const currentWordText = currentWordObj.text;
  const orpIndex = currentWordObj.orpIndex;
  const leftPart = currentWordText.slice(0, orpIndex);
  const focusLetter = currentWordText.charAt(orpIndex);
  const rightPart = currentWordText.slice(orpIndex + 1);

  const orpColors = {
    amber: "text-amber-500 dark:text-amber-400",
    orange: "text-[#ffb95f]",
    emerald: "text-emerald-500 dark:text-emerald-400",
    violet: "text-violet-500 dark:text-violet-400",
    indigo: "text-indigo-500 dark:text-indigo-400",
    rose: "text-rose-500 dark:text-rose-400",
  };

  const orpGlows = {
    orange: "text-shadow-glow-orange",
    amber: "text-shadow-glow-amber",
    emerald: "text-shadow-glow-emerald",
    violet: "text-shadow-glow-violet",
    indigo: "text-shadow-glow-indigo",
    rose: "text-shadow-glow-rose",
  };

  const readerFontClass = getReaderFontClass(settings.fontFamily);

  const resolvedOrpColor = settings.orpColor === "primary" ? getThemeColor("primary") : settings.orpColor;
  const isPreset = resolvedOrpColor in orpColors;
  const orpColorClass = isPreset ? orpColors[resolvedOrpColor as keyof typeof orpColors] : "";
  const orpGlowClass = isPreset && settings.orpGlow ? orpGlows[resolvedOrpColor as keyof typeof orpGlows] : "";

  const customOrpStyle: React.CSSProperties = !isPreset ? {
    color: resolvedOrpColor,
    textShadow: settings.orpGlow
      ? `0 0 12px ${hexToRgba(resolvedOrpColor, 0.55)}, 0 0 2px ${hexToRgba(resolvedOrpColor, 0.3)}`
      : undefined
  } : {};

  const resolvedUnmarkedColor = settings.unmarkedColor === "foreground"
    ? getThemeColor("foreground")
    : (settings.unmarkedColor === "primary" ? getThemeColor("primary") : settings.unmarkedColor);

  const customUnmarkedStyle: React.CSSProperties = {
    opacity: settings.unmarkedOpacity,
    color: resolvedUnmarkedColor,
  };

  const fontSizeStyle: React.CSSProperties = {
    fontSize: `${settings.fontSize}px`,
    fontFamily: getFontFamilyStyle(settings.fontFamily, customFonts),
  };

  return (
    <div className="w-full max-w-3xl h-[280px] border border-border/30 dark:border-border/15 relative flex items-center justify-center bg-card rounded-2xl overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.03)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] transition-all duration-300">
      {settings.showFocusGuides && (
        <div className="absolute left-[42%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-32 pointer-events-none z-0">
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-primary/15" />
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary/35" />
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary/35" />
        </div>
      )}

      <div
        style={fontSizeStyle}
        className={`w-full h-[1.2em] font-heading select-none tracking-tight flex items-center justify-center relative z-10 ${readerFontClass}`}
      >
        <div
          style={{ left: "42%" }}
          className="absolute -translate-x-1/2 flex items-center justify-center h-full"
        >
          <div
            style={customUnmarkedStyle}
            className={`absolute right-full pr-[0.08em] font-bold text-right whitespace-nowrap select-none pointer-events-none transition-opacity duration-350 ${settings.focalWeighting ? "font-extrabold" : ""}`}
          >
            {leftPart}
          </div>

          <div className="relative flex items-center justify-center z-10">
            <span
              style={customOrpStyle}
              className={`font-extrabold text-center relative transition-colors duration-200 ${orpColorClass} ${orpGlowClass}`}
            >
              {focusLetter}
            </span>
          </div>

          <div
            style={customUnmarkedStyle}
            className={`absolute left-full pl-[0.08em] text-left whitespace-nowrap select-none pointer-events-none transition-opacity duration-350 ${settings.focalWeighting ? "font-normal opacity-50" : "font-bold"}`}
          >
            {rightPart}
          </div>
        </div>
      </div>
    </div>
  );
}
