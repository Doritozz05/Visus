"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Hero3D } from "@/components/landing/Hero3D";

const sectionFadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#fdfcf0] text-zinc-900 overflow-x-hidden selection:bg-zinc-900 selection:text-[#fdfcf0]">
      {/* Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] z-50" />
      
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-8 md:px-20 overflow-hidden pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full max-w-7xl mx-auto z-10">
          
          {/* Text Content - Left Aligned */}
          <div className="text-left space-y-8 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="space-y-4"
            >
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-500 block mb-4">
                Est. 2026 — Visus Digital Archive
              </span>
              <h1 className="text-6xl md:text-[100px] font-serif leading-[0.9] tracking-tighter text-zinc-950">
                Reading <br />
                <span className="italic font-normal">Reimagined.</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-lg md:text-xl text-zinc-600 font-medium leading-relaxed"
            >
              A high-performance sanctuary for the modern mind. Experience documents through advanced visual clusters and RSVP technology.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="pt-4"
            >
              <Link 
                href="/reader" 
                className="inline-block border border-zinc-950 px-10 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-zinc-950 hover:text-[#fdfcf0] transition-all duration-500 shadow-sm"
              >
                Open the Reader
              </Link>
            </motion.div>
          </div>

          {/* 3D Visual - Right Aligned */}
          <div className="relative h-[500px] md:h-[700px] w-full flex items-center justify-center pointer-events-none">
            <div className="absolute inset-0 pointer-events-auto">
              <Hero3D />
            </div>
          </div>

        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-12 left-8 md:left-20 flex flex-col items-center gap-2 opacity-50"
        >
          <span className="text-[9px] uppercase tracking-widest font-bold">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-zinc-950 to-transparent" />
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto border-t border-zinc-200">
        <motion.div {...sectionFadeIn} className="grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl font-serif tracking-tight leading-tight">
              Crafted for those who <span className="italic underline decoration-1 underline-offset-8 text-zinc-400">value clarity</span> over noise.
            </h2>
            <p className="text-zinc-600 leading-relaxed text-lg">
              In an age of endless scrolling, Visus offers a focused environment. We've stripped away the "AI slop" and focused on the core engineering of reading: visual span, fixation control, and comprehension at scale.
            </p>
          </div>
          <div className="aspect-[4/5] bg-zinc-100 rounded-sm overflow-hidden relative group">
             <div className="absolute inset-0 bg-gradient-to-br from-zinc-500/10 to-transparent" />
             <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
                <p className="font-serif italic text-2xl text-zinc-400 opacity-50 select-none">
                  "The art of reading is in great part that of acquiring a better understanding."
                </p>
             </div>
             {/* Bento Grid Sub-element mockup */}
             <div className="absolute bottom-8 left-8 right-8 border border-zinc-950/5 bg-white/50 backdrop-blur-md p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-end">
                   <div className="space-y-1">
                      <div className="h-1 w-12 bg-zinc-950/10 rounded-full" />
                      <div className="h-1 w-8 bg-zinc-950/10 rounded-full" />
                   </div>
                   <span className="text-[10px] font-mono opacity-30 uppercase tracking-tighter">RSVP Engine v2.0</span>
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-zinc-950 text-[#fdfcf0]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...sectionFadeIn} className="mb-24 space-y-4">
             <h3 className="text-[11px] uppercase tracking-[0.4em] font-bold opacity-40">Core Technology</h3>
             <h2 className="text-6xl font-serif tracking-tight">Engineered Precision</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-1px bg-zinc-800 border border-zinc-800">
            {[
              { title: "RSVP Engine", desc: "Rapid Serial Visual Presentation tuned for optimal retention and zero eye-strain." },
              { title: "Visual Clusters", desc: "Break down complex documents into digestible cognitive nodes for faster mapping." },
              { title: "Universal Parser", desc: "Seamless support for ePUB, PDF, and Raw Text with perfect formatting preservation." },
              { title: "OLED Performance", desc: "Optimized for high-refresh rates and low-latency rendering on modern displays." },
              { title: "Sync Protocol", desc: "Cloud-hybrid synchronization ensuring your library is available offline and globally." },
              { title: "Privacy First", desc: "Local-first architecture. Your data never leaves your device unless you choose to sync." }
            ].map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-950 p-12 space-y-4 hover:bg-zinc-900 transition-colors duration-500"
              >
                <h4 className="text-xl font-serif italic text-zinc-100">{f.title}</h4>
                <p className="text-zinc-500 leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          <div className="space-y-4">
            <h4 className="text-2xl font-serif tracking-tighter">Visus</h4>
            <p className="text-xs text-zinc-400 max-w-[240px] leading-relaxed">
              Redefining the relationship between human cognition and digital text.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-12">
            <div className="space-y-4">
               <h5 className="text-[10px] uppercase tracking-widest font-bold opacity-30">Platform</h5>
               <ul className="space-y-2 text-sm">
                  <li><Link href="/dashboard" className="hover:underline">Dashboard</Link></li>
                  <li><Link href="/library" className="hover:underline">Library</Link></li>
                  <li><Link href="/reader" className="hover:underline">Reader</Link></li>
               </ul>
            </div>
            <div className="space-y-4">
               <h5 className="text-[10px] uppercase tracking-widest font-bold opacity-30">Legal</h5>
               <ul className="space-y-2 text-sm">
                  <li><Link href="/privacy" className="hover:underline">Privacy</Link></li>
                  <li><Link href="/terms" className="hover:underline">Terms</Link></li>
               </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-zinc-100 flex justify-between items-center">
          <span className="text-[10px] font-mono opacity-20 tracking-tighter uppercase">Build 2026.06.11 / v0.2.0-Alpha</span>
          <span className="text-[10px] font-mono opacity-20 tracking-tighter uppercase">Handcrafted with precision</span>
        </div>
      </footer>
    </main>
  );
}
