import Link from "next/link";
import { Eye, ArrowRight, Brain, Zap, Lock } from "lucide-react";
import { HeroSection } from "@/components/landing/HeroSection";
import { BentoFeatures } from "@/components/landing/BentoFeatures";
import { MiniRSVP } from "@/components/landing/MiniRSVP";
import { Testimonials } from "@/components/landing/Testimonials";
import { FaqSection } from "@/components/landing/FaqSection";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-clip relative font-sans">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-full max-h-[600px] opacity-20 pointer-events-none [mask-image:linear-gradient(to_bottom,white,transparent)] px-[100px]">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary/30 rounded-full blur-[100px]" />
      </div>

      {/* Hero Section (now showing the traditional saccades eye demo) */}
      <HeroSection />

      {/* RSVP Explanation Section (showing the original RSVP player underneath) */}
      <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto border-t border-border/10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold font-heading mb-6 tracking-tight">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/60">Advanced Speed Reading Platform</span> you need.
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Stop moving your eyes and start processing ideas. Visus is a fast, open-source platform that uses Rapid Serial Visual Presentation (RSVP) to show you text one word at a time. This simple change cuts out the constant eye jumping and the inner voice that slows most readers down.
          </p>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-4 leading-relaxed">
            From long EPUB books to complex work PDFs, our reader adapts to your pace. You can train your brain to hit 1000+ words per minute while keeping your focus laser-sharp and your comprehension high.
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

      {/* Deep dive & SEO content section */}
      <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto border-t border-border/10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold font-heading mb-6 tracking-tight">The science behind faster reading</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Visus is more than a document viewer. It is a cognitive training platform engineered to help you process text faster while improving retention.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group p-8 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4 font-heading">Breaking the subvocalization habit</h3>
            <p className="text-muted-foreground leading-relaxed">
              Most readers internally &quot;hear&quot; words, capping speed at ~250 WPM. Visus trains your brain to process word shapes as pure concepts, bypassing the inner voice to shatter your speed limits.
              <Link href="/speed-reading" className="inline-flex items-center gap-1 text-primary underline hover:opacity-80 mt-4 font-semibold text-sm">
                Learn about speed reading <ArrowRight className="w-4 h-4" />
              </Link>
            </p>
          </div>

          <div className="group p-8 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4 font-heading">Eliminating saccades and eye fatigue</h3>
            <p className="text-muted-foreground leading-relaxed">
              Traditional reading requires mechanical eye jumps (saccades) that cause fatigue. Our <Link href="/rsvp-method" className="text-primary underline hover:opacity-80">RSVP method</Link> presents text at a fixed point, keeping your eyes still and your focus laser-sharp.
            </p>
          </div>

          <div className="group p-8 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4 font-heading">Privacy-first document processing</h3>
            <p className="text-muted-foreground leading-relaxed">
              Visus operates entirely in your browser. Whether using our <Link href="/epub-reader" className="text-primary underline hover:opacity-80">EPUB reader</Link> or loading PDFs, your files never leave your device. 100% private, 100% offline.
            </p>
          </div>
        </div>
      </section>

      {/* CTA section */}
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

      <Footer />
    </main>
  );
}
