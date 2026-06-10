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
import { useReadingStore } from "../stores/reading-store";

interface PagesVisualBoxProps {
  currentChapter: ChapterHtmlData;
  chaptersData: ChapterHtmlData[];

  /** The local page index (within the current chapter) saved from the previous session. */
  savedLocalPageIndex?: number;
  /** Called after every page turn (handleNext/handlePrev) with the new local page index */
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
  const columnsContainerRef = React.useRef<HTMLDivElement>(null);
  const hiddenPaginatorRef = React.useRef<HTMLDivElement>(null);
  const canvasWrapperRef = React.useRef<HTMLDivElement>(null);

  // Subscribe atomically to Zustand store properties
  const wordIndex = useReadingStore((state) => state.wordIndex);
  const activeChapterIndex = useReadingStore((state) => state.activeChapterIndex);
  const allBookPages = useReadingStore((state) => state.allBookPages);

  const setWordIndex = React.useCallback((w: number) => {
    useReadingStore.getState().setWordIndex(w);
  }, []);

  // Compute currentPageIndex synchronously
  const currentPageIndex = React.useMemo(() => {
    if (!allBookPages || allBookPages.length === 0) return 0;
    
    const chapterPages = allBookPages.filter(p => p.chapterIndex === currentChapter.index);
    if (chapterPages.length === 0) return 0;

    const foundIndex = chapterPages.findIndex(
      (p) => wordIndex >= p.startWordIndex && wordIndex <= p.endWordIndex
    );
    
    if (foundIndex !== -1) return foundIndex;
    
    // Fallback if out of bounds: 0 if before, last if after
    if (chapterPages[0] && wordIndex < chapterPages[0].startWordIndex) return 0;
    return chapterPages.length - 1;
  }, [allBookPages, currentChapter.index, wordIndex]);

  // Derived active visual page object
  const activePage = React.useMemo(() => {
    if (allBookPages.length === 0) return null;
    const found = allBookPages.find(
      (p) => p.chapterIndex === activeChapterIndex && wordIndex >= p.startWordIndex && wordIndex <= p.endWordIndex
    );
    return found || allBookPages.find(p => p.chapterIndex === activeChapterIndex) || allBookPages[0];
  }, [allBookPages, activeChapterIndex, wordIndex]);
  
  // Track visible container dimensions for offscreen DOM pagination
  const [containerDimensions, setContainerDimensions] = React.useState<{ width: number; height: number } | null>(null);

  // Always-current ref for the values that the async paginateAllChapters needs
  const latestRestoreTargetRef = React.useRef<{
    savedLocalPageIndex: number | undefined;
    wordIndex: number;
    chapterIndex: number;
  }>({
    savedLocalPageIndex,
    wordIndex,
    chapterIndex: currentChapter.index,
  });

  // Keep the ref in sync on every render
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
  const { isPaginationReady, isFullPaginationReady, pageIndexMapRef } = useDomPagination({
    chaptersData,
    containerDimensions,
    scaledFontSize,
    readerFontClass,
    wordsPerPage,
    hiddenPaginatorRef,
    columnGap,
    latestRestoreTargetRef,
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
    totalPages,
    setWordIndex,
    onSavePageProgress,
    onPrevChapter,
    onNextChapter,
  });

  React.useLayoutEffect(() => {
    const el = columnsContainerRef.current;
    if (el && containerDimensions) {
      const width = containerDimensions.width || 1;
      const scrollWidth = el.scrollWidth;
      const pages = Math.max(1, Math.ceil((scrollWidth + columnGap) / (width + columnGap)));
      setTotalPages(pages);
    }
  }, [formattedHtml, scaledFontSize, readerFontClass, containerDimensions]);

  React.useEffect(() => {
    const wrapper = canvasWrapperRef.current;
    if (!wrapper) return;
    
    const updateDimensions = () => {
      const availableWidth = wrapper.clientWidth;
      const targetW = Math.round(800 * densityRatio);
      const widthVal = Math.floor(Math.min(availableWidth, targetW));
      const heightVal = wrapper.clientHeight;
      
      setContainerDimensions((prev) => {
        if (prev && prev.width === widthVal && prev.height === heightVal) {
          return prev;
        }
        return {
          width: widthVal,
          height: heightVal,
        };
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

  const globalPageDetails = React.useMemo(() => {
    if (allBookPages.length === 0) {
      return { current: currentPageIndex + 1, total: totalPages };
    }
    
    const absolutePageIndex = pageIndexMapRef.current.get(`${currentChapter.index}_${currentPageIndex}`);
    
    return {
      current: absolutePageIndex !== undefined ? absolutePageIndex + 1 : currentPageIndex + 1,
      total: allBookPages.length,
    };
  }, [allBookPages, currentChapter.index, currentPageIndex, totalPages, pageIndexMapRef]);

  const defaultBookmarkName = React.useMemo(() => {
    return `Page ${globalPageDetails.current} of ${globalPageDetails.total}`;
  }, [globalPageDetails]);

  const isLastChapter = currentChapter.index === chaptersData.length - 1;

  const showPrevChapter = currentPageIndex === 0;
  const showCompleteBook = currentPageIndex === totalPages - 1 && isLastChapter;
  const showNextChapter = currentPageIndex === totalPages - 1 && !isLastChapter;

  return (
    <div className="w-full bg-card/65 dark:bg-card/45 border border-border/20 rounded-2xl px-5 pb-4 pt-8 md:px-8 md:pt-11 md:pb-6 shadow-2xl glass-panel relative overflow-hidden transition-opacity duration-300 flex flex-col h-[660px] min-h-[660px] max-h-[660px]">
      
      <ReaderEpubStyles />

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

      <div className="flex justify-between items-start gap-4 text-[10px] font-mono tracking-widest text-muted-foreground uppercase pb-4 border-b border-border/10 mb-4 shrink-0">
        <span className="shrink-0">Visus Reader &bull; Pro</span>
        <span className="text-primary font-bold text-right break-words whitespace-normal max-w-[70%] leading-normal tracking-wide">
          {currentChapter.title}
        </span>
      </div>

      <div 
        ref={canvasWrapperRef}
        className="flex-1 w-full overflow-hidden relative my-2 flex flex-col justify-start"
      >
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

      <PagesFooter
        isPaginationReady={isPaginationReady}
        isFullPaginationReady={isFullPaginationReady}
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
