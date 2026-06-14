import * as React from "react";
import { RsvpSettings } from "@/core/entities/settings";
import { RSVPWord } from "@/core/entities/text";
import { useReadingStore } from "../../stores/reading-store";
import { hexToRgba } from "@/lib/color-utils";
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
  const { customFonts } = useSettings();
  const localWordIndex = useReadingStore((state) => state.wordIndex);

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
  
  const isPreset = settings.orpColor in orpColors;
  const orpColorClass = isPreset ? orpColors[settings.orpColor as keyof typeof orpColors] : "";
  const orpGlowClass = isPreset && settings.orpGlow ? orpGlows[settings.orpColor as keyof typeof orpGlows] : "";
  
  const customOrpStyle: React.CSSProperties = !isPreset ? {
    color: settings.orpColor,
    textShadow: settings.orpGlow
      ? `0 0 12px ${hexToRgba(settings.orpColor, 0.55)}, 0 0 2px ${hexToRgba(settings.orpColor, 0.3)}`
      : undefined
  } : {};

  const customUnmarkedStyle: React.CSSProperties = {
    opacity: settings.unmarkedOpacity,
    color: settings.unmarkedColor,
  };

  const fontSizeStyle: React.CSSProperties = {
    fontSize: `${settings.fontSize}px`,
    fontFamily: getFontFamilyStyle(settings.fontFamily, customFonts),
  };

  return (
    <div className="w-full py-20 border border-border/30 dark:border-border/15 relative flex items-center justify-center bg-card/50 dark:bg-card/30 rounded-2xl overflow-hidden backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.03)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] transition-all duration-300">
      
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
            className="absolute right-full pr-[0.08em] font-bold text-right whitespace-nowrap select-none pointer-events-none transition-opacity duration-350"
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
            className="absolute left-full pl-[0.08em] font-bold text-left whitespace-nowrap select-none pointer-events-none transition-opacity duration-350"
          >
            {rightPart}
          </div>
        </div>
      </div>
    </div>
  );
}
