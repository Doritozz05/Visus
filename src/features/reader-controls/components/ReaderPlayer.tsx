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
    <div className="w-full max-w-2xl mt-auto mb-4 flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#171f33]/60 backdrop-blur-xl p-4 md:p-6 rounded-xl border border-[#464554]/20 shadow-xl z-20">
      {/* Playback Toggles */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={onRewind}
          className="w-10 h-10 rounded-full border border-[#464554]/30 flex items-center justify-center text-[#c7c4d7] hover:bg-[#222a3d] transition-colors"
          title="Rewind 10 words"
        >
          <span className="material-symbols-outlined text-lg">replay_10</span>
        </button>
        <button
          onClick={onPlayPauseToggle}
          className="w-16 h-16 rounded-full bg-[#c0c1ff] text-[#1000a9] flex items-center justify-center shadow-[0_0_20px_rgba(192,193,255,0.2)] hover:scale-105 transition-all"
        >
          <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            {isPlaying ? "pause" : "play_arrow"}
          </span>
        </button>
        <button
          onClick={onSkip}
          className="w-10 h-10 rounded-full border border-[#464554]/30 flex items-center justify-center text-[#c7c4d7] hover:bg-[#222a3d] transition-colors"
          title="Skip 10 words"
        >
          <span className="material-symbols-outlined text-lg">forward_10</span>
        </button>
      </div>

      {/* WPM Speed Slider */}
      <div className="flex-1 flex flex-col gap-2 relative w-full sm:max-w-xs">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Target speed</span>
          <div className="text-lg font-bold text-[#c0c1ff] font-mono">
            {wpm} <span className="text-[10px] text-slate-400 font-normal">WPM</span>
          </div>
        </div>
        <div className="relative pt-2 pb-2">
          <input
            className="w-full accent-[#c0c1ff] h-1 bg-[#464554] rounded-lg appearance-none cursor-pointer"
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
