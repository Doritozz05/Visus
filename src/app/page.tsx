import Link from "next/link";
import { Eye, ArrowRight } from "lucide-react";
import { HeroSection } from "@/components/landing/HeroSection";
import { BentoFeatures } from "@/components/landing/BentoFeatures";
import { MiniRSVP } from "@/components/landing/MiniRSVP";
import { Testimonials } from "@/components/landing/Testimonials";
import { FaqSection } from "@/components/landing/FaqSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-clip relative font-sans">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-emerald-500/50 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <div className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/60 border-b border-border/10 shadow-sm">
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
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
            <a
              href="https://github.com/Doritozz05/Visus"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              <span>GitHub</span>
            </a>
            <Link
              href="/library"
              className="text-sm font-bold bg-foreground text-background px-4 py-2 rounded-full hover:bg-foreground/90 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              Launch app
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </nav>
      </div>

      {/* Hero Section (now showing the traditional saccades eye demo) */}
      <HeroSection />

      {/* RSVP Explanation Section (showing the original RSVP player underneath) */}
      <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto border-t border-border/10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold font-heading mb-6 tracking-tight">
            Read faster with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">sequential word presentation.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            By flashing words sequentially at a single focal point (RSVP), Visus eliminates the mechanical sweep of your eyes and pauses to capture details. Test your capability with the player below.
          </p>
        </div>

        <div className="w-full max-w-2xl mx-auto relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
          <MiniRSVP />
        </div>
      </section>

      {/* Bento grid features list (reverted to original standard features) */}
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
        <BentoFeatures />
      </div>

      {/* User testimonials */}
      <Testimonials />

      {/* Frequently asked questions */}
      <FaqSection />

      {/* Deep Dive & SEO Content Section */}
      <section className="relative z-10 py-24 px-6 max-w-4xl mx-auto border-t border-border/10">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center mb-8">The Science Behind Faster Reading</h2>
          <p className="lead text-center text-muted-foreground mb-12">
            Visus isn't just a simple document viewer. It's a platform engineered around cognitive science to help you process text faster and retain more information.
          </p>
          
          <h3>Breaking the Subvocalization Habit</h3>
          <p>
            When most people read, they internally "hear" the words in their head. This habit, known as subvocalization, physically limits your reading speed to your speaking speed (around 250 words per minute). To truly <Link href="/speed-reading" className="text-primary hover:underline">double your speed reading pace</Link>, you must break this habit. Visus forces your brain to process word shapes as pure concepts rather than sounds, dramatically increasing your WPM limit.
          </p>

          <h3>Eliminating Saccades and Eye Fatigue</h3>
          <p>
            Traditional reading requires your eyes to jump mechanically across a page in movements called saccades. During these jumps, your brain stops processing visual data. Visus uses the <Link href="/rsvp-method" className="text-primary hover:underline">RSVP (Rapid Serial Visual Presentation) method</Link> to present text sequentially at a fixed focal point. Your eyes stay completely still, eliminating muscular fatigue and maximizing the time your brain spends comprehending the text.
          </p>

          <h3>Privacy-First Document Processing</h3>
          <p>
            Unlike many cloud-based services, Visus operates entirely within your browser. Whether you are using it as an <Link href="/epub-reader" className="text-primary hover:underline">online EPUB reader</Link> or loading sensitive PDF documents, your files are never uploaded to a remote server. The local-first architecture ensures that your data remains 100% private and accessible even when you are completely offline.
          </p>
        </div>
      </section>

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
          Start reading now
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 py-16 px-6 bg-card/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Eye className="w-6 h-6 text-primary" />
              <span className="font-heading font-bold text-xl tracking-tight">Visus</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Advanced speed reading platform utilizing RSVP and semantic clustering.
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-sm uppercase tracking-wider text-foreground">Learn</h4>
            <Link href="/speed-reading" className="text-sm text-muted-foreground hover:text-primary transition-colors">Speed Reading Guide</Link>
            <Link href="/rsvp-method" className="text-sm text-muted-foreground hover:text-primary transition-colors">The RSVP Method</Link>
            <Link href="/epub-reader" className="text-sm text-muted-foreground hover:text-primary transition-colors">Free EPUB Reader</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-sm uppercase tracking-wider text-foreground">Legal</h4>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-sm uppercase tracking-wider text-foreground">Connect</h4>
            <a 
              href="https://github.com/Doritozz05/Visus" 
              target="_blank" 
              rel="noreferrer" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
            >
              GitHub (Open Source)
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border/10 flex items-center justify-between text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Visus Labs. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
