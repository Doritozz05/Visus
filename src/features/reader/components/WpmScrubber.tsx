import * as React from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useReadingStore } from "../stores/reading-store";

interface WpmScrubberProps {
  wpm: number;
  onWpmChange: (newWpm: number) => void;
}

const PRESETS = [250, 400, 600, 800];

export const WpmScrubber = React.memo(({ wpm, onWpmChange }: WpmScrubberProps) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Local state for smooth UI, committed to store on change or drag end
  const [localWpm, setLocalWpm] = React.useState(wpm);

  React.useEffect(() => {
    if (!isDragging) setLocalWpm(wpm);
  }, [wpm, isDragging]);

  const handleUpdate = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    
    // Scale: 100 to 1200 WPM
    const newWpm = Math.round((percentage * 1100 + 100) / 25) * 25;
    setLocalWpm(newWpm);
    onWpmChange(newWpm);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    handleUpdate(e.clientX);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      handleUpdate(e.clientX);
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const progress = (localWpm - 100) / 1100;

  return (
    <div className="flex flex-col gap-3 w-full px-1">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/70 font-bold">
          Reading Speed
        </span>
        <div className="flex items-center gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => onWpmChange(p)}
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded transition-all ${
                wpm === p 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-accent/50 text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div 
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="relative h-8 flex items-center cursor-ew-resize group select-none"
      >
        {/* Track */}
        <div className="absolute w-full h-1.5 bg-border/30 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary/40"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Notches */}
        <div className="absolute w-full h-full flex justify-between items-center px-0.5 pointer-events-none">
          {[...Array(11)].map((_, i) => (
            <div 
              key={i} 
              className={`w-0.5 rounded-full transition-[height,background-color] duration-200 ${
                i / 10 <= progress ? "h-2 bg-primary/40" : "h-1 bg-border/40"
              }`} 
            />
          ))}
        </div>

        {/* Handle */}
        <motion.div 
          className={`absolute w-4 h-4 rounded-full bg-primary shadow-lg border-2 border-background z-10 flex items-center justify-center transition-transform ${
            isDragging ? "scale-125 shadow-primary/20" : "group-hover:scale-110"
          }`}
          style={{ left: `calc(${progress * 100}% - 8px)` }}
        >
          {isDragging && (
            <div className="absolute -top-8 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded shadow-xl">
              {localWpm}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
});

WpmScrubber.displayName = "WpmScrubber";
