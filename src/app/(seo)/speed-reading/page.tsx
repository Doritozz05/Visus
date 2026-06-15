import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Zap, Brain, TrendingUp } from "lucide-react";
import { FaqSection } from "@/components/landing/FaqSection";

export const metadata: Metadata = {
  title: "How to Double Your Speed Reading Speed | Visus",
  description: "Learn the science behind speed reading, how to eliminate subvocalization, and read 2x faster with full comprehension using the RSVP method.",
  alternates: {
    canonical: "/speed-reading",
  },
};

const speedReadingFaqs = [
  {
    question: "Does speed reading reduce comprehension?",
    answer: "Traditional \"skimming\" does reduce comprehension. However, using tools like Visus that eliminate eye movement actually helps maintain high focus and retention, even at higher speeds, because your brain isn't distracted by tracking lines.",
  },
  {
    question: "Is it possible to read 1000 words per minute?",
    answer: "Yes. The physical limit of the human eye and brain to recognize words is well above 1000 WPM. The bottleneck is the mechanical movement of the eyes and the habit of subvocalizing.",
  },
  {
    question: "How long does it take to see results?",
    answer: "Most users see an immediate 50-100% increase in speed when first switching to RSVP. Long-term cognitive training to eliminate subvocalization usually takes 2-4 weeks of consistent practice.",
  },
];

export default function SpeedReadingPage() {
  return (
    <main className="font-sans pt-24 pb-40 px-6 relative overflow-hidden">
      <article className="max-w-4xl mx-auto">
        <header className="mb-20 text-center relative">
          {/* Background Decor - Adaptive to header size with breathing room */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[1000px] h-[calc(100%+120px)] opacity-25 pointer-events-none [mask-image:linear-gradient(to_bottom,white,transparent)] -z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/50 rounded-full blur-[100px]" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            <Zap className="w-3 h-3" /> Mastery Guide
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold font-heading tracking-tight mb-8 leading-[1.1]">
            Read <span className="text-primary">2x faster</span> with full comprehension
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Speed reading isn&apos;t just about skimming. It&apos;s about training your brain to process information visually, eliminating the inefficiencies that slow you down.
          </p>
        </header>
        
        <div className="space-y-24">
          <section>
            <h2 className="text-3xl md:text-4xl font-extrabold font-heading tracking-tight mb-6">Why traditional reading is slow</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-xl text-foreground/80 font-medium leading-relaxed mb-6">
                When you learned to read, you were likely taught to read aloud.
              </p>
              <p className="text-muted-foreground">
                As you grew older, you learned to read silently, but your brain still &quot;speaks&quot; the words in your head. This phenomenon is called <strong>subvocalization</strong>. Because you can only &quot;speak&quot; at about 200-250 words per minute (WPM), your reading speed is artificially capped by your speaking speed.
              </p>
            </div>
          </section>

          <section className="not-prose">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold font-heading tracking-tight">Methods at a glance</h2>
            </div>
            <div className="overflow-x-auto rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-xl shadow-black/5">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="p-6 font-bold text-muted-foreground uppercase text-xs tracking-widest">Feature</th>
                    <th className="p-6 font-bold">Traditional</th>
                    <th className="p-6 font-bold">Skimming</th>
                    <th className="p-6 font-bold text-primary">Visus (RSVP)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr className="hover:bg-muted/10 transition-colors">
                    <td className="p-6 font-medium">Avg. speed</td>
                    <td className="p-6 text-muted-foreground">200-250 WPM</td>
                    <td className="p-6 text-muted-foreground">400-500 WPM</td>
                    <td className="p-6 font-bold text-primary">600-1200+ WPM</td>
                  </tr>
                  <tr className="hover:bg-muted/10 transition-colors">
                    <td className="p-6 font-medium">Comprehension</td>
                    <td className="p-6 text-muted-foreground">High</td>
                    <td className="p-6 text-muted-foreground">Low / spotty</td>
                    <td className="p-6 font-bold text-primary">High / focused</td>
                  </tr>
                  <tr className="hover:bg-muted/10 transition-colors">
                    <td className="p-6 font-medium">Eye strain</td>
                    <td className="p-6 text-muted-foreground">Moderate</td>
                    <td className="p-6 text-muted-foreground">High</td>
                    <td className="p-6 font-bold text-primary">Minimal</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-3xl md:text-4xl font-extrabold font-heading tracking-tight mb-8 text-center">The three pillars of speed reading</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              <div className="group p-8 bg-card rounded-3xl border border-border/50 shadow-sm hover:border-primary/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3 font-heading">1. Quiet the voice</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Train your brain to recognize word shapes as concepts, bypassing the inner voice entirely.</p>
              </div>
              <div className="group p-8 bg-card rounded-3xl border border-border/50 shadow-sm hover:border-primary/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3 font-heading">2. Stop tracking</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Minimize fixations and saccades. Instead of reading line by line, let the text come to you.</p>
              </div>
              <div className="group p-8 bg-card rounded-3xl border border-border/50 shadow-sm hover:border-indigo-500/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-indigo-500" />
                </div>
                <h3 className="font-bold text-xl mb-3 font-heading">3. Use RSVP</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Software can present words sequentially at a single focal point, eliminating eye movement completely.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl md:text-4xl font-extrabold font-heading tracking-tight mb-6">The Visus approach to speed reading</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-xl text-foreground/80 font-medium leading-relaxed mb-6">
                Visus implements the <Link href="/rsvp-method" className="text-primary font-bold hover:underline">RSVP (Rapid Serial Visual Presentation)</Link> method.
              </p>
              <p className="text-muted-foreground">
                By flashing words at a precise &quot;Optimal Recognition Point&quot; on the screen, your eyes stay perfectly still. You spend 100% of your time comprehending text, and 0% moving your eyes.
              </p>
            </div>
          </section>
        </div>

        <FaqSection items={speedReadingFaqs} title="Speed reading FAQ" className="mt-32 border-t border-border/10" />

        <div className="mt-32 relative group">
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-2/3 bg-primary/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div className="relative p-8 md:py-12 md:px-16 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-[2.5rem] border border-primary/20 text-center not-prose shadow-2xl shadow-primary/5 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] -mr-32 -mt-32 rounded-full" />
            <div className="relative z-10">
              <h3 className="text-3xl md:text-5xl font-extrabold mb-4 font-heading tracking-tight leading-tight">
                Ready to read at the <br /> <span className="text-primary">speed of thought?</span>
              </h3>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Join thousands of readers who are saving time and learning faster with Visus. Free, open-source, and private.
              </p>
              <Link
                href="/library"
                className="inline-flex items-center gap-3 bg-primary text-primary-foreground font-bold text-lg px-12 py-5 rounded-full hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(var(--primary),0.5)] group"
              >
                Start reading now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* JSON-LD for FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": speedReadingFaqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
    </main>
  );
}
