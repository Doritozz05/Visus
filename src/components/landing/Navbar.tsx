"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, ArrowRight, ChevronDown, Zap, Focus, Layers, BookOpen } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [isGuidesOpen, setIsGuidesOpen] = useState(false);

  // Define routes where the landing navbar should be hidden (app routes)
  const isAppRoute = pathname.startsWith("/library") || 
                     pathname.startsWith("/reader") || 
                     pathname.startsWith("/dashboard") || 
                     pathname.startsWith("/settings");

  if (isAppRoute) return null;

  const guideOptions = [
    {
      title: "Read Faster",
      description: "Master the art of speed reading.",
      href: "/speed-reading",
      icon: <Zap className="w-4 h-4" />
    },
    {
      title: "RSVP Method",
      description: "The science of focus points.",
      href: "/rsvp-method",
      icon: <Focus className="w-4 h-4" />
    },
    {
      title: "Cluster Method",
      description: "Group words for deep flow.",
      href: "/cluster-method",
      icon: <Layers className="w-4 h-4" />
    },
    {
      title: "EPUB Reader",
      description: "Secure, local-first reading.",
      href: "/epub-reader",
      icon: <BookOpen className="w-4 h-4" />
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/60 border-b border-border/10 shadow-sm">
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
            <div 
              className="relative"
              onMouseEnter={() => setIsGuidesOpen(true)}
              onMouseLeave={() => setIsGuidesOpen(false)}
            >
              <button 
                className={`flex items-center gap-1 text-sm font-semibold transition-colors ${isGuidesOpen ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                Guides
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isGuidesOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isGuidesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, x: "-50%", scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
                    exit={{ opacity: 0, y: 10, x: "-50%", scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-1/2 pt-4 w-64"
                  >
                    <div className="bg-card border border-border/40 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden liquid-glass p-2">
                      {guideOptions.map((option) => (
                        <Link 
                          key={option.href}
                          href={option.href}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-primary/5 group transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            {option.icon}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{option.title}</span>
                            <span className="text-xs text-muted-foreground">{option.description}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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
    </header>
  );
}
