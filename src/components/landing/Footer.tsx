import Link from "next/link";
import { Eye } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/20 py-16 px-6 bg-card/50 mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src="/icons/icon-192x192.png" 
                alt="Visus logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight">Visus</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Advanced speed reading platform utilizing RSVP and semantic clustering.
            Open source and privacy-focused.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-bold text-sm uppercase tracking-wider text-foreground">Learn</h3>
          <Link href="/speed-reading" className="text-sm text-muted-foreground hover:text-primary transition-colors">Speed reading guide</Link>
          <Link href="/rsvp-method" className="text-sm text-muted-foreground hover:text-primary transition-colors">The RSVP method</Link>
          <Link href="/cluster-method" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cluster method</Link>
          <Link href="/epub-reader" className="text-sm text-muted-foreground hover:text-primary transition-colors">Free EPUB reader</Link>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-bold text-sm uppercase tracking-wider text-foreground">Legal</h3>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy policy</Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of service</Link>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-bold text-sm uppercase tracking-wider text-foreground">Connect</h3>
          <a
            href="https://github.com/Doritozz05/Visus"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
          >
            GitHub (Open Source)
          </a>
          <a
            href="https://twitter.com/visus_labs"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
          >
            Twitter / X
          </a>
          <a
            href="https://linkedin.com/company/visus-labs"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
          >
            LinkedIn
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border/10 flex items-center justify-between text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Visus Labs. All rights reserved.</p>
      </div>
    </footer>
  );
}
