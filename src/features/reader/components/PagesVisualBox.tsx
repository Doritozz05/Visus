"use client";

import * as React from "react";
import { Bookmark } from "@/core/entities/book";
import { BookmarkCorner } from "./BookmarkCorner";

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
  content: string;
  htmlContent?: string;
  index: number;
  words?: string[];
}

interface PagesVisualBoxProps {
  currentChapter: ChapterData;
  activePage: VisualPage | null;
  allBookPages: VisualPage[];
  wordIndex: number;
  setWordIndex: (w: number) => void;
  readerFontClass: string;
  fontSize: number;
  handlePageChange: (direction: "prev" | "next") => void;
  bookmarks: Bookmark[];
  onAddBookmark: (name: string, chapterIndex: number, wordIndex: number) => void;
  onRemoveBookmark: (id: string) => void;
  onUpdateBookmarkName: (id: string, name: string) => void;
}

export function PagesVisualBox({
  currentChapter,
  activePage,
  allBookPages,
  wordIndex,
  setWordIndex,
  readerFontClass,
  fontSize,
  handlePageChange,
  bookmarks,
  onAddBookmark,
  onRemoveBookmark,
  onUpdateBookmarkName,
}: PagesVisualBoxProps) {
  const columnsContainerRef = React.useRef<HTMLDivElement>(null);
  const prevChapterIndexRef = React.useRef(currentChapter.index);
  const isSyncingFromPropsRef = React.useRef(false);
  const lastTargetScrollLeftRef = React.useRef<number | null>(null);
  const lastSelfUpdatedWordIndexRef = React.useRef(-1);

  // Filter book pages to only show logical fallback pages (used as chapter offsets)
  const chapterPages = React.useMemo(() => {
    return allBookPages.filter((p) => p.chapterIndex === currentChapter.index);
  }, [allBookPages, currentChapter.index]);

  // Track the actual number of physical pages measured dynamically by the browser
  const [actualPagesCount, setActualPagesCount] = React.useState<number | null>(null);

  // Measure container layout size and actual overflow to determine physical pages
  const measurePages = React.useCallback(() => {
    const container = columnsContainerRef.current;
    if (!container) return;

    const computedStyle = window.getComputedStyle(container);
    const gap = parseFloat(computedStyle.columnGap || computedStyle.gap) || 64;
    const clientW = container.clientWidth || 1;
    const step = clientW + gap;
    const scrollW = container.scrollWidth;

    // CSS Columns overflow-x pagination calculation
    const pages = Math.max(1, Math.round((scrollW + gap) / step));
    setActualPagesCount(pages);
  }, []);

  // Monitor canvas resizing, zoom, or content shifts with Kindle-level ResizeObserver
  React.useEffect(() => {
    const container = columnsContainerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      measurePages();
    });

    resizeObserver.observe(container);
    measurePages(); // Initial measurement

    return () => {
      resizeObserver.disconnect();
    };
  }, [measurePages, currentChapter.index, fontSize, readerFontClass]);

  // Reset self-update tracker when chapter changes
  React.useEffect(() => {
    lastSelfUpdatedWordIndexRef.current = -1;
  }, [currentChapter.index]);

  // Compute HTML content to render (fallback to plain text paragraphs if no htmlContent exists)
  const htmlToRender = React.useMemo(() => {
    if (currentChapter.htmlContent) {
      return currentChapter.htmlContent;
    }
    return currentChapter.content
      .split(/\n\n+/)
      .filter((p) => p.trim() !== "")
      .map((p) => `<p class="mb-5 text-justify leading-relaxed text-foreground/90">${p.trim()}</p>`)
      .join("");
  }, [currentChapter]);

  // Generate exact physical pages by distributing words proportionally
  const dynamicChapterPages = React.useMemo(() => {
    const pagesCount = actualPagesCount || chapterPages.length || 1;
    const totalWords = currentChapter.words?.length || 0;

    const pages = [];
    for (let i = 0; i < pagesCount; i++) {
      const startWordIndex = Math.round(i * (totalWords / pagesCount));
      const endWordIndex = Math.round((i + 1) * (totalWords / pagesCount));
      pages.push({
        pageIndex: i,
        chapterIndex: currentChapter.index,
        startWordIndex,
        endWordIndex,
      });
    }
    return pages;
  }, [actualPagesCount, chapterPages.length, currentChapter.index, currentChapter.words]);

  // Find active physical page index in the current chapter
  const pageIndexInChapter = React.useMemo(() => {
    const totalWords = currentChapter.words?.length || 1;
    const pagesCount = dynamicChapterPages.length;

    // Find first physical page matching the current word index
    const idx = dynamicChapterPages.findIndex((p) => wordIndex >= p.startWordIndex && wordIndex < p.endWordIndex);
    if (idx !== -1) return idx;

    // Fallback/boundary clamping
    return Math.min(pagesCount - 1, Math.max(0, Math.floor((wordIndex / totalWords) * pagesCount)));
  }, [dynamicChapterPages, wordIndex, currentChapter.words]);

  // Sync scrollLeft instantly when active page changes
  React.useEffect(() => {
    const container = columnsContainerRef.current;
    if (!container) return;

    const computedStyle = window.getComputedStyle(container);
    const gap = parseFloat(computedStyle.columnGap || computedStyle.gap) || 64;
    const clientW = container.clientWidth || 1;
    const step = clientW + gap;
    
    let targetScroll = pageIndexInChapter * step;
    
    // Check if we just navigated to a previous chapter (so we should start at the last page)
    if (currentChapter.index < prevChapterIndexRef.current) {
      prevChapterIndexRef.current = currentChapter.index;
      const totalPagesInChapter = dynamicChapterPages.length;
      targetScroll = (totalPagesInChapter - 1) * step;
    } else {
      prevChapterIndexRef.current = currentChapter.index;
    }

    isSyncingFromPropsRef.current = true;
    lastTargetScrollLeftRef.current = targetScroll;
    container.scrollLeft = targetScroll;
    
    // Safety fallback timeout
    const timer = setTimeout(() => {
      isSyncingFromPropsRef.current = false;
    }, 150);

    return () => clearTimeout(timer);
  }, [pageIndexInChapter, currentChapter.index, dynamicChapterPages.length]);

  // Scroll listener to update page numbers and notify parent of the new word position on swipe/scroll
  React.useEffect(() => {
    const container = columnsContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentScroll = container.scrollLeft;

      // Programmatic scroll-snap ignore logic
      if (isSyncingFromPropsRef.current) {
        if (lastTargetScrollLeftRef.current !== null) {
          if (Math.abs(currentScroll - lastTargetScrollLeftRef.current) < 5) {
            isSyncingFromPropsRef.current = false;
            lastTargetScrollLeftRef.current = null;
          }
        }
        return;
      }

      const computedStyle = window.getComputedStyle(container);
      const gap = parseFloat(computedStyle.columnGap || computedStyle.gap) || 64;
      const clientW = container.clientWidth || 1;
      const step = clientW + gap;
      
      const localPageIndex = Math.round(currentScroll / step);
      
      // Safety guard against layout glitches
      if (localPageIndex < 0 || localPageIndex >= dynamicChapterPages.length) return;
      
      const targetPageObj = dynamicChapterPages[localPageIndex];
      
      if (targetPageObj && targetPageObj.startWordIndex !== wordIndex) {
        lastSelfUpdatedWordIndexRef.current = targetPageObj.startWordIndex;
        setWordIndex(targetPageObj.startWordIndex);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [dynamicChapterPages, wordIndex, setWordIndex]);

  // Recalculate snap positioning when resizing
  React.useEffect(() => {
    const container = columnsContainerRef.current;
    if (!container) return;

    const handleResize = () => {
      const computedStyle = window.getComputedStyle(container);
      const gap = parseFloat(computedStyle.columnGap || computedStyle.gap) || 64;
      const clientW = container.clientWidth || 1;
      const step = clientW + gap;
      container.scrollLeft = pageIndexInChapter * step;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pageIndexInChapter]);

  // First page of current chapter in estimated allBookPages (used to offset absolute page index)
  const firstPageInChapter = React.useMemo(() => {
    return allBookPages.find((p) => p.chapterIndex === currentChapter.index);
  }, [allBookPages, currentChapter.index]);

  // Derived absolute page metrics
  const virtualAbsolutePageIndex = React.useMemo(() => {
    const baseOffset = firstPageInChapter ? firstPageInChapter.absolutePageIndex : 0;
    return baseOffset + pageIndexInChapter;
  }, [firstPageInChapter, pageIndexInChapter]);

  const virtualTotalBookPages = React.useMemo(() => {
    let total = 0;
    let prevChIndex = -1;
    allBookPages.forEach((p) => {
      if (p.chapterIndex !== prevChIndex) {
        prevChIndex = p.chapterIndex;
        if (p.chapterIndex === currentChapter.index) {
          total += dynamicChapterPages.length;
        } else {
          const otherChPagesCount = allBookPages.filter((op) => op.chapterIndex === p.chapterIndex).length;
          total += otherChPagesCount;
        }
      }
    });
    return Math.max(1, total);
  }, [allBookPages, currentChapter.index, dynamicChapterPages.length]);

  // Bookmark positions relative to active page
  const pageStartWordIndex = React.useMemo(() => {
    const activePageObj = dynamicChapterPages[pageIndexInChapter];
    return activePageObj?.startWordIndex ?? 0;
  }, [dynamicChapterPages, pageIndexInChapter]);

  const pageEndWordIndex = React.useMemo(() => {
    const activePageObj = dynamicChapterPages[pageIndexInChapter];
    const totalWords = currentChapter.words?.length || 1;
    return activePageObj?.endWordIndex ?? totalWords;
  }, [dynamicChapterPages, pageIndexInChapter, currentChapter.words]);

  const activeBookmark = React.useMemo(() => {
    if (!bookmarks) return null;
    return (
      bookmarks.find((b) => {
        return (
          b.chapterIndex === currentChapter.index &&
          b.wordIndex >= pageStartWordIndex &&
          b.wordIndex <= pageEndWordIndex
        );
      }) || null
    );
  }, [bookmarks, currentChapter.index, pageStartWordIndex, pageEndWordIndex]);

  const defaultBookmarkName = React.useMemo(() => {
    const pageNum = virtualAbsolutePageIndex * 2 + 1;
    return `Section ${currentChapter.index + 1}, page ${pageNum}`;
  }, [currentChapter.index, virtualAbsolutePageIndex]);

  // Navigation handlers
  const handlePrevPage = () => {
    if (pageIndexInChapter > 0) {
      const prevPage = dynamicChapterPages[pageIndexInChapter - 1];
      setWordIndex(prevPage.startWordIndex);
    } else {
      handlePageChange("prev");
    }
  };

  const handleNextPage = () => {
    if (pageIndexInChapter < dynamicChapterPages.length - 1) {
      const nextPage = dynamicChapterPages[pageIndexInChapter + 1];
      setWordIndex(nextPage.startWordIndex);
    } else {
      handlePageChange("next");
    }
  };

  const isLastPageOfBook = React.useMemo(() => {
    const isLastChapter = currentChapter.index === allBookPages[allBookPages.length - 1]?.chapterIndex;
    const isLastPageOfChapter = pageIndexInChapter === dynamicChapterPages.length - 1;
    return isLastChapter && isLastPageOfChapter;
  }, [currentChapter.index, allBookPages, pageIndexInChapter, dynamicChapterPages.length]);

  return (
    <div className="w-full bg-card/65 dark:bg-card/45 border border-border/20 rounded-2xl px-5 pb-4 pt-8 md:px-8 md:pt-11 md:pb-6 shadow-2xl glass-panel relative overflow-hidden transition-all duration-500 flex flex-col h-[660px] min-h-[660px] max-h-[660px]">
      
      {/* Ribbon Bookmark Corner */}
      <BookmarkCorner
        bookmarks={bookmarks}
        currentChapterIndex={currentChapter.index}
        currentWordIndex={pageStartWordIndex}
        chapterTitle={currentChapter.title}
        defaultName={defaultBookmarkName}
        activeBookmark={activeBookmark}
        onAddBookmark={(name) => onAddBookmark(name, currentChapter.index, pageStartWordIndex)}
        onRemoveBookmark={onRemoveBookmark}
        onUpdateBookmarkName={onUpdateBookmarkName}
      />

      {/* Book spine simulation (Desktop only) */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border/20 to-transparent z-10"></div>
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-8 bg-gradient-to-r from-black/5 via-transparent to-black/5 dark:from-black/15 dark:via-transparent dark:to-black/15 -ml-4 pointer-events-none z-10"></div>

      {/* Header */}
      <div className="flex justify-between items-start gap-4 text-[10px] font-mono tracking-widest text-muted-foreground uppercase pb-4 border-b border-border/10 mb-4 shrink-0">
        <span className="shrink-0">Visus Reader &bull; Pro</span>
        <span className="text-primary font-bold text-right break-words whitespace-normal max-w-[70%] leading-normal tracking-wide">
          {currentChapter.title}
        </span>
      </div>

      {/* Dynamic Multi-Column Canvas */}
      <div className="flex-1 w-full overflow-hidden relative my-2">
        <div
          ref={columnsContainerRef}
          className={`${readerFontClass} reader-columns-canvas h-full w-full columns-1 md:columns-2 gap-16 overflow-x-auto overflow-y-hidden select-none relative scrollbar-none`}
          style={{
            columnFill: "auto",
            fontSize: `${fontSize}px`,
            lineHeight: "1.75",
          }}
          dangerouslySetInnerHTML={{ __html: htmlToRender }}
        />
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center pt-3 border-t border-border/10 mt-3 text-xs font-mono text-muted-foreground relative shrink-0">
        <button
          onClick={handlePrevPage}
          disabled={currentChapter.index === 0 && pageIndexInChapter === 0}
          className="flex items-center gap-1.5 hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none z-20"
        >
          <span className="material-symbols-outlined text-sm">arrow_back_ios</span>
          Previous
        </button>

        {/* Left Page Number absolute (Desktop only) */}
        <div className="absolute left-[20%] -translate-x-1/2 hidden lg:block text-[10px] tracking-wider uppercase font-semibold text-muted-foreground/60">
          Page {virtualAbsolutePageIndex * 2 + 1}
        </div>

        {/* Right Page Number absolute (Desktop only) */}
        <div className="absolute left-[80%] -translate-x-1/2 hidden lg:block text-[10px] tracking-wider uppercase font-semibold text-muted-foreground/60">
          {virtualAbsolutePageIndex * 2 + 2 <= virtualTotalBookPages * 2 ? `Page ${virtualAbsolutePageIndex * 2 + 2}` : ""}
        </div>

        <button
          onClick={handleNextPage}
          className={`flex items-center gap-1.5 transition-all z-20 hover:text-primary ${
            isLastPageOfBook
              ? "text-primary font-extrabold bg-primary/10 border border-primary/20 px-3 py-1 rounded hover:bg-primary hover:text-primary-foreground shadow-sm animate-pulse"
              : ""
          }`}
        >
          {isLastPageOfBook ? (
            <>
              Complete Book
              <span className="material-symbols-outlined text-base">task_alt</span>
            </>
          ) : (
            <>
              Next
              <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
