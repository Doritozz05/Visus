import * as React from "react";
import { BookVisualPage } from "@/lib/parser/paginator";
import { useReadingStore } from "../stores/reading-store";
import { 
  RotateCcw, 
  RotateCw, 
  Play, 
  Pause, 
  Settings2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayerVisibility } from "../hooks/usePlayerVisibility";
import { WpmScrubber } from "./WpmScrubber";

interface ReaderPlayerProps {
  onRewind: () => void;
  onSkip: () => void;
  allBookPages: BookVisualPage[];
}

/**
 * ReaderPlayer component for RSVP and Cluster reading modes.
 * Handles playback controls, speed adjustment, and visibility logic.
 * Note: This component is NOT rendered in 'normal' reading mode.
 */
export const ReaderPlayer = React.memo(({
  onRewind,
  onSkip,
}: ReaderPlayerProps) => {
  const [isWpmExpanded, setIsWpmExpanded] = React.useState(false);

  // Atomic selectors for performance
  const isPlaying = useReadingStore((state) => state.isPlaying);
  const wpm = useReadingStore((state) => state.wpm);
  const mode = useReadingStore((state) => state.mode);
  const isFocusMode = useReadingStore((state) => state.isFocusMode);

  const setWpm = useReadingStore((state) => state.setWpm);
  const setIsPlaying = useReadingStore((state) => state.setIsPlaying);

  // Derived visibility state
  const { isVisible, onPlayerMouseEnter, onPlayerMouseLeave } = usePlayerVisibility({ 
    isPlaying, 
    isFocusMode 
  });

  const onPlayPauseToggle = React.useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying, setIsPlaying]);

  return (
    <div 
      onMouseEnter={onPlayerMouseEnter}
      onMouseLeave={onPlayerMouseLeave}
      className="fixed bottom-6 left-0 right-0 flex justify-center px-4 z-50 pointer-events-none reader-player-container"
    >
      <motion.div
        initial={false}
        animate={{ 
          y: isVisible ? 0 : 100,
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.98
        }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 30,
          opacity: { duration: 0.2 }
        }}
        className="relative pointer-events-auto origin-bottom"
      >
        <motion.div 
          layout
          transition={{
            layout: { type: "spring", stiffness: 450, damping: 40, mass: 1 }
          }}
          className="liquid-glass flex flex-col gap-0 overflow-hidden shadow-[var(--card-shadow)] rounded-[calc(var(--radius)*2)] border border-border/30 bg-card/85 backdrop-blur-2xl w-[280px] xs:w-[320px] sm:w-[380px] !transition-none will-change-[transform,opacity]"
        >
          {/* Main Control Row */}
          <div className="flex items-center h-14 px-4 sm:px-5">
            
            {/* Left Slot: Speed Toggle Indicator */}
            <div className="flex-1 flex items-center justify-start">
              <button
                onClick={() => setIsWpmExpanded(!isWpmExpanded)}
                className={`
                  group flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all border
                  ${isWpmExpanded 
                    ? "bg-primary/10 border-primary/40 text-primary" 
                    : "bg-accent/30 border-border/20 text-muted-foreground hover:bg-accent hover:border-border/40"}
                `}
              >
                <div className="flex flex-col items-start leading-none min-w-[2.5ch]">
                  <span className="font-mono text-[11px] font-bold">{wpm}</span>
                  <span className="text-[8px] uppercase tracking-tighter opacity-70 font-bold">WPM</span>
                </div>
                <Settings2 className={`w-3.5 h-3.5 transition-transform duration-500 ${isWpmExpanded ? 'rotate-180' : 'group-hover:rotate-45'}`} />
              </button>
            </div>

            {/* Center Slot: Core Playback Group */}
            <div className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2 bg-accent/20 p-1 rounded-2xl border border-border/10">
              <button
                onClick={onRewind}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-all active:scale-90"
                title="Rewind 10 words"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={onPlayPauseToggle}
                className={`
                  w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-lg
                  ${isPlaying 
                    ? "bg-primary/20 text-primary border border-primary/30" 
                    : "bg-primary text-primary-foreground shadow-primary/20"}
                `}
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={onSkip}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-all active:scale-90"
                title="Skip 10 words"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {/* Right Slot: Mode Chip */}
            <div className="flex-1 flex items-center justify-end">
              <div className="hidden xs:flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 bg-accent/30 px-2 py-1 rounded-lg border border-border/10">
                <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-primary animate-pulse' : 'bg-muted-foreground/40'}`} />
                {mode}
              </div>
            </div>
          </div>

          {/* Expandable Speed Scrubber */}
          <AnimatePresence initial={false}>
            {isWpmExpanded && (
              <motion.div
                key="wpm-scrubber"
                layout
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ 
                  height: { type: "spring", stiffness: 450, damping: 40 },
                  opacity: { duration: 0.2 }
                }}
                className="overflow-hidden border-t border-border/10 px-6 pb-6 pt-3"
              >
                <WpmScrubber wpm={wpm} onWpmChange={setWpm} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
});

ReaderPlayer.displayName = "ReaderPlayer";
