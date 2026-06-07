"use client";

import * as React from "react";
import { FancyDropdown } from "@/components/ui/FancyDropdown";

interface EditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  editTitle: string;
  setEditTitle: (val: string) => void;
  editAuthor: string;
  setEditAuthor: (val: string) => void;
  editFormat: "PDF" | "EPUB" | "TXT" | "PHYSICAL";
  setEditFormat: (val: "PDF" | "EPUB" | "TXT" | "PHYSICAL") => void;
  editStatus: "active" | "completed" | "archived";
  setEditStatus: (val: "active" | "completed" | "archived") => void;
  editCurrentPage: number | "";
  setEditCurrentPage: (val: number | "") => void;
  editTotalPages: number | "";
  setEditTotalPages: (val: number | "") => void;
  editProgress: number;
  setEditProgress: (val: number) => void;
  formatOptions: { value: string; label: string }[];
  statusOptions: { value: string; label: string }[];
}

export function EditBookModal({
  isOpen,
  onClose,
  onSubmit,
  editTitle,
  setEditTitle,
  editAuthor,
  setEditAuthor,
  editFormat,
  setEditFormat,
  editStatus,
  setEditStatus,
  editCurrentPage,
  setEditCurrentPage,
  editTotalPages,
  setEditTotalPages,
  editProgress,
  setEditProgress,
  formatOptions,
  statusOptions,
}: EditBookModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-[4px] transition-opacity"
      />
      <div className="w-full max-w-md bg-card border border-border/30 rounded-2xl p-6 shadow-2xl relative z-10 glass-panel overflow-hidden animate-scale-up">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/10 mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">edit</span>
            <h3 className="font-heading font-bold text-lg">Edit Book Details</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Title</label>
            <input 
              type="text" 
              required
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-4 py-2 border border-border/40 rounded-lg bg-background/50 focus:outline-none focus:border-primary/80 text-sm h-10 transition-colors"
              placeholder="Title"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Author</label>
            <input 
              type="text" 
              value={editAuthor}
              onChange={(e) => setEditAuthor(e.target.value)}
              className="w-full px-4 py-2 border border-border/40 rounded-lg bg-background/50 focus:outline-none focus:border-primary/80 text-sm h-10 transition-colors"
              placeholder="Author"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Format</label>
              <FancyDropdown
                value={editFormat}
                onChange={(nextValue) => setEditFormat(nextValue as any)}
                placeholder="EPUB"
                ariaLabel="Select book format"
                className="w-full"
                triggerClassName="flex h-10 w-full items-center justify-between gap-3 rounded-lg border border-border/40 bg-background/50 px-3 text-left text-xs font-mono text-foreground shadow-sm transition-all hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                options={formatOptions}
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Status</label>
              <FancyDropdown
                value={editStatus}
                onChange={(nextValue) => setEditStatus(nextValue as any)}
                placeholder="Active"
                ariaLabel="Select book status"
                className="w-full"
                triggerClassName="flex h-10 w-full items-center justify-between gap-3 rounded-lg border border-border/40 bg-background/50 px-3 text-left text-xs font-mono text-foreground shadow-sm transition-all hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                options={statusOptions}
              />
            </div>
          </div>

          {editFormat === "PHYSICAL" ? (
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Current Page</label>
                <input 
                  type="number" 
                  min="0"
                  value={editCurrentPage}
                  onChange={(e) => setEditCurrentPage(e.target.value ? Number(e.target.value) : "")}
                  className="w-full px-4 py-2 border border-border/40 rounded-lg bg-background/50 focus:outline-none focus:border-primary/80 text-sm h-10 transition-colors"
                  placeholder="e.g., 45"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Total Pages</label>
                <input 
                  type="number" 
                  min="1"
                  value={editTotalPages}
                  onChange={(e) => setEditTotalPages(e.target.value ? Number(e.target.value) : "")}
                  className="w-full px-4 py-2 border border-border/40 rounded-lg bg-background/50 focus:outline-none focus:border-primary/80 text-sm h-10 transition-colors"
                  placeholder="e.g., 300"
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Progress</label>
                <span className="text-xs font-mono text-primary font-bold">{editProgress}%</span>
              </div>
              <input 
                type="range"
                min="0"
                max="100"
                value={editProgress}
                onChange={(e) => {
                  const progressVal = Number(e.target.value);
                  setEditProgress(progressVal);
                  
                  if (progressVal === 100) {
                    setEditStatus("completed");
                  } else if (progressVal < 100 && editStatus === "completed") {
                    setEditStatus("active");
                  }
                }}
                className="w-full accent-primary h-1 bg-border/40 rounded-lg appearance-none cursor-pointer my-2"
              />
            </div>
          )}

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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
