"use client";

import * as React from "react";
import { Book } from "@/core/entities/book";

interface BookDetailsModalProps {
  book: Book;
  onClose: () => void;
  onReadBook: (bookId: string) => void;
}

export function BookDetailsModal({
  book,
  onClose,
  onReadBook,
}: BookDetailsModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-[6px] transition-opacity duration-300"
      />
      <div className="w-full max-w-2xl bg-card border border-border/30 rounded-2xl shadow-2xl relative z-10 glass-panel overflow-hidden animate-scale-up flex flex-col md:flex-row min-h-[420px] max-h-[90vh]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none"></div>
        
        {/* Left Column: Large Book Cover / Backdrop Visual */}
        <div className="w-full md:w-1/3 bg-accent/20 border-r border-border/10 flex flex-col items-center justify-center p-6 relative overflow-hidden shrink-0 min-h-[200px] md:min-h-0">
          {/* Blur backdrop reflection for ultra-premium vibe */}
          {book.coverUrl && (
            <div 
              className="absolute inset-0 opacity-20 blur-xl scale-125 pointer-events-none"
              style={{
                backgroundImage: `url(${book.coverUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            />
          )}
          
          <div className="w-28 h-40 bg-gradient-to-br from-primary/10 to-primary/5 border border-border/20 rounded-xl flex items-center justify-center relative shadow-2xl overflow-hidden z-10 shrink-0 transform hover:scale-102 transition-transform duration-300">
            {book.coverUrl ? (
              <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full bg-accent/30">
                <span className="text-xl font-extrabold text-primary/70 font-mono tracking-tighter uppercase mb-1">
                  {book.title.slice(0, 2)}
                </span>
                <span className="material-symbols-outlined text-muted-foreground/30 text-2xl">menu_book</span>
              </div>
            )}
            <div className="absolute bottom-1 right-1 bg-accent/90 border border-border/10 px-1.5 py-0.5 rounded text-[8px] font-mono text-primary font-bold shadow-md">{book.format}</div>
          </div>
          
          <div className="mt-4 text-[10px] font-mono uppercase tracking-widest text-primary font-bold z-10 bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
            {book.format} volume
          </div>
        </div>

        {/* Right Column: Title, Synopsis and Technical Specifications */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-none">
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground border border-border/20 transition-all z-20"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>

          <div className="space-y-4">
            {/* Title & Author */}
            <div>
              <h3 className="font-heading font-extrabold text-xl md:text-2xl text-foreground leading-tight tracking-tight pr-8">{book.title}</h3>
              <p className="text-xs md:text-sm text-primary font-mono font-medium mt-1">{book.author}</p>
            </div>

            {/* Genre badges */}
            {book.genres && book.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {book.genres.slice(0, 4).map((genre, i) => (
                  <span 
                    key={i} 
                    className="text-[9px] font-mono uppercase tracking-wider bg-accent border border-border/30 text-muted-foreground px-2 py-0.5 rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Synopsis Scroll Box */}
            <div className="pt-2 border-t border-border/10">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">Synopsis</h4>
              <div className="max-h-[160px] overflow-y-auto pr-2 text-xs md:text-sm text-foreground/80 leading-relaxed font-sans scrollbar-none whitespace-pre-wrap">
                {book.description || `No synopsis available for this volume. Open the book to explore its complete visual elements and begin speed calibration.`}
              </div>
            </div>

            {/* Technical Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/10 text-[10px] font-mono">
              {book.publisher && (
                <div>
                  <span className="block text-muted-foreground uppercase tracking-wider">Publisher</span>
                  <span className="text-foreground font-semibold">{book.publisher}</span>
                </div>
              )}
              {book.publishDate && (
                <div>
                  <span className="block text-muted-foreground uppercase tracking-wider">Published</span>
                  <span className="text-foreground font-semibold">{book.publishDate}</span>
                </div>
              )}
              {book.language && (
                <div>
                  <span className="block text-muted-foreground uppercase tracking-wider">Language</span>
                  <span className="text-foreground font-semibold uppercase">{book.language}</span>
                </div>
              )}
              <div>
                <span className="block text-muted-foreground uppercase tracking-wider">Reading Progress</span>
                <span className="text-primary font-bold">{book.progress}% ({book.estimatedReadingTime})</span>
              </div>
            </div>
          </div>

          {/* Bottom Actions Row */}
          <div className="flex gap-3 pt-6 border-t border-border/10 mt-6 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-border/30 rounded-lg text-xs font-mono uppercase tracking-wider text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onReadBook(book.id);
                onClose();
              }}
              className="flex-1 py-2.5 bg-primary text-primary-foreground font-bold rounded-lg text-xs font-mono uppercase tracking-wider shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Read book</span>
              <span className="material-symbols-outlined text-sm">chrome_reader_mode</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
