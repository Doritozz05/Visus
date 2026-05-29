import * as React from "react";
import { RsvpSettings } from "@/core/entities/settings";

interface RsvpVisualBoxProps {
  leftPart: string;
  focusLetter: string;
  rightPart: string;
  settings: RsvpSettings;
  prevWord?: string;
  nextWord?: string;
}

export function RsvpVisualBox({ 
  leftPart, 
  focusLetter, 
  rightPart,
  settings,
  prevWord = "",
  nextWord = "",
}: RsvpVisualBoxProps) {
  const fontFamilies = {
    inter: "font-sans",
    atkinson: "font-sans font-medium tracking-wide",
    dyslexic: "font-sans font-bold tracking-widest",
  };

  const orpColors = {
    amber: "text-amber-500 dark:text-amber-400",
    orange: "text-[#ffb95f]", // Classic orange
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

  const fontFamilyClass = fontFamilies[settings.fontFamily as keyof typeof fontFamilies] || fontFamilies.inter;
  const orpColorClass = orpColors[settings.orpColor as keyof typeof orpColors] || orpColors.orange;
  const orpGlowClass = orpGlows[settings.orpColor as keyof typeof orpGlows] || orpGlows.orange;
  
  const fontSizeStyle: React.CSSProperties = {
    fontSize: `${settings.fontSize}px`,
  };

  const contextStyle: React.CSSProperties = {
    opacity: settings.contextOpacity,
    fontSize: `${settings.fontSize * 0.6}px`, // slightly smaller
    filter: "blur(2px)",
  };

  return (
    <div className="w-full py-20 border-y border-border/20 relative flex items-center justify-center bg-card/30 rounded-2xl overflow-hidden backdrop-blur-md">
      
      {/* Target Reticle/Guide lines for visual balance pinning */}
      <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-primary/10 -translate-x-1/2 pointer-events-none z-0" />
      <div className="absolute left-1/2 top-4 w-4 h-[2px] bg-primary/30 -translate-x-1/2 pointer-events-none z-0" />
      <div className="absolute left-1/2 bottom-4 w-4 h-[2px] bg-primary/30 -translate-x-1/2 pointer-events-none z-0" />

      {/* The Active RSVP Layout */}
      <div 
        style={fontSizeStyle}
        className={`w-full font-heading select-none tracking-tight flex items-center relative z-10 ${fontFamilyClass}`}
      >
        {/* Optional Context words to the left */}
        {settings.showContextWords && prevWord && (
          <div 
            style={contextStyle}
            className="absolute left-4 md:left-12 max-w-[20%] text-right font-medium truncate select-none hidden sm:block text-muted-foreground transition-all duration-300"
          >
            {prevWord}
          </div>
        )}

        {/* Left Part: right-aligned, takes up left half */}
        <div className="flex-1 text-right opacity-30 pr-0.5 text-foreground font-bold transition-all duration-350">
          {leftPart}
        </div>
        
        {/* Focus Letter (ORP): exactly in the middle */}
        <div 
          className={`shrink-0 font-extrabold px-0.5 text-center relative transition-all duration-350 ${orpColorClass} ${
            settings.orpGlow ? orpGlowClass : ""
          }`}
        >
          {focusLetter}
        </div>
        
        {/* Right Part: left-aligned, takes up right half */}
        <div className="flex-1 text-left opacity-30 pl-0.5 text-foreground font-bold transition-all duration-350">
          {rightPart}
        </div>

        {/* Optional Context words to the right */}
        {settings.showContextWords && nextWord && (
          <div 
            style={contextStyle}
            className="absolute right-4 md:right-12 max-w-[20%] text-left font-medium truncate select-none hidden sm:block text-muted-foreground transition-all duration-300"
          >
            {nextWord}
          </div>
        )}
      </div>
    </div>
  );
}
