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
          Read on your terms, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/60">at your speed.</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Visus is designed to make reading effortless. Whether you're catching up on technical docs or diving into a novel, we've built the tools to help you stay focused.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card 1: Themes & Typography */}
        <SpotlightCard className="md:col-span-2 p-8 md:p-12 flex flex-col md:flex-row gap-10 items-center" spotlightColor="hsl(var(--primary) / 0.15)">
          <div className="flex-1">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
              <Settings className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-3xl font-extrabold font-heading mb-4 tracking-tight">Built for your focus.</h3>
            <p className="text-muted-foreground text-lg mb-6">
              Reading shouldn't be a chore. Switch between fonts and themes designed to reduce eye strain and keep you immersed in the text for hours.
            </p>
          </div>

          <div className="w-full md:w-72 grid grid-cols-2 gap-4 shrink-0">
            {/* Square 1: Light Paper + Inter */}
            <div className="bg-[#f7f8fa] rounded-2xl border border-[#d8dce6] p-6 text-center shadow-lg transition-transform hover:scale-105">
              <span className="font-sans text-3xl font-bold text-[#0f131a] block">Aa</span>
              <span className="text-[10px] text-[#0f131a]/60 mt-3 block">Inter</span>
            </div>
            {/* Square 2: Sepia Warm + Lora */}
            <div className="bg-[#f3ebd8] rounded-2xl border border-[#dcd2bc] p-6 text-center shadow-lg transition-transform hover:scale-105">
              <span className="font-serif text-3xl font-bold text-[#5a4535] block">Aa</span>
              <span className="text-[10px] text-[#5a4535]/60 mt-3 block">Lora</span>
            </div>
            {/* Square 3: Dark Violet + Outfit */}
            <div className="bg-[#0b1326] rounded-2xl border border-[#464554] p-6 text-center shadow-lg transition-transform hover:scale-105">
              <span className="font-heading text-3xl font-bold text-[#dae2fd] block">Aa</span>
              <span className="text-[10px] text-[#dae2fd]/60 mt-3 block">Outfit</span>
            </div>
            {/* Square 4: Nord Arctic + Mono */}
            <div className="bg-[#2e3440] rounded-2xl border border-[#4c566a] p-6 text-center shadow-lg transition-transform hover:scale-105">
              <span className="font-mono text-3xl font-bold text-[#eceff4] block">Aa</span>
              <span className="text-[10px] text-[#eceff4]/60 mt-3 block">Mono</span>
            </div>
          </div>
        </SpotlightCard>

        {/* Card 2: Offline PWA */}
        <SpotlightCard className="p-8 flex flex-col justify-between" spotlightColor="hsl(var(--primary) / 0.15)">
          <div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold font-heading mb-3 tracking-tight">Your data, your device.</h3>
            <p className="text-muted-foreground">
              Visus runs completely in your browser. Install it as a PWA to read offline. Nothing is sent to our servers unless you opt-in to cloud sync.
            </p>
          </div>
          <div className="mt-8 pt-6 border-t border-border/50 flex items-center gap-3 text-sm font-bold text-primary">
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
              <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-700 text-xs font-bold">Fast</span>
              <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-700 text-xs font-bold">Accurate</span>
              <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-700 text-xs font-bold">Semantic</span>
            </div>
          </div>
        </SpotlightCard>

      </div>
    </section>
  );
}
