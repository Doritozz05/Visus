import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Lock, FileText, WifiOff } from "lucide-react";

export const metadata: Metadata = {
  title: "Fast EPUB Reader Online: 100% Private & Offline Capable",
  description: "Read EPUB files online at high speeds. Visus is a secure, local-first EPUB reader that works offline and never uploads your books to the cloud.",
  alternates: {
    canonical: "/epub-reader",
  },
};

export default function EpubReaderPage() {
  return (
    <main className="font-sans pt-16 pb-16 px-6 max-w-4xl mx-auto">
      <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-extrabold">
        <h1 className="text-4xl md:text-5xl tracking-tight mb-8">
          The ultimate EPUB web reader: fast, private, and local-first
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8">
          Looking for a way to read your EPUB files online without compromising your privacy? Visus is a next-generation web reader that processes your books directly in your browser.
        </p>

        <section className="my-12">
          <h2>Why most online EPUB readers fail</h2>
          <p>
            Traditional online document readers require you to upload your personal files to their servers. This introduces several major issues:
          </p>
          <ul className="space-y-2">
            <li><strong>Privacy risks:</strong> Your personal library and reading habits are stored on third-party servers.</li>
            <li><strong>Slow performance:</strong> You have to wait for large EPUB or PDF files to upload before you can start reading.</li>
            <li><strong>No offline access:</strong> If you lose your internet connection, you lose access to your books.</li>
          </ul>
        </section>

        <section className="my-12">
          <h2>The Visus advantage: local-first architecture</h2>
          <p>
            Visus solves these problems by utilizing modern web technologies like Service Workers and the File System Access API. When you &quot;upload&quot; a book to Visus, it never actually leaves your device.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 not-prose">
            <div className="p-8 bg-card rounded-2xl border border-border/50 shadow-sm flex flex-col h-full">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-3">100% private</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Parsing happens locally. We do not have servers that store your EPUB files.</p>
            </div>
            <div className="p-8 bg-card rounded-2xl border border-border/50 shadow-sm flex flex-col h-full">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6">
                <WifiOff className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="font-bold text-lg mb-3">Works offline</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Once loaded, you can disconnect from the internet and read anywhere.</p>
            </div>
            <div className="p-8 bg-card rounded-2xl border border-border/50 shadow-sm flex flex-col h-full">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6">
                <FileText className="w-5 h-5 text-indigo-500" />
              </div>
              <h3 className="font-bold text-lg mb-3">Multi-format</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Supports EPUB, PDF, and raw text files with perfect formatting extraction.</p>
            </div>
          </div>
        </section>

        <section className="my-12">
          <h2>Integrated speed reading</h2>
          <p>
            Unlike basic EPUB readers that just show you a static page, Visus is built for speed. It integrates seamlessly with our <Link href="/rsvp-method" className="text-primary font-bold hover:underline">RSVP engine</Link> and <Link href="/speed-reading" className="text-primary font-bold hover:underline">speed reading guide</Link>.
          </p>
          <p>
            You can toggle between traditional pagination and high-speed RSVP mode instantly, allowing you to consume your EPUB library at 600+ words per minute.
          </p>
        </section>

        <div className="mt-16 p-10 bg-gradient-to-tr from-primary/10 to-indigo-500/10 rounded-3xl border border-primary/20 text-center not-prose shadow-xl shadow-primary/5">
          <h3 className="text-3xl font-extrabold mb-4 font-heading">Start reading your EPUBs securely</h3>
          <p className="text-lg text-muted-foreground mb-8">No account required. Drag and drop your file to begin.</p>
          <Link
            href="/library"
            className="inline-flex items-center gap-2 bg-foreground text-background font-bold px-10 py-5 rounded-full hover:scale-105 transition-transform group shadow-lg"
          >
            Open EPUB reader <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </article>
    </main>
  );
}