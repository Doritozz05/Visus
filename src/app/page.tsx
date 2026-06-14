import Link from "next/link";
import { ArrowRight, BookOpen, Eye, Zap, Shield, BarChart, Settings, Smartphone } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-hidden relative font-sans">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-emerald-500/50 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-lg shadow-primary/20">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <span className="font-heading font-extrabold text-xl tracking-tight">Visus</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/library" className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Library
          </Link>
          <Link href="/dashboard" className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <Link 
            href="/library" 
            className="text-sm font-bold bg-foreground text-background px-4 py-2 rounded-full hover:bg-foreground/90 transition-all shadow-md hover:shadow-lg"
          >
            Open App
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-24 pb-20 md:pt-32 md:pb-32 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-widest mb-8">
          <Zap className="w-4 h-4" />
          <span>The next generation of reading</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight font-heading leading-[1.1] mb-6">
          Read Faster. Retain More. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Entirely Private.</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Visus uses advanced RSVP and semantic clustering to train your peripheral vision and double your reading speed, all without leaving your browser.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link 
            href="/library" 
            className="flex items-center gap-2 bg-primary text-primary-foreground font-bold text-lg px-8 py-4 rounded-2xl hover:brightness-110 transition-all shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] group"
          >
            Start Reading Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 bg-accent/50 text-foreground font-semibold text-lg px-8 py-4 rounded-2xl hover:bg-accent transition-all border border-border/50"
          >
            View Dashboard
          </Link>
        </div>
      </section>

      {/* Bento Grid Showcase */}
      <section className="relative z-10 px-6 pb-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: RSVP (Large) */}
          <div className="md:col-span-2 bg-card border border-border/30 rounded-3xl p-8 md:p-12 overflow-hidden relative group hover:border-primary/50 transition-all shadow-xl">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <BookOpen className="w-48 h-48" />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="mb-12">
                <h2 className="text-3xl font-extrabold font-heading mb-4">Focus without moving your eyes.</h2>
                <p className="text-muted-foreground text-lg max-w-md">
                  Our RSVP (Rapid Serial Visual Presentation) engine highlights the Optimal Recognition Point in every word. Eliminate subvocalization and breeze through books.
                </p>
              </div>
              
              {/* Mockup UI */}
              <div className="w-full max-w-md mx-auto bg-background border border-border/40 rounded-2xl p-6 shadow-2xl relative">
                <div className="text-center font-serif text-3xl mb-4">
                  <span className="text-muted-foreground">in</span><span className="text-primary font-bold">t</span><span className="text-muted-foreground">eresting</span>
                </div>
                <div className="w-full bg-border/40 h-1.5 rounded-full overflow-hidden">
                  <div className="w-1/3 bg-primary h-full rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Offline PWA */}
          <div className="bg-card border border-border/30 rounded-3xl p-8 overflow-hidden relative group hover:border-emerald-500/50 transition-all shadow-xl flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
              <Shield className="w-6 h-6 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold font-heading mb-3">Your data, your device.</h2>
            <p className="text-muted-foreground">
              Visus runs completely in your browser. Upload EPUBs or text securely. Nothing is sent to our servers unless you opt-in to cloud sync.
            </p>
            <div className="mt-auto pt-8">
              <div className="flex items-center gap-3 text-sm font-semibold text-emerald-500">
                <Smartphone className="w-5 h-5" />
                Install as PWA for offline reading
              </div>
            </div>
          </div>

          {/* Card 3: Analytics */}
          <div className="bg-card border border-border/30 rounded-3xl p-8 overflow-hidden relative group hover:border-blue-500/50 transition-all shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
              <BarChart className="w-6 h-6 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold font-heading mb-3">Track your velocity.</h2>
            <p className="text-muted-foreground mb-6">
              Beautiful telemetry dashboards visualize your WPM, reading streaks, and comprehension accuracy over time.
            </p>
          </div>

          {/* Card 4: Customizable */}
          <div className="md:col-span-2 bg-card border border-border/30 rounded-3xl p-8 md:p-12 overflow-hidden relative group hover:border-purple-500/50 transition-all shadow-xl flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20">
                <Settings className="w-6 h-6 text-purple-500" />
              </div>
              <h2 className="text-3xl font-extrabold font-heading mb-4">Tailored to your eyes.</h2>
              <p className="text-muted-foreground text-lg">
                Choose from highly legible typography, dark modes, sepia tones, and custom spacing. Adjust speed from 100 to 1200 WPM instantly.
              </p>
            </div>
            <div className="w-full md:w-64 grid grid-cols-2 gap-3 shrink-0">
              <div className="bg-background rounded-lg border border-border/40 p-4 text-center">
                <span className="font-sans text-2xl font-bold text-foreground block">Aa</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2 block">Inter</span>
              </div>
              <div className="bg-[#f4ecd8] rounded-lg border border-[#e5d8b8] p-4 text-center">
                <span className="font-serif text-2xl font-bold text-[#5c4b37] block">Aa</span>
                <span className="text-[10px] text-[#8a7b66] uppercase tracking-widest mt-2 block">Sepia</span>
              </div>
              <div className="bg-[#1e1e2e] rounded-lg border border-[#313244] p-4 text-center">
                <span className="font-mono text-2xl font-bold text-[#cdd6f4] block">Aa</span>
                <span className="text-[10px] text-[#a6adc8] uppercase tracking-widest mt-2 block">Mono</span>
              </div>
              <div className="bg-background rounded-lg border border-border/40 p-4 text-center flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-primary block">600</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 block">WPM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <Eye className="w-4 h-4" />
            <span className="font-heading font-bold tracking-tight">Visus &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
