import * as React from "react";
import { BookVisualPage } from "@/lib/parser/paginator";
import { useReadingStore } from "../stores/reading-store";
import { ChevronLeft, ChevronRight, RotateCcw, RotateCw, Play, Pause, Zap } from "lucide-react";
import { findPageForWordIndex, findFirstPageOfChapter } from "../utils/binarySearch";

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
  // Subscribe atomically to Zustand store properties
  const isPlaying = useReadingStore((state) => state.isPlaying);
  const wpm = useReadingStore((state) => state.wpm);
  const mode = useReadingStore((state) => state.mode);

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

  const isNormalMode = mode === "normal";

  return (
    <div className="w-full max-w-2xl mt-auto mb-4 flex flex-col sm:flex-row items-center justify-between gap-6 bg-card/60 backdrop-blur-xl p-4 md:p-6 rounded-xl border border-border/20 shadow-xl z-20 liquid-glass transition-all duration-300">
      {/* Playback Toggles */}
      <div className="flex items-center justify-center gap-6">
        {isNormalMode ? (
          <button
            onClick={onPrevPage}
            disabled={!hasPrevPage}
            className="w-10 h-10 rounded-full border border-border/30 flex items-center justify-center text-muted-foreground hover:bg-accent disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Previous Chapter/Page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={onRewind}
            className="w-10 h-10 rounded-full border border-border/30 flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors"
            title="Rewind 10 words"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={onPlayPauseToggle}
          className={`w-16 h-16 rounded-full text-primary-foreground flex items-center justify-center shadow-lg hover:scale-105 transition-all ${
            isNormalMode 
              ? "bg-emerald-500 shadow-emerald-500/20" 
              : "bg-primary shadow-primary/20"
          }`}
          title={isNormalMode ? "Start Speed Reading (RSVP)" : (isPlaying ? "Pause" : "Play")}
        >
          {isNormalMode ? (
            <Zap className="w-6 h-6 fill-current" />
          ) : isPlaying ? (
            <Pause className="w-6 h-6 fill-current" />
          ) : (
            <Play className="w-6 h-6 fill-current ml-0.5" />
          )}
        </button>

        {isNormalMode ? (
          <button
            onClick={onNextPage}
            disabled={!hasNextPage}
            className="w-10 h-10 rounded-full border border-border/30 flex items-center justify-center text-muted-foreground hover:bg-accent disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Next Chapter/Page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={onSkip}
            className="w-10 h-10 rounded-full border border-border/30 flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors"
            title="Skip 10 words"
          >
            <RotateCw className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* WPM Speed Slider / Info Panel */}
      <div className="flex-1 flex flex-col gap-2 relative w-full sm:max-w-xs">
        {isNormalMode ? (
          <div className="flex flex-col justify-center h-full">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Reader Guide</span>
            <p className="text-xs text-foreground/80 font-sans leading-snug">
              Click the green play button to start speed reading from the first word of the chapter.
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Target speed</span>
              <div className="text-lg font-bold text-primary font-mono">
                {wpm} <span className="text-[10px] text-muted-foreground/80 font-normal">WPM</span>
              </div>
            </div>
            <div className="relative pt-2 pb-2">
              <input
                className="w-full accent-primary h-1 bg-border/40 rounded-lg appearance-none cursor-pointer"
                max="1200"
                min="100"
                type="range"
                value={wpm}
                onChange={(e) => onWpmChange(Number(e.target.value))}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
