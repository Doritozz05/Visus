"use client";

import * as React from "react";
import { BookOpen, X } from "lucide-react";
import { FormField } from "@/components/ui/FormField";
import { NumberInput } from "@/components/ui/NumberInput";

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
  titleError?: string;
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
  titleError,
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
        <form onSubmit={onSubmit} noValidate className="space-y-4 relative z-10">
          <FormField label="Title" required error={titleError}>
            <input 
              type="text" 
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-4 py-2 border border-border/40 rounded-lg bg-background/50 focus:outline-none focus:border-primary/80 text-sm h-10 transition-colors"
              placeholder="e.g., Moby Dick"
            />
          </FormField>

          <FormField label="Author">
            <input 
              type="text" 
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              className="w-full px-4 py-2 border border-border/40 rounded-lg bg-background/50 focus:outline-none focus:border-primary/80 text-sm h-10 transition-colors"
              placeholder="e.g., Herman Melville"
            />
          </FormField>

          <FormField label="Cover image URL (optional)">
            <input 
              type="text" 
              value={newCoverUrl}
              onChange={(e) => setNewCoverUrl(e.target.value)}
              className="w-full px-4 py-2 border border-border/40 rounded-lg bg-background/50 focus:outline-none focus:border-primary/80 text-sm h-10 transition-colors"
              placeholder="https://example.com/cover.jpg"
            />
          </FormField>

          <FormField label="Tags (comma separated)">
            <input 
              type="text" 
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              className="w-full px-4 py-2 border border-border/40 rounded-lg bg-background/50 focus:outline-none focus:border-primary/80 text-sm h-10 transition-colors"
              placeholder="Fiction, Classic, Adventure"
            />
          </FormField>

          <div className="flex gap-4">
            <FormField label="Current Page" className="flex-1">
              <NumberInput 
                min="0"
                value={newCurrentPage}
                onChange={(e) => setNewCurrentPage(e.target.value ? Number(e.target.value) : "")}
                className="w-full px-4 py-2 border border-border/40 rounded-lg bg-background/50 focus:outline-none focus:border-primary/80 text-sm h-10 transition-colors"
                placeholder="e.g., 45"
              />
            </FormField>
            <FormField label="Total Pages" className="flex-1">
              <NumberInput 
                min="1"
                value={newTotalPages}
                onChange={(e) => setNewTotalPages(e.target.value ? Number(e.target.value) : "")}
                className="w-full px-4 py-2 border border-border/40 rounded-lg bg-background/50 focus:outline-none focus:border-primary/80 text-sm h-10 transition-colors"
                placeholder="e.g., 300"
              />
            </FormField>
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
