"use client";

import * as React from "react";
import { Book, Bookmark } from "@/core/entities/book";
import { TableOfContents } from "./TableOfContents";
import { useReadingStore } from "../stores/reading-store";
import { motion } from "framer-motion";
import { FancyTabs } from "@/components/ui/FancyTabs";
import { FancyDropdown } from "@/components/ui/FancyDropdown";
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
  Timer,
  BookOpen,
  Zap,
  Layers
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

  const modeOptions = React.useMemo(() => [
    { value: "normal", label: "Reader", description: "Traditional page reading", icon: <BookOpen className="w-4 h-4 text-primary" /> },
    { value: "rsvp", label: "RSVP", description: "One word at a time", icon: <Zap className="w-4 h-4 text-amber-500" /> },
    { value: "cluster", label: "Cluster", description: "Visual word groupings", icon: <Layers className="w-4 h-4 text-emerald-500" /> },
  ], []);

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

  const leftControls = (
    <div className="flex items-center justify-start gap-1 md:gap-1.5 min-w-0 flex-1">
      <button
        onClick={() => setActiveBookId(null)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/40 hover:bg-accent text-xs font-mono text-muted-foreground hover:text-primary transition-all shrink-0 shadow-sm liquid-glass cursor-pointer"
        title="Back to library bookshelf"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Bookshelf</span>
      </button>

      {/* Vertical divider */}
      <div className="h-4 w-px bg-border/20 mx-1 shrink-0 hidden sm:block" />

      {/* Layout Utilities (Glued next to bookshelf) */}
      <button
        onClick={toggleFullscreen}
        className="hidden sm:flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground hover:bg-accent/70 hover:text-primary transition-all cursor-pointer select-none shrink-0"
        title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
      </button>
      <button
        onClick={() => setIsFocusMode(true)}
        className="hidden sm:flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground hover:bg-accent/70 hover:text-primary transition-all cursor-pointer select-none shrink-0"
        title="Enter focus mode"
      >
        <EyeOff className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  const rightControls = (
    <div className="flex items-center justify-end gap-1.5 sm:gap-2 flex-1">
      {/* Mode Selector Dropdown */}
      <div className="shrink-0">
        <FancyDropdown
          value={mode}
          onChange={(val) => {
            if (val === "normal") {
              setIsPlaying(false);
              setMode("normal");
            } else {
              setMode(val as any);
              setCompletedChapter(null);
            }
          }}
          options={modeOptions}
          placeholder="Select mode"
          ariaLabel="Select reading mode"
          triggerClassName="group flex h-8 items-center justify-center gap-1 rounded-lg border border-border/40 bg-card px-2 text-xs font-mono font-bold text-foreground shadow-sm transition-all hover:border-primary/50 hover:bg-accent focus:outline-none liquid-glass cursor-pointer shrink-0"
          menuClassName="min-w-[200px] max-w-[260px] overflow-hidden rounded-2xl border border-border/40 bg-card shadow-[0_24px_70px_rgba(0,0,0,0.22)] liquid-glass"
          align="end"
          renderTrigger={(selectedOption, isOpen) => (
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                {selectedOption?.icon}
              </span>
              <span className="hidden sm:inline text-[10px] uppercase tracking-wider font-semibold pr-1">
                {selectedOption?.label}
              </span>
              <ChevronDown className={`h-3 w-3 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </div>
          )}
        />
      </div>

      {/* Pomodoro Timer Toggle (Tablet / Desktop only) */}
      <button
        onClick={() => setIsPomodoroOpen?.(!isPomodoroOpen)}
        className={`hidden sm:flex items-center justify-center w-8 h-8 rounded-lg border border-border/40 transition-all shrink-0 shadow-sm liquid-glass cursor-pointer ${
          isPomodoroOpen
            ? "bg-primary text-primary-foreground shadow-[0_0_10px_rgba(var(--primary),0.2)]"
            : "hover:bg-accent text-muted-foreground hover:text-primary"
        }`}
        title="Toggle Pomodoro timer"
      >
        <Timer className="w-4 h-4" />
      </button>

      {/* Quick Settings Trigger */}
      <button
        data-testid="desktop-settings-button"
        onClick={openQuickSettings}
        className="flex items-center justify-center w-8 h-8 rounded-lg border border-border/40 hover:bg-accent text-muted-foreground hover:text-primary transition-all shrink-0 shadow-sm liquid-glass cursor-pointer"
        title="Open settings"
      >
        <Settings className="w-4 h-4 animate-spin-slow" />
      </button>
    </div>
  );

  return (
    <div className={`w-full flex items-center justify-between px-2 md:px-8 z-30 border-b border-border/10 h-14 sm:h-20 gap-1 md:gap-4 transition-all duration-300 glass-surface relative ${isFocusMode ? 'opacity-0 h-0 overflow-hidden py-0 border-0 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Left controls */}
      {leftControls}

      {/* Center: Title & Chapter Selector */}
      <div className="flex flex-col items-center justify-center min-w-0 flex-1 gap-0.5">
        {/* Book Title (Centered above chapter) */}
        <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-muted-foreground dark:text-foreground/75 font-bold truncate max-w-[120px] xs:max-w-[160px] sm:max-w-[220px] md:max-w-[280px]">
          {activeBook.title}
        </span>

        {/* Chapter Switcher Row */}
        <div className="flex items-center justify-center gap-0.5 w-full">
          <button
            onClick={() => {
              if (activeChapterIndex > 0) {
                setActiveChapterIndex(activeChapterIndex - 1);
              }
            }}
            disabled={activeChapterIndex === 0}
            className="w-6 h-6 rounded border border-border/30 hover:bg-accent text-muted-foreground hover:text-primary transition-all flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none liquid-glass cursor-pointer"
            title="Previous chapter"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Clickable Chapter Badge */}
          <button
            ref={chapterBtnRef}
            onClick={handleToggleToc}
            className="text-[10px] sm:text-xs text-primary/80 hover:text-primary font-semibold bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/45 px-2 py-0.5 rounded flex items-center gap-1 transition-all truncate max-w-[90px] xs:max-w-[140px] sm:max-w-[180px] md:max-w-[220px] liquid-glass cursor-pointer"
            title="Open table of contents / chapter index"
          >
            <span className="truncate">{currentChapter.title}</span>
            {isTocOpen ? <ChevronUp className="w-3 h-3 shrink-0" /> : <ChevronDown className="w-3 h-3 shrink-0" />}
          </button>

          <button
            onClick={() => {
              if (activeChapterIndex < chaptersData.length - 1) {
                setActiveChapterIndex(activeChapterIndex + 1);
              }
            }}
            disabled={activeChapterIndex === chaptersData.length - 1}
            className="w-6 h-6 rounded border border-border/30 hover:bg-accent text-muted-foreground hover:text-primary transition-all flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none liquid-glass cursor-pointer"
            title="Next chapter"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Progress Bar & Percentage (Tablet & Desktop only) */}
        <div className="hidden sm:flex flex-col items-center mt-1.5 w-full">
          <div className="w-36 sm:w-48 h-1.5 bg-muted dark:bg-card/90 rounded-full overflow-hidden border border-border/40 dark:border-border/20 shadow-inner">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-muted-foreground/90 dark:text-muted-foreground font-semibold mt-1">
            {progressPercentage}% complete
          </span>
        </div>
      </div>

      {/* Right controls */}
      {rightControls}

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
