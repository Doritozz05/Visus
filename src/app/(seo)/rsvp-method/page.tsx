import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Focus, Timer, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "What is RSVP Reading? The Rapid Serial Visual Presentation Method",
  description: "Discover the RSVP reading method. Learn how Rapid Serial Visual Presentation eliminates eye tracking and saccades to boost reading speed and focus.",
  alternates: {
    canonical: "/rsvp-method",
  },
};

export default function RsvpMethodPage() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans pt-24 pb-16 px-6 max-w-4xl mx-auto">
      <article className="prose prose-lg dark:prose-invert max-w-none">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">
          The RSVP Method: Rapid Serial Visual Presentation Explained
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8">
          RSVP (Rapid Serial Visual Presentation) is a paradigm-shifting reading technology that displays words one-by-one at a fixed focal point. By removing the need to move your eyes, RSVP allows you to read at cognitive speed rather than mechanical speed.
        </p>

        <section className="my-12">
          <h2>The Mechanics of Eye Movement</h2>
          <p>
            To understand why RSVP works, we first have to understand why standard reading is inefficient.
            When you read a normal page, your eyes don't glide smoothly. They jump in erratic, jerky motions known as <strong>saccades</strong>. 
          </p>
          <p>
            Between each saccade, your eyes rest for about 200-250 milliseconds in a <strong>fixation</strong>. You only actually "read" during these fixations. Up to 30% of your reading time is wasted physically moving your eyes from left to right, and sweeping back to the start of the next line (the return sweep).
          </p>
        </section>

        <section className="my-12">
          <h2>How RSVP Fixes Reading</h2>
          <p>
            RSVP solves this by moving the text instead of your eyes. In an RSVP system like Visus, words flash on the screen at a single point, aligned by their <strong>Optimal Recognition Point (ORP)</strong>. 
          </p>
          <ul className="list-none space-y-4 not-prose my-8">
            <li className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border/30">
              <Focus className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <strong className="block text-lg">Zero Eye Fatigue</strong>
                <span className="text-muted-foreground">By keeping your eyes stationary, you eliminate the muscular fatigue associated with tracking long lines of text.</span>
              </div>
            </li>
            <li className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border/30">
              <Timer className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <strong className="block text-lg">Absolute Pacing</strong>
                <span className="text-muted-foreground">The software controls the pace. This completely stops your mind from wandering, forcing you into a state of deep focus.</span>
              </div>
            </li>
            <li className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border/30">
              <BookOpen className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <strong className="block text-lg">Improved Accessibility</strong>
                <span className="text-muted-foreground">For individuals with Dyslexia or ADHD, the isolation of single words reduces visual crowding and cognitive overload.</span>
              </div>
            </li>
          </ul>
        </section>

        <section className="my-12">
          <h2>Visus: Advanced RSVP</h2>
          <p>
            While standard RSVP is great, Visus takes it a step further. We implement <strong>Visual Semantic Clustering</strong>. Instead of always showing one word, Visus can intelligently group short phrases (like "of the" or "in a") together. This utilizes your peripheral vision to process context faster, providing a much smoother reading experience than raw word-by-word flashing.
          </p>
        </section>

        <div className="mt-16 p-8 bg-gradient-to-br from-primary/10 to-emerald-500/10 rounded-2xl border border-primary/20 text-center not-prose">
          <h3 className="text-2xl font-bold mb-4">Experience RSVP Firsthand</h3>
          <p className="text-muted-foreground mb-6">Upload an EPUB, PDF, or text file and see the difference.</p>
          <Link
            href="/library"
            className="inline-flex items-center gap-2 bg-foreground text-background font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform"
          >
            Launch Visus Reader <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </article>
    </main>
  );
}