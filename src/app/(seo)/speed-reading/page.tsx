import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Zap, Brain, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "How to Double Your Speed Reading Speed | Visus",
  description: "Learn the science behind speed reading, how to eliminate subvocalization, and read 2x faster with full comprehension using the RSVP method.",
  alternates: {
    canonical: "/speed-reading",
  },
};

export default function SpeedReadingPage() {
  return (
    <main className="font-sans pt-16 pb-16 px-6 max-w-4xl mx-auto">
      <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-extrabold">
        <h1 className="text-4xl md:text-5xl tracking-tight mb-8">
          The ultimate guide to speed reading: read 2x faster with full comprehension
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8">
          Speed reading isn&apos;t just about skimming pages. It&apos;s about training your brain to process information visually rather than audibly, eliminating inefficiencies like subvocalization and unnecessary eye movements.
        </p>

        <section className="my-12">
          <h2>Why traditional reading is slow</h2>
          <p>
            When you learned to read, you were likely taught to read aloud. As you grew older, you learned to read silently, but your brain still &quot;speaks&quot; the words in your head. This phenomenon is called <strong>subvocalization</strong>. Because you can only &quot;speak&quot; at about 200-250 words per minute (WPM), your reading speed is artificially capped by your speaking speed.
          </p>
        </section>

        <section className="my-16 not-prose">
          <h2 className="text-3xl font-extrabold mb-8 text-center font-heading">Reading methods compared</h2>
          <div className="overflow-x-auto rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="p-4 font-bold text-muted-foreground">Feature</th>
                  <th className="p-4 font-bold">Traditional</th>
                  <th className="p-4 font-bold">Skimming</th>
                  <th className="p-4 font-bold text-primary">Visus (RSVP)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                <tr>
                  <td className="p-4 font-medium">Avg. speed</td>
                  <td className="p-4 text-muted-foreground">200-250 WPM</td>
                  <td className="p-4 text-muted-foreground">400-500 WPM</td>
                  <td className="p-4 font-bold">600-1200+ WPM</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Comprehension</td>
                  <td className="p-4 text-muted-foreground">High</td>
                  <td className="p-4 text-muted-foreground">Low / spotty</td>
                  <td className="p-4 font-bold">High / focused</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Eye strain</td>
                  <td className="p-4 text-muted-foreground">Moderate</td>
                  <td className="p-4 text-muted-foreground">High</td>
                  <td className="p-4 font-bold">Minimal</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Subvocalization</td>
                  <td className="p-4 text-muted-foreground">Constant</td>
                  <td className="p-4 text-muted-foreground">Partial</td>
                  <td className="p-4 font-bold">Eliminated</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="my-12">
          <h2>How to triple your reading speed</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 not-prose">
            <div className="p-8 bg-card rounded-2xl border border-border/50 shadow-sm flex flex-col h-full">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-3">1. Eliminate subvocalization</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Train your eyes to recognize word shapes as concepts, bypassing the inner voice entirely.</p>
            </div>
            <div className="p-8 bg-card rounded-2xl border border-border/50 shadow-sm flex flex-col h-full">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6">
                <Brain className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="font-bold text-lg mb-3">2. Expand peripheral vision</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Stop looking at individual words. Read in chunks of 2-4 words at a time to reduce fixations.</p>
            </div>
            <div className="p-8 bg-card rounded-2xl border border-border/50 shadow-sm flex flex-col h-full">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
              </div>
              <h3 className="font-bold text-lg mb-3">3. Use RSVP technology</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Software can present words sequentially at a single focal point, eliminating eye movement completely.</p>
            </div>
          </div>
        </section>

        <section className="my-12">
          <h2>The Visus approach to speed reading</h2>
          <p>
            Visus implements the <Link href="/rsvp-method" className="text-primary font-bold hover:underline">RSVP (Rapid Serial Visual Presentation)</Link> method. By flashing words at a precise &quot;Optimal Recognition Point&quot; on the screen, your eyes stay perfectly still. You spend 100% of your time comprehending text, and 0% moving your eyes.
          </p>
        </section>

        <section className="my-12">
          <h2>Frequently asked questions</h2>
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-muted/30 border border-border/20">
              <h3 className="text-xl font-bold mt-0">Does speed reading reduce comprehension?</h3>
              <p className="mb-0 text-muted-foreground">Traditional &quot;skimming&quot; does reduce comprehension. However, using tools like Visus that eliminate eye movement actually helps maintain high focus and retention, even at higher speeds, because your brain isn&apos;t distracted by tracking lines.</p>
            </div>
            <div className="p-6 rounded-xl bg-muted/30 border border-border/20">
              <h3 className="text-xl font-bold mt-0">Is it possible to read 1000 words per minute?</h3>
              <p className="mb-0 text-muted-foreground">Yes. The physical limit of the human eye and brain to recognize words is well above 1000 WPM. The bottleneck is the mechanical movement of the eyes and the habit of subvocalizing.</p>
            </div>
          </div>
        </section>

        <div className="mt-16 p-10 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl border border-primary/20 text-center not-prose shadow-xl shadow-primary/5">
          <h3 className="text-3xl font-extrabold mb-4 font-heading">Ready to read at the speed of thought?</h3>
          <p className="text-lg text-muted-foreground mb-8">Try our free open-source RSVP reader today. No sign-up required.</p>
          <Link
            href="/library"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold text-lg px-10 py-5 rounded-full hover:scale-105 transition-transform shadow-lg shadow-primary/25 group"
          >
            Start reading now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </article>
      
      {/* JSON-LD for FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Does speed reading reduce comprehension?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Traditional 'skimming' does reduce comprehension. However, using tools like Visus that eliminate eye movement actually helps maintain high focus and retention, even at higher speeds, because your brain isn't distracted by tracking lines."
                }
              },
              {
                "@type": "Question",
                "name": "Is it possible to read 1000 words per minute?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. The physical limit of the human eye and brain to recognize words is well above 1000 WPM. The bottleneck is the mechanical movement of the eyes and the habit of subvocalizing."
                }
              }
            ]
          })
        }}
      />
    </main>
  );
}