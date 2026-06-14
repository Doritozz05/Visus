"use client";

import * as React from "react";
import { Book, Bookmark } from "@/core/entities/book";
import { TableOfContents } from "./TableOfContents";
import { useReadingStore } from "../stores/reading-store";
import { motion } from "framer-motion";
import { FancyTabs } from "@/components/ui/FancyTabs";
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp, 
  ChevronDown, 
  Settings,
  Maximize,
  Minimize,
  Eye,
  EyeOff,
  Timer
} from "lucide-react";

interface ChapterItem {
  title: string;
}

interface ReaderHeaderProps {
  activeBook: Book;
  setActiveChapterIndex: (index: number) => void;
  chaptersData: ChapterItem[];
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
  isPomodoroOpen?: boolean;
  setIsPomodoroOpen?: (open: boolean) => void;
}

export function ReaderHeader({
  activeBook,
  setActiveChapterIndex,
  chaptersData,
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
  isPomodoroOpen = false,
  setIsPomodoroOpen,
}: ReaderHeaderProps) {
  const chapterBtnRef = React.useRef<HTMLButtonElement>(null);
  const [anchorPos, setAnchorPos] = React.useState<{ x: number; y: number } | null>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  // Subscribe atomically to Zustand store properties
  const activeChapterIndex = useReadingStore((state) => state.activeChapterIndex);
  const progressPercentage = useReadingStore((state) => state.progressPercentage);
  const mode = useReadingStore((state) => state.mode);
  const isFocusMode = useReadingStore((state) => state.isFocusMode);
  const setIsFocusMode = useReadingStore((state) => state.setIsFocusMode);

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const currentChapter = React.useMemo(() => {
    const safeIdx = Math.min(Math.max(0, activeChapterIndex), chaptersData.length - 1);
    return chaptersData[safeIdx] || { title: "No Book Loaded" };
  }, [chaptersData, activeChapterIndex]);

  const handleToggleToc = () => {
    if (!isTocOpen && chapterBtnRef.current) {
      const r = chapterBtnRef.current.getBoundingClientRect();
      setAnchorPos({ x: r.left + r.width / 2, y: r.bottom });
    }
    setIsTocOpen(!isTocOpen);
  };

  return (
    <div className={`w-full grid grid-cols-3 items-center px-6 md:px-8 z-30 border-b border-border/10 pb-4 gap-4 transition-all duration-300 glass-surface ${isFocusMode ? 'opacity-0 h-0 overflow-hidden py-0 border-0 pointer-events-none' : 'opacity-100'}`}>
      {/* Left: Back to Bookshelf & Tools */}
      <div className="flex items-center justify-start gap-2 min-w-0">
        <button
          onClick={() => setActiveBookId(null)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/40 hover:bg-accent text-xs font-mono text-muted-foreground hover:text-primary transition-all shrink-0 shadow-sm liquid-glass"
          title="Change book or back to selection list"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Bookshelf</span>
        </button>

        <div className="h-4 w-px bg-border/20 mx-1 hidden sm:block" />

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-border/40 hover:bg-accent text-muted-foreground hover:text-primary transition-all shrink-0 shadow-sm liquid-glass"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>

        {/* Focus Mode Toggle */}
        <button
          onClick={() => setIsFocusMode(true)}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-border/40 hover:bg-accent text-muted-foreground hover:text-primary transition-all shrink-0 shadow-sm liquid-glass"
          title="Enter Focus Mode"
        >
          <EyeOff className="w-4 h-4" />
        </button>
      </div>

      {/* Center: Title & Progress */}
      <div className="flex flex-col items-center justify-center min-w-0">
        <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground dark:text-foreground/75 font-bold truncate max-w-[140px] sm:max-w-xs">
          {activeBook.title}
        </h2>
        <div className="flex items-center gap-1.5 mt-1.5 shrink-0">
          <button
            onClick={() => {
              if (activeChapterIndex > 0) {
                setActiveChapterIndex(activeChapterIndex - 1);
              }
            }}
            disabled={activeChapterIndex === 0}
            className="w-5 h-5 rounded border border-border/30 hover:bg-accent text-muted-foreground hover:text-primary transition-all flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none liquid-glass"
            title="Previous chapter"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Clickable Chapter Badge */}
          <button
            ref={chapterBtnRef}
            onClick={handleToggleToc}
            className="text-xs text-primary/80 hover:text-primary font-semibold bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/45 px-2.5 py-0.5 rounded flex items-center gap-1 transition-all truncate max-w-[110px] sm:max-w-[180px] liquid-glass"
            title="Open table of contents / chapter index"
          >
            <span className="truncate">{currentChapter.title}</span>
            {isTocOpen ? <ChevronUp className="w-3.5 h-3.5 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 shrink-0" />}
          </button>

          <button
            onClick={() => {
              if (activeChapterIndex < chaptersData.length - 1) {
                setActiveChapterIndex(activeChapterIndex + 1);
              }
            }}
            disabled={activeChapterIndex === chaptersData.length - 1}
            className="w-5 h-5 rounded border border-border/30 hover:bg-accent text-muted-foreground hover:text-primary transition-all flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none liquid-glass"
            title="Next chapter"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="w-36 sm:w-48 h-1.5 bg-muted dark:bg-card/90 mt-2.5 rounded-full overflow-hidden border border-border/40 dark:border-border/20 shadow-inner">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <span className="text-[10px] font-mono text-muted-foreground/90 dark:text-muted-foreground font-semibold mt-1">
          {progressPercentage}% complete
        </span>
      </div>

      {/* Right: Mode selector & Settings */}
      <div className="flex items-center justify-end gap-3 min-w-0">
        {/* Triple Mode Switcher */}
        <FancyTabs
          tabs={[
            { id: "normal", label: "Reader" },
            { id: "rsvp", label: "RSVP" },
            { id: "cluster", label: "Cluster" }
          ]}
          activeTab={mode}
          onChange={(id) => {
            if (id === "normal") {
              setIsPlaying(false);
              setMode("normal");
            } else {
              setMode(id as any);
              setCompletedChapter(null);
            }
          }}
          layoutId="active-reader-mode"
          variant="pill"
          className="hidden md:flex liquid-glass"
        />

        {/* Pomodoro Timer Toggle */}
        <button
          onClick={() => setIsPomodoroOpen?.(!isPomodoroOpen)}
          className={`flex items-center justify-center w-8 h-8 rounded-lg border border-border/40 transition-all shrink-0 shadow-sm liquid-glass ${
            isPomodoroOpen
              ? "bg-primary text-primary-foreground shadow-[0_0_10px_rgba(var(--primary),0.2)]"
              : "hover:bg-accent text-muted-foreground hover:text-primary"
          }`}
          title="Toggle Pomodoro Timer"
        >
          <Timer className="w-4 h-4" />
        </button>

        {/* Quick Settings Trigger (Desktop) */}
        <button
          data-testid="desktop-settings-button"
          onClick={openQuickSettings}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/40 hover:bg-accent text-xs font-mono text-muted-foreground hover:text-primary transition-all shrink-0 shadow-sm liquid-glass"
        >
          <Settings className="w-4 h-4 animate-spin-slow" />
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
        setWordIndex={(w) => useReadingStore.getState().setWordIndex(w)}
        bookmarks={bookmarks}
        onGoToBookmark={onGoToBookmark}
        onDeleteBookmark={onDeleteBookmark}
        anchorX={anchorPos?.x}
        anchorY={anchorPos?.y}
      />
    </div>
  );
}
