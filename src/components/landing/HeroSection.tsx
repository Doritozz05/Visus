"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { MiniRSVP } from "./MiniRSVP";

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  return (
    <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-32 pb-24 md:pt-40 md:pb-32 w-full max-w-5xl mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center w-full"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-widest mb-8 backdrop-blur-sm">
          <Zap className="w-4 h-4" />
          <span>The next generation of reading</span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight font-heading leading-[1.05] mb-6">
          Read Faster. <br className="hidden sm:block" />
          Retain More. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-primary bg-[length:200%_auto] animate-gradient">
            Entirely Private.
          </span>
        </motion.h1>

        <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Visus uses advanced RSVP and semantic clustering to train your peripheral vision and double your reading speed, all without leaving your browser.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 mb-20 w-full justify-center">
          <Link
            href="/library"
            className="flex items-center justify-center gap-2 bg-foreground text-background font-bold text-lg px-8 py-4 rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_-10px_rgba(var(--primary),0.5)] group w-full sm:w-auto"
          >
            Start Reading Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 bg-transparent text-foreground font-semibold text-lg px-8 py-4 rounded-full hover:bg-accent transition-colors border border-border w-full sm:w-auto"
          >
            View Dashboard
          </Link>
        </motion.div>

        {/* Floating Mini RSVP Demo */}
        <motion.div 
          variants={itemVariants}
          className="w-full max-w-2xl relative"
        >
          {/* Decorative glow behind the RSVP player */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
          
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            <MiniRSVP />
          </motion.div>
        </motion.div>

      </motion.div>
    </section>
  );
}
