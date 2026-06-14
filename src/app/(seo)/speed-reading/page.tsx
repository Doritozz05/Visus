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
    <main className="min-h-screen bg-background text-foreground font-sans pt-24 pb-16 px-6 max-w-4xl mx-auto">
      <article className="prose prose-lg dark:prose-invert max-w-none">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">
          The Ultimate Guide to Speed Reading: Read 2x Faster with Full Comprehension
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8">
          Speed reading isn't just about skimming pages. It's about training your brain to process information visually rather than audibly, eliminating inefficiencies like subvocalization and unnecessary eye movements.
        </p>

        <section className="my-12">
          <h2>Why Traditional Reading is Slow</h2>
          <p>
            When you learned to read, you were likely taught to read aloud. As you grew older, you learned to read silently, but your brain still "speaks" the words in your head. This phenomenon is called <strong>subvocalization</strong>. Because you can only "speak" at about 200-250 words per minute (WPM), your reading speed is artificially capped by your speaking speed.
          </p>
          <p>
            Additionally, traditional reading requires your eyes to scan across the page in mechanical leaps called <strong>saccades</strong>. During a saccade, your brain actually stops processing visual information. It only processes text during the brief stops (fixations) between saccades.
          </p>
        </section>

        <section className="my-12">
          <h2>How to Tripple Your Reading Speed</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 not-prose">
            <div className="p-6 bg-card rounded-xl border border-border/50">
              <Zap className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-bold mb-2">1. Eliminate Subvocalization</h3>
              <p className="text-sm text-muted-foreground">Train your eyes to recognize word shapes as concepts, bypassing the inner voice entirely.</p>
            </div>
            <div className="p-6 bg-card rounded-xl border border-border/50">
              <Brain className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-bold mb-2">2. Expand Peripheral Vision</h3>
              <p className="text-sm text-muted-foreground">Stop looking at individual words. Read in chunks of 2-4 words at a time to reduce fixations.</p>
            </div>
            <div className="p-6 bg-card rounded-xl border border-border/50">
              <TrendingUp className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-bold mb-2">3. Use RSVP Technology</h3>
              <p className="text-sm text-muted-foreground">Software can present words sequentially at a single focal point, eliminating eye movement completely.</p>
            </div>
          </div>
        </section>

        <section className="my-12">
          <h2>The Visus Approach to Speed Reading</h2>
          <p>
            Visus implements the <Link href="/rsvp-method" className="text-primary font-bold">RSVP (Rapid Serial Visual Presentation)</Link> method. By flashing words at a precise "Optimal Recognition Point" on the screen, your eyes stay perfectly still. You spend 100% of your time comprehending text, and 0% moving your eyes.
          </p>
          <p>
            Combined with our visual clustering technology, users regularly reach reading speeds of 600 to 1000+ WPM without losing comprehension.
          </p>
        </section>

        {/* FAQ Schema implemented via JSON-LD in layout or directly here */}
        <section className="my-12">
          <h2>Frequently Asked Questions (FAQ)</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold">Does speed reading reduce comprehension?</h3>
              <p>Traditional "skimming" does reduce comprehension. However, using tools like Visus that eliminate eye movement actually helps maintain high focus and retention, even at higher speeds, because your brain isn't distracted by tracking lines.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold">Is it possible to read 1000 words per minute?</h3>
              <p>Yes. The physical limit of the human eye and brain to recognize words is well above 1000 WPM. The bottleneck is the mechanical movement of the eyes and the habit of subvocalizing.</p>
            </div>
          </div>
        </section>

        <div className="mt-16 p-8 bg-primary/5 rounded-2xl border border-primary/20 text-center not-prose">
          <h3 className="text-2xl font-bold mb-4">Ready to read at the speed of thought?</h3>
          <p className="text-muted-foreground mb-6">Try our free open-source RSVP reader today.</p>
          <Link
            href="/library"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform"
          >
            Start Reading Now <ArrowRight className="w-5 h-5" />
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