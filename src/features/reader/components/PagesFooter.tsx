"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { BookVisualPage } from "@/lib/parser/paginator";

interface PagesFooterProps {
  isPaginationReady: boolean;
  isFullPaginationReady: boolean;
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
  isFullPaginationReady,
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
        className="flex items-center gap-1 hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none z-20 text-xs sm:text-sm"
      >
        <ChevronLeft className="h-3.5 w-3.5 shrink-0" />
        <span className="hidden sm:inline">{showPrevChapter ? "Previous Chapter" : "Previous Page"}</span>
        <span className="inline sm:hidden">{showPrevChapter ? "Prev. Ch." : "Prev"}</span>
      </button>

      {/* Page indicator & Slider */}
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 min-w-[100px] sm:min-w-[120px]">
        {!isFullPaginationReady ? (
          <div className="text-[10px] tracking-wider uppercase font-semibold text-muted-foreground/50 animate-pulse pointer-events-none leading-none py-2">
            Calculating pages...
          </div>
        ) : (
          <>
            <div className="text-[9px] sm:text-[10px] tracking-wider uppercase font-semibold text-muted-foreground/60 pointer-events-none leading-none">
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
                  let targetPage = allBookPages[targetPageNum - 1];
                  if (!targetPage || targetPage.absolutePageIndex !== targetPageNum - 1) {
                    targetPage = allBookPages.find((p) => p.absolutePageIndex === targetPageNum - 1) as BookVisualPage;
                  }
                  if (targetPage) {
                    if (targetPage.chapterIndex !== currentChapterIndex) {
                      setActiveChapterIndex(targetPage.chapterIndex);
                    }
                    setWordIndex(targetPage.startWordIndex);
                  }
                }}
                className="w-20 sm:w-32 accent-primary h-1 bg-border/40 hover:bg-border/60 rounded-lg appearance-none cursor-pointer transition-colors z-30 disabled:opacity-30 disabled:pointer-events-none"
                title={`Page ${globalPageDetails.current} of ${globalPageDetails.total}`}
              />
            )}
          </>
        )}
      </div>

      <button
        data-testid="next-page-button"
        onClick={handleNext}
        disabled={!isPaginationReady}
        className={`flex items-center gap-1 transition-all z-20 hover:text-primary disabled:opacity-30 disabled:pointer-events-none text-xs sm:text-sm ${
          showCompleteBook
            ? "text-primary font-extrabold bg-primary/10 border border-primary/30 px-2 py-0.5 sm:px-3 sm:py-1 rounded hover:bg-primary hover:text-primary-foreground shadow-md shadow-primary/10"
            : ""
        }`}
      >
        {showCompleteBook ? (
          <>
            <span className="hidden sm:inline">Complete Book</span>
            <span className="inline sm:hidden">Complete</span>
            <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
          </>
        ) : (
          <>
            <span className="hidden sm:inline">{showNextChapter ? "Next Chapter" : "Next Page"}</span>
            <span className="inline sm:hidden">{showNextChapter ? "Next Ch." : "Next"}</span>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          </>
        )}
      </button>
    </div>
  );
}
