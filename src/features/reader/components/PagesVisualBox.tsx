"use client";

import * as React from "react";
import { Bookmark } from "@/core/entities/book";
import { BookmarkCorner } from "./BookmarkCorner";
import { BookVisualPage } from "@/lib/parser/paginator";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

// Extracted Sub-Components and Utilities
import { prepareChapterHtml, ChapterHtmlData } from "@/features/reader/utils/chapterHtml";
import { ReaderEpubStyles } from "./ReaderEpubStyles";
import { PagesFooter } from "./PagesFooter";
import { useDomPagination } from "../hooks/useDomPagination";
import { usePageNavigation } from "../hooks/usePageNavigation";

interface PagesVisualBoxProps {
  currentChapter: ChapterHtmlData;
  chaptersData: ChapterHtmlData[];
  activePage: BookVisualPage | null;
  allBookPages: BookVisualPage[];
  onPagesComputed?: (computedPages: BookVisualPage[]) => void;
  wordIndex: number;
  setWordIndex: (w: number) => void;
  /** The local page index (within the current chapter) saved from the previous session.
   *  Used to restore currentPageIndex directly after DOM pagination completes, bypassing
   *  the potentially-unstable wordIndex→page mapping. */
  savedLocalPageIndex?: number;
  /** Called after every page turn (handleNext/handlePrev) with the new local page index
   *  so it can be persisted alongside lastWordIndex. */
  onSavePageProgress?: (localPageIndex: number, wordIndex: number) => void;
  readerFontClass: string;
  fontSize: number;
  wordsPerPage: number;
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
  savedLocalPageIndex,
  onSavePageProgress,
  readerFontClass,
  fontSize,
  wordsPerPage,
  onPrevChapter,
  onNextChapter,
  setActiveChapterIndex,
  bookmarks,
  onAddBookmark,
  onRemoveBookmark,
  onUpdateBookmarkName,
}: PagesVisualBoxProps) {
  const columnGap = 40;
  const [totalPages, setTotalPages] = React.useState(1);
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0);
  const columnsContainerRef = React.useRef<HTMLDivElement>(null);
  const hiddenPaginatorRef = React.useRef<HTMLDivElement>(null);
  const canvasWrapperRef = React.useRef<HTMLDivElement>(null);
  
  // Track visible container dimensions for offscreen DOM pagination
  const [containerDimensions, setContainerDimensions] = React.useState<{ width: number; height: number } | null>(null);
  
  // Track local word index updates to avoid synchronization render loops
  const localWordIndexChangeRef = React.useRef<number | null>(null);
  
  // Guards against the useLayoutEffect overriding a pending page restoration.
  // When savedLocalPageIndex triggers a restore inside the pagination effect,
  // this ref is set to the target page index. The useLayoutEffect checks this
  // ref and skips its word→page mapping when a restore is pending, preventing
  // the "always land on page 0" bug that occurs because allBookPages is empty
  // during the initial render cycle after navigating back to the reader.
  const pendingRestorePageRef = React.useRef<number | null>(null);

  // Always-current ref for the values that the async paginateAllChapters needs
  // at the END of its run (after all rAF ticks). Because paginateAllChapters is
  // async, its closure captures stale values from the render that scheduled the
  // effect. By reading from this ref instead of the closure, we always use the
  // latest savedLocalPageIndex / wordIndex / currentChapter.index — even if the
  // restore effect fired and updated state after the pagination effect started.
  const latestRestoreTargetRef = React.useRef<{
    savedLocalPageIndex: number | undefined;
    wordIndex: number;
    chapterIndex: number;
  }>({
    savedLocalPageIndex,
    wordIndex,
    chapterIndex: currentChapter.index,
  });

  // Keep the ref in sync on every render (runs before effects, so it's always
  // fresh by the time any async code reads it).
  latestRestoreTargetRef.current = {
    savedLocalPageIndex,
    wordIndex,
    chapterIndex: currentChapter.index,
  };

  const densityRatio = React.useMemo(() => {
    const standardCapacity = Math.max(100, Math.round(300 * (16 / fontSize) * 0.82));
    return wordsPerPage / standardCapacity;
  }, [fontSize, wordsPerPage]);

  const targetWidth = React.useMemo(() => {
    return Math.round(800 * densityRatio);
  }, [densityRatio]);

  const scaledFontSize = React.useMemo(() => {
    if (!containerDimensions || containerDimensions.width <= 0) {
      return fontSize;
    }
    const actualWidth = containerDimensions.width;
    const ratio = actualWidth / targetWidth;
    const cappedRatio = Math.min(1.0, ratio);
    return Math.max(10, fontSize * Math.sqrt(cappedRatio));
  }, [containerDimensions, targetWidth, fontSize]);

  // Compute standard HTML markup to feed our reading layout
  const formattedHtml = React.useMemo(() => {
    return prepareChapterHtml(currentChapter);
  }, [currentChapter]);

  // Consuming custom DOM pagination hook
  const { isPaginationReady } = useDomPagination({
    chaptersData,
    containerDimensions,
    onPagesComputed,
    scaledFontSize,
    readerFontClass,
    wordsPerPage,
    hiddenPaginatorRef,
    columnGap,
    latestRestoreTargetRef,
    setCurrentPageIndex,
    localWordIndexChangeRef,
    pendingRestorePageRef,
    initialReady: allBookPages.length > 0,
  });

  // Consuming custom Page navigation hook
  const {
    getPageIndexForWord,
    getWordIndexForPage,
    handlePrev,
    handleNext,
  } = usePageNavigation({
    allBookPages,
    currentChapterIndex: currentChapter.index,
    columnsContainerRef,
    containerDimensions,
    columnGap,
    currentPageIndex,
    setCurrentPageIndex,
    totalPages,
    localWordIndexChangeRef,
    setWordIndex,
    onSavePageProgress,
    onPrevChapter,
    onNextChapter,
  });

  // Eagerly guard pendingRestorePageRef when we know there is a saved page to
  // restore. This runs synchronously (useLayoutEffect) BEFORE the async
  // paginateAllChapters completes, preventing the wordIndex-change layoutEffect
  // below from calling getPageIndexForWord() and overwriting currentPageIndex
  // with 0 while allBookPages is still empty or stale.
  React.useLayoutEffect(() => {
    if (savedLocalPageIndex !== undefined && allBookPages.length === 0) {
      // Signal that a restore is pending so the layout effect below skips its
      // word→page derivation. The exact page number isn't known yet (pending
      // async pagination), so store a sentinel (-1) to distinguish from the
      // real page value set later by paginateAllChapters.
      if (pendingRestorePageRef.current === null) {
        pendingRestorePageRef.current = -1;
      }
    }
  }, [savedLocalPageIndex, allBookPages.length]);

  // Measure synchronously after layout is computed but before the browser paints!
  // This completely eliminates any blank flickering or jumping movements!
  React.useLayoutEffect(() => {
    const el = columnsContainerRef.current;
    if (el && containerDimensions) {
      const width = containerDimensions.width || 1;
      const scrollWidth = el.scrollWidth;
      const pages = Math.max(1, Math.ceil((scrollWidth + columnGap) / (width + columnGap)));
      setTotalPages(pages);
      
      // If the pagination effect has set (or is about to set) a specific page to
      // restore to, skip the word→page derivation here to avoid overwriting it.
      // pendingRestorePageRef is -1 (sentinel) while async pagination is still
      // running and a restore is expected, or a real page index (>= 0) once
      // paginateAllChapters has finished computing the target page.
      if (pendingRestorePageRef.current !== null) {
        if (pendingRestorePageRef.current >= 0) {
          // Real page index set by paginateAllChapters — clear both guards now.
          pendingRestorePageRef.current = null;
          localWordIndexChangeRef.current = null;
        }
        // Either way (sentinel or real), skip the word→page derivation.
        return;
      }
      
      if (wordIndex !== localWordIndexChangeRef.current) {
        const initialPage = getPageIndexForWord(wordIndex);
        setCurrentPageIndex(initialPage);
      }
      
      // Always clear the ref after consuming it so it doesn't dangle
      // and accidentally block a future valid navigation to that same word index.
      localWordIndexChangeRef.current = null;
    }
  }, [formattedHtml, scaledFontSize, readerFontClass, containerDimensions, wordIndex, getPageIndexForWord]);

  React.useEffect(() => {
    const wrapper = canvasWrapperRef.current;
    if (!wrapper) return;
    
    const updateDimensions = () => {
      const availableWidth = wrapper.clientWidth;
      const targetW = Math.round(800 * densityRatio);
      const widthVal = Math.floor(Math.min(availableWidth, targetW));
      
      setContainerDimensions({
        width: widthVal,
        height: wrapper.clientHeight,
      });
    };
    
    updateDimensions();
    
    const observer = new ResizeObserver(() => {
      updateDimensions();
    });
    observer.observe(wrapper);
    
    return () => observer.disconnect();
  }, [densityRatio]);

  // Bookmark alignments relative to current page boundaries
  const pageStartWordIndex = React.useMemo(() => {
    return getWordIndexForPage(currentPageIndex);
  }, [currentPageIndex, getWordIndexForPage]);

  const activeBookmark = React.useMemo(() => {
    if (!bookmarks) return null;
    return (
      bookmarks.find((b) => {
        return (
          b.chapterIndex === currentChapter.index &&
          getPageIndexForWord(b.wordIndex) === currentPageIndex
        );
      }) || null
    );
  }, [bookmarks, currentChapter.index, currentPageIndex, getPageIndexForWord]);

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
  }, [globalPageDetails]);

  const isLastChapter = currentChapter.index === chaptersData.length - 1;

  const showPrevChapter = currentPageIndex === 0;
  const showCompleteBook = currentPageIndex === totalPages - 1 && isLastChapter;
  const showNextChapter = currentPageIndex === totalPages - 1 && !isLastChapter;

  return (
    <div className="w-full bg-card/65 dark:bg-card/45 border border-border/20 rounded-2xl px-5 pb-4 pt-8 md:px-8 md:pt-11 md:pb-6 shadow-2xl glass-panel relative overflow-hidden transition-opacity duration-300 flex flex-col h-[660px] min-h-[660px] max-h-[660px]">
      
      {/* Stylesheet reset component */}
      <ReaderEpubStyles />

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
      <div 
        ref={canvasWrapperRef}
        className="flex-1 w-full overflow-hidden relative my-2 flex flex-col justify-start"
      >
        {/* Pagination loading overlay */}
        {!isPaginationReady && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/80 backdrop-blur-sm rounded-xl">
            <LoadingSpinner message="Rendering pages..." />
          </div>
        )}

        <div 
          className="h-full overflow-hidden relative"
          style={{
            width: containerDimensions ? `${containerDimensions.width}px` : "100%",
            margin: "0 auto",
            opacity: isPaginationReady ? 1 : 0,
            transition: isPaginationReady ? "opacity 0.25s ease-in" : "none",
          }}
        >
          <div
            ref={columnsContainerRef}
            className={`h-full epub-content ${readerFontClass}`}
            style={{
              columnWidth: "100%",
              columnCount: 1,
              columnGap: `${columnGap}px`,
              columnFill: "auto",
              transform: `translateX(-${currentPageIndex * ((containerDimensions?.width || 0) + columnGap)}px)`,
              fontSize: `${scaledFontSize}px`,
              lineHeight: "1.75",
            }}
            dangerouslySetInnerHTML={{ __html: formattedHtml }}
          />
        </div>
      </div>

      {/* Footer Navigation Component */}
      <PagesFooter
        isPaginationReady={isPaginationReady}
        currentPageIndex={currentPageIndex}
        currentChapterIndex={currentChapter.index}
        globalPageDetails={globalPageDetails}
        allBookPages={allBookPages}
        showPrevChapter={showPrevChapter}
        showNextChapter={showNextChapter}
        showCompleteBook={showCompleteBook}
        handlePrev={handlePrev}
        handleNext={handleNext}
        setActiveChapterIndex={setActiveChapterIndex}
        setWordIndex={setWordIndex}
      />

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
            columnGap: `${columnGap}px`,
            columnFill: "auto",
            fontSize: `${scaledFontSize}px`,
            lineHeight: "1.75",
          }}
        />
      </div>
    </div>
  );
}
