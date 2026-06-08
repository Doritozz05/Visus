"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { BookVisualPage } from "@/lib/parser/paginator";

interface PagesFooterProps {
  isPaginationReady: boolean;
  currentPageIndex: number;
  currentChapterIndex: number;
  globalPageDetails: { current: number; total: number };
  allBookPages: BookVisualPage[];
  showPrevChapter: boolean;
  showNextChapter: boolean;
  showCompleteBook: boolean;
  handlePrev: () => void;
  handleNext: () => void;
  setActiveChapterIndex: (index: number) => void;
  setWordIndex: (w: number) => void;
}

export function PagesFooter({
  isPaginationReady,
  currentPageIndex,
  currentChapterIndex,
  globalPageDetails,
  allBookPages,
  showPrevChapter,
  showNextChapter,
  showCompleteBook,
  handlePrev,
  handleNext,
  setActiveChapterIndex,
  setWordIndex,
}: PagesFooterProps) {
  return (
    <div className="h-12 min-h-[48px] max-h-[48px] flex justify-between items-center pt-3 border-t border-border/10 mt-1 text-xs font-mono text-muted-foreground relative shrink-0">
      <button
        data-testid="prev-page-button"
        onClick={handlePrev}
        disabled={!isPaginationReady || (currentPageIndex === 0 && currentChapterIndex === 0)}
        className="flex items-center gap-1.5 hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none z-20"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        {showPrevChapter ? "Previous Chapter" : "Previous Page"}
      </button>

      {/* Page indicator & Slider */}
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
        <div className="text-[10px] tracking-wider uppercase font-semibold text-muted-foreground/60 pointer-events-none leading-none">
          Page {globalPageDetails.current} of {globalPageDetails.total}
        </div>
        {allBookPages.length > 0 && (
          <input
            type="range"
            min="1"
            max={globalPageDetails.total}
            value={globalPageDetails.current}
            disabled={!isPaginationReady}
            onChange={(e) => {
              const targetPageNum = Number(e.target.value);
              const targetPage = allBookPages.find(p => p.absolutePageIndex === targetPageNum - 1);
              if (targetPage) {
                if (targetPage.chapterIndex !== currentChapterIndex) {
                  setActiveChapterIndex(targetPage.chapterIndex);
                }
                setWordIndex(targetPage.startWordIndex);
              }
            }}
            className="w-32 accent-primary h-1 bg-border/40 hover:bg-border/60 rounded-lg appearance-none cursor-pointer transition-colors z-30 disabled:opacity-30 disabled:pointer-events-none"
            title={`Page ${globalPageDetails.current} of ${globalPageDetails.total}`}
          />
        )}
      </div>

      <button
        data-testid="next-page-button"
        onClick={handleNext}
        disabled={!isPaginationReady}
        className={`flex items-center gap-1.5 transition-all z-20 hover:text-primary disabled:opacity-30 disabled:pointer-events-none ${
          showCompleteBook
            ? "text-primary font-extrabold bg-primary/10 border border-primary/30 px-3 py-1 rounded hover:bg-primary hover:text-primary-foreground shadow-md shadow-primary/10"
            : ""
        }`}
      >
        {showCompleteBook ? (
          <>
            Complete Book
            <CheckCircle className="h-4 w-4" />
          </>
        ) : (
          <>
            {showNextChapter ? "Next Chapter" : "Next Page"}
            <ChevronRight className="h-3.5 w-3.5" />
          </>
        )}
      </button>
    </div>
  );
}
