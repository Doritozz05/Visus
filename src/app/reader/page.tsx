"use client";

import * as React from "react";
import { Sidebar } from "@/components/Sidebar";
import { calculateORP, calculatePunctuationDelay } from "@/core/algorithms/rsvp";

const PROTOTYPE_TEXT = 
  "Visus elevates your reading speed by locking your focus onto the Optimal Recognition Point of each word. By eliminating traditional eye scanning patterns, RSVP allows your brain to absorb information at an outstanding rate of compression. Combined with visual semantic cluster tracking, you can effortlessly train your peripheral field of vision.";

export default function ReaderPage() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [wpm, setWpm] = React.useState(600);
  const [wordIndex, setWordIndex] = React.useState(0);
  const [mode, setMode] = React.useState<"rsvp" | "cluster">("rsvp");

  const words = React.useMemo(() => {
    return PROTOTYPE_TEXT.split(/\s+/);
  }, []);

  // Timer interval for RSVP
  React.useEffect(() => {
    if (!isPlaying) return;

    const currentWord = words[wordIndex] || "";
    const baseDelayMs = (60 * 1000) / wpm;
    const delayMultiplier = calculatePunctuationDelay(currentWord);
    const finalDelay = baseDelayMs * delayMultiplier;

    const interval = setTimeout(() => {
      setWordIndex((prev) => {
        if (prev >= words.length - 1) {
          setIsPlaying(false);
          return 0; // Reset
        }
        return prev + 1;
      });
    }, finalDelay);

    return () => clearTimeout(interval);
  }, [isPlaying, wordIndex, wpm, words]);

  // Current RSVP word elements
  const currentWord = words[wordIndex] || "Ready";
  const orpIndex = calculateORP(currentWord);
  const leftPart = currentWord.slice(0, orpIndex);
  const focusLetter = currentWord.charAt(orpIndex);
  const rightPart = currentWord.slice(orpIndex + 1);

  // Cluster groupings (3 words per chunk)
  const clusterChunks = React.useMemo(() => {
    const chunks: string[] = [];
    for (let i = 0; i < words.length; i += 3) {
      chunks.push(words.slice(i, i + 3).join(" "));
    }
    return chunks;
  }, [words]);

  const activeClusterIndex = Math.min(
    Math.floor(wordIndex / 3),
    clusterChunks.length - 1
  );

  const progressPercentage = Math.round(((wordIndex + 1) / words.length) * 100);

  return (
    <div className="bg-[#0b1326] text-[#dae2fd] font-sans min-h-screen flex flex-col md:flex-row antialiased selection:bg-[#8083ff]/30 selection:text-white">
      <Sidebar activePath="/reader" />

      {/* Mobile TopNav */}
      <nav className="md:hidden bg-[#0b1326] border-b border-[#464554]/30 flex justify-between items-center w-full px-6 py-4 z-50 sticky top-0">
        <div className="text-xl font-bold tracking-tight text-[#dae2fd]">Visus</div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-[#ffb95f]">local_fire_department</span>
          <div className="w-8 h-8 rounded-full bg-[#171f33] border border-[#464554]/30 overflow-hidden">
            <div className="w-full h-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-[#c0c1ff]">
              VP
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center relative md:pl-64 h-[calc(100vh-80px)] md:h-screen p-6">
        
        {/* Document Title / Progress */}
        <div className="absolute top-8 left-0 right-0 flex flex-col items-center justify-center opacity-50 z-10 pointer-events-none md:pl-64">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#dae2fd]">
            Visus_Introduction_Guide.pdf
          </h2>
          <div className="w-48 h-1.5 bg-[#171f33] mt-2 rounded-full overflow-hidden border border-[#464554]/20">
            <div 
              className="h-full bg-[#c0c1ff] transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-slate-500 mt-1">{progressPercentage}% Complete</span>
        </div>

        {/* Dual Mode Switcher */}
        <div className="absolute top-24 right-8 bg-[#171f33] p-1 rounded-lg flex items-center border border-[#464554]/20 z-20">
          <button 
            onClick={() => setMode("rsvp")}
            className={`px-4 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all ${
              mode === "rsvp" 
                ? "bg-[#222a3d] text-[#c0c1ff] font-bold shadow-sm" 
                : "text-[#c7c4d7] hover:text-[#c0c1ff]"
            }`}
          >
            RSVP mode
          </button>
          <button 
            onClick={() => setMode("cluster")}
            className={`px-4 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all ${
              mode === "cluster" 
                ? "bg-[#222a3d] text-[#c0c1ff] font-bold shadow-sm" 
                : "text-[#c7c4d7] hover:text-[#c0c1ff]"
            }`}
          >
            Cluster mode
          </button>
        </div>

        {/* Reading Canvas */}
        <div className="w-full max-w-2xl px-6 md:px-0 flex flex-col items-center justify-center flex-1 relative">
          
          {mode === "rsvp" ? (
            /* RSVP Visual Box */
            <div className="w-full py-20 border-y border-[#464554]/30 relative flex items-center justify-center bg-[#0b1326] overflow-hidden">
              {/* ORP Alignment Guides */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#464554]/20 transform -translate-x-[20%]"></div>
              <div className="absolute left-1/2 top-10 bottom-10 w-px bg-[#c0c1ff]/30 transform -translate-x-[20%]"></div>

              {/* The Active RSVP Word */}
              <div className="text-4xl md:text-6xl font-heading text-slate-100 relative z-10 font-bold tracking-tight flex select-none">
                <span className="opacity-40">{leftPart}</span>
                <span className="text-[#ffb95f] relative px-0.5">
                  {focusLetter}
                  {/* ORP Dot indicator */}
                  <div className="absolute -top-4 left-1/2 w-1.5 h-1.5 bg-[#ffb95f] rounded-full -translate-x-1/2 shadow-[0_0_8px_#ffb95f]"></div>
                </span>
                <span className="opacity-40">{rightPart}</span>
              </div>
            </div>
          ) : (
            /* Cluster Visual Box */
            <div className="w-full max-w-xl text-lg md:text-xl text-[#c7c4d7]/50 leading-relaxed text-justify py-8 h-64 overflow-y-auto border border-[#464554]/20 rounded-xl p-6 bg-[#171f33]/40">
              {clusterChunks.map((chunk, index) => {
                const isActive = index === activeClusterIndex;
                return (
                  <span 
                    key={index} 
                    className={`inline-block mr-2 px-1 rounded transition-all ${
                      isActive 
                        ? "bg-[#c0c1ff]/20 text-[#c0c1ff] font-bold border border-[#c0c1ff]/30 scale-105" 
                        : "opacity-40"
                    }`}
                  >
                    {chunk}
                  </span>
                );
              })}
            </div>
          )}

          {/* Core Controls */}
          <div className="w-full max-w-md mt-12 flex flex-col gap-6 bg-[#171f33]/60 backdrop-blur-xl p-6 rounded-xl border border-[#464554]/20 shadow-xl">
            {/* Playback Toggles */}
            <div className="flex items-center justify-center gap-6">
              <button 
                onClick={() => setWordIndex((prev) => Math.max(0, prev - 10))}
                className="w-10 h-10 rounded-full border border-[#464554]/30 flex items-center justify-center text-[#c7c4d7] hover:bg-[#222a3d] transition-colors"
                title="Rewind 10 words"
              >
                <span className="material-symbols-outlined text-lg">replay_10</span>
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 rounded-full bg-[#c0c1ff] text-[#1000a9] flex items-center justify-center shadow-[0_0_20px_rgba(192,193,255,0.2)] hover:scale-105 transition-all"
              >
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {isPlaying ? "pause" : "play_arrow"}
                </span>
              </button>
              <button 
                onClick={() => setWordIndex((prev) => Math.min(words.length - 1, prev + 10))}
                className="w-10 h-10 rounded-full border border-[#464554]/30 flex items-center justify-center text-[#c7c4d7] hover:bg-[#222a3d] transition-colors"
                title="Skip 10 words"
              >
                <span className="material-symbols-outlined text-lg">forward_10</span>
              </button>
            </div>

            {/* WPM Speed Slider */}
            <div className="flex flex-col gap-2 relative">
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
                  onChange={(e) => setWpm(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
