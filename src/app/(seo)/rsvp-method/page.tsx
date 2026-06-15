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
    <main className="font-sans pt-16 pb-16 px-6 max-w-4xl mx-auto">
      <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-extrabold">
        <h1 className="text-4xl md:text-5xl tracking-tight mb-8">
          The RSVP method: Rapid Serial Visual Presentation explained
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8">
          RSVP (Rapid Serial Visual Presentation) is a paradigm-shifting reading technology that displays words one-by-one at a fixed focal point. By removing the need to move your eyes, RSVP allows you to read at cognitive speed rather than mechanical speed.
        </p>

        <section className="my-12">
          <h2>The mechanics of eye movement</h2>
          <p>
            To understand why RSVP works, we first have to understand why standard reading is inefficient.
            When you read a normal page, your eyes don&apos;t glide smoothly. They jump in erratic, jerky motions known as <strong>saccades</strong>. 
          </p>
          <p>
            Between each saccade, your eyes rest for about 200-250 milliseconds in a <strong>fixation</strong>. You only actually &quot;read&quot; during these fixations. Up to 30% of your reading time is wasted physically moving your eyes from left to right, and sweeping back to the start of the next line (the return sweep).
          </p>
        </section>

        <section className="my-12">
          <h2>How RSVP fixes reading</h2>
          <p>
            RSVP solves this by moving the text instead of your eyes. In an RSVP system like Visus, words flash on the screen at a single point, aligned by their <strong>Optimal Recognition Point (ORP)</strong>. 
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 not-prose">
            <div className="p-8 bg-card rounded-2xl border border-border/50 shadow-sm flex flex-col h-full">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Focus className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-3">Zero eye fatigue</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">By keeping your eyes stationary, you eliminate the muscular fatigue associated with tracking long lines of text.</p>
            </div>
            <div className="p-8 bg-card rounded-2xl border border-border/50 shadow-sm flex flex-col h-full">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6">
                <Timer className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="font-bold text-lg mb-3">Absolute pacing</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">The software controls the pace. This completely stops your mind from wandering, forcing you into a state of deep focus.</p>
            </div>
            <div className="p-8 bg-card rounded-2xl border border-border/50 shadow-sm flex flex-col h-full">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6">
                <BookOpen className="w-5 h-5 text-indigo-500" />
              </div>
              <h3 className="font-bold text-lg mb-3">Accessibility focus</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">For individuals with Dyslexia or ADHD, the isolation of single words reduces visual crowding.</p>
            </div>
          </div>
        </section>

        <section className="my-12">
          <h2>Visus: advanced RSVP</h2>
          <p>
            While standard RSVP is great, Visus takes it a step further. We implement <strong>Visual Semantic Clustering</strong>. Instead of always showing one word, Visus can intelligently group short phrases (like &quot;of the&quot; or &quot;in a&quot;) together. This utilizes your peripheral vision to process context faster, providing a much smoother reading experience than raw word-by-word flashing.
          </p>
        </section>

        <div className="mt-16 p-10 bg-gradient-to-br from-primary/10 to-emerald-500/10 rounded-3xl border border-primary/20 text-center not-prose shadow-xl shadow-primary/5">
          <h3 className="text-3xl font-extrabold mb-4 font-heading">Experience RSVP firsthand</h3>
          <p className="text-lg text-muted-foreground mb-8">Upload an EPUB, PDF, or text file and see the difference.</p>
          <Link
            href="/library"
            className="inline-flex items-center gap-2 bg-foreground text-background font-bold px-10 py-5 rounded-full hover:scale-105 transition-transform group shadow-lg"
          >
            Launch Visus reader <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </article>
    </main>
  );
}