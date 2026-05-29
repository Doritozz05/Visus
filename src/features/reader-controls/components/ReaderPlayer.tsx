import * as React from "react";

interface ReaderPlayerProps {
  isPlaying: boolean;
  onPlayPauseToggle: () => void;
  wpm: number;
  onWpmChange: (wpm: number) => void;
  onRewind: () => void;
  onSkip: () => void;
}

export function ReaderPlayer({
  isPlaying,
  onPlayPauseToggle,
  wpm,
  onWpmChange,
  onRewind,
  onSkip,
}: ReaderPlayerProps) {
  return (
    <div className="w-full max-w-2xl mt-auto mb-4 flex flex-col sm:flex-row items-center justify-between gap-6 bg-card/60 backdrop-blur-xl p-4 md:p-6 rounded-xl border border-border/20 shadow-xl z-20 glass-panel transition-all duration-300">
      {/* Playback Toggles */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={onRewind}
          className="w-10 h-10 rounded-full border border-border/30 flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors"
          title="Rewind 10 words"
        >
          <span className="material-symbols-outlined text-lg">replay_10</span>
        </button>
        <button
          onClick={onPlayPauseToggle}
          className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-all"
        >
          <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            {isPlaying ? "pause" : "play_arrow"}
          </span>
        </button>
        <button
          onClick={onSkip}
          className="w-10 h-10 rounded-full border border-border/30 flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors"
          title="Skip 10 words"
        >
          <span className="material-symbols-outlined text-lg">forward_10</span>
        </button>
      </div>

      {/* WPM Speed Slider */}
      <div className="flex-1 flex flex-col gap-2 relative w-full sm:max-w-xs">
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
      </div>
    </div>
  );
}
