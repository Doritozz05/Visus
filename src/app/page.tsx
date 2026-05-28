/**
 * @file page.tsx
 * @description Visus main home page validating visual scaffolding and introducing prototype screens.
 */

import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      <div className="max-w-2xl w-full text-center space-y-8 glass-panel p-8 md:p-12 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Decorative backdrop elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />

        <div className="space-y-3 relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            v0.1.0 Scaffolding Successful
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight font-heading">
            <span className="text-gradient-primary">Visus</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md mx-auto">
            Open-source speed reading platform and PWA using high-performance RSVP and visual reading clusters.
          </p>
        </div>

        {/* Prototype Navigation Panels */}
        <div className="relative pt-6 border-t border-slate-800/60 space-y-4">
          <h3 className="text-sm font-semibold tracking-wider uppercase text-indigo-400 text-left font-heading">
            Interactive Prototype Screens (Lectura Pro)
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Link 
              href="/dashboard"
              className="flex flex-col p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-indigo-500/50 transition-all duration-300 text-left group"
            >
              <span className="text-sm font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">Performance Dashboard</span>
              <span className="text-xs text-slate-500 mt-1">Check visual analytics & progress charts</span>
            </Link>
            <Link 
              href="/reader"
              className="flex flex-col p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-indigo-500/50 transition-all duration-300 text-left group"
            >
              <span className="text-sm font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">Reading Room</span>
              <span className="text-xs text-slate-500 mt-1">Calibrate speeds & read with active ORP</span>
            </Link>
            <Link 
              href="/library"
              className="flex flex-col p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-indigo-500/50 transition-all duration-300 text-left group"
            >
              <span className="text-sm font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">Library Management</span>
              <span className="text-xs text-slate-500 mt-1">Manage documents, ePUBs & raw texts</span>
            </Link>
            <Link 
              href="/settings"
              className="flex flex-col p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-indigo-500/50 transition-all duration-300 text-left group"
            >
              <span className="text-sm font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">Workspace Settings</span>
              <span className="text-xs text-slate-500 mt-1">Customize themes, fonts & indicators</span>
            </Link>
          </div>
        </div>

        {/* Initialization Status */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-col gap-3 text-xs text-slate-500 text-left font-mono relative">
          <div className="flex justify-between items-center py-1">
            <span>Domain Core Architecture</span>
            <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Clean & Ready</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span>Next.js App Router (hydration-safe)</span>
            <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Initialized</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span>Tailwind Custom Premium Config</span>
            <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Active</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span>PWA Manifest & Service Worker</span>
            <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Configured</span>
          </div>
        </div>
      </div>
    </main>
  );
}
