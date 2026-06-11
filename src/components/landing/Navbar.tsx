"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 mix-blend-difference"
    >
      <Link href="/" className="text-sm font-heading font-bold tracking-tighter uppercase text-white">
        Visus / Modern Archive
      </Link>
      
      <div className="flex gap-8 items-center">
        <Link href="/library" className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors">
          Collection
        </Link>
        <Link href="/reader" className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors">
          Reader
        </Link>
        <Link href="/dashboard" className="px-4 py-1.5 rounded-full bg-white text-black text-[11px] font-bold uppercase tracking-wider hover:bg-zinc-200 transition-colors">
          Access
        </Link>
      </div>
    </motion.nav>
  );
};
