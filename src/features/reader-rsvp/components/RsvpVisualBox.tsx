import * as React from "react";
import { RsvpSettings } from "@/core/entities/settings";

interface RsvpVisualBoxProps {
  rsvpSequence: any[];
  initialWordIndex: number;
  subscribeToPlayback: (callback: (idx: number) => void) => () => void;
  settings: RsvpSettings;
}

export function RsvpVisualBox({ 
  rsvpSequence, 
  initialWordIndex,
  subscribeToPlayback,
  settings,
}: RsvpVisualBoxProps) {
  const [localWordIndex, setLocalWordIndex] = React.useState(initialWordIndex);

  // Sync state if initialWordIndex changes (such as manually moving bookmarks or skip/rewind)
  React.useEffect(() => {
    setLocalWordIndex(initialWordIndex);
  }, [initialWordIndex]);

  // Subscribe to high-frequency timer ticks
  React.useEffect(() => {
    return subscribeToPlayback((newIdx) => {
      setLocalWordIndex(newIdx);
    });
  }, [subscribeToPlayback]);

  // Calculations for current active RSVP word
  const currentWordObj = rsvpSequence[localWordIndex] || { text: "Ready", orpIndex: 1, delayMultiplier: 1.0 };
  const currentWordText = currentWordObj.text;
  const orpIndex = currentWordObj.orpIndex;
  const leftPart = currentWordText.slice(0, orpIndex);
  const focusLetter = currentWordText.charAt(orpIndex);
  const rightPart = currentWordText.slice(orpIndex + 1);
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
      
      {/* Perfectly static, sub-pixel immune visual guide lines */}
      {settings.showFocusGuides && (
        <div className="absolute left-[42%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-32 pointer-events-none z-0">
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-primary/15" />
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary/35" />
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary/35" />
        </div>
      )}

      {/* The Active RSVP Layout */}
      <div 
        style={fontSizeStyle}
        className={`w-full h-[1.2em] font-heading select-none tracking-tight flex items-center justify-center relative z-10 ${fontFamilyClass}`}
      >
        {/* Centered Anchor at exactly 42% of the parent's width */}
        <div 
          style={{ left: "42%" }}
          className="absolute -translate-x-1/2 flex items-center justify-center h-full"
        >
          {/* Left Part: placed absolute right-full, ends exactly at the left edge of the ORP letter */}
          <div 
            style={{ opacity: settings.unmarkedOpacity }}
            className={`absolute right-full pr-[0.08em] font-bold text-right whitespace-nowrap select-none pointer-events-none transition-opacity duration-350 ${unmarkedColorClass}`}
          >
            {leftPart}
          </div>
          
          {/* Focus Letter (ORP): exactly centered at the 42% mark of the parent card */}
          <div className="relative flex items-center justify-center z-10">
            <span 
              className={`font-extrabold text-center relative transition-colors duration-200 ${orpColorClass} ${
                settings.orpGlow ? orpGlowClass : ""
              }`}
            >
              {focusLetter}
            </span>
          </div>
          
          {/* Right Part: placed absolute left-full, starts exactly at the right edge of the ORP letter */}
          <div 
            style={{ opacity: settings.unmarkedOpacity }}
            className={`absolute left-full pl-[0.08em] font-bold text-left whitespace-nowrap select-none pointer-events-none transition-opacity duration-350 ${unmarkedColorClass}`}
          >
            {rightPart}
          </div>
        </div>
      </div>
    </div>
  );
}
