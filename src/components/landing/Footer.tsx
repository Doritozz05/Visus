import Link from "next/link";
import { Eye } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/20 py-16 px-6 bg-card/50 mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-lg shadow-primary/20">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight">Visus</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Advanced speed reading platform utilizing RSVP and semantic clustering. 
            Open source and privacy-focused.
          </p>
        </div>
        
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-sm uppercase tracking-wider text-foreground">Learn</h4>
          <Link href="/speed-reading" className="text-sm text-muted-foreground hover:text-primary transition-colors">Speed reading guide</Link>
          <Link href="/rsvp-method" className="text-sm text-muted-foreground hover:text-primary transition-colors">The RSVP method</Link>
          <Link href="/cluster-method" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cluster method</Link>
          <Link href="/epub-reader" className="text-sm text-muted-foreground hover:text-primary transition-colors">Free EPUB reader</Link>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-sm uppercase tracking-wider text-foreground">Legal</h4>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy policy</Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of service</Link>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-sm uppercase tracking-wider text-foreground">Connect</h4>
          <a 
            href="https://github.com/Doritozz05/Visus" 
            target="_blank" 
            rel="noreferrer" 
            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
          >
            GitHub (open source)
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border/10 flex items-center justify-between text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Visus Labs. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/sitemap.xml" className="hover:text-primary transition-colors">Sitemap</Link>
        </div>
      </div>
    </footer>
  );
}
