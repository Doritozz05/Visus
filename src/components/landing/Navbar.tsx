"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Eye, ArrowRight } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  // Define routes where the landing navbar should be hidden (app routes)
  const isAppRoute = pathname.startsWith("/library") || 
                     pathname.startsWith("/reader") || 
                     pathname.startsWith("/dashboard") || 
                     pathname.startsWith("/settings");

  if (isAppRoute) return null;

  return (
    <div className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/60 border-b border-border/10 shadow-sm">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-lg shadow-primary/20">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <span className="font-heading font-extrabold text-xl tracking-tight">Visus</span>
        </Link>
        
        <div className="flex items-center gap-4 md:gap-8">
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/speed-reading" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              Guide
            </Link>
            <Link href="/rsvp-method" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              RSVP
            </Link>
            <Link href="/dashboard" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <a
              href="https://github.com/Doritozz05/Visus"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              <span>GitHub</span>
            </a>
          </div>

          {/* Action Button */}
          <Link
            href="/library"
            className="text-sm font-bold bg-foreground text-background px-5 py-2.5 rounded-full hover:bg-foreground/90 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            Launch app
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>
    </div>
  );
}
