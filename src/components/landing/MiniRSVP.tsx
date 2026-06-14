"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";

const WORD_LIST = [
  "Read", "faster,", "focus", "better.", 
  "The", "optimal", "recognition", "point", 
  "never", "moves", "from", "the", "center.",
  "Eliminate", "subvocalization", "today."
];

// Professional RSVP ORP Calculation
function getOrpIndex(word: string) {
  const len = word.length;
  if (len === 1) return 0;
  if (len <= 5) return 1;
  if (len <= 9) return 2;
  if (len <= 13) return 3;
  return 4;
}

export function MiniRSVP() {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % WORD_LIST.length);
    }, 200); // 300 WPM

    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentWord = WORD_LIST[index];
  const orpIndex = getOrpIndex(currentWord);
  
  const prefix = currentWord.substring(0, orpIndex);
  const orp = currentWord.charAt(orpIndex);
  const suffix = currentWord.substring(orpIndex + 1);

  return (
    <div className="w-full max-w-2xl mx-auto bg-card border border-border/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl group">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20" />
      
      {/* Decorative top bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
      
      {/* RSVP Display Area */}
      <div className="h-28 flex items-center justify-center relative w-full font-serif text-4xl md:text-5xl tracking-wide">
        
        {/* 
          Flexbox magic for optimal ORP positioning. 
          Using 40/60 split (flex-[4] and flex-[6]) shifts the ORP to the left,
          which balances the visual weight of longer suffixes.
        */}
        <div className="flex w-full items-center">
          <div className="flex-[4] text-right text-muted-foreground whitespace-pre">
            {prefix}
          </div>
          
          <div className="text-primary font-bold z-10 relative">
            {orp}
          </div>
          
          <div className="flex-[6] text-left text-muted-foreground whitespace-pre">
            {suffix}
          </div>
        </div>

      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-border/40 h-1 rounded-full overflow-hidden mt-2 relative">
        <motion.div 
          className="bg-primary h-full rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${((index + 1) / WORD_LIST.length) * 100}%` }}
          transition={{ ease: "linear", duration: 0.25 }}
        />
      </div>
      
      {/* Controls */}
      <div className="flex justify-between items-center mt-6 relative z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary/20 hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_-3px_rgba(var(--primary),0.3)]"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            {isPlaying ? "Playing" : "Paused"}
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-primary/70 font-bold bg-primary/10 px-2 py-1 rounded-md border border-primary/20">240 WPM</span>
      </div>
    </div>
  );
}
