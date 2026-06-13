"use client";

import * as React from "react";
import { BookOpen, X } from "lucide-react";

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  newTitle: string;
  setNewTitle: (val: string) => void;
  newAuthor: string;
  setNewAuthor: (val: string) => void;
  newCoverUrl: string;
  setNewCoverUrl: (val: string) => void;
  newTags: string;
  setNewTags: (val: string) => void;
  newCurrentPage: number | "";
  setNewCurrentPage: (val: number | "") => void;
  newTotalPages: number | "";
  setNewTotalPages: (val: number | "") => void;
}

export function AddBookModal({
  isOpen,
  onClose,
  onSubmit,
  newTitle,
  setNewTitle,
  newAuthor,
  setNewAuthor,
  newCoverUrl,
  setNewCoverUrl,
  newTags,
  setNewTags,
  newCurrentPage,
  setNewCurrentPage,
  newTotalPages,
  setNewTotalPages,
}: AddBookModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-[4px] transition-opacity"
      />
      <div className="w-full max-w-md bg-card border border-border/30 rounded-2xl p-6 shadow-2xl relative z-10 liquid-glass overflow-hidden animate-scale-up">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/10 mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <BookOpen className="text-primary w-5 h-5" />
            <h3 className="font-heading font-bold text-lg">Add book manually</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Title</label>
            <input 
              type="text" 
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-4 py-2 border border-border/40 rounded-lg bg-background/50 focus:outline-none focus:border-primary/80 text-sm h-10 transition-colors"
              placeholder="e.g., Moby Dick"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Author</label>
            <input 
              type="text" 
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              className="w-full px-4 py-2 border border-border/40 rounded-lg bg-background/50 focus:outline-none focus:border-primary/80 text-sm h-10 transition-colors"
              placeholder="e.g., Herman Melville"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Cover image URL (optional)</label>
            <input 
              type="text" 
              value={newCoverUrl}
              onChange={(e) => setNewCoverUrl(e.target.value)}
              className="w-full px-4 py-2 border border-border/40 rounded-lg bg-background/50 focus:outline-none focus:border-primary/80 text-sm h-10 transition-colors"
              placeholder="https://example.com/cover.jpg"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Tags (comma separated)</label>
            <input 
              type="text" 
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              className="w-full px-4 py-2 border border-border/40 rounded-lg bg-background/50 focus:outline-none focus:border-primary/80 text-sm h-10 transition-colors"
              placeholder="Fiction, Classic, Adventure"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Current Page</label>
              <input 
                type="number" 
                min="0"
                value={newCurrentPage}
                onChange={(e) => setNewCurrentPage(e.target.value ? Number(e.target.value) : "")}
                className="w-full px-4 py-2 border border-border/40 rounded-lg bg-background/50 focus:outline-none focus:border-primary/80 text-sm h-10 transition-colors"
                placeholder="e.g., 45"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Total Pages</label>
              <input 
                type="number" 
                min="1"
                value={newTotalPages}
                onChange={(e) => setNewTotalPages(e.target.value ? Number(e.target.value) : "")}
                className="w-full px-4 py-2 border border-border/40 rounded-lg bg-background/50 focus:outline-none focus:border-primary/80 text-sm h-10 transition-colors"
                placeholder="e.g., 300"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-border/30 rounded-lg text-xs font-mono uppercase tracking-wider text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-primary text-primary-foreground font-bold rounded-lg text-xs font-mono uppercase tracking-wider shadow-md hover:brightness-110 transition-all"
            >
              Add volume
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
