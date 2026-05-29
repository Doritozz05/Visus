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

const PROTOTYPE_TEXT =
  "Visus elevates your reading speed by locking your focus onto the Optimal Recognition Point of each word. By eliminating traditional eye scanning patterns, RSVP allows your brain to absorb information at an outstanding rate of compression. Combined with visual semantic cluster tracking, you can effortlessly train your peripheral field of vision.";

export default function ReaderPage() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [wpm, setWpm] = React.useState(600);
  const [wordIndex, setWordIndex] = React.useState(0);
  const [mode, setMode] = React.useState<"rsvp" | "cluster">("rsvp");
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [drawerTab, setDrawerTab] = React.useState<"general" | "rsvp" | "cluster">("rsvp");
  
  const { settings } = useSettings();

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

  // Handle opening settings drawer (pauses reading)
  const openQuickSettings = () => {
    setIsPlaying(false);
    // Align drawer tab automatically to the active reader mode for superior UX
    setDrawerTab(mode);
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
        <div className="absolute top-8 left-0 right-0 flex items-center justify-between px-8 z-10 md:pl-72">
          <div className="flex-1 flex flex-col items-center justify-center pointer-events-none">
            <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground dark:text-foreground/75 font-semibold">
              Visus_Introduction_Guide.pdf
            </h2>
            <div className="w-48 h-1.5 bg-muted dark:bg-card/90 mt-2 rounded-full overflow-hidden border border-border/40 dark:border-border/20 shadow-inner">
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

        {/* Dual Mode Switcher */}
        <div className="absolute top-24 right-8 bg-card border border-border/30 p-1 rounded-lg flex items-center z-20 shadow-md">
          <button
            onClick={() => setMode("rsvp")}
            className={`px-4 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all ${mode === "rsvp"
                ? "bg-accent text-primary font-bold shadow-sm"
                : "text-muted-foreground hover:text-primary"
              }`}
          >
            RSVP mode
          </button>
          <button
            onClick={() => setMode("cluster")}
            className={`px-4 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all ${mode === "cluster"
                ? "bg-accent text-primary font-bold shadow-sm"
                : "text-muted-foreground hover:text-primary"
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
          onPlayPauseToggle={() => setIsPlaying(!isPlaying)}
          wpm={wpm}
          onWpmChange={setWpm}
          onRewind={() => setWordIndex((prev) => Math.max(0, prev - 10))}
          onSkip={() => setWordIndex((prev) => Math.min(words.length - 1, prev + 10))}
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
