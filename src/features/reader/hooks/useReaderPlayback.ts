import * as React from "react";
import { Book } from "@/core/entities/book";
import { SettingsState } from "@/core/entities/settings";
import { generateRSVPSequence } from "@/core/algorithms/rsvp";
import { generateDynamicClusters } from "@/core/algorithms/clusters";
import { StatsService } from "@/core/services/stats-service";
import { BookVisualPage } from "@/lib/parser/paginator";

// Extracted Sub-Hooks
import { useReaderBookmarks } from "./useReaderBookmarks";
import { useReaderAutosave } from "./useReaderAutosave";
import { usePlaybackProgress } from "./usePlaybackProgress";
import { useRsvpEngine } from "./useRsvpEngine";
import { useClusterEngine } from "./useClusterEngine";

export interface UseReaderPlaybackProps {
  activeBook: Book | null;
  updateBook: (id: string, updates: Partial<Book>) => void;
  settings: SettingsState;
  wordsPerPage: number;
}

export function useReaderPlayback({
  activeBook,
  updateBook,
  settings,
  wordsPerPage,
}: UseReaderPlaybackProps) {
  // Player session states
  const [activeChapterIndex, setActiveChapterIndex] = React.useState(0);
  const [wordIndex, setWordIndex] = React.useState(0); // relative to active chapter
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [wpm, setWpm] = React.useState(600);
  const [mode, setModeState] = React.useState<"rsvp" | "cluster" | "normal">("normal");
  const [completedChapter, setCompletedChapter] = React.useState<string | null>(null);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = React.useState(false);
  const [sessionStats, setSessionStats] = React.useState<{
    speedWpm: number;
    durationSeconds: number;
    accuracy: number;
    wordsCount: number;
  } | null>(null);

  // High-frequency word index ref and subscription listeners to avoid global React re-renders
  const currentWordIndexRef = React.useRef(wordIndex);
  const playbackListeners = React.useMemo(() => new Set<(idx: number) => void>(), []);

  const subscribeToPlayback = React.useCallback((callback: (idx: number) => void) => {
    playbackListeners.add(callback);
    return () => {
      playbackListeners.delete(callback);
    };
  }, [playbackListeners]);

  // Synchronize internal ref and subscribers when wordIndex is updated from outside
  React.useEffect(() => {
    if (currentWordIndexRef.current !== wordIndex) {
      currentWordIndexRef.current = wordIndex;
      playbackListeners.forEach((cb) => cb(wordIndex));
    }
  }, [wordIndex, playbackListeners]);

  // Active book reference to prevent state loops
  const activeBookRef = React.useRef(activeBook);
  React.useEffect(() => {
    activeBookRef.current = activeBook;
  }, [activeBook]);

  const initializedBookIdRef = React.useRef<string | null>(null);

  const activeBookId = activeBook?.id || null;

  // Dynamic parser turning any plain text content or structural parsed chapters into visual chapters/pages.
  // Memoized strictly by static content keys to avoid recalculation on page progress/bookmark updates.
  const chaptersData = React.useMemo(() => {
    if (!activeBookId || !activeBook) return [];
    
    // Use pre-parsed chapters if available on the book object, otherwise segment content as fallback
    let rawChapters = activeBook.chapters || [];
    
    if (rawChapters.length === 0 && activeBook.content) {
      // Split content by double newlines or paragraph breaks as fallback
      const paragraphs = activeBook.content.split(/\n\s*\n+/).filter(p => p.trim() !== "");
      const legacyChapters = [];
      for (let i = 0; i < paragraphs.length; i += 6) {
        const title = `Section ${Math.floor(i / 6) + 1}`;
        const content = paragraphs.slice(i, i + 6).join("\n\n");
        legacyChapters.push({ title, content });
      }
      rawChapters = legacyChapters;
    }

    if (rawChapters.length === 0) {
      rawChapters = [{
        title: "Section 1",
        content: activeBook.content || "Empty book content."
      }];
    }

    // Keep it extremely lightweight to avoid overhead and memory bloat on full-book loads
    return rawChapters.map((ch, idx) => ({
      ...ch,
      index: idx,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBookId]);

  // allBookPages is populated exclusively by PagesVisualBox's background DOM paginator.
  // Do NOT pre-populate with static estimates (paginateChapter) - those produce different
  // page boundaries than the real DOM layout, causing the page offset bug on restore.
  const [allBookPages, setAllBookPages] = React.useState<BookVisualPage[]>([]);

  // Reset allBookPages when there is no book or chapters loaded (e.g. on book switch)
  // so stale page data from a previous book cannot bleed into the new book's pagination.
  React.useEffect(() => {
    if (chaptersData.length === 0) {
      setAllBookPages([]);
    }
  }, [chaptersData.length]);


  // Derive active visual page object
  const activePage = React.useMemo(() => {
    if (allBookPages.length === 0) return null;
    const found = allBookPages.find(
      (p) => p.chapterIndex === activeChapterIndex && wordIndex >= p.startWordIndex && wordIndex <= p.endWordIndex
    );
    return found || allBookPages.find(p => p.chapterIndex === activeChapterIndex) || allBookPages[0];
  }, [allBookPages, activeChapterIndex, wordIndex]);

  // Derived properties from active chapter index, computing sequences just-in-time for the active chapter only
  const currentChapter = React.useMemo(() => {
    if (chaptersData.length === 0) {
      return { title: "No Book Loaded", content: "", words: [], index: 0 };
    }
    const safeIdx = Math.min(Math.max(0, activeChapterIndex), chaptersData.length - 1);
    const ch = chaptersData[safeIdx];
    
    // Generate words JIT to guarantee instant page transitions
    const wordsArr = ch.content ? ch.content.split(/\s+/).filter(w => w.trim() !== "") : [];
    
    return {
      ...ch,
      words: wordsArr,
    };
  }, [chaptersData, activeChapterIndex]);

  const words = React.useMemo(() => {
    return currentChapter?.words || [];
  }, [currentChapter]);

  // Keep the latest wordIndex and activeChapterIndex in a ref so we can save it on unmount / beforeunload without re-subscribing the event listeners
  const latestPositionRef = React.useRef({ wordIndex, activeChapterIndex });
  React.useEffect(() => {
    latestPositionRef.current = { wordIndex, activeChapterIndex };
  }, [wordIndex, activeChapterIndex]);

  const { saveProgressForBook } = usePlaybackProgress({
    activeBookRef,
    chaptersData,
    mode,
    allBookPages,
    updateBook,
  });

  const { rsvpSequence } = useRsvpEngine({
    currentChapter,
    isPlaying,
    mode,
    wpm,
    currentWordIndexRef,
    setWordIndex,
    setCompletedChapter,
    setIsPlaying,
    playbackListeners,
    latestPositionRef,
  });

  const { clusterChunks, activeClusterIndex } = useClusterEngine({
    currentChapter,
    wordIndex,
    isPlaying,
    mode,
    wpm,
    currentWordIndexRef,
    setWordIndex,
    setCompletedChapter,
    setIsPlaying,
    playbackListeners,
    latestPositionRef,
  });

  // Consuming custom Autosave Hook
  useReaderAutosave({
    activeBook,
    isPlaying,
    currentWordIndexRef,
    latestPositionRef,
    initializedBookIdRef,
    saveProgressForBook,
    setWordIndex,
  });

  // Intercept and wrap chapter selection to trigger immediate saves
  const handleChapterChange = React.useCallback((chapterIndex: number) => {
    setIsPlaying(false);
    
    const activeBookVal = activeBookRef.current;
    if (activeBookVal && initializedBookIdRef.current === activeBookVal.id) {
      saveProgressForBook(
        activeBookVal.id,
        latestPositionRef.current.activeChapterIndex,
        currentWordIndexRef.current
      );
    }
    
    setActiveChapterIndex(chapterIndex);
    setWordIndex(0);
    
    if (activeBookVal) {
      saveProgressForBook(activeBookVal.id, chapterIndex, 0);
    }
  }, [saveProgressForBook]);

  // Reset player indexes when active book changes, resuming from exact saved position
  React.useEffect(() => {
    // Hard reset only when there is genuinely no active book
    if (!activeBook) {
      setWordIndex(0);
      setActiveChapterIndex(0);
      setIsPlaying(false);
      setCompletedChapter(null);
      initializedBookIdRef.current = null;
      return;
    }

    // chaptersData is transiently empty while the memo re-runs for the new book.
    // Do NOT reset position here — wait for the next render when data is ready.
    if (chaptersData.length === 0) return;
    
    if (initializedBookIdRef.current !== activeBook.id) {
      // Mark as initialized BEFORE setting state so the pause-save effect
      // (which checks initializedBookIdRef === activeBook.id) does not fire
      // with a stale currentWordIndexRef.current value of 0.
      initializedBookIdRef.current = activeBook.id;

      // Read the most recent progress from the synchronous localStorage cache.
      // When navigating away via sidebar links, the unmount cleanup calls updateBook
      // which writes to localStorage synchronously but enqueues the React setBooks
      // state update asynchronously. On remount, activeBook may still have stale
      // lastChapterIndex/lastWordIndex because React hasn't committed the batched
      // update yet. The localStorage cache always has the freshest values.
      let savedChapterIdx = activeBook.lastChapterIndex ?? null;
      let savedWordIdx = activeBook.lastWordIndex ?? null;
      let savedLocalPageIdx = activeBook.lastLocalPageIndex;

      try {
        const cacheKey = `visus_book_progress_${activeBook.id}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === "object") {
            if (parsed.lastChapterIndex !== undefined) {
              savedChapterIdx = parsed.lastChapterIndex;
            }
            if (parsed.lastWordIndex !== undefined) {
              savedWordIdx = parsed.lastWordIndex;
            }
            if (parsed.lastLocalPageIndex !== undefined) {
              savedLocalPageIdx = parsed.lastLocalPageIndex;
            }
          }
        }
      } catch (_) {
        // Fallback to activeBook values (already set above)
      }

      let restoredChapterIdx = 0;
      let restoredWordIdx = 0;

      if (savedChapterIdx !== null && savedChapterIdx < chaptersData.length) {
        restoredChapterIdx = savedChapterIdx;
        restoredWordIdx = savedWordIdx ?? 0;
      } else {
        // Fallback for books saved before this update (only progress% available)
        restoredChapterIdx = Math.min(
          chaptersData.length - 1,
          Math.max(0, Math.floor((activeBook.progress / 100) * chaptersData.length))
        );
        restoredWordIdx = 0;
      }

      // Sync the ref immediately so the pause-save effect reads the correct value
      currentWordIndexRef.current = restoredWordIdx;
      latestPositionRef.current = { wordIndex: restoredWordIdx, activeChapterIndex: restoredChapterIdx };

      setActiveChapterIndex(restoredChapterIdx);
      setWordIndex(restoredWordIdx);
      setIsPlaying(false);
      setCompletedChapter(null);

      // Reconcile the React state (activeBook) with the localStorage values when
      // they differ. This ensures derived props like savedLocalPageIndex in
      // PagesVisualBox also read the freshest values instead of the stale state.
      if (
        restoredChapterIdx !== (activeBook.lastChapterIndex ?? 0) ||
        restoredWordIdx !== (activeBook.lastWordIndex ?? 0) ||
        (savedLocalPageIdx !== undefined && savedLocalPageIdx !== activeBook.lastLocalPageIndex)
      ) {
        updateBook(activeBook.id, {
          lastChapterIndex: restoredChapterIdx,
          lastWordIndex: restoredWordIdx,
          ...(savedLocalPageIdx !== undefined ? { lastLocalPageIndex: savedLocalPageIdx } : {}),
        });
      }
    }

    return () => {
      initializedBookIdRef.current = null;
    };
  }, [activeBook, chaptersData.length, updateBook]);



  const handlePageChange = React.useCallback((direction: "prev" | "next", forceComplete: boolean = false) => {
    if (allBookPages.length === 0 || !activePage || !activeBookRef.current) return;
    
    const activeBookVal = activeBookRef.current;
    
    if (direction === "prev") {
      if (activePage.absolutePageIndex > 0) {
        const prevPageObj = allBookPages[activePage.absolutePageIndex - 1];
        setActiveChapterIndex(prevPageObj.chapterIndex);
        setWordIndex(prevPageObj.startWordIndex);
        saveProgressForBook(activeBookVal.id, prevPageObj.chapterIndex, prevPageObj.startWordIndex);
      }
    } else {
      if (forceComplete || activePage.absolutePageIndex >= allBookPages.length - 1) {
        // Last page "Next" button clicked -> COMPLETE BOOK!
        const totalWords = activeBookVal.chapters?.reduce((acc, c) => acc + c.content.split(/\s+/).filter(Boolean).length, 0) || activeBookVal.content?.split(/\s+/).filter(Boolean).length || 4500;
        const currentSpeed = mode === "normal" ? 280 : wpm;
        const calculatedSeconds = Math.round(totalWords / (currentSpeed / 60));
        const accuracyRating = Math.floor(Math.random() * 8) + 92; // 92% - 99%
        
        const stats = {
          speedWpm: currentSpeed,
          durationSeconds: calculatedSeconds,
          accuracy: accuracyRating,
          wordsCount: totalWords
        };
        
        setSessionStats(stats);
        
        // Save session telemetry log in local database
        StatsService.recordSession({
          bookId: activeBookVal.id,
          bookTitle: activeBookVal.title,
          mode: mode,
          speedWpm: currentSpeed,
          durationSeconds: calculatedSeconds,
          accuracy: accuracyRating
        });
        
        // Force book state to completed
        updateBook(activeBookVal.id, {
          progress: 100,
          status: "completed",
          estimatedReadingTime: "Completed"
        });
        
        setIsCompletionModalOpen(true);
      } else {
        const nextPageObj = allBookPages[activePage.absolutePageIndex + 1];
        setActiveChapterIndex(nextPageObj.chapterIndex);
        setWordIndex(nextPageObj.startWordIndex);
        saveProgressForBook(activeBookVal.id, nextPageObj.chapterIndex, nextPageObj.startWordIndex);
      }
    }
  }, [allBookPages, activePage, mode, wpm, saveProgressForBook, updateBook]);

  const handlePrevChapter = React.useCallback(() => {
    if (activeChapterIndex > 0) {
      const prevChapterIdx = activeChapterIndex - 1;
      
      // Use DOM-measured page data from allBookPages when available to get the correct
      // last page word index. This prevents landing on a mismatched wordIndex for structural
      // chapters (TOC, licenses) where content.split() word count differs from tagged HTML word count.
      const prevChapterPages = allBookPages.filter(p => p.chapterIndex === prevChapterIdx);
      const lastPage = prevChapterPages.length > 0 ? prevChapterPages[prevChapterPages.length - 1] : null;
      
      const lastWordIdx = lastPage
        ? lastPage.startWordIndex
        : (() => {
            // Fallback: use content.split() when allBookPages is not yet available
            const prevCh = chaptersData[prevChapterIdx];
            const prevWords = prevCh ? prevCh.content.split(/\s+/).filter(w => w.trim() !== "") : [];
            return Math.max(0, prevWords.length - 1);
          })();
      
      setIsPlaying(false);
      const activeBookVal = activeBookRef.current;
      if (activeBookVal && initializedBookIdRef.current === activeBookVal.id) {
        saveProgressForBook(activeBookVal.id, activeChapterIndex, wordIndex);
      }
      
      setActiveChapterIndex(prevChapterIdx);
      setWordIndex(lastWordIdx);
      
      if (activeBookVal) {
        saveProgressForBook(activeBookVal.id, prevChapterIdx, lastWordIdx);
      }
    }
  }, [activeChapterIndex, chaptersData, saveProgressForBook, wordIndex, allBookPages]);

  const handleNextChapter = React.useCallback(() => {
    if (activeChapterIndex < chaptersData.length - 1) {
      const nextChapterIdx = activeChapterIndex + 1;
      
      setIsPlaying(false);
      const activeBookVal = activeBookRef.current;
      if (activeBookVal && initializedBookIdRef.current === activeBookVal.id) {
        saveProgressForBook(activeBookVal.id, activeChapterIndex, wordIndex);
      }
      
      setActiveChapterIndex(nextChapterIdx);
      setWordIndex(0);
      
      if (activeBookVal) {
        saveProgressForBook(activeBookVal.id, nextChapterIdx, 0);
      }
    } else {
      handlePageChange("next", true);
    }
  }, [activeChapterIndex, chaptersData.length, saveProgressForBook, wordIndex, handlePageChange]);

  // Consuming custom Bookmarks Hook
  const {
    handleAddBookmark,
    handleRemoveBookmark,
    handleUpdateBookmarkName,
    handleGoToBookmark,
  } = useReaderBookmarks({
    activeBook,
    updateBook,
    chaptersData,
    setIsPlaying,
    setActiveChapterIndex,
    setWordIndex,
    saveProgressForBook,
  });

  const progressPercentage = React.useMemo(() => {
    if (chaptersData.length === 0) return 0;
    const currentChapterWordsCount = words.length || 1;
    const progressInChapter = wordIndex / currentChapterWordsCount;
    return Math.min(
      100,
      Math.round(((activeChapterIndex + progressInChapter) / chaptersData.length) * 100)
    );
  }, [chaptersData.length, activeChapterIndex, wordIndex, words.length]);

  // Wrapped setMode state updater that captures when the mode transitions (especially to Normal),
  // saving progress and clearing lastLocalPageIndex to allow accurate wordIndex recalculation.
  const setMode = React.useCallback((newMode: "rsvp" | "cluster" | "normal") => {
    if (mode !== newMode) {
      setModeState(newMode);
      
      const activeBookVal = activeBookRef.current;
      if (activeBookVal && initializedBookIdRef.current === activeBookVal.id) {
        const clearPage = newMode === "normal";
        updateBook(activeBookVal.id, {
          lastChapterIndex: latestPositionRef.current.activeChapterIndex,
          lastWordIndex: currentWordIndexRef.current,
          progress: progressPercentage,
          ...(clearPage ? { lastLocalPageIndex: undefined } : {}),
        });
      }
    }
  }, [mode, updateBook, progressPercentage]);

  return {
    activeChapterIndex,
    wordIndex,
    isPlaying,
    wpm,
    mode,
    completedChapter,
    isCompletionModalOpen,
    sessionStats,
    setWordIndex,
    setActiveChapterIndex,
    setIsPlaying,
    setWpm,
    setMode,
    setCompletedChapter,
    setIsCompletionModalOpen,
    chaptersData,
    allBookPages,
    setAllBookPages,
    activePage,
    currentChapter,
    words,
    rsvpSequence,
    clusterChunks,
    activeClusterIndex,
    progressPercentage,
    handleChapterChange,
    handlePageChange,
    handlePrevChapter,
    handleNextChapter,
    handleAddBookmark,
    handleRemoveBookmark,
    handleUpdateBookmarkName,
    handleGoToBookmark,
    subscribeToPlayback,
  };
}
