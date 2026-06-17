"use client";

import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "I've doubled my reading speed in just a week. The RSVP engine is smooth and the typography choices are perfect for developers.",
    author: "Alex C.",
    role: "Software Engineer",
  },
  {
    quote: "Finally, a reader that doesn't track me. The offline PWA is incredibly fast, and I love that my data stays on my device.",
    author: "Sarah M.",
    role: "Privacy Advocate",
  },
  {
    quote: "The visual telemetry is addicting. Seeing my WPM go up every day has completely gamified my reading habit.",
    author: "David L.",
    role: "Student",
  },
  {
    quote: "The OpenDyslexic font integration combined with custom line spacing has made reading enjoyable for me again.",
    author: "Emma R.",
    role: "Designer",
  },
  {
    quote: "Visus handles technical EPUBs without breaking a sweat. It's an essential part of my learning stack now.",
    author: "James H.",
    role: "Tech Lead",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 overflow-hidden border-t border-border/10 bg-gradient-to-b from-transparent to-background/50 relative">
      {/* Edge fading masks */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div className="text-center mb-16 relative z-10">
        <h2 className="text-3xl md:text-4xl font-extrabold font-heading mb-4 tracking-tight">Loved by readers everywhere.</h2>
      </div>

      <div className="flex w-full overflow-hidden py-10 -my-10">
        <motion.div
          className="flex gap-6 pr-6 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Main set of testimonials */}
          {testimonials.map((t, i) => (
            <div
              key={`main-${i}`}
              className="w-[350px] md:w-[400px] shrink-0 bg-card border border-border/40 rounded-2xl p-8 flex flex-col justify-between hover:border-primary/30 transition-colors shadow-sm"
            >
              <p className="text-muted-foreground mb-6 leading-relaxed">&quot;{t.quote}&quot;</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-foreground">{t.author}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">{t.role}</div>
                </div>
              </div>
            </div>
          ))}

          {/* Duplicate set for infinite loop - marked aria-hidden for SEO/A11y */}
          {testimonials.map((t, i) => (
            <div
              key={`dup-${i}`}
              aria-hidden="true"
              className="w-[350px] md:w-[400px] shrink-0 bg-card border border-border/40 rounded-2xl p-8 flex flex-col justify-between hover:border-primary/30 transition-colors shadow-sm"
            >
              <p className="text-muted-foreground mb-6 leading-relaxed">&quot;{t.quote}&quot;</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-foreground">{t.author}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
