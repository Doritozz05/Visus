"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What is RSVP reading?",
    answer: "RSVP stands for Rapid Serial Visual Presentation. Instead of moving your eyes across a page, Visus flashes words sequentially at a fixed point on your screen. This eliminates the time your eyes spend moving (saccades) and reduces subvocalization, allowing you to read much faster.",
  },
  {
    question: "Do I need an internet connection to read?",
    answer: "No. Visus is built as an Offline-First Progressive Web App (PWA). Once you load the site or install it on your device, all parsing and reading happen locally. You can read on a plane, subway, or anywhere without a connection.",
  },
  {
    question: "Are my books stored on your servers?",
    answer: "Absolutely not. By default, your EPUB files and reading progress are stored entirely in your browser's local IndexedDB. If you choose to enable Cloud Sync, your data is securely synced, but we never analyze or sell your library data.",
  },
  {
    question: "What file formats are supported?",
    answer: "Currently, Visus supports EPUB formats (both EPUB 2 and EPUB 3), which is the standard for most ebooks. Our intelligent parser extracts chapters, tables of contents, and covers automatically.",
  },
  {
    question: "Is it completely free?",
    answer: "Yes, the core local experience is completely free and open-source. We may offer premium tiers in the future for advanced cloud features, but local reading will always be free.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 px-6 max-w-3xl mx-auto border-t border-border/10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold font-heading mb-4 tracking-tight">Frequently asked questions</h2>
      </div>

      <div className="flex flex-col gap-4">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          const faqId = `faq-content-${i}`;
          const buttonId = `faq-button-${i}`;

          return (
            <div
              key={i}
              className={cn(
                "border border-border/40 rounded-2xl bg-card overflow-hidden transition-colors",
                isOpen ? "border-primary/30 shadow-[0_0_20px_-10px_rgba(var(--primary),0.2)]" : "hover:border-border"
              )}
            >
              <button
                id={buttonId}
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                aria-controls={faqId}
                className="flex items-center justify-between w-full p-6 text-left focus:outline-none focus-visible:bg-muted/50"
              >
                <span className="font-bold text-lg">{faq.question}</span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={faqId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 pt-0 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
