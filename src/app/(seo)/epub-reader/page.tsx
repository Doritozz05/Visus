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
    <main className="min-h-screen bg-background text-foreground font-sans pt-24 pb-16 px-6 max-w-4xl mx-auto">
      <article className="prose prose-lg dark:prose-invert max-w-none">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">
          The Ultimate EPUB Web Reader: Fast, Private, and Local-First
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8">
          Looking for a way to read your EPUB files online without compromising your privacy? Visus is a next-generation web reader that processes your books directly in your browser.
        </p>

        <section className="my-12">
          <h2>Why Most Online EPUB Readers Fail</h2>
          <p>
            Traditional online document readers require you to upload your personal files to their servers. This introduces several major issues:
          </p>
          <ul>
            <li><strong>Privacy Risks:</strong> Your personal library, sensitive documents, and reading habits are stored on third-party servers.</li>
            <li><strong>Slow Performance:</strong> You have to wait for large EPUB or PDF files to upload before you can start reading.</li>
            <li><strong>No Offline Access:</strong> If you lose your internet connection, you lose access to your books.</li>
          </ul>
        </section>

        <section className="my-12">
          <h2>The Visus Advantage: Local-First Architecture</h2>
          <p>
            Visus solves these problems by utilizing modern web technologies like Service Workers and the File System Access API. When you "upload" a book to Visus, it never actually leaves your device.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 not-prose">
            <div className="p-6 bg-card rounded-xl border border-border/50">
              <Lock className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-bold mb-2">100% Private</h3>
              <p className="text-sm text-muted-foreground">Parsing happens locally. We do not have servers that store your EPUB files.</p>
            </div>
            <div className="p-6 bg-card rounded-xl border border-border/50">
              <WifiOff className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-bold mb-2">Works Offline</h3>
              <p className="text-sm text-muted-foreground">Once loaded, you can disconnect from the internet and read anywhere.</p>
            </div>
            <div className="p-6 bg-card rounded-xl border border-border/50">
              <FileText className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-bold mb-2">Multi-Format</h3>
              <p className="text-sm text-muted-foreground">Supports EPUB, PDF, and raw text files with perfect formatting extraction.</p>
            </div>
          </div>
        </section>

        <section className="my-12">
          <h2>Integrated Speed Reading</h2>
          <p>
            Unlike basic EPUB readers that just show you a static page, Visus is built for speed. It integrates seamlessly with our <Link href="/rsvp-method" className="text-primary font-bold">RSVP Engine</Link> and <Link href="/speed-reading" className="text-primary font-bold">Semantic Clustering algorithms</Link>.
          </p>
          <p>
            You can toggle between traditional pagination and high-speed RSVP mode instantly, allowing you to consume your EPUB library at 600+ words per minute.
          </p>
        </section>

        <div className="mt-16 p-8 bg-gradient-to-tr from-primary/10 to-indigo-500/10 rounded-2xl border border-primary/20 text-center not-prose">
          <h3 className="text-2xl font-bold mb-4">Start reading your EPUBs securely</h3>
          <p className="text-muted-foreground mb-6">No account required. Drag and drop your file to begin.</p>
          <Link
            href="/library"
            className="inline-flex items-center gap-2 bg-foreground text-background font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform"
          >
            Open EPUB Reader <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </article>
    </main>
  );
}