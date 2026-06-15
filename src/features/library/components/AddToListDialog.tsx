"use client";

import * as React from "react";
import { useReadingList } from "../context/reading-list-context";
import { Book } from "@/core/entities/book";
import { X, Check, ListPlus, FolderOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AddToListDialogProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
}

export function AddToListDialog({ book, isOpen, onClose }: AddToListDialogProps) {
  const { lists, addBookToList, removeBookFromList } = useReadingList();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-card border border-border/40 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden liquid-glass"
      >
        <div className="p-4 border-b border-border/10 flex justify-between items-center bg-accent/30">
          <div className="flex items-center gap-2">
            <ListPlus className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold font-heading">Add to List</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded-full transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-1 max-h-[300px] overflow-y-auto scrollbar-none">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3 px-1">
            Include <span className="text-foreground font-bold">&quot;{book.title}&quot;</span> in:
          </p>
          
          {lists.length === 0 ? (
            <div className="py-8 text-center flex flex-col items-center gap-2">
              <FolderOpen className="w-8 h-8 text-muted-foreground/20" />
              <p className="text-xs text-muted-foreground">You don&apos;t have any lists yet.</p>
              <p className="text-[10px] text-muted-foreground/60">Create one in the sidebar to organize your library.</p>
            </div>
          ) : (
            lists.map((list) => {
              const isIncluded = list.bookIds.includes(book.id);
              return (
                <button
                  key={list.id}
                  onClick={() => isIncluded ? removeBookFromList(list.id, book.id) : addBookToList(list.id, book.id)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-accent/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: list.color || 'var(--primary)' }} />
                    <span className="text-xs font-medium text-foreground">{list.name}</span>
                  </div>
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                    isIncluded 
                      ? "bg-primary border-primary text-primary-foreground" 
                      : "border-border/60 group-hover:border-primary/50"
                  }`}>
                    {isIncluded && <Check className="w-3 h-3" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="p-4 bg-accent/10 border-t border-border/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-bold font-mono uppercase tracking-wider hover:brightness-110 shadow-lg shadow-primary/20 transition-all"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
}
