import Link from "next/link";
import { Eye, ArrowRight } from "lucide-react";

export default function SeoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 relative font-sans">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-emerald-500/50 rounded-full blur-[100px]" />
      </div>

      {/* Navbar - Simplified but consistent with Home */}
      <div className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/60 border-b border-border/10 shadow-sm">
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-lg shadow-primary/20">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-extrabold text-xl tracking-tight">Visus</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/speed-reading" className="hidden sm:block text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              Guide
            </Link>
            <Link href="/rsvp-method" className="hidden sm:block text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              RSVP
            </Link>
            <Link
              href="/library"
              className="text-sm font-bold bg-foreground text-background px-4 py-2 rounded-full hover:bg-foreground/90 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              Launch app
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </nav>
      </div>

      <div className="relative z-10">
        {children}
      </div>

      {/* Footer - Consistent with expanded Home Footer */}
      <footer className="border-t border-border/20 py-16 px-6 bg-card/50 mt-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Eye className="w-6 h-6 text-primary" />
              <span className="font-heading font-bold text-xl tracking-tight">Visus</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Advanced speed reading platform utilizing RSVP and semantic clustering.
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-sm uppercase tracking-wider text-foreground">Learn</h4>
            <Link href="/speed-reading" className="text-sm text-muted-foreground hover:text-primary transition-colors">Speed Reading Guide</Link>
            <Link href="/rsvp-method" className="text-sm text-muted-foreground hover:text-primary transition-colors">The RSVP Method</Link>
            <Link href="/epub-reader" className="text-sm text-muted-foreground hover:text-primary transition-colors">Free EPUB Reader</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-sm uppercase tracking-wider text-foreground">Legal</h4>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-sm uppercase tracking-wider text-foreground">Connect</h4>
            <a 
              href="https://github.com/Doritozz05/Visus" 
              target="_blank" 
              rel="noreferrer" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
            >
              GitHub (Open Source)
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border/10 flex items-center justify-between text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Visus Labs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}