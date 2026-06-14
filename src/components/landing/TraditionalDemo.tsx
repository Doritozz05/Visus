"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EyeOff } from "lucide-react";

const DEMO_WORDS = [
  "Traditional", "reading", "requires", "your", "eyes", "to", "constantly",
  "jump", "across", "the", "page,", "moving", "from", "left", "to", "right,",
  "then", "sweeping", "back", "to", "the", "next", "line.", "This", "movement",
  "wastes", "time,", "causes", "fatigue,", "and", "frequently", "leads", "to",
  "regression,", "where", "your", "brain", "re-reads", "words", "unconsciously."
];

export function TraditionalDemo() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % DEMO_WORDS.length);
    }, 450); // Simulates standard reading speed (around 200-250 WPM) with gaze duration

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto bg-card border border-border/50 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden group select-none">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 pointer-events-none" />

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-8 h-8 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive">
          <EyeOff className="w-4.5 h-4.5" />
        </div>
        <div>
          <h3 className="text-sm font-bold font-heading text-foreground">How you currently read</h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Saccadic eye jumps & regressions</p>
        </div>
      </div>

      <div className="relative p-8 md:p-10 bg-background/50 border border-border/20 rounded-2xl min-h-[300px] flex items-center justify-center font-sans leading-loose text-base">
        <div className="flex flex-wrap gap-x-2 gap-y-3.5 justify-center">
          {DEMO_WORDS.map((word, i) => {
            const isActive = i === index;
            return (
              <span
                key={i}
                className={`relative px-1.5 border rounded transition-colors duration-100 font-medium ${isActive
                  ? "text-destructive bg-destructive/10 border-destructive/20"
                  : "text-muted-foreground/60 border-transparent"
                  }`}
              >
                {word}
                {isActive && (
                  <motion.span
                    layoutId="gaze-dot"
                    className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-destructive rounded-full border border-background shadow-md shadow-destructive/50"
                    transition={{ type: "spring", stiffness: 150, damping: 18 }}
                  />
                )}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
