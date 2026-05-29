"use client";

import * as React from "react";
import { Sidebar } from "@/components/Sidebar";
import { calculateORP, generateRSVPSequence } from "@/core/algorithms/rsvp";
import { generateDynamicClusters } from "@/core/algorithms/clusters";
import { RsvpVisualBox } from "@/features/reader-rsvp/components/RsvpVisualBox";
import { ClusterVisualBox } from "@/features/reader-clusters/components/ClusterVisualBox";
import { ReaderPlayer } from "@/features/reader-controls/components/ReaderPlayer";

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

  const rsvpSequence = React.useMemo(() => {
    return generateRSVPSequence(PROTOTYPE_TEXT);
  }, []);

  // Semantic Visual Cluster groupings (dynamic cognitive visual chunks)
  const clusterChunks = React.useMemo(() => {
    return generateDynamicClusters(PROTOTYPE_TEXT, 3);
  }, []);

  // Map individual word index to correct dynamic semantic cluster index
  const activeClusterIndex = React.useMemo(() => {
    let currentWordOffset = 0;
    for (let i = 0; i < clusterChunks.length; i++) {
      const chunkWordsCount = clusterChunks[i].wordCount;
      if (wordIndex >= currentWordOffset && wordIndex < currentWordOffset + chunkWordsCount) {
        return i;
      }
      currentWordOffset += chunkWordsCount;
    }
    return Math.max(0, clusterChunks.length - 1);
  }, [clusterChunks, wordIndex]);

  // Master timer interval for RSVP and Cluster playback modes
  React.useEffect(() => {
    if (!isPlaying) return;

    const baseDelayMs = (60 * 1000) / wpm;
    let finalDelay = baseDelayMs;
    let wordsToAdvance = 1;

    if (mode === "rsvp") {
      const currentWordObj = rsvpSequence[wordIndex];
      const delayMultiplier = currentWordObj ? currentWordObj.delayMultiplier : 1.0;
      finalDelay = baseDelayMs * delayMultiplier;
      wordsToAdvance = 1;
    } else {
      const currentChunk = clusterChunks[activeClusterIndex];
      if (currentChunk) {
        const delayMultiplier = currentChunk.delayMultiplier || 1.0;
        finalDelay = baseDelayMs * currentChunk.wordCount * delayMultiplier;
        wordsToAdvance = currentChunk.wordCount;
      }
    }

    const interval = setTimeout(() => {
      setWordIndex((prev) => {
        const nextIndex = prev + wordsToAdvance;
        if (nextIndex >= rsvpSequence.length) {
          setIsPlaying(false);
          return 0;
        }
        return nextIndex;
      });
    }, finalDelay);

    return () => clearTimeout(interval);
  }, [isPlaying, wordIndex, wpm, rsvpSequence, mode, clusterChunks, activeClusterIndex]);

  // Current RSVP word elements
  const currentWordObj = rsvpSequence[wordIndex] || { text: "Ready", orpIndex: 1, delayMultiplier: 1.0 };
  const currentWordText = currentWordObj.text;
  const orpIndex = currentWordObj.orpIndex;
  const leftPart = currentWordText.slice(0, orpIndex);
  const focusLetter = currentWordText.charAt(orpIndex);
  const rightPart = currentWordText.slice(orpIndex + 1);

  const progressPercentage = Math.round((Math.min(wordIndex + 1, words.length) / words.length) * 100);

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
      <main className="flex-1 flex flex-col items-center justify-between relative md:pl-64 h-[calc(100vh-80px)] md:h-screen p-6 pt-32 pb-8">

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
            className={`px-4 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all ${mode === "rsvp"
                ? "bg-[#222a3d] text-[#c0c1ff] font-bold shadow-sm"
                : "text-[#c7c4d7] hover:text-[#c0c1ff]"
              }`}
          >
            RSVP mode
          </button>
          <button
            onClick={() => setMode("cluster")}
            className={`px-4 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all ${mode === "cluster"
                ? "bg-[#222a3d] text-[#c0c1ff] font-bold shadow-sm"
                : "text-[#c7c4d7] hover:text-[#c0c1ff]"
              }`}
          >
            Cluster mode
          </button>
        </div>

        {/* Reading Canvas */}
        <div className={`w-full ${mode === "cluster" ? "max-w-4xl" : "max-w-2xl"} px-6 md:px-0 flex-1 flex flex-col items-center justify-center relative z-10 transition-all duration-500`}>

          {mode === "rsvp" ? (
            <RsvpVisualBox
              leftPart={leftPart}
              focusLetter={focusLetter}
              rightPart={rightPart}
            />
          ) : (
            <ClusterVisualBox
              clusterChunks={clusterChunks}
              activeClusterIndex={activeClusterIndex}
            />
          )}
        </div>

        {/*Player Bar */}
        <ReaderPlayer
          isPlaying={isPlaying}
          onPlayPauseToggle={() => setIsPlaying(!isPlaying)}
          wpm={wpm}
          onWpmChange={setWpm}
          onRewind={() => setWordIndex((prev) => Math.max(0, prev - 10))}
          onSkip={() => setWordIndex((prev) => Math.min(words.length - 1, prev + 10))}
        />
      </main>
    </div>
  );
}
