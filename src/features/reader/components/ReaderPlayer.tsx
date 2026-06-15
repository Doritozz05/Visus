import * as React from "react";
import { BookVisualPage } from "@/lib/parser/paginator";
import { useReadingStore } from "../stores/reading-store";
import { ChevronLeft, ChevronRight, RotateCcw, RotateCw, Play, Pause, Zap } from "lucide-react";
import { findPageForWordIndex, findFirstPageOfChapter } from "../utils/binarySearch";
import { motion, AnimatePresence } from "framer-motion";

interface ReaderPlayerProps {
  onRewind: () => void;
  onSkip: () => void;
  onPrevPage?: () => void;
  onNextPage?: () => void;
  allBookPages: BookVisualPage[];
}

export function ReaderPlayer({
  onRewind,
  onSkip,
  onPrevPage,
  onNextPage,
  allBookPages,
}: ReaderPlayerProps) {
  const [showSlider, setShowSlider] = React.useState(false);

  // Subscribe atomically to Zustand store properties
  const isPlaying = useReadingStore((state) => state.isPlaying);
  const wpm = useReadingStore((state) => state.wpm);
  const mode = useReadingStore((state) => state.mode);
  const isFocusMode = useReadingStore((state) => state.isFocusMode);

  // Derive activePage ONLY in normal mode to prevent high-frequency re-renders during RSVP/Cluster playback
  const activePage = useReadingStore((state) => {
    if (state.mode !== "normal" || allBookPages.length === 0) return null;
    const found = findPageForWordIndex(allBookPages, state.activeChapterIndex, state.wordIndex);
    return (
      found ||
      findFirstPageOfChapter(allBookPages, state.activeChapterIndex) ||
      allBookPages[0]
    );
  });

  const hasPrevPage = activePage ? activePage.absolutePageIndex > 0 : false;
  const hasNextPage = activePage ? activePage.absolutePageIndex < allBookPages.length - 1 : false;

  const onPlayPauseToggle = React.useCallback(() => {
    useReadingStore.getState().setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const onWpmChange = React.useCallback((newWpm: number) => {
    useReadingStore.getState().setWpm(newWpm);
  }, []);

  const adjustWpm = React.useCallback((amount: number) => {
    useReadingStore.getState().setWpm(Math.max(100, Math.min(1200, wpm + amount)));
  }, [wpm]);

  const isNormalMode = mode === "normal";

  return (
    <div className={`w-full max-w-xl md:max-w-2xl mt-auto mb-4 bg-card/95 border border-border/20 shadow-xl rounded-xl z-20 overflow-hidden liquid-glass transition-all duration-300 ${
      isFocusMode 
        ? isPlaying 
          ? 'opacity-0 translate-y-4 hover:opacity-100 hover:translate-y-0' 
          : 'opacity-100 translate-y-0' 
        : 'opacity-100 translate-y-0'
    }`}>
      
      {/* Collapsible Speed Slider */}
      <AnimatePresence>
        {showSlider && !isNormalMode && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden px-4 pb-3 pt-3 border-b border-border/10 flex items-center gap-3 w-full"
          >
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground shrink-0">Fine tune:</span>
            <input
              className="flex-1 accent-primary h-1 bg-border/40 rounded-lg appearance-none cursor-pointer"
              max="1200"
              min="100"
              step="25"
              type="range"
              value={wpm}
              onChange={(e) => onWpmChange(Number(e.target.value))}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between w-full h-14 px-3 sm:px-4">
        {/* Left: Speed Adjuster or Reader Info */}
        <div className="flex items-center gap-1.5 min-w-0">
          {isNormalMode ? (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Zap className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-wider font-semibold truncate max-w-[80px] xs:max-w-[120px]">Page view</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={() => adjustWpm(-25)}
                className="w-7 h-7 rounded-lg border border-border/20 flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-primary transition-colors cursor-pointer select-none"
                title="Decrease speed -25 WPM"
              >
                <span className="text-sm font-bold">-</span>
              </button>
              <button
                onClick={() => setShowSlider(!showSlider)}
                className={`px-2 py-0.5 h-7 flex items-center justify-center rounded-lg border font-mono text-[11px] font-bold transition-all cursor-pointer select-none ${
                  showSlider 
                    ? "border-primary bg-primary/10 text-primary shadow-[0_0_8px_rgba(var(--primary),0.1)]" 
                    : "border-border/20 text-foreground hover:bg-accent"
                }`}
                title="Toggle WPM slider"
              >
                {wpm} <span className="text-[9px] text-muted-foreground/80 font-normal ml-0.5">WPM</span>
              </button>
              <button
                onClick={() => adjustWpm(25)}
                className="w-7 h-7 rounded-lg border border-border/20 flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-primary transition-colors cursor-pointer select-none"
                title="Increase speed +25 WPM"
              >
                <span className="text-sm font-bold">+</span>
              </button>
            </div>
          )}
        </div>

        {/* Center: Playback controls */}
        <div className="flex items-center gap-3">
          {isNormalMode ? (
            <button
              onClick={onPrevPage}
              disabled={!hasPrevPage}
              className="w-8 h-8 rounded-full border border-border/20 flex items-center justify-center text-muted-foreground hover:bg-accent disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onRewind}
              className="w-8 h-8 rounded-full border border-border/20 flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors cursor-pointer"
              title="Rewind 10 words"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onPlayPauseToggle}
            className={`w-11 h-11 rounded-full text-primary-foreground flex items-center justify-center shadow-lg hover:scale-105 transition-all cursor-pointer ${
              isNormalMode 
                ? "bg-emerald-500 shadow-emerald-500/20" 
                : "bg-primary shadow-primary/20"
            }`}
            title={isNormalMode ? "Start Speed Reading (RSVP)" : (isPlaying ? "Pause" : "Play")}
          >
            {isNormalMode ? (
              <Zap className="w-5 h-5 fill-current" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          {isNormalMode ? (
            <button
              onClick={onNextPage}
              disabled={!hasNextPage}
              className="w-8 h-8 rounded-full border border-border/20 flex items-center justify-center text-muted-foreground hover:bg-accent disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onSkip}
              className="w-8 h-8 rounded-full border border-border/20 flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors cursor-pointer"
              title="Skip 10 words"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right: Mode indicator */}
        <div className="flex items-center gap-1.5 select-none shrink-0">
          <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground/80 bg-accent/40 px-2 py-0.5 rounded border border-border/10">
            {mode}
          </span>
        </div>
      </div>
    </div>
  );
}
