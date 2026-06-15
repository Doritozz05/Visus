"use client";

import React from "react";
import { motion } from "framer-motion";
import { SpotlightCard } from "./SpotlightCard";
import { Shield, Smartphone, BookOpen, Settings, BarChart, LayoutGrid } from "lucide-react";

export function BentoFeatures() {
  return (
    <section className="relative z-10 px-6 py-32 max-w-7xl mx-auto border-t border-border/10">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-extrabold font-heading mb-6 tracking-tight">
          Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">master reading.</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Visus is built like a modern developer tool: blazingly fast, entirely offline-capable, and obsessively focused on typography and performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card 1: Themes & Typography */}
        <SpotlightCard className="md:col-span-2 p-8 md:p-12 flex flex-col md:flex-row gap-10 items-center" spotlightColor="hsl(var(--primary) / 0.15)">
          <div className="flex-1">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
              <Settings className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-3xl font-extrabold font-heading mb-4 tracking-tight">Tailored to your eyes.</h3>
            <p className="text-muted-foreground text-lg mb-6">
              Choose from highly legible typography including Inter, Lora, and OpenDyslexic. Switch instantly between dark, light, sepia, and mono themes.
            </p>
          </div>

          <div className="w-full md:w-72 grid grid-cols-2 gap-4 shrink-0">
            <div className="bg-background rounded-2xl border border-border/50 p-6 text-center shadow-lg transition-transform hover:scale-105">
              <span className="font-sans text-3xl font-bold text-foreground block">Aa</span>
              <span className="text-[10px] text-muted-foreground mt-3 block">Inter</span>
            </div>
            <div className="bg-[#f4ecd8] rounded-2xl border border-[#e5d8b8] p-6 text-center shadow-lg transition-transform hover:scale-105">
              <span className="font-serif text-3xl font-bold text-[#5c4b37] block">Aa</span>
              <span className="text-[10px] text-[#8a7b66] mt-3 block">Sepia</span>
            </div>
            <div className="bg-[#1e1e2e] rounded-2xl border border-[#313244] p-6 text-center shadow-lg transition-transform hover:scale-105">
              <span className="font-mono text-3xl font-bold text-[#cdd6f4] block">Aa</span>
              <span className="text-[10px] text-[#a6adc8] mt-3 block">Mono</span>
            </div>
            <div className="bg-background rounded-2xl border border-border/50 p-6 text-center flex flex-col items-center justify-center shadow-lg transition-transform hover:scale-105">
              <span className="font-serif text-3xl font-bold text-foreground block italic">Aa</span>
              <span className="text-[10px] text-muted-foreground mt-3 block">Lora</span>
            </div>
          </div>
        </SpotlightCard>

        {/* Card 2: Offline PWA */}
        <SpotlightCard className="p-8 flex flex-col justify-between" spotlightColor="rgba(16, 185, 129, 0.15)">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold font-heading mb-3 tracking-tight">Your data, your device.</h3>
            <p className="text-muted-foreground">
              Visus runs completely in your browser. Install it as a PWA to read offline. Nothing is sent to our servers unless you opt-in to cloud sync.
            </p>
          </div>
          <div className="mt-8 pt-6 border-t border-border/50 flex items-center gap-3 text-sm font-bold text-emerald-500">
            <Smartphone className="w-5 h-5" />
            Offline ready
          </div>
        </SpotlightCard>

        {/* Card 3: Analytics */}
        <SpotlightCard className="p-8 flex flex-col justify-between" spotlightColor="rgba(59, 130, 246, 0.15)">
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
              <BarChart className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold font-heading mb-3 tracking-tight">Track velocity</h3>
            <p className="text-muted-foreground mb-8">
              Beautiful telemetry visualizes your WPM, streaks, and progress over time.
            </p>
          </div>

          {/* Mini Animated Chart */}
          <div className="h-24 w-full flex items-end gap-2 px-2">
            {[40, 70, 45, 90, 65, 80, 100].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                whileInView={{ height: `${height}%` }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                className="flex-1 bg-blue-500/80 rounded-t-md"
              />
            ))}
          </div>
        </SpotlightCard>

        {/* Card 4: Library & Parsing */}
        <SpotlightCard className="md:col-span-2 p-8 md:p-12 flex flex-col justify-between overflow-hidden relative" spotlightColor="rgba(139, 92, 246, 0.15)">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <BookOpen className="w-64 h-64" />
          </div>
          <div className="relative z-10 max-w-xl">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6">
              <LayoutGrid className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-3xl font-extrabold font-heading mb-4 tracking-tight">Intelligent library parsing.</h3>
            <p className="text-muted-foreground text-lg mb-8">
              Our local parser handles massive EPUB files instantly. It extracts semantic chapters, generates crisp covers, and sanitizes HTML for a flawless, distraction-free reading experience.
            </p>
            <div className="flex gap-4">
              <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-xs font-bold">Fast</span>
              <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-xs font-bold">Accurate</span>
              <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-xs font-bold">Semantic</span>
            </div>
          </div>
        </SpotlightCard>

      </div>
    </section>
  );
}
