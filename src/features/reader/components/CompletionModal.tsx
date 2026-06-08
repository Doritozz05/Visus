"use client";

import * as React from "react";
import { Trophy } from "lucide-react";

interface SessionStats {
  speedWpm: number;
  durationSeconds: number;
  accuracy: number;
  wordsCount: number;
}

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
  stats: SessionStats | null;
  onNavigateToLibrary: () => void;
  onNavigateToDashboard: () => void;
}

export function CompletionModal({
  isOpen,
  onClose,
  bookTitle,
  stats,
  onNavigateToLibrary,
  onNavigateToDashboard,
}: CompletionModalProps) {
  if (!isOpen || !stats) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
      />
      <div className="w-full max-w-lg bg-card border border-border/30 rounded-2xl p-8 shadow-2xl relative z-10 glass-panel overflow-hidden animate-scale-up text-center flex flex-col items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent opacity-50"></div>
        
        {/* Glowing Trophy Badge */}
        <div className="relative mb-6">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 blur opacity-70 animate-pulse"></div>
          <div className="relative w-20 h-20 rounded-full bg-background border border-primary/30 flex items-center justify-center text-primary">
            <Trophy className="h-9 w-9 animate-bounce text-primary" />
          </div>
        </div>

        <div className="relative z-10 mb-6">
          <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold mb-1.5 block">Congratulations!</span>
          <h2 className="text-2xl font-extrabold font-heading text-foreground tracking-tight leading-tight">{bookTitle}</h2>
          <p className="text-xs text-muted-foreground font-sans mt-2 max-w-sm mx-auto">
            You have successfully completed this book! Your visual scanning performance and foveal recognition metrics have been saved.
          </p>
        </div>

        {/* Performance Stats Bento Box */}
        <div className="grid grid-cols-2 gap-4 w-full relative z-10 mb-8">
          {/* Stat 1: WPM */}
          <div className="bg-background/60 border border-border/20 p-4 rounded-xl text-left">
            <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Reading speed</span>
            <p className="text-xl font-extrabold font-heading text-primary mt-1">
              {stats.speedWpm} <span className="text-[10px] font-mono text-muted-foreground font-normal">WPM</span>
            </p>
          </div>
          
          {/* Stat 2: Accuracy */}
          <div className="bg-background/60 border border-border/20 p-4 rounded-xl text-left">
            <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Comprehension</span>
            <p className="text-xl font-extrabold font-heading text-emerald-500 dark:text-emerald-400 mt-1">
              {stats.accuracy}%
            </p>
          </div>

          {/* Stat 3: Duration */}
          <div className="bg-background/60 border border-border/20 p-4 rounded-xl text-left">
            <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Time elapsed</span>
            <p className="text-xl font-extrabold font-heading text-foreground mt-1">
              {stats.durationSeconds >= 60 
                ? `${Math.floor(stats.durationSeconds / 60)}m ${stats.durationSeconds % 60}s` 
                : `${stats.durationSeconds}s`
              }
            </p>
          </div>

          {/* Stat 4: Words read */}
          <div className="bg-background/60 border border-border/20 p-4 rounded-xl text-left">
            <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Volume length</span>
            <p className="text-xl font-extrabold font-heading text-foreground mt-1">
              {stats.wordsCount.toLocaleString()} <span className="text-[10px] font-mono text-muted-foreground font-normal">words</span>
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 w-full relative z-10">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-border/30 rounded-lg text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
          >
            Close
          </button>
          <button
            onClick={onNavigateToLibrary}
            className="flex-1 py-3 bg-accent text-primary border border-primary/20 rounded-lg text-xs font-mono uppercase tracking-wider font-bold hover:brightness-95 transition-all"
          >
            My library
          </button>
          <button
            onClick={onNavigateToDashboard}
            className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg text-xs font-mono uppercase tracking-wider font-bold shadow-[0_0_15px_rgba(var(--primary),0.15)] hover:brightness-110 transition-all"
          >
            View analytics
          </button>
        </div>
      </div>
    </div>
  );
}
