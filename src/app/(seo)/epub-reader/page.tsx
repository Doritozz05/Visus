import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Lock, FileText, WifiOff, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Fast EPUB Reader Online: 100% Private & Offline Capable",
  description: "Read EPUB files online at high speeds. Visus is a secure, local-first EPUB reader that works offline and never uploads your books to the cloud.",
  keywords: ["online epub reader", "private ebook reader", "offline epub viewer", "web epub reader", "browser epub reader"],
  alternates: {
    canonical: "/epub-reader",
  },
};

export default function EpubReaderPage() {
  return (
    <main className="font-sans pt-24 pb-40 px-6 relative overflow-hidden">
      <article className="max-w-4xl mx-auto">
        <header className="mb-20 text-center relative">
          {/* Background Decor - Adaptive to header size with breathing room */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[1000px] h-[calc(100%+120px)] opacity-25 pointer-events-none [mask-image:linear-gradient(to_bottom,white,transparent)] -z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/50 rounded-full blur-[100px]" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            <ShieldCheck className="w-3 h-3" /> Privacy First
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold font-heading tracking-tight mb-8 leading-[1.1]">
            The ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/60">EPUB web reader</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Fast, private, and local-first. Experience a reading environment that respects your library and your data.
          </p>
        </header>

        <div className="space-y-24">
          <section>
            <h2 className="text-3xl md:text-4xl font-extrabold font-heading tracking-tight mb-6">Why most online EPUB readers fail</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-xl text-foreground/80 font-medium leading-relaxed mb-6">
                Traditional online document readers require you to upload your personal files to their servers.
              </p>
              <p className="text-muted-foreground">
                This introduces major issues: your personal library and reading habits are stored on third-party servers, you have to wait for large files to upload, and if you lose your internet connection, you lose access to your books.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl md:text-4xl font-extrabold font-heading tracking-tight mb-8 text-center">The Visus advantage</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose">
              <div className="group p-8 bg-card rounded-3xl border border-border/50 shadow-sm hover:border-primary/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3 font-heading">100% Private</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Parsing happens locally. We do not have servers that store your EPUB files or track what you read.</p>
              </div>
              <div className="group p-8 bg-card rounded-3xl border border-border/50 shadow-sm hover:border-primary/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <WifiOff className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3 font-heading">Works Offline</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Once loaded, your book stays in your browser cache. Disconnect from the web and keep reading anywhere.</p>
              </div>
              <div className="group p-8 bg-card rounded-3xl border border-border/50 shadow-sm hover:border-indigo-600/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-bold text-xl mb-3 font-heading">Multi-format</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Beyond EPUB, Visus supports PDF and raw text files with perfect, clean formatting extraction.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl md:text-4xl font-extrabold font-heading tracking-tight mb-6 text-center">Integrated speed reading</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none text-center">
              <p className="text-xl text-foreground/80 font-medium leading-relaxed mb-6">
                Built for power users.
              </p>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                Unlike basic EPUB readers that just show you a static page, Visus integrates seamlessly with our <Link href="/rsvp-method" className="text-primary font-bold underline hover:opacity-80">RSVP engine</Link> and <Link href="/speed-reading" className="text-primary font-bold underline hover:opacity-80">speed reading guide</Link>. Toggle between traditional pagination and high-speed RSVP mode instantly.
              </p>
              <p className="text-muted-foreground mt-4">
                Our parser supports multiple text encodings and intelligently identifies chapter breaks, providing a navigation experience that rivals dedicated desktop software while running entirely in a browser tab.
              </p>
            </div>
          </section>

          <section className="border-t border-border/10 pt-24">
            <h2 className="text-3xl font-extrabold font-heading tracking-tight mb-8">Reading Resources</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/rsvp-method" className="p-6 rounded-2xl border border-border/50 hover:border-primary/50 bg-card/50 transition-colors group">
                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">The RSVP Method</h3>
                <p className="text-sm text-muted-foreground">Learn how to read one word at a time without moving your eyes.</p>
              </Link>
              <Link href="/speed-reading" className="p-6 rounded-2xl border border-border/50 hover:border-primary/50 bg-card/50 transition-colors group">
                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">Speed Reading Guide</h3>
                <p className="text-sm text-muted-foreground">The science and techniques to double your reading speed today.</p>
              </Link>
              <Link href="/cluster-method" className="p-6 rounded-2xl border border-border/50 hover:border-primary/50 bg-card/50 transition-colors group">
                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">Semantic Clustering</h3>
                <p className="text-sm text-muted-foreground">Process groups of words for a more natural reading flow.</p>
              </Link>
            </div>
          </section>
        </div>

        <div className="mt-32 relative group">
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-2/3 bg-primary/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div className="relative p-8 md:py-12 md:px-16 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-[2.5rem] border border-primary/20 text-center not-prose shadow-2xl shadow-primary/5 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] -mr-32 -mt-32 rounded-full" />
            <div className="relative z-10">
              <h3 className="text-3xl md:text-5xl font-extrabold mb-4 font-heading tracking-tight leading-tight">
                Read your library <br /> <span className="text-primary">without compromise.</span>
              </h3>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                No account required. Your books never leave your device.
              </p>
              <Link
                href="/library"
                className="inline-flex items-center gap-3 bg-foreground text-background font-bold text-lg px-12 py-5 rounded-full hover:scale-105 transition-all duration-300 shadow-xl group"
              >
                Launch EPUB reader <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
