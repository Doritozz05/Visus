"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, ArrowRight, ChevronDown, Menu, X } from "lucide-react";

interface NavbarClientProps {
  guideOptions: Array<{
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
  }>;
}

export function NavbarClient({ guideOptions }: NavbarClientProps) {
  const pathname = usePathname();
  const [isGuidesOpen, setIsGuidesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Define routes where the landing navbar should be hidden (app and auth routes)
  const isExcludedRoute = pathname.startsWith("/library") || 
                          pathname.startsWith("/reader") || 
                          pathname.startsWith("/dashboard") || 
                          pathname.startsWith("/settings") ||
                          pathname.startsWith("/login") ||
                          pathname.startsWith("/register") ||
                          pathname.startsWith("/reset-password") ||
                          pathname.startsWith("/update-password");

  if (isExcludedRoute) return null;

  return (
    <>
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-secondary text-secondary-foreground border-b border-border/10 shadow-sm transition-colors">
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
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
                  className={`flex items-center gap-1 text-sm font-semibold transition-colors ${isGuidesOpen ? "text-primary" : "text-secondary-foreground/70 hover:text-secondary-foreground"}`}
                >
                  Guides
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isGuidesOpen ? "rotate-180" : ""}`} />
                </button>

                <motion.div
                  initial={false}
                  animate={{ 
                    opacity: isGuidesOpen ? 1 : 0,
                    y: isGuidesOpen ? 0 : 10,
                    scale: isGuidesOpen ? 1 : 0.95,
                    pointerEvents: isGuidesOpen ? "auto" : "none",
                  }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-1/2 pt-4 w-64 z-50"
                  style={{ 
                    visibility: isGuidesOpen ? "visible" : "hidden",
                    translateX: "-50%"
                  }}
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
              </div>

              <a
                href="https://github.com/Doritozz05/Visus"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-sm font-semibold text-secondary-foreground/70 hover:text-secondary-foreground transition-colors"
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
              className="text-sm font-bold bg-primary text-primary-foreground px-5 py-2.5 rounded-full hover:brightness-110 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              Launch app
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -mr-2 text-secondary-foreground/70 hover:text-secondary-foreground md:hidden focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Sidebar Menu (Drawer) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-background/40 backdrop-blur-sm z-[100] md:hidden"
            />

            {/* Sidebar Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 max-w-[80vw] bg-card/95 backdrop-blur-md border-l border-border/20 shadow-2xl z-[100] p-6 flex flex-col gap-6 md:hidden liquid-glass"
            >
              {/* Header with Title and Close Button */}
              <div className="flex items-center justify-between">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center">
                  <span className="font-heading font-extrabold text-xl tracking-tight">Visus</span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <hr className="border-border/10 -mx-6" />

              {/* Navigation Items */}
              <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-none">
                {/* Guides Section */}
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                    Guides
                  </span>
                  <div className="grid grid-cols-1 gap-2 pl-2 border-l border-border/20">
                    {guideOptions.map((option) => (
                      <Link
                        key={option.href}
                        href={option.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-primary/5 group transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform shrink-0">
                          {option.icon}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                            {option.title}
                          </span>
                          <span className="text-[11px] text-muted-foreground leading-snug">
                            {option.description}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <hr className="border-border/10" />

                {/* Dashboard & GitHub Links */}
                <div className="flex flex-col gap-4">
                  <a
                    href="https://github.com/Doritozz05/Visus"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm font-bold text-foreground hover:text-primary transition-colors flex items-center justify-between py-1"
                  >
                    <div className="flex items-center gap-2">
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
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground/40" />
                  </a>
                </div>
              </div>

              {/* Action Button inside drawer */}
              <div className="mt-auto pt-4 border-t border-border/10">
                <Link
                  href="/library"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-sm font-bold bg-primary text-primary-foreground py-3 rounded-full hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  Launch app
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
