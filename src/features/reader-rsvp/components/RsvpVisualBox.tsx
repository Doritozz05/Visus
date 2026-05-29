import * as React from "react";
import { RsvpSettings } from "@/core/entities/settings";

interface RsvpVisualBoxProps {
  leftPart: string;
  focusLetter: string;
  rightPart: string;
  settings: RsvpSettings;
}

export function RsvpVisualBox({ 
  leftPart, 
  focusLetter, 
  rightPart,
  settings,
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

  const unmarkedColors = {
    foreground: "text-foreground",
    primary: "text-primary",
    muted: "text-muted-foreground",
  };

  const fontFamilyClass = fontFamilies[settings.fontFamily as keyof typeof fontFamilies] || fontFamilies.inter;
  const orpColorClass = orpColors[settings.orpColor as keyof typeof orpColors] || orpColors.orange;
  const orpGlowClass = orpGlows[settings.orpColor as keyof typeof orpGlows] || orpGlows.orange;
  const unmarkedColorClass = unmarkedColors[settings.unmarkedColor as keyof typeof unmarkedColors] || unmarkedColors.foreground;
  
  const fontSizeStyle: React.CSSProperties = {
    fontSize: `${settings.fontSize}px`,
  };

  return (
    <div className="w-full py-20 border border-border/30 dark:border-border/15 relative flex items-center justify-center bg-card/50 dark:bg-card/30 rounded-2xl overflow-hidden backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.03)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] transition-all duration-300">
      
      {/* The Active RSVP Layout */}
      <div 
        style={fontSizeStyle}
        className={`w-full font-heading select-none tracking-tight flex items-center relative z-10 ${fontFamilyClass}`}
      >
        {/* Left Part: right-aligned, takes up 42% of space cleanly */}
        <div 
          style={{ flex: "42 42 0%", opacity: settings.unmarkedOpacity }}
          className={`text-right pr-0.5 font-bold transition-all duration-350 min-w-0 ${unmarkedColorClass}`}
        >
          {leftPart}
        </div>
        
        {/* Focus Letter (ORP): exactly centered at the 42% boundary, never squished */}
        <div className="shrink-0 flex items-center justify-center relative z-10 px-0.5">
          {/* Target Reticle/Guide lines positioned exactly relative to the center of the focus letter! */}
          {settings.showFocusGuides && (
            <>
              <div className="absolute top-[-80px] bottom-[-80px] w-[2px] bg-primary/15 left-1/2 -translate-x-1/2 pointer-events-none z-0" />
              <div className="absolute top-[-60px] w-4 h-[2px] bg-primary/35 left-1/2 -translate-x-1/2 pointer-events-none z-0" />
              <div className="absolute bottom-[-60px] w-4 h-[2px] bg-primary/35 left-1/2 -translate-x-1/2 pointer-events-none z-0" />
            </>
          )}
          
          <span 
            className={`font-extrabold text-center relative transition-all duration-350 ${orpColorClass} ${
              settings.orpGlow ? orpGlowClass : ""
            }`}
          >
            {focusLetter}
          </span>
        </div>
        
        {/* Right Part: left-aligned, takes up remaining 58% of space cleanly */}
        <div 
          style={{ flex: "58 58 0%", opacity: settings.unmarkedOpacity }}
          className={`text-left pl-0.5 font-bold transition-all duration-350 min-w-0 ${unmarkedColorClass}`}
        >
          {rightPart}
        </div>
      </div>
    </div>
  );
}
