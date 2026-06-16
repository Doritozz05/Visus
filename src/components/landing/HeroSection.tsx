import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroClient } from "./HeroClient";

export function HeroSection() {
  const cta = (
    <>
      <Link
        href="/library"
        className="flex items-center justify-center gap-2 bg-foreground text-background font-bold text-lg px-8 py-4 rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_-10px_rgba(var(--primary),0.5)] group w-full sm:w-auto"
      >
        Start reading now
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Link>
      <Link
        href="/dashboard"
        className="flex items-center justify-center gap-2 bg-transparent text-foreground font-semibold text-lg px-8 py-4 rounded-full hover:bg-accent transition-colors border border-border w-full sm:w-auto"
      >
        View dashboard
      </Link>
    </>
  );

  return (
    <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-32 pb-24 md:pt-40 md:pb-32 w-full max-w-5xl mx-auto">
      <HeroClient cta={cta}>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight font-heading leading-[1.05] mb-6">
          <span className="block">Read faster.</span>
          <span className="block">Retain more.</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/70 to-primary bg-[length:200%_auto] animate-gradient block">
            Advanced Speed Reading Platform
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Visus uses advanced RSVP and semantic clustering to boost your reading focus and double your speed, all while maintaining 100% privacy in your browser.
        </p>
      </HeroClient>
    </section>
  );
}
