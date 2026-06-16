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
      className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-24px)] max-w-[360px] z-50 pointer-events-none reader-player-container flex justify-center"
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
          stiffness: 380, 
          damping: 32,
          mass: 0.9
        }}
        className="relative pointer-events-auto origin-bottom w-full"
      >
        <div 
          className="liquid-glass flex flex-col gap-0 overflow-hidden shadow-[var(--card-shadow)] rounded-[calc(var(--radius)*2)] border border-border/30 bg-card/85 backdrop-blur-xl w-full"
        >
          {/* Expandable Speed Scrubber */}
          <AnimatePresence initial={false}>
            {isWpmExpanded && (
              <motion.div
                key="wpm-scrubber"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 380,
                  damping: 32,
                  mass: 0.9
                }}
                className="overflow-hidden border-b border-border/10"
              >
                <div className="px-6 pt-6 pb-3">
                  <WpmScrubber wpm={wpm} onWpmChange={setWpm} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Control Row */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center h-12 px-3 sm:px-4 gap-2">
            
            {/* Left Slot: Speed Toggle Indicator */}
            <div className="flex items-center justify-start overflow-hidden">
              <button
                onClick={() => setIsWpmExpanded(!isWpmExpanded)}
                className={`
                  group flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all border
                  ${isWpmExpanded 
                    ? "bg-primary/10 border-primary/40 text-primary" 
                    : "bg-accent/30 border-border/20 text-muted-foreground hover:bg-accent hover:border-border/40"}
                `}
              >
                <Settings2 className={`w-3 h-3 transition-transform duration-500 ${isWpmExpanded ? 'rotate-180' : 'group-hover:rotate-45'}`} />
                <span className="font-mono text-[10px] font-bold">{wpm}</span>
              </button>
            </div>

            {/* Center Slot: Core Playback Group */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-0.5 sm:gap-1 bg-accent/20 p-0.5 rounded-2xl border border-border/10">
                <button
                  onClick={onRewind}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-all active:scale-90"
                  title="Rewind 10 words"
                >
                  <RotateCcw className="w-3 h-3 sm:w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onPlayPauseToggle}
                  className={`
                    w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-lg
                    ${isPlaying 
                      ? "bg-primary/20 text-primary border border-primary/30" 
                      : "bg-primary text-primary-foreground shadow-primary/20"}
                  `}
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                  ) : (
                    <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  onClick={onSkip}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-all active:scale-90"
                  title="Skip 10 words"
                >
                  <RotateCw className="w-3 h-3 sm:w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Slot: Mode Chip */}
            <div className="flex items-center justify-end overflow-hidden">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-border/20 bg-accent/30 text-muted-foreground/60 transition-all">
                <span className={`w-1 h-1 rounded-full ${isPlaying ? 'bg-primary animate-pulse' : 'bg-muted-foreground/40'}`} />
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider">{mode}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

ReaderPlayer.displayName = "ReaderPlayer";
