import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Focus, Timer, BookOpen } from "lucide-react";
import { FaqSection } from "@/components/landing/FaqSection";

export const metadata: Metadata = {
  title: "RSVP reading: Rapid serial visual presentation",
  description: "Discover the RSVP reading method. Learn how rapid serial visual presentation eliminates eye tracking and saccades to boost reading speed.",
  keywords: ["RSVP reading method", "Rapid Serial Visual Presentation", "eye saccades", "reading focus", "optimal recognition point"],
  alternates: {
    canonical: "/rsvp-method",
  },
  openGraph: {
    title: "The RSVP reading method explained | Visus",
    description: "Deep dive into the science of focus points and rapid serial visual presentation.",
    url: "https://visuslabs.tech/rsvp-method",
    siteName: "Visus",
    images: [{ url: "/opengraph-image" }],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The RSVP reading method | Visus",
    description: "Eliminate eye tracking and boost reading speed.",
    images: ["/twitter-image"],
  },
};

const rsvpFaqs = [
  {
    question: "Is RSVP harder on the eyes?",
    answer: "Actually, it's often the opposite. Most eye strain in reading comes from the mechanical movement of 'saccades'. By keeping your eyes perfectly still at a single focal point, RSVP can reduce the muscular fatigue of the eye.",
  },
  {
    question: "What is the 'Optimal Recognition Point' (ORP)?",
    answer: "The ORP is the specific point in a word where the brain can identify it fastest—usually slightly to the left of the center. Visus automatically aligns every word to this point on your screen.",
  },
  {
    question: "Can I use RSVP for deep technical reading?",
    answer: "RSVP is excellent for fiction and straightforward non-fiction. For extremely dense technical material, some readers prefer a slightly slower pace or 'Semantic Clustering', which Visus supports to group related words together.",
  },
];

export default function RsvpMethodPage() {
  return (
    <main className="font-sans pt-24 pb-40 px-6 relative overflow-hidden">
      <article className="max-w-4xl mx-auto">
        <header className="mb-20 text-center relative">
          {/* Background Decor - Adaptive to header size with breathing room */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[1000px] h-[calc(100%+120px)] opacity-25 pointer-events-none [mask-image:linear-gradient(to_bottom,white,transparent)] -z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/50 rounded-full blur-[100px]" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            <Focus className="w-3 h-3" /> Technical Deep Dive
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold font-heading tracking-tight mb-8 leading-[1.1]">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/60">RSVP method</span> explained
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Rapid Serial Visual Presentation (RSVP) is a reading paradigm that displays text one word at a time, eliminating the need for eye movement.
          </p>
        </header>

        <div className="space-y-24">
          <section>
            <h2 className="text-3xl md:text-4xl font-extrabold font-heading tracking-tight mb-6">The mechanics of eye movement</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-xl text-foreground/80 font-medium leading-relaxed mb-6">
                To understand why RSVP works, we first have to understand why standard reading is inefficient.
              </p>
              <p className="text-muted-foreground">
                When you read a normal page, your eyes don&apos;t glide smoothly. They jump in erratic, jerky motions known as <strong>saccades</strong>. Between each saccade, your eyes rest for about 200-250 milliseconds in a <strong>fixation</strong>. You only actually &quot;read&quot; during these fixations. Up to 30% of your reading time is wasted physically moving your eyes from left to right.
              </p>
            </div>
          </section>

          {/* Visual Demo Placeholder */}
          <div className="my-16 not-prose p-12 rounded-3xl bg-muted/30 border border-border/50 flex flex-col items-center justify-center text-center">
             <div className="text-xs uppercase tracking-widest text-muted-foreground mb-8 font-bold">Optimal Recognition Point (ORP)</div>
             <div className="text-5xl md:text-7xl font-mono font-bold flex items-center gap-0 tracking-tighter uppercase">
                <span>RE</span>
                <span className="text-primary relative">
                  C
                </span>
                <span>OGNITION</span>
             </div>
             <p className="mt-8 text-sm text-muted-foreground max-w-md italic">
               Visus aligns every word at its ORP, allowing your brain to process the word instantly without scanning.
             </p>
          </div>

          <section>
            <h2 className="text-3xl md:text-4xl font-extrabold font-heading tracking-tight mb-6 text-center">How RSVP fixes reading</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
               <p className="text-xl text-foreground/80 font-medium leading-relaxed text-center">
                 RSVP solves this by moving the text instead of your eyes.
               </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose">
              <div className="group p-8 bg-card rounded-3xl border border-border/50 shadow-sm hover:border-primary/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Focus className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3 font-heading">Zero fatigue</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">By keeping your eyes stationary, you eliminate the muscular fatigue associated with tracking long lines.</p>
              </div>
              <div className="group p-8 bg-card rounded-3xl border border-border/50 shadow-sm hover:border-primary/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Timer className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3 font-heading">Total focus</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">The software controls the pace, which stops your mind from wandering and forces a state of flow.</p>
              </div>
              <div className="group p-8 bg-card rounded-3xl border border-border/50 shadow-sm hover:border-indigo-600/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-bold text-xl mb-3 font-heading">Accessibility</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">For individuals with Dyslexia, the isolation of single words reduces visual crowding and improves clarity.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl md:text-4xl font-extrabold font-heading tracking-tight mb-6">Visus: advanced RSVP</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-xl text-foreground/80 font-medium leading-relaxed mb-6">
                While standard RSVP is great, Visus takes it a step further. We implement <strong>Visual Semantic Clustering</strong>.
              </p>
              <p className="text-muted-foreground">
                Instead of always showing one word, Visus can intelligently group short phrases (like &quot;of the&quot; or &quot;in a&quot;) together. This utilizes your peripheral vision to process context faster, providing a much smoother reading experience than raw word-by-word flashing.
              </p>
              <p className="text-muted-foreground mt-4">
                This adaptive engine ensures that the cognitive rhythm of the sentence is preserved, preventing the robotic feel of some older RSVP tools while maintaining extreme speed.
              </p>
            </div>
          </section>

          <section className="border-t border-border/10 pt-24">
            <h2 className="text-3xl font-extrabold font-heading tracking-tight mb-8">Continue learning</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/speed-reading" className="p-6 rounded-2xl border border-border/50 hover:border-primary/50 bg-card/50 transition-colors group">
                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">Speed reading guide</h3>
                <p className="text-sm text-muted-foreground">Master the fundamental principles of rapid text processing.</p>
              </Link>
              <Link href="/cluster-method" className="p-6 rounded-2xl border border-border/50 hover:border-primary/50 bg-card/50 transition-colors group">
                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">Semantic clustering</h3>
                <p className="text-sm text-muted-foreground">Go beyond word-by-word with our advanced grouping algorithm.</p>
              </Link>
              <Link href="/epub-reader" className="p-6 rounded-2xl border border-border/50 hover:border-primary/50 bg-card/50 transition-colors group">
                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">EPUB web reader</h3>
                <p className="text-sm text-muted-foreground">Privacy-first reading for all your personal ebook collections.</p>
              </Link>
            </div>
          </section>
        </div>

        <FaqSection items={rsvpFaqs} title="RSVP method FAQ" className="mt-32 border-t border-border/10" />

        <div className="mt-32 relative group">
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-2/3 bg-primary/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div className="relative p-8 md:py-12 md:px-16 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-[2.5rem] border border-primary/20 text-center not-prose shadow-2xl shadow-primary/5 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] -mr-32 -mt-32 rounded-full" />
            <div className="relative z-10">
              <h3 className="text-3xl md:text-5xl font-extrabold mb-4 font-heading tracking-tight leading-tight">
                Experience the <br /> <span className="text-primary">future of reading.</span>
              </h3>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Upload your first book and see how fast you can actually read. No installation required.
              </p>
              <Link
                href="/library"
                className="inline-flex items-center gap-3 bg-foreground text-background font-bold text-lg px-12 py-5 rounded-full hover:scale-105 transition-all duration-300 shadow-xl group"
              >
                Launch Visus reader <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
            "mainEntity": rsvpFaqs.map(faq => ({
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
