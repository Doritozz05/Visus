"use client";

import * as React from "react";
import { Sidebar } from "@/components/Sidebar";
import { calculateORP, generateRSVPSequence } from "@/core/algorithms/rsvp";
import { generateDynamicClusters } from "@/core/algorithms/clusters";
import { RsvpVisualBox } from "@/features/reader-rsvp/components/RsvpVisualBox";
import { ClusterVisualBox } from "@/features/reader-clusters/components/ClusterVisualBox";
import { ReaderPlayer } from "@/features/reader-controls/components/ReaderPlayer";
import { useSettings } from "@/context/settings-context";
import { GeneralSettingsForm } from "@/features/settings/components/GeneralSettingsForm";
import { RsvpSettingsForm } from "@/features/settings/components/RsvpSettingsForm";
import { ClusterSettingsForm } from "@/features/settings/components/ClusterSettingsForm";

interface Chapter {
  title: string;
  content: string;
}

const CHAPTERS: Chapter[] = [
  {
    title: "Chapter 1: The RSVP Revolution",
    content: "Visus elevates your reading speed by locking your focus onto the Optimal Recognition Point of each word. By eliminating traditional eye scanning patterns, RSVP allows your brain to absorb information at an outstanding rate of compression. Combined with visual semantic cluster tracking, you can effortlessly train your peripheral field of vision."
  },
  {
    title: "Chapter 2: Cognitive Visual Chunking",
    content: "Rather than reading word-by-word, semantic clustering groups words into logical cognitive blocks. This matches how the human brain naturally processes language: not as isolated symbols, but as structured ideas. By reading in chunks, you widen your visual span and reduce subvocalization."
  },
  {
    title: "Chapter 3: The Flow State of Visus",
    content: "Entering a flow state is the ultimate goal of speed reading. Visus is designed to minimize visual friction, letting you absorb knowledge effortlessly. Calibrate your target WPM and let your focus settle into the center line, where optimal comprehension meets high speed."
  }
];

function splitTextInHalf(text: string): [string, string] {
  const wordsList = text.split(/\s+/);
  const half = Math.ceil(wordsList.length / 2);
  const firstHalf = wordsList.slice(0, half).join(" ");
  const secondHalf = wordsList.slice(half).join(" ");
  return [firstHalf, secondHalf];
}

export default function ReaderPage() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [wpm, setWpm] = React.useState(600);
  const [wordIndex, setWordIndex] = React.useState(0);
  const [mode, setMode] = React.useState<"rsvp" | "cluster" | "normal">("normal");
  const [activeNormalPage, setActiveNormalPage] = React.useState(0);
  const [completedChapter, setCompletedChapter] = React.useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [drawerTab, setDrawerTab] = React.useState<"general" | "rsvp" | "cluster">("rsvp");
  
  const { settings } = useSettings();

  // Process chapters data with word indices
  const chaptersData = React.useMemo(() => {
    let wordOffset = 0;
    return CHAPTERS.map((ch, idx) => {
      const rsvpSeq = generateRSVPSequence(ch.content);
      const clusterSeq = generateDynamicClusters(ch.content, 3);
      const wordsArr = ch.content.split(/\s+/);
      const startWordIndex = wordOffset;
      const endWordIndex = wordOffset + wordsArr.length;
      wordOffset = endWordIndex;
      
      return {
        ...ch,
        index: idx,
        words: wordsArr,
        rsvpSequence: rsvpSeq,
        clusterChunks: clusterSeq,
        startWordIndex,
        endWordIndex,
      };
    });
  }, []);

  const words = React.useMemo(() => {
    return chaptersData.flatMap(c => c.words);
  }, [chaptersData]);

  const rsvpSequence = React.useMemo(() => {
    return chaptersData.flatMap(c => c.rsvpSequence);
  }, [chaptersData]);

  const clusterChunks = React.useMemo(() => {
    return chaptersData.flatMap(c => c.clusterChunks);
  }, [chaptersData]);

  const currentChapter = React.useMemo(() => {
    const found = chaptersData.find(
      (c) => wordIndex >= c.startWordIndex && wordIndex < c.endWordIndex
    );
    return found || chaptersData[chaptersData.length - 1];
  }, [chaptersData, wordIndex]);

  // Synchronize normal page with word index changes
  React.useEffect(() => {
    const chIndex = chaptersData.findIndex(
      (c) => wordIndex >= c.startWordIndex && wordIndex < c.endWordIndex
    );
    if (chIndex !== -1 && chIndex !== activeNormalPage) {
      setActiveNormalPage(chIndex);
    }
  }, [wordIndex, chaptersData, activeNormalPage]);

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
    } else if (mode === "cluster") {
      const currentChunk = clusterChunks[activeClusterIndex];
      if (currentChunk) {
        const delayMultiplier = currentChunk.delayMultiplier || 1.0;
        finalDelay = baseDelayMs * currentChunk.wordCount * delayMultiplier;
        wordsToAdvance = currentChunk.wordCount;
      }
    } else {
      setIsPlaying(false);
      return;
    }

    const interval = setTimeout(() => {
      setWordIndex((prev) => {
        const nextIndex = prev + wordsToAdvance;

        // Auto-pause checking at chapter boundaries
        const currentCh = chaptersData.find(c => prev >= c.startWordIndex && prev < c.endWordIndex);
        if (currentCh) {
          if (nextIndex >= currentCh.endWordIndex) {
            setIsPlaying(false);
            setCompletedChapter(currentCh.title);
            return Math.min(nextIndex, rsvpSequence.length - 1);
          }
        }

        if (nextIndex >= rsvpSequence.length) {
          setIsPlaying(false);
          return 0;
        }
        return nextIndex;
      });
    }, finalDelay);

    return () => clearTimeout(interval);
  }, [isPlaying, wordIndex, wpm, rsvpSequence, mode, clusterChunks, activeClusterIndex, chaptersData]);
  // Paragraph double click handlers removed

  const handlePageChange = (newPage: number) => {
    if (newPage < 0 || newPage >= chaptersData.length) return;
    setActiveNormalPage(newPage);
    setWordIndex(chaptersData[newPage].startWordIndex);
  };

  // Handle opening settings drawer (pauses reading)
  const openQuickSettings = () => {
    setIsPlaying(false);
    // Align drawer tab automatically to the active reader mode for superior UX
    if (mode === "normal") {
      setDrawerTab("general");
    } else {
      setDrawerTab(mode);
    }
    setIsDrawerOpen(true);
  };

  // Current RSVP word elements
  const currentWordObj = rsvpSequence[wordIndex] || { text: "Ready", orpIndex: 1, delayMultiplier: 1.0 };
  const currentWordText = currentWordObj.text;
  const orpIndex = currentWordObj.orpIndex;
  const leftPart = currentWordText.slice(0, orpIndex);
  const focusLetter = currentWordText.charAt(orpIndex);
  const rightPart = currentWordText.slice(orpIndex + 1);

  // Context words for adjacent text blurring
  const prevWordObj = wordIndex > 0 ? rsvpSequence[wordIndex - 1] : null;
  const nextWordObj = wordIndex < rsvpSequence.length - 1 ? rsvpSequence[wordIndex + 1] : null;
  const prevWord = prevWordObj ? prevWordObj.text : "";
  const nextWord = nextWordObj ? nextWordObj.text : "";

  const progressPercentage = Math.round((Math.min(wordIndex + 1, words.length) / words.length) * 100);

  return (
    <div className="bg-background text-foreground font-sans h-screen overflow-hidden overscroll-none flex flex-col md:flex-row antialiased transition-all duration-300 relative">
      <Sidebar activePath="/reader" />

      {/* Mobile TopNav */}
      <nav className="md:hidden bg-card border-b border-border/50 flex justify-between items-center w-full px-6 py-4 z-40 sticky top-0 transition-all duration-300">
        <div className="text-xl font-bold tracking-tight text-foreground">Visus</div>
        <div className="flex items-center gap-3">
          <button 
            onClick={openQuickSettings}
            className="w-9 h-9 rounded-full bg-accent flex items-center justify-center border border-border/30 hover:text-primary transition-all text-muted-foreground"
          >
            <span className="material-symbols-outlined text-lg">settings</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-accent border border-border/30 overflow-hidden">
            <div className="w-full h-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              VP
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-between relative md:pl-64 h-[calc(100vh-80px)] md:h-screen p-6 pt-32 pb-8 overflow-hidden overscroll-none">

        {/* Document Title / Progress & Settings Button */}
        <div className="absolute top-8 left-0 right-0 flex items-center justify-between px-8 z-10 md:pl-72 border-b border-border/10 pb-4">
          <div className="flex-1 flex flex-col items-center justify-center pointer-events-none">
            <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground dark:text-foreground/75 font-bold">
              Visus_Introduction_Guide.pdf
            </h2>
            <span className="text-xs text-primary/80 font-semibold bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded mt-1.5">
              {currentChapter.title}
            </span>
            <div className="w-48 h-1.5 bg-muted dark:bg-card/90 mt-2.5 rounded-full overflow-hidden border border-border/40 dark:border-border/20 shadow-inner">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-muted-foreground/90 dark:text-muted-foreground font-semibold mt-1">
              {progressPercentage}% Complete
            </span>
          </div>
          
          {/* Quick Settings Trigger (Desktop) */}
          <button
            onClick={openQuickSettings}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/40 bg-card hover:bg-accent text-xs font-mono text-muted-foreground hover:text-primary transition-all shrink-0 shadow-sm"
          >
            <span className="material-symbols-outlined text-base animate-spin-slow">settings</span>
            Settings
          </button>
        </div>

        {/* Triple Mode Switcher */}
        <div className="absolute top-24 right-8 bg-card border border-border/30 p-1 rounded-lg flex items-center z-20 shadow-md">
          <button
            onClick={() => {
              setIsPlaying(false);
              setMode("normal");
            }}
            className={`px-4 py-1.5 rounded text-[10px] font-mono uppercase tracking-wider transition-all ${
              mode === "normal"
                ? "bg-accent text-primary font-bold shadow-sm"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            Pages
          </button>
          <button
            onClick={() => {
              setMode("rsvp");
              setCompletedChapter(null);
            }}
            className={`px-4 py-1.5 rounded text-[10px] font-mono uppercase tracking-wider transition-all ${
              mode === "rsvp"
                ? "bg-accent text-primary font-bold shadow-sm"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            RSVP (Word)
          </button>
          <button
            onClick={() => {
              setMode("cluster");
              setCompletedChapter(null);
            }}
            className={`px-4 py-1.5 rounded text-[10px] font-mono uppercase tracking-wider transition-all ${
              mode === "cluster"
                ? "bg-accent text-primary font-bold shadow-sm"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            Cluster (Blocks)
          </button>
        </div>

        {/* Reading Canvas Container */}
        <div className={`w-full ${
          mode === "cluster" 
            ? "max-w-4xl" 
            : mode === "normal" 
              ? "max-w-5xl" 
              : "max-w-2xl"
        } px-6 md:px-0 flex-1 flex flex-col items-center justify-center relative z-10 transition-all duration-500`}>

          {/* Auto-pause Chapter completed overlay */}
          {completedChapter && (
            <div className="absolute inset-0 bg-background/85 dark:bg-background/90 backdrop-blur-md flex flex-col items-center justify-center p-6 z-30 rounded-2xl border border-border/20 transition-all duration-300">
              <div className="max-w-md w-full bg-card border border-border/30 rounded-2xl p-8 text-center shadow-2xl glass-panel relative overflow-hidden flex flex-col items-center justify-center gap-6">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary animate-bounce relative z-10">
                  <span className="material-symbols-outlined text-3xl">auto_stories</span>
                </div>
                
                <div className="relative z-10">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-primary mb-2 block font-bold">Section Completed</span>
                  <h2 className="text-xl font-bold font-heading text-foreground mb-3">{completedChapter}</h2>
                  <p className="text-xs text-muted-foreground font-sans max-w-xs leading-relaxed mx-auto">
                    Excellent comprehension pace! Your mind has successfully processed this chapter. Take a second to breathe and consolidate the information.
                  </p>
                </div>

                <div className="flex gap-3 w-full mt-2 relative z-10">
                  <button
                    onClick={() => {
                      setCompletedChapter(null);
                      setMode("normal");
                    }}
                    className="flex-1 px-4 py-2.5 border border-border/30 rounded text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
                  >
                    Back to Pages
                  </button>
                  <button
                    onClick={() => {
                      setCompletedChapter(null);
                      setIsPlaying(true);
                    }}
                    className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded text-xs font-mono uppercase tracking-wider font-bold shadow-[0_0_15px_rgba(var(--primary),0.15)] hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Next Chapter</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {mode === "normal" ? (
            <div className="w-full bg-card/65 dark:bg-card/45 border border-border/20 rounded-2xl p-6 md:p-10 shadow-2xl glass-panel relative overflow-hidden transition-all duration-500 flex flex-col min-h-[460px]">
              {/* Book spine simulation in the middle (Desktop only) */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border/20 to-transparent z-10"></div>
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-8 bg-gradient-to-r from-black/5 via-transparent to-black/5 dark:from-black/15 dark:via-transparent dark:to-black/15 -ml-4 pointer-events-none z-10"></div>

              {/* Page Header */}
              <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-muted-foreground uppercase pb-4 border-b border-border/10 mb-6">
                <span>Visus Reader &bull; Pro</span>
                <span className="text-primary font-bold">{chaptersData[activeNormalPage]?.title}</span>
              </div>

              {/* Two-Column Page Content */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 leading-relaxed text-foreground select-none relative font-sans">
                {/* Left Page Column */}
                <div className="flex flex-col justify-start p-4 transition-all duration-300">
                  <p className="text-base text-foreground whitespace-pre-wrap leading-relaxed">
                    {splitTextInHalf(chaptersData[activeNormalPage]?.content || "")[0]}
                  </p>
                </div>

                {/* Right Page Column */}
                <div className="flex flex-col justify-start p-4 transition-all duration-300">
                  <p className="text-base text-foreground whitespace-pre-wrap leading-relaxed">
                    {splitTextInHalf(chaptersData[activeNormalPage]?.content || "")[1]}
                  </p>
                </div>
              </div>

              {/* Page Footer Navigation */}
              <div className="flex justify-between items-center pt-6 border-t border-border/10 mt-6 text-xs font-mono text-muted-foreground relative">
                <button
                  onClick={() => handlePageChange(activeNormalPage - 1)}
                  disabled={activeNormalPage === 0}
                  className="flex items-center gap-1.5 hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none z-20"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back_ios</span>
                  Previous Chapter
                </button>
                
                {/* Left Page Number */}
                <div className="absolute left-[25%] -translate-x-1/2 hidden md:block text-[10px] tracking-wider uppercase font-semibold text-muted-foreground/60">
                  Page {2 * activeNormalPage + 1}
                </div>

                {/* Right Page Number */}
                <div className="absolute left-[75%] -translate-x-1/2 hidden md:block text-[10px] tracking-wider uppercase font-semibold text-muted-foreground/60">
                  Page {2 * activeNormalPage + 2}
                </div>

                {/* Fallback for mobile */}
                <div className="md:hidden text-[10px] tracking-wider uppercase font-semibold text-muted-foreground/60">
                  Page {activeNormalPage + 1} of {chaptersData.length}
                </div>

                <button
                  onClick={() => handlePageChange(activeNormalPage + 1)}
                  disabled={activeNormalPage === chaptersData.length - 1}
                  className="flex items-center gap-1.5 hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none z-20"
                >
                  Next Chapter
                  <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
                </button>
              </div>
            </div>
          ) : mode === "rsvp" ? (
            <RsvpVisualBox
              leftPart={leftPart}
              focusLetter={focusLetter}
              rightPart={rightPart}
              settings={settings.rsvp}
            />
          ) : (
            <ClusterVisualBox
              clusterChunks={clusterChunks}
              activeClusterIndex={activeClusterIndex}
              settings={settings.cluster}
            />
          )}
        </div>

        {/* Player Bar */}
        <ReaderPlayer
          isPlaying={isPlaying}
          onPlayPauseToggle={() => {
            if (mode === "normal") {
              setMode("rsvp");
              setIsPlaying(false);
              const startWord = chaptersData[activeNormalPage]?.startWordIndex || 0;
              setWordIndex(startWord);
            } else {
              setIsPlaying(!isPlaying);
            }
          }}
          wpm={wpm}
          onWpmChange={setWpm}
          onRewind={() => setWordIndex((prev) => Math.max(0, prev - 10))}
          onSkip={() => setWordIndex((prev) => Math.min(words.length - 1, prev + 10))}
          mode={mode}
          onPrevPage={() => handlePageChange(activeNormalPage - 1)}
          onNextPage={() => handlePageChange(activeNormalPage + 1)}
          hasPrevPage={activeNormalPage > 0}
          hasNextPage={activeNormalPage < chaptersData.length - 1}
        />
      </main>

      {/* QUICK SETTINGS DRAWER OVERLAY */}
      {isDrawerOpen && (
        <>
          {/* Backdrop Click Dismiss */}
          <div 
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[90] transition-opacity duration-300"
          />

          {/* Slide-over Drawer Panel */}
          <div className="fixed right-0 top-0 bottom-0 z-[100] w-full sm:w-[400px] bg-card border-l border-border/40 shadow-2xl glass-panel p-6 flex flex-col transition-all duration-300 animate-slide-in">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border/30 mb-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">settings_applications</span>
                <h3 className="font-heading font-bold text-base">Quick Calibration</h3>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground border border-border/20 transition-all"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Micro Tabs inside drawer */}
            <div className="flex gap-1 border-b border-border/10 pb-3 mb-6 overflow-x-auto scrollbar-none">
              {[
                { id: "general", label: "General", icon: "settings" },
                { id: "rsvp", label: "RSVP", icon: "bolt" },
                { id: "cluster", label: "Cluster", icon: "splitscreen" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setDrawerTab(t.id as any)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border font-mono text-[10px] uppercase tracking-wider transition-all shrink-0 ${
                    drawerTab === t.id
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                      : "border-border/30 bg-card hover:bg-accent/65 text-muted-foreground hover:text-foreground shadow-sm"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Scrollable Form Container with Premium Fading Edge Mask */}
            <div 
              className="flex-1 overflow-y-auto scrollbar-none py-2 -my-2"
              style={{
                maskImage: "linear-gradient(to bottom, transparent 0%, black 16px, black calc(100% - 24px), transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 16px, black calc(100% - 24px), transparent 100%)",
              }}
            >
              <div className="pt-2 pb-12">
                {drawerTab === "general" && <GeneralSettingsForm />}
                {drawerTab === "rsvp" && <RsvpSettingsForm />}
                {drawerTab === "cluster" && <ClusterSettingsForm />}
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
