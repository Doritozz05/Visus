import Link from "next/link";
import { Eye, ArrowRight } from "lucide-react";
import { HeroSection } from "@/components/landing/HeroSection";
import { BentoFeatures } from "@/components/landing/BentoFeatures";
import { Testimonials } from "@/components/landing/Testimonials";
import { FaqSection } from "@/components/landing/FaqSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-hidden relative font-sans">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-emerald-500/50 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto backdrop-blur-md sticky top-0 bg-background/50 border-b border-border/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-lg shadow-primary/20">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <span className="font-heading font-extrabold text-xl tracking-tight">Visus</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/library" className="hidden sm:block text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Library
          </Link>
          <Link href="/dashboard" className="hidden sm:block text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <Link 
            href="/library" 
            className="text-sm font-bold bg-foreground text-background px-4 py-2 rounded-full hover:bg-foreground/90 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            Launch App
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      <HeroSection />
      
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
        <BentoFeatures />
      </div>

      <Testimonials />
      
      <FaqSection />

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-32 max-w-4xl mx-auto text-center border-t border-border/10">
        <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
        <h2 className="text-4xl md:text-5xl font-extrabold font-heading mb-6 tracking-tight relative z-10">
          Ready to read at the speed of thought?
        </h2>
        <p className="text-xl text-muted-foreground mb-10 relative z-10 max-w-2xl mx-auto">
          Join readers who are consuming knowledge faster, retaining more, and building better habits with Visus.
        </p>
        <Link 
          href="/library" 
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold text-lg px-10 py-5 rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_-10px_rgba(var(--primary),0.5)] group relative z-10"
        >
          Start Reading Now
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 py-12 px-6 bg-card/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-60">
            <Eye className="w-5 h-5" />
            <span className="font-heading font-bold tracking-tight">Visus &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground font-medium">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
