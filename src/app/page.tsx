/**
 * @file page.tsx
 * @description Visus main home page validating visual scaffolding and introducing prototype screens.
 */

import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-background text-foreground selection:bg-primary/30 transition-all duration-300">
      <div className="max-w-2xl w-full text-center space-y-8 glass-panel p-8 md:p-12 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Decorative backdrop elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />

        <div className="space-y-3 relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            v0.1.0 Scaffolding successful
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight font-heading">
            <span className="text-gradient-primary">Visus</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Open-source speed reading platform and PWA using high-performance RSVP and visual reading clusters.
          </p>
        </div>

        {/* Prototype Navigation Panels */}
        <div className="relative pt-6 border-t border-border/40 space-y-4">
          <h3 className="text-sm font-semibold tracking-wider uppercase text-primary text-left font-heading">
            Interactive prototype screens (Visus Reader Pro)
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Link 
              href="/dashboard"
              className="flex flex-col p-4 rounded-xl border border-border/30 bg-card hover:bg-accent hover:border-primary/50 transition-all duration-300 text-left group"
            >
              <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors font-heading">Performance dashboard</span>
              <span className="text-xs text-muted-foreground mt-1">Check visual analytics & progress charts</span>
            </Link>
            <Link 
              href="/reader"
              className="flex flex-col p-4 rounded-xl border border-border/30 bg-card hover:bg-accent hover:border-primary/50 transition-all duration-300 text-left group"
            >
              <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors font-heading">Reading room</span>
              <span className="text-xs text-muted-foreground mt-1">Calibrate speeds & read with active ORP</span>
            </Link>
            <Link 
              href="/library"
              className="flex flex-col p-4 rounded-xl border border-border/30 bg-card hover:bg-accent hover:border-primary/50 transition-all duration-300 text-left group"
            >
              <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors font-heading">Library management</span>
              <span className="text-xs text-muted-foreground mt-1">Manage documents, ePUBs & raw texts</span>
            </Link>
            <Link 
              href="/settings"
              className="flex flex-col p-4 rounded-xl border border-border/30 bg-card hover:bg-accent hover:border-primary/50 transition-all duration-300 text-left group"
            >
              <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors font-heading">Workspace settings</span>
              <span className="text-xs text-muted-foreground mt-1">Customize themes, fonts & indicators</span>
            </Link>
          </div>
        </div>

        {/* Initialization Status */}
        <div className="pt-6 border-t border-border/40 flex flex-col gap-3 text-xs text-muted-foreground text-left font-mono relative">
          <div className="flex justify-between items-center py-1">
            <span>Domain Core Architecture</span>
            <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Clean & Ready</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span>Next.js App Router (hydration-safe)</span>
            <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Initialized</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span>Tailwind Custom Premium Config</span>
            <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Active</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span>PWA Manifest & Service Worker</span>
            <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Configured</span>
          </div>
        </div>

        {/* Footer Links */}
        <footer className="pt-6 mt-6 border-t border-border/20 flex justify-center gap-6 text-[10px] text-muted-foreground/60 font-medium uppercase tracking-widest">
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          <span>&bull;</span>
          <span>&copy; 2026 Visus</span>
        </footer>
      </div>
    </main>
  );
}
