"use client";

import * as React from "react";
import { Bookmark, Annotation } from "@/core/entities/book";
import { useSettings } from "@/features/settings/context/settings-context";
import { getFontFamilyStyle } from "@/lib/typography";
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
import { findPageForWordIndex, findFirstPageOfChapter, findLastPageOfChapter } from "../utils/binarySearch";
import { motion, AnimatePresence } from "framer-motion";

// Text Selection & Annotations
import { useTextSelection } from "../hooks/useTextSelection";
import { SelectionToolbar } from "./SelectionToolbar";
import { DictionaryModal } from "./DictionaryModal";
import { AnnotationNoteDialog } from "./AnnotationNoteDialog";
import { dbService } from "@/core/services/db-service";
import { toast } from "sonner";
import { MessageSquare, BookOpen, Search, Volume2, Copy } from "lucide-react";
import { getUncoveredSegments } from "../utils/annotationOverlap";

interface PagesVisualBoxProps {
  activeBookId: string;
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
  activeBookId,
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
  const { customFonts, settings } = useSettings();
  const columnGap = 40;
  const [totalPages, setTotalPages] = React.useState(1);
  const columnsContainerRef = React.useRef<HTMLDivElement>(null);
  const hiddenPaginatorRef = React.useRef<HTMLDivElement>(null);
  const canvasWrapperRef = React.useRef<HTMLDivElement>(null);

  // Subscribe atomically to Zustand store properties
  const wordIndex = useReadingStore((state) => state.wordIndex);
  const activeChapterIndex = useReadingStore((state) => state.activeChapterIndex);
  const allBookPages = useReadingStore((state) => state.allBookPages);
  const storeActiveBookId = useReadingStore((state) => state.activeBookId);

  const setWordIndex = React.useCallback((w: number) => {
    useReadingStore.getState().setWordIndex(w);
  }, []);

  // Compute currentPageIndex synchronously
  const currentPageIndex = React.useMemo(() => {
    if (!allBookPages || allBookPages.length === 0) return 0;

    const page = findPageForWordIndex(allBookPages, currentChapter.index, wordIndex);
    if (page) {
      return page.pageIndex;
    }

    // Fallback if out of bounds: 0 if before, last if after
    const firstPage = findFirstPageOfChapter(allBookPages, currentChapter.index);
    if (firstPage && wordIndex < firstPage.startWordIndex) return 0;

    // Count pages for the current chapter to return the last page index
    // This is essentially fallback but binary search makes the prior step fast
    let lastIdx = 0;
    for (let i = allBookPages.length - 1; i >= 0; i--) {
      if (allBookPages[i].chapterIndex === currentChapter.index) {
        lastIdx = allBookPages[i].pageIndex;
        break;
      }
    }
    return lastIdx;
  }, [allBookPages, currentChapter.index, wordIndex]);

  // Derived active visual page object
  const activePage = React.useMemo(() => {
    if (allBookPages.length === 0) return null;
    const found = findPageForWordIndex(allBookPages, activeChapterIndex, wordIndex);
    return found || findFirstPageOfChapter(allBookPages, activeChapterIndex) || allBookPages[0];
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

  const { isPaginationReady, isFullPaginationReady, pageIndexMapRef } = useDomPagination({
    chaptersData,
    containerDimensions,
    scaledFontSize,
    readerFontClass,
    wordsPerPage,
    hiddenPaginatorRef,
    columnGap,
    latestRestoreTargetRef,
    initialReady: allBookPages.length > 0 && storeActiveBookId === activeBookId,
  });

  // Synchronous source of truth: does the store actually have pages for this chapter?
  const hasPagesForCurrentChapter = React.useMemo(() => {
    return !!findFirstPageOfChapter(allBookPages, currentChapter.index);
  }, [allBookPages, currentChapter.index]);

  // Combined ready state that responds immediately to chapter changes
  const isReady = isPaginationReady && hasPagesForCurrentChapter;

  // Source of truth for total pages in the current chapter
  const totalPagesInChapter = React.useMemo(() => {
    if (hasPagesForCurrentChapter) {
      const lastPage = findLastPageOfChapter(allBookPages, currentChapter.index);
      if (lastPage) return lastPage.pageIndex + 1;
    }
    return totalPages;
  }, [hasPagesForCurrentChapter, allBookPages, currentChapter.index, totalPages]);

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
    totalPages: totalPagesInChapter,
    setWordIndex,
    onSavePageProgress,
    onPrevChapter,
    onNextChapter,
  });

  // --- ANNOTATIONS ENGINE ---
  const allAnnotations = useReadingStore((state) => state.annotations);
  const setAnnotations = useReadingStore((state) => state.setAnnotations);
  const chapterAnnotations = React.useMemo(() => {
    return allAnnotations.filter(a => a.chapterIndex === currentChapter.index);
  }, [allAnnotations, currentChapter.index]);

  const {
    selection,
    position,
    isDragging,
    clearSelection,
    updateSelection: updateSelectionRange,
    selectWord,
    selectRange,
  } = useTextSelection(columnsContainerRef);

  const [isDictionaryOpen, setIsDictionaryOpen] = React.useState(false);
  const [selectedWord, setSelectedWord] = React.useState("");
  const [isNoteDialogOpen, setIsNoteDialogOpen] = React.useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = React.useState<Annotation | null>(null);
  const [currentColor, setCurrentColor] = React.useState("#fef08a");

  const handleAddAnnotation = React.useCallback(async (color: string, style: Annotation["style"] = "highlight", startIndex?: number, endIndex?: number) => {
    const finalStart = startIndex ?? selection?.startWordIndex;
    const finalEnd = endIndex ?? selection?.endWordIndex;

    if (finalStart === undefined || finalEnd === undefined) return;

    const segments = getUncoveredSegments(finalStart, finalEnd, chapterAnnotations);

    if (segments.length === 0) {
      return;
    }

    const newAnnotations: Annotation[] = segments.map((seg) => ({
      id: crypto.randomUUID(),
      bookId: activeBookId,
      chapterIndex: currentChapter.index,
      startWordIndex: seg.startWordIndex,
      endWordIndex: seg.endWordIndex,
      color,
      style,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    try {
      for (const ann of newAnnotations) {
        await dbService.saveAnnotation(ann);
      }
      setAnnotations([...allAnnotations, ...newAnnotations]);
      clearSelection();
      setCurrentColor(color);
    } catch (error) {
      toast.error("Failed to save annotation");
    }
  }, [selection, activeBookId, currentChapter.index, allAnnotations, setAnnotations, clearSelection, chapterAnnotations]);

  const handleCopy = React.useCallback(() => {
    if (selection) {
      navigator.clipboard.writeText(`"${selection.text}"\n— ${currentChapter.title}`);
      toast.success("Copied to clipboard");
      clearSelection();
    }
  }, [selection, currentChapter.title, clearSelection]);

  const handleTTS = React.useCallback(() => {
    if (selection && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(selection.text);
      window.speechSynthesis.speak(utterance);
      clearSelection();
    } else {
      toast.error("Text-to-speech not supported in this browser");
    }
  }, [selection, clearSelection]);

  const handleDictionary = React.useCallback(() => {
    const textToSearch = selection?.text || selectedWord;
    if (textToSearch) {
      setSelectedWord(textToSearch);
      setIsDictionaryOpen(true);
      // We don't clear selection yet so the user sees what they are looking up
    }
  }, [selection, selectedWord]);

  const handleWebSearch = React.useCallback(() => {
    const textToSearch = selection?.text || selectedWord;
    if (textToSearch) {
      const query = encodeURIComponent(textToSearch);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
      clearSelection();
    }
  }, [selection, selectedWord, clearSelection]);

  // Stabilize handlers for the memoized reader content to prevent DOM replacements
  // that would blow away native selection and manual annotation paints.
  const handleContextMenuRef = React.useRef<((e: React.MouseEvent) => void) | null>(null);
  const handleDoubleClickRef = React.useRef<((e: React.MouseEvent) => void) | null>(null);
  const handleMouseUpRef = React.useRef<((e: React.MouseEvent | React.TouchEvent) => void) | null>(null);

  const handleContextMenu = React.useCallback((e: React.MouseEvent) => {
    handleContextMenuRef.current?.(e);
  }, []);

  const handleDoubleClick = React.useCallback((e: React.MouseEvent) => {
    handleDoubleClickRef.current?.(e);
  }, []);

  const handleMouseUp = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
    handleMouseUpRef.current?.(e);
  }, []);

  const handleAnnotationClick = React.useCallback((wordIndex: number) => {
    const annotation = chapterAnnotations.find(
      a => wordIndex >= a.startWordIndex && wordIndex <= a.endWordIndex
    );
    if (!annotation) return;
    setSelectedAnnotation(annotation);
    selectRange(annotation.startWordIndex, annotation.endWordIndex);
  }, [chapterAnnotations, selectRange]);

  React.useLayoutEffect(() => {
    handleContextMenuRef.current = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    handleDoubleClickRef.current = (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      const wordIndexAttr = target.getAttribute('data-word-index');
      if (wordIndexAttr) {
        selectWord(parseInt(wordIndexAttr, 10));
      }
    };
  }, [selectWord]);

  React.useLayoutEffect(() => {
    handleMouseUpRef.current = (e: React.MouseEvent | React.TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.selection-toolbar') || target.closest('.context-menu-container')) {
        return;
      }

      const sel = window.getSelection();
      if (sel && sel.isCollapsed) {
        const wordIndexAttr = target.getAttribute('data-word-index');
        if (wordIndexAttr !== null) {
          const wordIndex = parseInt(wordIndexAttr, 10);
          handleAnnotationClick(wordIndex);
          return;
        }
        setSelectedAnnotation(null);
      }
    };
  }, [handleAnnotationClick]);

  const handleMouseDown = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.selection-toolbar') || target.closest('.context-menu-container')) {
      return;
    }
  }, []);

  React.useEffect(() => {
    if (!isReady) return;

    const paintAnnotations = () => {
      const container = columnsContainerRef.current;
      if (!container) return;

      // Clear previous highlights completely
      const allSpans = container.querySelectorAll('span[data-word-index]');
      allSpans.forEach((node) => {
        const span = node as HTMLElement;
        span.style.backgroundColor = '';
        span.style.textDecoration = '';
        span.style.textDecorationStyle = '';
        span.style.textDecorationColor = '';
        span.style.cursor = '';
      });

      // Apply active highlights
      chapterAnnotations.forEach(annotation => {
        for (let i = annotation.startWordIndex; i <= annotation.endWordIndex; i++) {
          const span = container.querySelector(`span[data-word-index="${i}"]`) as HTMLElement;
          if (span) {
            if (annotation.style === 'highlight') {
              span.style.backgroundColor = annotation.color;
            } else {
              span.style.textDecoration = 'underline';
              span.style.textDecorationStyle = annotation.style;
              span.style.textDecorationColor = annotation.color;
            }
            span.style.cursor = 'pointer';
          }
        }
      });
    };

    // Paint immediately
    paintAnnotations();
    
    // Safety delay to ensure DOM is fully settled and animations finished
    const timer = setTimeout(paintAnnotations, 100);
    return () => clearTimeout(timer);
  }, [chapterAnnotations, formattedHtml, currentPageIndex, isReady]);

  const handleSaveAnnotationNote = async (note: string, tags: string[]) => {
    if (!selectedAnnotation) return;
    const updated: Annotation = {
      ...selectedAnnotation,
      note,
      tags,
      updatedAt: new Date().toISOString(),
    };

    try {
      await dbService.saveAnnotation(updated);
      setAnnotations(allAnnotations.map(a => a.id === updated.id ? updated : a));
      setIsNoteDialogOpen(false);
      setSelectedAnnotation(null);
      clearSelection();
      toast.success("Note saved");
    } catch (error) {
      toast.error("Failed to update note");
    }
  };

  const handleDeleteAnnotation = async () => {
    if (!selectedAnnotation) return;
    try {
      await dbService.deleteAnnotation(selectedAnnotation.id);
      setAnnotations(allAnnotations.filter(a => a.id !== selectedAnnotation.id));
      setSelectedAnnotation(null);
      clearSelection();
      toast.success("Annotation removed");
    } catch (error) {
      toast.error("Failed to delete annotation");
    }
  };

  const handleAddNoteToSelection = React.useCallback(async () => {
    if (selectedAnnotation) {
      setIsNoteDialogOpen(true);
      return;
    }
    if (!selection) return;

    const segments = getUncoveredSegments(selection.startWordIndex, selection.endWordIndex, chapterAnnotations);

    if (segments.length === 0) return;

    const newAnnotations: Annotation[] = segments.map((seg) => ({
      id: crypto.randomUUID(),
      bookId: activeBookId,
      chapterIndex: currentChapter.index,
      startWordIndex: seg.startWordIndex,
      endWordIndex: seg.endWordIndex,
      color: currentColor,
      style: "highlight",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    try {
      for (const ann of newAnnotations) {
        await dbService.saveAnnotation(ann);
      }
      setAnnotations([...allAnnotations, ...newAnnotations]);
      if (newAnnotations.length === 1) {
        setSelectedAnnotation(newAnnotations[0]);
        setIsNoteDialogOpen(true);
      } else {
        clearSelection();
      }
    } catch (error) {
      toast.error("Failed to save annotation");
    }
  }, [selectedAnnotation, selection, currentColor, activeBookId, currentChapter.index, allAnnotations, setAnnotations, chapterAnnotations, clearSelection]);

  // Reset measured pages IMMEDIATELY when chapter changes to prevent stale navigation logic
  const [lastChapterIdx, setLastChapterIdx] = React.useState(currentChapter.index);
  if (lastChapterIdx !== currentChapter.index) {
    setLastChapterIdx(currentChapter.index);
    setTotalPages(1);
  }

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
      const wrapper = canvasWrapperRef.current;
      if (!wrapper) return;

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

    let timeoutId: NodeJS.Timeout;
    let isMounted = true;

    const observer = new ResizeObserver(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (isMounted) updateDimensions();
      }, 150);
    });
    observer.observe(wrapper);

    return () => {
      isMounted = false;
      observer.disconnect();
      clearTimeout(timeoutId);
    };
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
      return { current: currentPageIndex + 1, total: totalPagesInChapter };
    }

    const absolutePageIndex = pageIndexMapRef.current.get(`${currentChapter.index}_${currentPageIndex}`);

    return {
      current: absolutePageIndex !== undefined ? absolutePageIndex + 1 : currentPageIndex + 1,
      total: allBookPages.length,
    };
  }, [allBookPages, currentChapter.index, currentPageIndex, totalPagesInChapter, pageIndexMapRef]);

  const defaultBookmarkName = React.useMemo(() => {
    return `Page ${globalPageDetails.current} of ${globalPageDetails.total}`;
  }, [globalPageDetails]);

  const isLastChapter = currentChapter.index === chaptersData.length - 1;

  const showPrevChapter = currentPageIndex === 0;
  const showCompleteBook = currentPageIndex === totalPagesInChapter - 1 && isLastChapter;
  const showNextChapter = currentPageIndex === totalPagesInChapter - 1 && !isLastChapter;

  // Memoized Reader Content to prevent re-renders during selection/dragging
  const readerContent = React.useMemo(() => (
    <div
      ref={columnsContainerRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      data-custom-context-menu="true"
      className={`h-full epub-content ${readerFontClass} selection-no-browser-ui`}
      style={{
        columnWidth: "100%",
        columnCount: 1,
        columnGap: `${columnGap}px`,
        columnFill: "auto",
        transform: `translateX(-${currentPageIndex * ((containerDimensions?.width || 0) + columnGap)}px)`,
        fontSize: `${scaledFontSize}px`,
        lineHeight: "1.75",
        fontFamily: getFontFamilyStyle(settings.general.readerFontFamily, customFonts),
      }}
      dangerouslySetInnerHTML={{ __html: formattedHtml }}
    />
  ), [
    formattedHtml, 
    readerFontClass, 
    columnGap, 
    currentPageIndex, 
    containerDimensions, 
    scaledFontSize, 
    settings.general.readerFontFamily, 
    customFonts,
    handleMouseDown,
    handleMouseUp,
    handleDoubleClick,
    handleContextMenu
  ]);

  return (
    <div className="w-full bg-card border border-border/20 rounded-2xl px-3.5 pb-3 pt-5 sm:px-5 sm:pb-4 sm:pt-8 md:px-8 md:pt-11 md:pb-6 shadow-2xl relative overflow-hidden transition-opacity duration-300 flex flex-col h-full md:h-[660px] min-h-0">

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

      <div className="hidden sm:flex justify-between items-start gap-4 text-[10px] font-mono tracking-widest text-muted-foreground uppercase pb-4 border-b border-border/10 mb-4 shrink-0">
        <span className="shrink-0">Visus Reader &bull; Pro</span>
        <span className="text-primary font-bold text-right break-words whitespace-normal max-w-[70%] leading-normal tracking-wide">
          {currentChapter.title}
        </span>
      </div>

      <div
        ref={canvasWrapperRef}
        className="flex-1 w-full overflow-hidden relative my-2 flex flex-col justify-start min-h-0"
      >
        <AnimatePresence>
          {!isReady && (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex items-center justify-center bg-card/80 backdrop-blur-sm rounded-xl"
            >
              <LoadingSpinner message="Optimizing layout..." />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentChapter.index}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: isReady ? 1 : 0, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="h-full w-full overflow-hidden relative"
            style={{
              width: containerDimensions ? `${containerDimensions.width}px` : "100%",
              margin: "0 auto",
              willChange: "opacity, transform",
            }}
          >
            {readerContent}
          </motion.div>
        </AnimatePresence>
      </div>

      <SelectionToolbar
        selection={selection}
        position={position}
        existingAnnotation={selectedAnnotation}
        onHighlight={(color) => handleAddAnnotation(color, "highlight")}
        onAddNote={handleAddNoteToSelection}
        onDictionary={handleDictionary}
        onCopy={handleCopy}
        onSearch={handleWebSearch}
        onTTS={handleTTS}
        onDelete={selectedAnnotation ? handleDeleteAnnotation : undefined}
        onClose={() => { clearSelection(); setSelectedAnnotation(null); }}
        currentColor={currentColor}
      />

      <AnimatePresence>
        {isDictionaryOpen && (
          <DictionaryModal
            word={selectedWord}
            onClose={() => {
              setIsDictionaryOpen(false);
              clearSelection();
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isNoteDialogOpen && selectedAnnotation && (
          <AnnotationNoteDialog
            annotation={selectedAnnotation}
            onSave={handleSaveAnnotationNote}
            onDelete={handleDeleteAnnotation}
            onClose={() => { setIsNoteDialogOpen(false); }}
          />
        )}
      </AnimatePresence>

      <PagesFooter
        isPaginationReady={isReady}
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
            fontFamily: getFontFamilyStyle(settings.general.readerFontFamily, customFonts),
          }}
        />
      </div>
    </div>
  );
}
