import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Layers, Cpu, Eye } from "lucide-react";
import { FaqSection } from "@/components/landing/FaqSection";

export const metadata: Metadata = {
  title: "Visual semantic clustering speed reading",
  description: "Discover semantic clustering. Learn how Visus groups words into logical units to maximize peripheral vision and increase reading comprehension.",
  keywords: ["semantic clustering", "visual word grouping", "speed reading technique", "peripheral vision training", "cognitive reading"],
  alternates: {
    canonical: "/cluster-method",
  },
  openGraph: {
    title: "Visual semantic clustering | Visus",
    description: "Learn how to process logical units of text instead of single words.",
    url: "https://visuslabs.tech/cluster-method",
    siteName: "Visus",
    images: [{ url: "/opengraph-image" }],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Visual semantic clustering | Visus",
    description: "The evolution of the RSVP reading method.",
    images: ["/twitter-image"],
  },
};

const clusterFaqs = [
  {
    question: "What is Semantic Clustering?",
    answer: "Semantic Clustering is a reading technique where instead of looking at single words, you process small groups of words (2-3) that form a logical meaning unit. This reduces the number of 'eye stops' needed to consume a sentence.",
  },
  {
    question: "In what is it better than single-word RSVP?",
    answer: "It isn't about being better, but about different use cases. Single-word RSVP is optimal for maximum speed and focus on straightforward text, while Cluster Mode excels at maintaining contextual flow and 'melody' in more complex literary or narrative content.",
  },
  {
    question: "How do I start using it?",
    answer: "Visus includes an intelligent clustering engine. You can enable it in the Reading Room settings by selecting 'Cluster'. The software will automatically analyze the text structure to group relevant phrases together into visual clusters.",
  },
];

export default function ClusterMethodPage() {
  return (
    <main className="font-sans pt-24 pb-40 px-6 relative overflow-hidden">
      <article className="max-w-4xl mx-auto">
        <header className="mb-20 text-center relative">
          {/* Background Decor - Adaptive to header size with breathing room */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[100vw] h-[calc(100%+120px)] opacity-25 pointer-events-none [mask-image:linear-gradient(to_bottom,white,transparent)] -z-10 px-[100px]">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/50 rounded-full blur-[100px]" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            <Layers className="w-3 h-3" /> Advanced Technique
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold font-heading tracking-tight mb-8 leading-[1.1]">
            Visual <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/60">semantic clustering</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Beyond word-by-word reading. Experience Cluster Mode in the Reading Room to match the speed of thought.
          </p>
        </header>

        <div className="space-y-24">
          <section>
            <h2 className="text-3xl md:text-4xl font-extrabold font-heading tracking-tight mb-6 text-center text-primary">Cluster mode in action</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-xl text-foreground/80 font-medium leading-relaxed mb-6 text-center">
                Your brain doesn&apos;t think in words; it thinks in concepts.
              </p>
              <p className="text-muted-foreground text-center max-w-3xl mx-auto">
                While standard RSVP is powerful, flashing one word at a time can sometimes break the natural rhythm of a sentence. Cluster Mode bridges the gap by grouping information into logical meaning units.
              </p>
            </div>
          </section>

          {/* Visual Demo Placeholder */}
          <div className="my-16 not-prose p-12 rounded-3xl bg-muted/30 border border-border/50 flex flex-col items-center justify-center text-center">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-12 font-bold">Clustering Demo</div>
            <div className="flex items-center gap-4 w-full max-w-lg">
              <div className="h-px flex-1 bg-border" />
              <div className="px-6 py-4 bg-primary/10 rounded-2xl border border-primary/20 ring-8 ring-primary/5">
                <span className="text-2xl md:text-4xl font-mono font-bold tracking-tighter uppercase text-primary">
                  READING IN FLOW
                </span>
              </div>
              <div className="h-px flex-1 bg-border" />
            </div>
            <p className="mt-12 text-sm text-muted-foreground max-w-md italic">
              Visus groups words into logical clusters, allowing you to process entire concepts in a single fixation.
            </p>
          </div>

          <section>
            <h2 className="text-3xl md:text-4xl font-extrabold font-heading tracking-tight mb-6 text-center">Why clustering works</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
              <p className="text-xl text-foreground/80 font-medium leading-relaxed text-center">
                Clustering bridges the gap between traditional reading and pure RSVP.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose">
              <div className="group p-8 bg-card rounded-3xl border border-border/50 shadow-sm hover:border-primary/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3 font-heading">Peripheral usage</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Most RSVP apps waste your peripheral vision. Clustering utilizes your full foveal view to take in more data per second.</p>
              </div>
              <div className="group p-8 bg-card rounded-3xl border border-border/50 shadow-sm hover:border-primary/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3 font-heading">Contextual flow</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">By keeping prepositions and articles with their subjects, the natural &quot;melody&quot; of the sentence is preserved.</p>
              </div>
              <div className="group p-8 bg-card rounded-3xl border border-border/50 shadow-sm hover:border-indigo-600/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Cpu className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-bold text-xl mb-3 font-heading">Cognitive load</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Fewer visual interruptions mean less cognitive overhead, allowing for longer reading sessions without fatigue.</p>
              </div>
            </div>
          </section>

          <section className="border-t border-border/10 pt-24">
            <h2 className="text-3xl font-extrabold font-heading tracking-tight mb-8">Master more reading techniques</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/rsvp-method" className="p-6 rounded-2xl border border-border/50 hover:border-primary/50 bg-card/50 transition-colors group">
                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">The RSVP method</h3>
                <p className="text-sm text-muted-foreground">The core technology behind our high-speed reading engine.</p>
              </Link>
              <Link href="/speed-reading" className="p-6 rounded-2xl border border-border/50 hover:border-primary/50 bg-card/50 transition-colors group">
                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">Speed reading guide</h3>
                <p className="text-sm text-muted-foreground">Fundamental tips and science to double your reading speed.</p>
              </Link>
              <Link href="/epub-reader" className="p-6 rounded-2xl border border-border/50 hover:border-primary/50 bg-card/50 transition-colors group">
                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">EPUB web reader</h3>
                <p className="text-sm text-muted-foreground">Load your own books and apply clustering modes instantly.</p>
              </Link>
            </div>
          </section>
        </div>

        <FaqSection items={clusterFaqs} title="Clustering FAQ" className="mt-32 border-t border-border/10" />

        <div className="mt-32 relative group">
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-2/3 bg-primary/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div className="relative p-8 md:py-12 md:px-16 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-[2.5rem] border border-primary/20 text-center not-prose shadow-2xl shadow-primary/5 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] -mr-32 -mt-32 rounded-full" />
            <div className="relative z-10">
              <h3 className="text-3xl md:text-5xl font-extrabold mb-4 font-heading tracking-tight leading-tight">
                Read smarter, <br /> <span className="text-primary">not just faster.</span>
              </h3>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Experience the power of Semantic Clustering in our advanced reader.
              </p>
              <Link
                href="/library"
                className="inline-flex items-center gap-3 bg-foreground text-background font-bold text-lg px-12 py-5 rounded-full hover:scale-105 transition-all duration-300 shadow-xl group"
              >
                Open reader <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
