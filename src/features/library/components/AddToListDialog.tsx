"use client";

import * as React from "react";
import { useReadingList } from "../context/reading-list-context";
import { Book } from "@/core/entities/book";
import { X, Check, ListPlus, FolderOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface AddToListDialogProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
}

export function AddToListDialog({ book, isOpen, onClose }: AddToListDialogProps) {
  const { lists, addBookToList, removeBookFromList } = useReadingList();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 transition-opacity animate-in fade-in duration-300"
      />
      
      {/* Dialog Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-card border border-border/40 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden liquid-glass relative z-10 animate-scale-up"
      >
        {/* Visual Decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50 pointer-events-none"></div>

        <div className="p-6 border-b border-border/10 flex justify-between items-center bg-accent/30 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ListPlus className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-heading">Add to List</h2>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider line-clamp-1">Organizing &quot;{book.title}&quot;</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-full transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-1 max-h-[300px] overflow-y-auto scrollbar-none relative z-10">
          {lists.length === 0 ? (
            <div className="py-8 text-center flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent/50 flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-muted-foreground/30" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No collections found</p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">Create one in the library to start grouping your books.</p>
              </div>
            </div>
          ) : (
            lists.map((list) => {
              const isIncluded = list.bookIds.includes(book.id);
              return (
                <button
                  key={list.id}
                  onClick={() => isIncluded ? removeBookFromList(list.id, book.id) : addBookToList(list.id, book.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group border mb-2 ${
                    isIncluded 
                      ? "bg-primary/[0.03] border-primary/20 shadow-sm shadow-primary/5" 
                      : "bg-accent/5 border-border/40 hover:border-primary/30 hover:bg-primary/[0.02]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-3 h-3 rounded-full shadow-inner ring-4 ring-background" 
                      style={{ backgroundColor: list.color || 'var(--primary)' }} 
                    />
                    <div className="flex flex-col items-start">
                      <span className={`text-xs font-bold transition-colors ${isIncluded ? "text-primary" : "text-foreground/80 group-hover:text-primary"}`}>
                        {list.name}
                      </span>
                      <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-tighter">
                        {list.bookIds.length} items
                      </span>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-xl border flex items-center justify-center transition-all duration-300 ${
                    isIncluded 
                      ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110" 
                      : "border-border/60 group-hover:border-primary/50 group-hover:scale-105"
                  }`}>
                    {isIncluded ? (
                      <Check className="w-4 h-4" strokeWidth={3} />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-border/40 group-hover:bg-primary/40" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="p-4 bg-accent/10 border-t border-border/10 flex justify-end relative z-10">
          <button
            onClick={onClose}
            className="w-full py-3 bg-primary text-primary-foreground rounded-2xl text-[10px] font-bold font-mono uppercase tracking-widest hover:brightness-110 shadow-lg shadow-primary/20 transition-all"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
