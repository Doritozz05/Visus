"use client";

import * as React from "react";
import DOMPurify from "dompurify";
import { Bookmark } from "@/core/entities/book";
import { BookmarkCorner } from "./BookmarkCorner";

interface VisualPage {
  pageIndex: number;
  chapterIndex: number;
  absolutePageIndex: number;
  startWordIndex: number;
  endWordIndex: number;
  content: string;
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
  chaptersData: ChapterData[];
  activePage: VisualPage | null;
  allBookPages: VisualPage[];
  wordIndex: number;
  setWordIndex: (w: number) => void;
  readerFontClass: string;
  fontSize: number;
  onPrevChapter: () => void;
  onNextChapter: () => void;
  bookmarks: Bookmark[];
  onAddBookmark: (name: string, chapterIndex: number, wordIndex: number) => void;
  onRemoveBookmark: (id: string) => void;
  onUpdateBookmarkName: (id: string, name: string) => void;
  onLayoutMeasured?: (wordsPerPage: number) => void;
}

export function PagesVisualBox({
  currentChapter,
  chaptersData,
  activePage,
  allBookPages,
  wordIndex,
  setWordIndex,
  readerFontClass,
  fontSize,
  onPrevChapter,
  onNextChapter,
  bookmarks,
  onAddBookmark,
  onRemoveBookmark,
  onUpdateBookmarkName,
  onLayoutMeasured,
}: PagesVisualBoxProps) {
  const [totalPages, setTotalPages] = React.useState(1);
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0);
  const [isMeasuring, setIsMeasuring] = React.useState(true);
  const columnsContainerRef = React.useRef<HTMLDivElement>(null);

  // Compute standard HTML markup to feed our reading layout
  const formattedHtml = React.useMemo(() => {
    let rawHtml = "";
    if (currentChapter.htmlContent) {
      rawHtml = currentChapter.htmlContent;
    } else {
      // Fallback convert plain text to simple paragraphs
      rawHtml = currentChapter.content
        .split(/\n\s*\n+/)
        .map((p) => {
          const clean = p.trim();
          if (!clean) return "";
          return `<p class="mb-4 text-justify leading-relaxed">${clean}</p>`;
        })
        .join("");
    }

    let finalHtml = rawHtml;

    // Clean trailing empty elements to prevent empty overflow columns
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(`<div>${rawHtml}</div>`, "text/html");
      const container = doc.body.firstElementChild as HTMLElement;
      if (container) {
        let modified = false;
        const cleanTrailing = (el: HTMLElement): boolean => {
          const children = Array.from(el.children);
          for (let i = children.length - 1; i >= 0; i--) {
            const child = children[i] as HTMLElement;
            const tagName = child.tagName.toLowerCase();
            const text = child.textContent?.trim() || "";
            const isMedia = child.querySelector("img, image, svg, iframe") || tagName === "img";
            
            if (!text && !isMedia && (tagName === "p" || tagName === "div" || tagName === "br" || tagName === "span" || tagName === "section")) {
              child.remove();
              modified = true;
            } else {
              if (tagName === "div" || tagName === "p" || tagName === "section") {
                if (cleanTrailing(child)) {
                  modified = true;
                }
              }
              break;
            }
          }
          return modified;
        };

        cleanTrailing(container);
        finalHtml = container.innerHTML;
      }
    } catch (e) {
      console.warn("Failed to sanitize/trim trailing empty tags:", e);
    }

    // Safely sanitize HTML to prevent XSS attacks while preserving structure
    if (typeof window !== "undefined") {
      return DOMPurify.sanitize(finalHtml);
    }
    return finalHtml;
  }, [currentChapter.htmlContent, currentChapter.content]);

  // Bi-directional word mapping conversions
  const totalWords = React.useMemo(() => {
    const wordsArr = currentChapter.content.split(/\s+/).filter((w) => w.trim() !== "");
    return Math.max(1, wordsArr.length);
  }, [currentChapter.content]);

  // Helper to map wordIndex to page index robustly and deterministically
  const getPageIndexForWord = React.useCallback((wIdx: number, pagesCount: number, wordsCount: number): number => {
    if (pagesCount <= 1) return 0;
    for (let p = 0; p < pagesCount; p++) {
      const start = Math.floor(p * (wordsCount / pagesCount));
      const nextStart = Math.floor((p + 1) * (wordsCount / pagesCount));
      if (wIdx >= start && (wIdx < nextStart || p === pagesCount - 1)) {
        return p;
      }
    }
    return 0;
  }, []);

  // Helper to map page index to its starting word index
  const getWordIndexForPage = React.useCallback((pIdx: number, pagesCount: number, wordsCount: number): number => {
    if (pagesCount <= 1) return 0;
    return Math.floor(pIdx * (wordsCount / pagesCount));
  }, []);

  // Dynamic Page Count calculations based on element layout scrollWidth
  const updatePagesCount = React.useCallback(() => {
    const el = columnsContainerRef.current;
    if (el) {
      const width = el.clientWidth || 1;
      const scrollWidth = el.scrollWidth;
      const pages = Math.max(1, Math.ceil(scrollWidth / width));
      setTotalPages((prev) => {
        if (prev === pages) return prev;
        return pages;
      });
    }
  }, []);

  // Lock visibility and set isMeasuring to true when chapter changes
  React.useEffect(() => {
    setIsMeasuring(true);
  }, [currentChapter.index]);

  // Measure after layout stabilizes, content changes, font adjustments, or resize actions
  React.useLayoutEffect(() => {
    setIsMeasuring(true);
    const timer = setTimeout(() => {
      const el = columnsContainerRef.current;
      if (el) {
        const width = el.clientWidth || 1;
        const scrollWidth = el.scrollWidth;
        const pages = Math.max(1, Math.ceil(scrollWidth / width));
        setTotalPages(pages);
        
        // Compute and set current page index in the same batch using our robust helper
        const initialPage = getPageIndexForWord(wordIndex, pages, totalWords);
        setCurrentPageIndex(initialPage);

        // Call the callback to synchronize page counts dynamically
        if (onLayoutMeasured) {
          const measuredWPP = Math.max(50, Math.round(totalWords / pages));
          onLayoutMeasured(measuredWPP);
        }
      }
      setIsMeasuring(false);
    }, 120);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formattedHtml, fontSize, readerFontClass, totalWords]); // Exclude wordIndex from measurements to avoid transition flickers!

  // Instant synchronization for wordIndex shifts (e.g. page turns, bookmark jumps, TOC clicks)
  React.useEffect(() => {
    if (!isMeasuring) {
      const page = getPageIndexForWord(wordIndex, totalPages, totalWords);
      if (page !== currentPageIndex) {
        setCurrentPageIndex(page);
      }
    }
  }, [wordIndex, totalPages, totalWords, isMeasuring, currentPageIndex, getPageIndexForWord]);

  React.useEffect(() => {
    const el = columnsContainerRef.current;
    if (!el) return;
    
    const observer = new ResizeObserver(() => {
      updatePagesCount();
    });
    observer.observe(el);
    
    return () => observer.disconnect();
  }, [updatePagesCount]);

  // Bookmark alignments relative to current page boundaries
  const pageStartWordIndex = React.useMemo(() => {
    return getWordIndexForPage(currentPageIndex, totalPages, totalWords);
  }, [currentPageIndex, totalWords, totalPages, getWordIndexForPage]);

  const pageEndWordIndex = React.useMemo(() => {
    return Math.min(totalWords - 1, getWordIndexForPage(currentPageIndex + 1, totalPages, totalWords) - 1);
  }, [currentPageIndex, totalWords, totalPages, getWordIndexForPage]);

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
    return `Chapter ${currentChapter.index + 1}, Page ${currentPageIndex + 1}`;
  }, [currentChapter.index, currentPageIndex]);

  const isLastChapter = currentChapter.index === chaptersData.length - 1;

  const showPrevChapter = currentPageIndex === 0 && !isMeasuring;
  const showCompleteBook = currentPageIndex === totalPages - 1 && isLastChapter && !isMeasuring;
  const showNextChapter = currentPageIndex === totalPages - 1 && !isLastChapter && !isMeasuring;

  // Compute global page numbers across the entire book to help the reader track progress globally
  const globalPageDetails = React.useMemo(() => {
    if (allBookPages.length === 0) {
      return { current: currentPageIndex + 1, total: totalPages };
    }
    const chapterPagesInStatic = allBookPages.filter((p) => p.chapterIndex === currentChapter.index);
    const staticPagesCount = chapterPagesInStatic.length || 1;
    const mappedPageIndex = Math.min(
      staticPagesCount - 1,
      Math.max(0, Math.floor((currentPageIndex / totalPages) * staticPagesCount))
    );
    const activeStaticPage = chapterPagesInStatic[mappedPageIndex];
    const globalCurrent = activeStaticPage ? activeStaticPage.absolutePageIndex + 1 : currentPageIndex + 1;
    return {
      current: globalCurrent,
      total: allBookPages.length,
    };
  }, [allBookPages, currentChapter.index, currentPageIndex, totalPages]);

  // Page Navigation Triggers (Local source of truth - zero rounding snapping desyncs!)
  const handlePrev = () => {
    if (currentPageIndex > 0) {
      const prevPageIndex = currentPageIndex - 1;
      setCurrentPageIndex(prevPageIndex);
      
      const targetWordIndex = getWordIndexForPage(prevPageIndex, totalPages, totalWords);
      setWordIndex(targetWordIndex);
    } else {
      // Crossing chapter boundary to previous file
      onPrevChapter();
    }
  };

  const handleNext = () => {
    if (currentPageIndex < totalPages - 1) {
      const nextPageIndex = currentPageIndex + 1;
      setCurrentPageIndex(nextPageIndex);
      
      const targetWordIndex = getWordIndexForPage(nextPageIndex, totalPages, totalWords);
      setWordIndex(targetWordIndex);
    } else {
      // Crossing chapter boundary to next file or completing book
      onNextChapter();
    }
  };

  return (
    <div className="w-full bg-card/65 dark:bg-card/45 border border-border/20 rounded-2xl px-5 pb-4 pt-8 md:px-8 md:pt-11 md:pb-6 shadow-2xl glass-panel relative overflow-hidden transition-opacity duration-300 flex flex-col h-[660px] min-h-[660px] max-h-[660px]">
      {/* Stylesheet reset for injected EPUB components to force premium visual styles, zero cuts, and dark-resiliency */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .epub-content {
            font-family: var(--font-serif, serif);
            color: hsl(var(--foreground));
          }

          .epub-content h1, .epub-content h2, .epub-content h3, .epub-content h4, .epub-content h5, .epub-content h6 {
            color: hsl(var(--primary));
            font-family: var(--font-heading, inherit);
            font-weight: 700;
            margin-top: 1.2em;
            margin-bottom: 0.6em;
            line-height: 1.25;
            break-inside: avoid-column;
            column-break-inside: avoid;
            break-after: avoid;
            column-break-after: avoid;
          }
          .epub-content h1 { font-size: 1.65em; }
          .epub-content h2 { font-size: 1.45em; }
          .epub-content h3 { font-size: 1.25em; }
          
          /* Spaced paragraphs for divisions and text segments */
          .epub-content p {
            margin-bottom: 1em;
            text-align: justify;
            line-height: 1.75;
            text-indent: 1.5em;
            /* Defensive column wrapping protection - absolutely zero cuts between pages! */
            break-inside: avoid-column;
            column-break-inside: avoid;
            page-break-inside: avoid;
          }
          
          /* Space bare div tags that act as paragraphs in Project Gutenberg EPUBs */
          .epub-content div:not(:empty) {
            margin-bottom: 0.8rem;
            line-height: 1.75;
            text-align: justify;
            break-inside: avoid-column;
            column-break-inside: avoid;
          }
          
          .epub-content p:first-of-type, 
          .epub-content h1 + p, 
          .epub-content h2 + p, 
          .epub-content h3 + p,
          .epub-content div + p {
            text-indent: 0;
          }
          
          .epub-content img {
            max-width: 100%;
            max-height: 280px;
            height: auto;
            object-fit: contain;
            display: block;
            margin: 1.5em auto;
            border-radius: 0.5rem;
            break-inside: avoid;
            column-break-inside: avoid;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          }
          
          .epub-content ul, .epub-content ol {
            margin-bottom: 1em;
            padding-left: 2em;
            break-inside: avoid-column;
            column-break-inside: avoid;
          }
          
          .epub-content li {
            margin-bottom: 0.5em;
            line-height: 1.6;
            break-inside: avoid-column;
            column-break-inside: avoid;
          }
          
          .epub-content blockquote {
            border-left: 4px solid hsl(var(--primary));
            padding-left: 1.2em;
            margin: 1.5em 0;
            color: hsl(var(--muted-foreground));
            font-style: italic;
            break-inside: avoid-column;
            column-break-inside: avoid;
          }
          
          .epub-content table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5em 0;
            font-size: 0.9em;
            break-inside: avoid-column;
            column-break-inside: avoid;
          }
          
          .epub-content th, .epub-content td {
            border: 1px solid hsl(var(--border));
            padding: 0.6em;
            text-align: left;
          }
          
          .epub-content th {
            background-color: hsl(var(--accent));
            font-weight: 700;
          }
          
          /* Defensive links styles - completely overrides visited link purple and underline! */
          .epub-content a, .epub-content a:visited, .epub-content a:hover, .epub-content a:active {
            color: inherit !important;
            text-decoration: none !important;
            cursor: text !important;
            pointer-events: none !important;
          }
        `
      }} />

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

      {/* Header */}
      <div className="flex justify-between items-start gap-4 text-[10px] font-mono tracking-widest text-muted-foreground uppercase pb-4 border-b border-border/10 mb-4 shrink-0">
        <span className="shrink-0">Visus Reader &bull; Pro</span>
        <span className="text-primary font-bold text-right break-words whitespace-normal max-w-[70%] leading-normal tracking-wide">
          {currentChapter.title}
        </span>
      </div>

      {/* Static Kindle-Level Canvas using dynamic native CSS Multi-column layout set to EXACTLY ONE column */}
      <div className="flex-1 w-full overflow-hidden relative my-2 flex flex-col justify-start">
        <div className="w-full h-full overflow-hidden relative">
          <div
            ref={columnsContainerRef}
            className={`h-full epub-content ${readerFontClass}`}
            style={{
              columnWidth: "100%",
              columnCount: 1,
              columnGap: "0rem",
              columnFill: "auto",
              transform: `translateX(-${currentPageIndex * 100}%)`,
              fontSize: `${fontSize}px`,
              lineHeight: "1.75",
              opacity: isMeasuring ? 0 : 1,
              transition: isMeasuring ? "none" : "opacity 100ms ease-in-out",
            }}
            dangerouslySetInnerHTML={{ __html: formattedHtml }}
          />
        </div>
      </div>

      {/* Footer Navigation (strictly fixed height to eliminate sub-pixel layout feedback loops) */}
      <div className="h-10 min-h-[40px] max-h-[40px] flex justify-between items-center pt-3 border-t border-border/10 mt-3 text-xs font-mono text-muted-foreground relative shrink-0">
        <button
          onClick={handlePrev}
          disabled={currentPageIndex === 0 && currentChapter.index === 0}
          className="flex items-center gap-1.5 hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none z-20"
        >
          <span className="material-symbols-outlined text-sm">arrow_back_ios</span>
          {showPrevChapter ? "Previous Chapter" : "Previous Page"}
        </button>

        {/* Page indicator (Discrete, deterministic global X of Y) */}
        <div className="text-[10px] tracking-wider uppercase font-semibold text-muted-foreground/60">
          Page {globalPageDetails.current} of {globalPageDetails.total}
        </div>

        <button
          onClick={handleNext}
          className={`flex items-center gap-1.5 transition-all z-20 hover:text-primary ${
            showCompleteBook
              ? "text-primary font-extrabold bg-primary/10 border border-primary/30 px-3 py-1 rounded hover:bg-primary hover:text-primary-foreground shadow-md shadow-primary/10"
              : ""
          }`}
        >
          {showCompleteBook ? (
            <>
              Complete Book
              <span className="material-symbols-outlined text-base">task_alt</span>
            </>
          ) : (
            <>
              {showNextChapter ? "Next Chapter" : "Next Page"}
              <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
