"use client";

import * as React from "react";
import { Book, Bookmark } from "@/core/entities/book";
import { TableOfContents } from "./TableOfContents";

interface ChapterItem {
  title: string;
}

interface ReaderHeaderProps {
  activeBook: Book;
  currentChapter: ChapterItem;
  activeChapterIndex: number;
  setActiveChapterIndex: (index: number) => void;
  chaptersData: ChapterItem[];
  setWordIndex: (index: number) => void;
  progressPercentage: number;
  mode: "rsvp" | "cluster" | "normal";
  setMode: (mode: "rsvp" | "cluster" | "normal") => void;
  setIsPlaying: (playing: boolean) => void;
  setCompletedChapter: (chapter: string | null) => void;
  openQuickSettings: () => void;
  setActiveBookId: (id: string | null) => void;
  isTocOpen: boolean;
  setIsTocOpen: (open: boolean) => void;
  bookmarks: Bookmark[];
  onGoToBookmark: (chapterIndex: number, wordIndex: number) => void;
  onDeleteBookmark: (id: string) => void;
}

export function ReaderHeader({
  activeBook,
  currentChapter,
  activeChapterIndex,
  setActiveChapterIndex,
  chaptersData,
  setWordIndex,
  progressPercentage,
  mode,
  setMode,
  setIsPlaying,
  setCompletedChapter,
  openQuickSettings,
  setActiveBookId,
  isTocOpen,
  setIsTocOpen,
  bookmarks,
  onGoToBookmark,
  onDeleteBookmark,
}: ReaderHeaderProps) {
  const chapterBtnRef = React.useRef<HTMLButtonElement>(null);
  const [anchorPos, setAnchorPos] = React.useState<{ x: number; y: number } | null>(null);

  const handleToggleToc = () => {
    if (!isTocOpen && chapterBtnRef.current) {
      const r = chapterBtnRef.current.getBoundingClientRect();
      setAnchorPos({ x: r.left + r.width / 2, y: r.bottom });
    }
    setIsTocOpen(!isTocOpen);
  };

  return (
    <div className="absolute top-8 left-0 md:left-64 right-0 flex items-center justify-between px-6 md:px-8 z-30 border-b border-border/10 pb-4 gap-4 bg-background/95 backdrop-blur-sm">
      {/* Left: Back to Bookshelf */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setActiveBookId(null)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/40 bg-card hover:bg-accent text-xs font-mono text-muted-foreground hover:text-primary transition-all shrink-0 shadow-sm"
          title="Change book or back to selection list"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span className="hidden sm:inline">Bookshelf</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center pointer-events-auto min-w-0 relative">
        <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground dark:text-foreground/75 font-bold truncate max-w-[200px] sm:max-w-xs">
          {activeBook.title}
        </h2>
        <div className="flex items-center gap-1.5 mt-1.5 shrink-0 pointer-events-auto">
          <button
            onClick={() => {
              if (activeChapterIndex > 0) {
                setActiveChapterIndex(activeChapterIndex - 1);
                setWordIndex(0);
              }
            }}
            disabled={activeChapterIndex === 0}
            className="w-5 h-5 rounded border border-border/30 bg-card hover:bg-accent text-muted-foreground hover:text-primary transition-all flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none"
            title="Previous chapter"
          >
            <span className="material-symbols-outlined text-[12px] font-bold">chevron_left</span>
          </button>

          {/* Clickable Chapter Badge */}
          <button
            ref={chapterBtnRef}
            onClick={handleToggleToc}
            className="text-xs text-primary/80 hover:text-primary font-semibold bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/45 px-2.5 py-0.5 rounded flex items-center gap-1 transition-all truncate max-w-[120px] sm:max-w-[200px]"
            title="Open table of contents / chapter index"
          >
            <span className="truncate">{currentChapter.title}</span>
            <span className="material-symbols-outlined text-[14px] shrink-0 leading-none">
              {isTocOpen ? "expand_less" : "expand_more"}
            </span>
          </button>

          <button
            onClick={() => {
              if (activeChapterIndex < chaptersData.length - 1) {
                setActiveChapterIndex(activeChapterIndex + 1);
                setWordIndex(0);
              }
            }}
            disabled={activeChapterIndex === chaptersData.length - 1}
            className="w-5 h-5 rounded border border-border/30 bg-card hover:bg-accent text-muted-foreground hover:text-primary transition-all flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none"
            title="Next chapter"
          >
            <span className="material-symbols-outlined text-[12px] font-bold">chevron_right</span>
          </button>
        </div>
        <div className="w-48 h-1.5 bg-muted dark:bg-card/90 mt-2.5 rounded-full overflow-hidden border border-border/40 dark:border-border/20 shadow-inner">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <span className="text-[10px] font-mono text-muted-foreground/90 dark:text-muted-foreground font-semibold mt-1">
          {progressPercentage}% complete
        </span>
      </div>

      <div className="hidden md:flex items-center gap-3 shrink-0">
        {/* Triple Mode Switcher */}
        <div className="bg-card border border-border/30 p-1 rounded-lg flex items-center shadow-sm">
          <button
            onClick={() => {
              setIsPlaying(false);
              setMode("normal");
            }}
            className={`px-3 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition-all ${
              mode === "normal"
                ? "bg-accent text-primary font-bold shadow-sm"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            Pages
          </button>
          <button
            onClick={() => {
              setMode("rsvp");
              setCompletedChapter(null);
            }}
            className={`px-3 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition-all ${
              mode === "rsvp"
                ? "bg-accent text-primary font-bold shadow-sm"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            RSVP
          </button>
          <button
            onClick={() => {
              setMode("cluster");
              setCompletedChapter(null);
            }}
            className={`px-3 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition-all ${
              mode === "cluster"
                ? "bg-accent text-primary font-bold shadow-sm"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            Cluster
          </button>
        </div>

        {/* Quick Settings Trigger (Desktop) */}
        <button
          data-testid="desktop-settings-button"
          onClick={openQuickSettings}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/40 bg-card hover:bg-accent text-xs font-mono text-muted-foreground hover:text-primary transition-all shrink-0 shadow-sm"
        >
          <span className="material-symbols-outlined text-base animate-spin-slow">settings</span>
          Settings
        </button>
      </div>

      {/* Table of Contents — anchored precisely to the chapter badge button */}
      <TableOfContents
        isTocOpen={isTocOpen}
        setIsTocOpen={setIsTocOpen}
        chaptersData={chaptersData}
        activeChapterIndex={activeChapterIndex}
        setActiveChapterIndex={setActiveChapterIndex}
        setWordIndex={setWordIndex}
        bookmarks={bookmarks}
        onGoToBookmark={onGoToBookmark}
        onDeleteBookmark={onDeleteBookmark}
        anchorX={anchorPos?.x}
        anchorY={anchorPos?.y}
      />
    </div>
  );
}

