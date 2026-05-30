"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Book } from "@/core/entities/book";

interface BookshelfSelectorProps {
  books: Book[];
  setActiveBookId: (id: string | null) => void;
}

export function BookshelfSelector({ books, setActiveBookId }: BookshelfSelectorProps) {
  const router = useRouter();

  return (
    <div className="bg-background text-foreground font-sans h-screen flex flex-col md:flex-row antialiased transition-all duration-300 relative overflow-hidden">
      <Sidebar activePath="/reader" />

      <main className="flex-1 flex flex-col items-center justify-between p-6 pt-24 pb-8 md:pl-72 overflow-hidden">
        <div className="w-full max-w-4xl flex-1 flex flex-col justify-center gap-6 mt-4">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold font-heading text-foreground">Bookshelf Selection</h2>
            <p className="text-xs text-muted-foreground font-sans mt-1">Select a cataloged book to load into your speed reading room.</p>
          </div>

          {/* Scrollable Bookshelf Shelf */}
          <div className="flex-1 max-h-[60vh] overflow-y-auto pr-1 scrollbar-none">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {books.map((book) => (
                <div
                  key={book.id}
                  onClick={() => setActiveBookId(book.id)}
                  className="bg-card border border-border/20 hover:border-primary/50 transition-all rounded-xl p-5 flex flex-col justify-between shadow-md cursor-pointer group glass-panel min-h-[170px]"
                >
                  <div className="flex gap-3.5 items-start">
                    <div className="w-10 h-14 bg-background border border-border/30 rounded flex items-center justify-center shrink-0 relative shadow-inner">
                      <span className="material-symbols-outlined text-muted-foreground/80 text-xl">menu_book</span>
                      <div className="absolute bottom-0.5 right-0.5 bg-accent/90 px-1 rounded text-[6px] font-mono text-primary font-bold">{book.format}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold font-heading text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">{book.title}</h3>
                      <p className="text-[10px] text-muted-foreground font-mono truncate mt-0.5">{book.author}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-2 border-t border-border/10 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-primary font-bold">{book.progress}% Done</span>
                    <span className="text-muted-foreground">{book.status.toUpperCase()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-2">
            <button
              onClick={() => router.push("/library")}
              className="px-5 py-2.5 border border-border/30 rounded-lg text-xs font-mono uppercase tracking-wider text-muted-foreground hover:bg-accent hover:text-foreground transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">library_books</span>
              Manage Library Books
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
