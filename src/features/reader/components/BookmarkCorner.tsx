"use client";

import * as React from "react";
import { Bookmark } from "@/core/entities/book";

interface BookmarkCornerProps {
  bookmarks: Bookmark[];
  currentChapterIndex: number;
  currentWordIndex: number;
  chapterTitle: string;
  defaultName: string;
  activeBookmark: Bookmark | null;
  onAddBookmark: (name: string) => void;
  onRemoveBookmark: (id: string) => void;
  onUpdateBookmarkName: (id: string, name: string) => void;
}

export function BookmarkCorner({
  bookmarks,
  currentChapterIndex,
  currentWordIndex,
  chapterTitle,
  defaultName,
  activeBookmark,
  onAddBookmark,
  onRemoveBookmark,
  onUpdateBookmarkName,
}: BookmarkCornerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [nameInput, setNameInput] = React.useState("");

  // Sync input name when active bookmark changes or popover opens
  React.useEffect(() => {
    if (activeBookmark) {
      setNameInput(activeBookmark.name);
    } else {
      setNameInput(defaultName);
    }
  }, [activeBookmark, defaultName, isOpen]);

  const handleTogglePopover = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = nameInput.trim() || defaultName;
    if (activeBookmark) {
      onUpdateBookmarkName(activeBookmark.id, finalName);
    } else {
      onAddBookmark(finalName);
    }
    setIsOpen(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeBookmark) {
      onRemoveBookmark(activeBookmark.id);
    }
    setIsOpen(false);
  };

  return (
    <div className="absolute top-0 right-8 z-30 flex flex-col items-end">
      <button
        onClick={handleTogglePopover}
        className="group relative focus:outline-none"
        title={activeBookmark ? "Edit bookmark" : "Add bookmark"}
      >
        <svg
          width="22"
          height="34"
          viewBox="0 0 22 34"
          className={`transition-all duration-300 transform gpu origin-top group-hover:scale-y-110 will-change-transform ${
            activeBookmark
              ? "fill-primary text-primary stroke-primary/30 drop-shadow-[0_2px_4px_hsl(var(--primary)/0.3)]"
              : "fill-muted-foreground/15 text-muted-foreground/15 stroke-muted-foreground/35 hover:fill-muted-foreground/35 hover:stroke-muted-foreground/50"
          }`}
        >
          <path d="M0.5 0 H21.5 V29.5 L11 22.5 L0.5 29.5 Z" strokeWidth="1" />
        </svg>

        {/* Small dot inside active bookmark to make it feel extra premium */}
        {activeBookmark && (
          <span className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary-foreground rounded-full opacity-80 animate-pulse" />
        )}
      </button>

      {/* Popover overlay dropdown */}
      {isOpen && (
        <>
          {/* Click-outside backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-transparent"
          />

          <form
            onSubmit={handleSave}
            className="absolute top-9 right-0 w-64 bg-card border border-border/40 shadow-2xl rounded-xl p-3 z-50 animate-fade-in flex flex-col gap-2.5 pointer-events-auto"
          >
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold border-b border-border/10 pb-1.5 shrink-0 select-none">
              {activeBookmark ? "Edit bookmark" : "Add bookmark"}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="bookmark-name-input" className="text-[9px] font-mono uppercase tracking-wide text-muted-foreground/70">
                Bookmark name
              </label>
              <input
                id="bookmark-name-input"
                type="text"
                autoFocus
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder={defaultName}
                className="w-full bg-accent/40 border border-border/30 rounded px-2 py-1.5 text-xs text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 justify-end mt-1 shrink-0">
              {activeBookmark && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="mr-auto text-[10px] font-mono uppercase tracking-wider text-destructive hover:text-destructive-hover transition-colors font-bold px-1 py-1 rounded"
                >
                  Remove
                </button>
              )}
              
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-accent border border-border/20 rounded transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-primary text-primary-foreground text-[10px] font-mono uppercase tracking-wider font-bold rounded shadow-sm hover:brightness-110 transition-all"
              >
                Save
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
