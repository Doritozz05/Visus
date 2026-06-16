"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Book } from "@/core/entities/book";
import { Book as BookIcon, BookOpen, Library } from "lucide-react";
import { motion } from "framer-motion";
import { useSettings } from "@/features/settings/context/settings-context";
import { getFontFamilyStyle } from "@/lib/typography";

interface BookshelfSelectorProps {
  books: Book[];
  setActiveBookId: (id: string | null) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 25 } 
  }
};

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 25 } 
  }
};

export function BookshelfSelector({ books, setActiveBookId }: BookshelfSelectorProps) {
  const router = useRouter();
  const { settings, customFonts } = useSettings();
  const hasBooks = books.length > 0;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="h-screen flex flex-col items-center justify-between p-6 pt-24 pb-8 overflow-hidden relative"
    >
      <div className="w-full max-w-4xl flex-1 flex flex-col justify-center gap-6 mt-4">
        <motion.div variants={titleVariants} className="text-center mb-4">
          <h2 className="text-2xl font-bold font-heading text-foreground">Active bookshelf</h2>
          <p className="text-xs text-muted-foreground font-sans mt-1">Only active books are shown here. Completed titles stay in the library.</p>
        </motion.div>

        {/* Scrollable Bookshelf Shelf */}
        <div className="flex-1 max-h-[60vh] overflow-y-auto px-4 -mx-4 pt-4 -mt-4 pb-4 scrollbar-none">
          {hasBooks ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {books.map((book) => (
                <motion.div
                  key={book.id}
                  variants={itemVariants}
                  className="bg-card border border-border/20 hover:border-primary/50 transition-all rounded-xl p-5 flex flex-col justify-between shadow-md group liquid-glass min-h-[190px]"
                >
                  <div className="flex gap-3.5 items-start">
                    <div className="w-12 h-16 rounded-lg border border-border/30 overflow-hidden shrink-0 relative shadow-inner bg-background">
                      {book.coverUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <Image src={book.coverUrl} fill alt={book.title} className="object-cover transition-transform duration-300 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-accent/25">
                          <BookIcon className="text-muted-foreground/80 h-5 w-5" />
                        </div>
                      )}
                      <div className="absolute bottom-0.5 right-0.5 bg-accent/90 px-1 rounded text-[6px] font-mono text-primary font-bold">{book.format}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 
                        style={{ fontFamily: getFontFamilyStyle(settings.general.readerFontFamily, customFonts) }}
                        className="text-sm font-bold font-heading text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug"
                      >
                        {book.title}
                      </h3>
                      <p className="text-[10px] text-muted-foreground font-mono truncate mt-0.5">{book.author}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/10 flex flex-col items-center gap-3">
                    <div className="w-full flex items-center justify-between text-[10px] font-mono">
                      <span className="text-primary font-bold">{book.progress}% Done</span>
                      <span className="text-muted-foreground uppercase tracking-wider">Active</span>
                    </div>
                    
                    <button
                      onClick={() => setActiveBookId(book.id)}
                      className="w-full py-2 bg-primary/10 border border-primary/20 text-[10px] font-mono uppercase tracking-wider text-primary font-bold hover:bg-primary hover:text-primary-foreground rounded-lg transition-all shadow-sm group/btn flex items-center justify-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                      <span>Read book</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div variants={itemVariants} className="max-w-md mx-auto w-full border border-dashed border-border/30 rounded-2xl bg-card/40 liquid-glass p-10 md:p-12 text-center min-h-[320px] flex flex-col items-center justify-center gap-5">
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <BookOpen className="h-8 w-8" />
              </div>
              <div className="max-w-md">
                <h3 className="text-lg font-bold font-heading text-foreground">No active books available</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  All your books are currently completed. Open the library to reactivate one or import a new title to start reading.
                </p>
              </div>
              <div className="flex justify-center w-full max-w-sm">
                <button
                  onClick={() => router.push("/library")}
                  className="w-full px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-xs font-mono uppercase tracking-wider font-bold shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
                >
                  <Library className="h-3.5 w-3.5" />
                  Open library
                </button>
              </div>
            </motion.div>
          )}
        </div>

        <motion.div variants={itemVariants} className="flex justify-center mt-2">
          <button
            onClick={() => router.push("/library")}
            className="px-5 py-2.5 border border-border/30 rounded-lg text-xs font-mono uppercase tracking-wider text-muted-foreground hover:bg-accent hover:text-foreground transition-all flex items-center gap-1.5"
          >
            <Library className="h-3.5 w-3.5" />
            Manage library books
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

