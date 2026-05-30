"use client";

import * as React from "react";

interface VisualPage {
  pageIndex: number;
  chapterIndex: number;
  absolutePageIndex: number;
  startWordIndex: number;
  endWordIndex: number;
  leftColumn: string;
  rightColumn: string;
}

interface ChapterData {
  title: string;
}

interface PagesVisualBoxProps {
  currentChapter: ChapterData;
  activePage: VisualPage | null;
  allBookPages: VisualPage[];
  readerFontClass: string;
  fontSize: number;
  handlePageChange: (direction: "prev" | "next") => void;
}

export function PagesVisualBox({
  currentChapter,
  activePage,
  allBookPages,
  readerFontClass,
  fontSize,
  handlePageChange,
}: PagesVisualBoxProps) {
  return (
    <div className="w-full bg-card/65 dark:bg-card/45 border border-border/20 rounded-2xl p-5 md:px-8 md:py-6 pb-4 md:pb-6 shadow-2xl glass-panel relative overflow-hidden transition-all duration-500 flex flex-col h-[660px] min-h-[660px] max-h-[660px]">
      {/* Book spine simulation in the middle (Desktop only) */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border/20 to-transparent z-10"></div>
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-8 bg-gradient-to-r from-black/5 via-transparent to-black/5 dark:from-black/15 dark:via-transparent dark:to-black/15 -ml-4 pointer-events-none z-10"></div>

      {/* Page Header (Adjusted to items-start to support vertical wrapping gracefully) */}
      <div className="flex justify-between items-start gap-4 text-[10px] font-mono tracking-widest text-muted-foreground uppercase pb-4 border-b border-border/10 mb-4 shrink-0">
        <span className="shrink-0">Visus Reader &bull; Pro</span>
        <span className="text-primary font-bold text-right break-words whitespace-normal max-w-[70%] leading-normal tracking-wide">
          {currentChapter.title}
        </span>
      </div>

      {/* Two-Column Page Content */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 text-foreground select-none relative overflow-hidden">
        {/* Left Page Column */}
        <div className="flex flex-col justify-start p-1 md:px-2 md:py-0 transition-all duration-300">
          {activePage?.pageIndex === 0 && (
            <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-primary border-b border-border/10 pb-3 mb-4 uppercase tracking-wide leading-tight break-words whitespace-normal shrink-0">
              {currentChapter.title}
            </h1>
          )}
          <p
            className={`${readerFontClass} whitespace-pre-wrap leading-relaxed`}
            style={{ fontSize: `${fontSize}px` }}
          >
            {activePage?.leftColumn || ""}
          </p>
        </div>

        {/* Right Page Column */}
        <div className="flex flex-col justify-start p-1 md:px-2 md:py-0 transition-all duration-300">
          <p
            className={`${readerFontClass} whitespace-pre-wrap leading-relaxed`}
            style={{ fontSize: `${fontSize}px` }}
          >
            {activePage?.rightColumn || ""}
          </p>
        </div>
      </div>

      {/* Page Footer Navigation */}
      <div className="flex justify-between items-center pt-3 border-t border-border/10 mt-3 text-xs font-mono text-muted-foreground relative shrink-0">
        <button
          onClick={() => handlePageChange("prev")}
          disabled={activePage ? activePage.absolutePageIndex === 0 : true}
          className="flex items-center gap-1.5 hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none z-20"
        >
          <span className="material-symbols-outlined text-sm">arrow_back_ios</span>
          Previous
        </button>

        {/* Left Page Number absolute (visible on desktop) */}
        <div className="absolute left-[20%] -translate-x-1/2 hidden lg:block text-[10px] tracking-wider uppercase font-semibold text-muted-foreground/60">
          Page {activePage ? activePage.absolutePageIndex * 2 + 1 : 1}
        </div>

        {/* Right Page Number absolute (visible on desktop) */}
        <div className="absolute left-[80%] -translate-x-1/2 hidden lg:block text-[10px] tracking-wider uppercase font-semibold text-muted-foreground/60">
          Page {activePage ? activePage.absolutePageIndex * 2 + 2 : 2}
        </div>

        <button
          onClick={() => handlePageChange("next")}
          disabled={activePage ? activePage.absolutePageIndex === allBookPages.length - 1 : true}
          className="flex items-center gap-1.5 hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none z-20"
        >
          Next
          <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
        </button>
      </div>
    </div>
  );
}
