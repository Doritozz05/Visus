"use client";

import * as React from "react";
import DOMPurify from "dompurify";
import { Bookmark } from "@/core/entities/book";
import { BookmarkCorner } from "./BookmarkCorner";
import { tagHtmlBlocksWithWordIndices } from "@/lib/parser/paginator";

interface VisualPage {
  pageIndex: number;
  chapterIndex: number;
  absolutePageIndex: number;
  startWordIndex: number;
  endWordIndex: number;
  content: string;
  leftColumn: string;
  rightColumn: string;
  title?: string;
}

interface ChapterData {
  title: string;
  content: string;
  htmlContent?: string;
  index: number;
  words?: string[];
}

// Helper function to prepare and tag chapter HTML in a standardized way
function prepareChapterHtml(chapter: ChapterData): string {
  let rawHtml = "";
  if (chapter.htmlContent) {
    rawHtml = chapter.htmlContent;
  } else {
    // Fallback convert plain text to simple paragraphs
    rawHtml = chapter.content
      .split(/\n\s*\n+/)
      .map((p) => {
        const clean = p.trim();
        if (!clean) return "";
        return `<p class="mb-4 text-justify leading-relaxed">${clean}</p>`;
      })
      .join("");
  }

  let finalHtml = rawHtml;

  // Clean trailing empty elements
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${rawHtml}</div>`, "text/html");
    const container = doc.body.firstElementChild as HTMLElement;
    if (container) {
      const cleanTrailing = (el: HTMLElement): boolean => {
        let modified = false;
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

  if (typeof window !== "undefined") {
    finalHtml = DOMPurify.sanitize(finalHtml);
  }

  const tagged = tagHtmlBlocksWithWordIndices(finalHtml);
  return tagged.html;
}

interface PagesVisualBoxProps {
  currentChapter: ChapterData;
  chaptersData: ChapterData[];
  activePage: VisualPage | null;
  allBookPages: VisualPage[];
  onPagesComputed?: (computedPages: VisualPage[]) => void;
  wordIndex: number;
  setWordIndex: (w: number) => void;
  readerFontClass: string;
  fontSize: number;
  onPrevChapter: () => void;
  onNextChapter: () => void;
  setActiveChapterIndex: (index: number) => void;
  bookmarks: Bookmark[];
  onAddBookmark: (name: string, chapterIndex: number, wordIndex: number) => void;
  onRemoveBookmark: (id: string) => void;
  onUpdateBookmarkName: (id: string, name: string) => void;
}

export function PagesVisualBox({
  currentChapter,
  chaptersData,
  activePage,
  allBookPages,
  onPagesComputed,
  wordIndex,
  setWordIndex,
  readerFontClass,
  fontSize,
  onPrevChapter,
  onNextChapter,
  setActiveChapterIndex,
  bookmarks,
  onAddBookmark,
  onRemoveBookmark,
  onUpdateBookmarkName,
}: PagesVisualBoxProps) {
  const [totalPages, setTotalPages] = React.useState(1);
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0);
  const columnsContainerRef = React.useRef<HTMLDivElement>(null);
  const hiddenPaginatorRef = React.useRef<HTMLDivElement>(null);
  
  // Track visible container dimensions for offscreen DOM pagination
  const [containerDimensions, setContainerDimensions] = React.useState<{ width: number; height: number } | null>(null);
  
  // Track local word index updates to avoid synchronization render loops
  const localWordIndexChangeRef = React.useRef<number | null>(null);

  // Compute standard HTML markup to feed our reading layout
  const formattedHtml = React.useMemo(() => {
    return prepareChapterHtml(currentChapter);
  }, [currentChapter]);

  // Bi-directional word mapping conversions
  const totalWords = React.useMemo(() => {
    const wordsArr = currentChapter.content.split(/\s+/).filter((w) => w.trim() !== "");
    return Math.max(1, wordsArr.length);
  }, [currentChapter.content]);

  // Helper to map wordIndex to the exact page index using DOM coordinates!
  const getPageIndexForWord = React.useCallback((wIdx: number): number => {
    const el = columnsContainerRef.current;
    if (!el) return 0;
    const width = el.clientWidth || 1;
    
    // Find the block containing this word
    const blocks = el.querySelectorAll("[data-start-word-idx]");
    let activeBlock: HTMLElement | null = null;
    let lastBlock: HTMLElement | null = null;
    
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i] as HTMLElement;
      const start = parseInt(block.getAttribute("data-start-word-idx") || "0", 10);
      const end = parseInt(block.getAttribute("data-end-word-idx") || "0", 10);
      
      lastBlock = block;
      
      if (wIdx >= start && wIdx <= end) {
        activeBlock = block;
        break;
      }
    }
    
    if (activeBlock) {
      // Use Math.round to handle minor column gaps, sub-pixel offsets, and margin differences safely!
      return Math.round(activeBlock.offsetLeft / width);
    }
    
    // Fallback: if wordIndex exceeds tagged block range (structural chapters like TOC/licenses),
    // return the last page instead of 0 to prevent navigation jumping to the start
    if (lastBlock) {
      return Math.round(lastBlock.offsetLeft / width);
    }
    
    return 0;
  }, []);

  // Helper to map page index to its starting word index using DOM coordinates!
  const getWordIndexForPage = React.useCallback((pIdx: number): number => {
    const el = columnsContainerRef.current;
    if (!el) return 0;
    const width = el.clientWidth || 1;
    const targetOffset = pIdx * width;
    
    const blocks = el.querySelectorAll("[data-start-word-idx]");
    let closestBlock: HTMLElement | null = null;
    let minDiff = Infinity;
    
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i] as HTMLElement;
      const blockLeft = block.offsetLeft;
      
      // Find the first block that starts inside this target column page area
      // Tolerating 30px for margins/paddings and sub-pixel offsets
      if (blockLeft >= targetOffset - 30) {
        const diff = blockLeft - targetOffset;
        if (diff < minDiff) {
          minDiff = diff;
          closestBlock = block;
        }
      }
    }
    
    if (closestBlock) {
      return parseInt(closestBlock.getAttribute("data-start-word-idx") || "0", 10);
    }
    
    return 0;
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

  // Background dynamic DOM pagination to get pixel-perfect 1:1 pages count for all chapters.
  // Performs measurements sequentially in requestAnimationFrame ticks to keep the thread fully responsive.
  React.useEffect(() => {
    if (!onPagesComputed || !containerDimensions || chaptersData.length === 0) {
      return;
    }

    let active = true;

    const paginateAllChapters = async () => {
      const { width, height } = containerDimensions;
      if (width <= 0 || height <= 0) return;

      const computedPages: VisualPage[] = [];
      let absolutePageIndex = 0;

      for (let chIdx = 0; chIdx < chaptersData.length; chIdx++) {
        if (!active) return;

        const chapter = chaptersData[chIdx];
        const chapterHtml = prepareChapterHtml(chapter);
        
        const hiddenEl = hiddenPaginatorRef.current;
        if (!hiddenEl) return;
        
        hiddenEl.innerHTML = chapterHtml;
        
        // Wait a frame for browser layout calculation
        await new Promise((resolve) => requestAnimationFrame(resolve));
        
        if (!active) return;
        
        const scrollWidth = hiddenEl.scrollWidth;
        const totalPagesInChapter = Math.max(1, Math.ceil(scrollWidth / width));
        
        const blocks = hiddenEl.querySelectorAll("[data-start-word-idx]");
        const blockPositions = Array.from(blocks).map((block) => {
          const el = block as HTMLElement;
          return {
            offsetLeft: el.offsetLeft,
            startIdx: parseInt(el.getAttribute("data-start-word-idx") || "0", 10),
            endIdx: parseInt(el.getAttribute("data-end-word-idx") || "0", 10),
          };
        });
        
        const wordsArr = chapter.content.split(/\s+/).filter((w) => w.trim() !== "");
        const totalWords = Math.max(1, wordsArr.length);
        
        const findStartWordForPage = (pIdx: number): number => {
          const targetOffset = pIdx * width;
          let closestBlockStart = 0;
          let minDiff = Infinity;
          
          for (const block of blockPositions) {
            if (block.offsetLeft >= targetOffset - 30) {
              const diff = block.offsetLeft - targetOffset;
              if (diff < minDiff) {
                minDiff = diff;
                closestBlockStart = block.startIdx;
              }
            }
          }
          return closestBlockStart;
        };

        const rawChapterPages: VisualPage[] = [];
        for (let pIdx = 0; pIdx < totalPagesInChapter; pIdx++) {
          const startWordIndex = findStartWordForPage(pIdx);
          
          rawChapterPages.push({
            pageIndex: pIdx,
            chapterIndex: chIdx,
            absolutePageIndex: 0, // Recomputed after deduplication
            title: `Page ${pIdx + 1}`,
            content: "",
            leftColumn: "",
            rightColumn: "",
            startWordIndex,
            endWordIndex: 0,
          });
        }
        
        // Deduplicate phantom pages: collapse consecutive pages with identical startWordIndex.
        // This happens in structural chapters (TOC, licenses) where few tagged blocks exist
        // relative to the visual column count, causing multiple pages to map to word index 0.
        const chapterPages: VisualPage[] = [];
        for (let i = 0; i < rawChapterPages.length; i++) {
          if (i === 0 || rawChapterPages[i].startWordIndex !== rawChapterPages[i - 1].startWordIndex) {
            chapterPages.push(rawChapterPages[i]);
          }
        }
        
        // Assign correct sequential page indices and word ranges after deduplication
        for (let i = 0; i < chapterPages.length; i++) {
          chapterPages[i].pageIndex = i;
          chapterPages[i].absolutePageIndex = absolutePageIndex++;
          chapterPages[i].title = `Page ${i + 1}`;
          
          if (i < chapterPages.length - 1) {
            chapterPages[i].endWordIndex = chapterPages[i + 1].startWordIndex - 1;
          } else {
            chapterPages[i].endWordIndex = totalWords - 1;
          }
        }

        computedPages.push(...chapterPages);
      }

      if (active) {
        onPagesComputed(computedPages);
      }
    };

    paginateAllChapters();

    return () => {
      active = false;
    };
  }, [chaptersData, fontSize, readerFontClass, containerDimensions, onPagesComputed]);

  // Measure synchronously after layout is computed but before the browser paints!
  // This completely eliminates any blank flickering or jumping movements!
  React.useLayoutEffect(() => {
    const el = columnsContainerRef.current;
    if (el) {
      const width = el.clientWidth || 1;
      const scrollWidth = el.scrollWidth;
      const pages = Math.max(1, Math.ceil(scrollWidth / width));
      setTotalPages(pages);
      
      // Compute and set current page index synchronously in the same batch
      const initialPage = getPageIndexForWord(wordIndex);
      setCurrentPageIndex(initialPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formattedHtml, fontSize, readerFontClass]);

  // Instant synchronization for wordIndex shifts (e.g. page turns, bookmark jumps, TOC clicks)
  React.useEffect(() => {
    // Skip synchronization if it is a local page transition already handled
    if (wordIndex === localWordIndexChangeRef.current) {
      return;
    }
    const page = getPageIndexForWord(wordIndex);
    if (page !== currentPageIndex) {
      setCurrentPageIndex(page);
    }
  }, [wordIndex, currentPageIndex, getPageIndexForWord]);

  React.useEffect(() => {
    const el = columnsContainerRef.current;
    if (!el) return;
    
    // Initialize container dimensions on mount
    setContainerDimensions({
      width: el.clientWidth,
      height: el.clientHeight,
    });
    
    const observer = new ResizeObserver(() => {
      updatePagesCount();
      setContainerDimensions({
        width: el.clientWidth,
        height: el.clientHeight,
      });
    });
    observer.observe(el);
    
    return () => observer.disconnect();
  }, [updatePagesCount]);

  // Bookmark alignments relative to current page boundaries
  const pageStartWordIndex = React.useMemo(() => {
    return getWordIndexForPage(currentPageIndex);
  }, [currentPageIndex, getWordIndexForPage]);

  const pageEndWordIndex = React.useMemo(() => {
    return Math.min(totalWords - 1, getWordIndexForPage(currentPageIndex + 1) - 1);
  }, [currentPageIndex, totalWords, getWordIndexForPage]);

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

  // Compute global page numbers across the entire book chapters.
  // Uses currentPageIndex (DOM-accurate from visible container) offset by the chapter's
  // starting position in allBookPages. This prevents accumulated counter errors in
  // structural chapters (TOC, licenses) where wordIndex-to-page mapping can be unreliable.
  const globalPageDetails = React.useMemo(() => {
    if (allBookPages.length === 0) {
      return { current: currentPageIndex + 1, total: totalPages };
    }
    
    // Find the first page of the current chapter in allBookPages to get the absolute offset
    const chapterFirstPage = allBookPages.find(p => p.chapterIndex === currentChapter.index);
    if (!chapterFirstPage) {
      return { current: currentPageIndex + 1, total: allBookPages.length };
    }
    
    // Count how many pages this chapter has in allBookPages to clamp safely
    // (in case visible container and background paginator slightly disagree on page count)
    const chapterPageCount = allBookPages.filter(p => p.chapterIndex === currentChapter.index).length;
    const clampedPageIndex = Math.min(currentPageIndex, Math.max(0, chapterPageCount - 1));
    
    return {
      current: chapterFirstPage.absolutePageIndex + clampedPageIndex + 1,
      total: allBookPages.length,
    };
  }, [allBookPages, currentChapter.index, currentPageIndex, totalPages]);

  const defaultBookmarkName = React.useMemo(() => {
    return `Page ${globalPageDetails.current} of ${globalPageDetails.total}`;
  }, [globalPageDetails.current, globalPageDetails.total]);

  const isLastChapter = currentChapter.index === chaptersData.length - 1;

  const showPrevChapter = currentPageIndex === 0;
  const showCompleteBook = currentPageIndex === totalPages - 1 && isLastChapter;
  const showNextChapter = currentPageIndex === totalPages - 1 && !isLastChapter;



  const handlePrev = () => {
    if (currentPageIndex > 0) {
      const prevPageIndex = currentPageIndex - 1;
      setCurrentPageIndex(prevPageIndex);
      
      const targetWordIndex = getWordIndexForPage(prevPageIndex);
      localWordIndexChangeRef.current = targetWordIndex;
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
      
      const targetWordIndex = getWordIndexForPage(nextPageIndex);
      localWordIndexChangeRef.current = targetWordIndex;
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
            }}
            dangerouslySetInnerHTML={{ __html: formattedHtml }}
          />
        </div>
      </div>

      {/* Footer Navigation (strictly fixed height to eliminate sub-pixel layout feedback loops) */}
      <div className="h-12 min-h-[48px] max-h-[48px] flex justify-between items-center pt-3 border-t border-border/10 mt-1 text-xs font-mono text-muted-foreground relative shrink-0">
        <button
          onClick={handlePrev}
          disabled={currentPageIndex === 0 && currentChapter.index === 0}
          className="flex items-center gap-1.5 hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none z-20"
        >
          <span className="material-symbols-outlined text-sm">arrow_back_ios</span>
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
              onChange={(e) => {
                const targetPageNum = Number(e.target.value);
                const targetPage = allBookPages.find(p => p.absolutePageIndex === targetPageNum - 1);
                if (targetPage) {
                  if (targetPage.chapterIndex !== currentChapter.index) {
                    setActiveChapterIndex(targetPage.chapterIndex);
                  }
                  setWordIndex(targetPage.startWordIndex);
                }
              }}
              className="w-32 accent-primary h-1 bg-border/40 hover:bg-border/60 rounded-lg appearance-none cursor-pointer transition-colors z-30"
              title={`Page ${globalPageDetails.current} of ${globalPageDetails.total}`}
            />
          )}
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

      {/* Hidden offscreen container for background pagination */}
      <div
        style={{
          position: "absolute",
          top: -9999,
          left: -9999,
          width: containerDimensions?.width || "100%",
          height: containerDimensions?.height || "100%",
          visibility: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          ref={hiddenPaginatorRef}
          className={`h-full epub-content ${readerFontClass}`}
          style={{
            columnWidth: "100%",
            columnCount: 1,
            columnGap: "0rem",
            columnFill: "auto",
            fontSize: `${fontSize}px`,
            lineHeight: "1.75",
          }}
        />
      </div>
    </div>
  );
}
