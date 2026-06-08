import * as React from "react";
import { Book } from "@/core/entities/book";
import { SettingsState } from "@/core/entities/settings";
import { StatsService } from "@/core/services/stats-service";
import { BookVisualPage } from "@/lib/parser/paginator";
import { useReadingStore } from "../stores/reading-store";

// Extracted Sub-Hooks
import { useReaderBookmarks } from "./useReaderBookmarks";
import { useReaderAutosave } from "./useReaderAutosave";
import { usePlaybackProgress } from "./usePlaybackProgress";
import { useRsvpEngine } from "./useRsvpEngine";
import { useClusterEngine } from "./useClusterEngine";

export interface UseReaderPlaybackProps {
  activeBook: Book | null;
  updateBook: (id: string, updates: Partial<Book>, silent?: boolean) => void;
  settings: SettingsState;
  wordsPerPage: number;
}

export function useReaderPlayback({
  activeBook,
  updateBook,
  settings,
  wordsPerPage,
}: UseReaderPlaybackProps) {
  // Modal & Stats session states (low-frequency)
  const [isCompletionModalOpen, setIsCompletionModalOpen] = React.useState(false);
  const [sessionStats, setSessionStats] = React.useState<{
    speedWpm: number;
    durationSeconds: number;
    accuracy: number;
    wordsCount: number;
  } | null>(null);

  // Active book reference to prevent state loops
  const activeBookRef = React.useRef(activeBook);
  React.useEffect(() => {
    activeBookRef.current = activeBook;
  }, [activeBook]);

  const initializedBookIdRef = React.useRef<string | null>(null);
  const activeBookId = activeBook?.id || null;

  // Dynamic parser turning any plain text content or structural parsed chapters into visual chapters/pages.
  const chaptersData = React.useMemo(() => {
    if (!activeBook) return [];
    
    let rawChapters = activeBook.chapters || [];
    
    if (rawChapters.length === 0 && activeBook.content) {
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

    return rawChapters.map((ch, idx) => ({
      ...ch,
      index: idx,
    }));
  }, [activeBook?.id, activeBook?.chapters, activeBook?.content]);

  // allBookPages is populated exclusively by PagesVisualBox's background DOM paginator.
  const [allBookPages, setAllBookPages] = React.useState<BookVisualPage[]>([]);

  // Reset allBookPages when there is no book or chapters loaded
  React.useEffect(() => {
    if (chaptersData.length === 0) {
      setAllBookPages([]);
    }
  }, [chaptersData.length]);

  const mode = useReadingStore((state) => state.mode);
  const wpm = useReadingStore((state) => state.wpm);
  const activeChapterIndex = useReadingStore((state) => state.activeChapterIndex);

  const { saveProgressForBook } = usePlaybackProgress({
    activeBookRef,
    chaptersData,
    mode,
    allBookPages,
    updateBook,
  });

  const { rsvpSequence } = useRsvpEngine({
    currentChapter: React.useMemo(() => {
      const safeIdx = Math.min(Math.max(0, activeChapterIndex), chaptersData.length - 1);
      const ch = chaptersData[safeIdx] || { title: "No Book", content: "" };
      const wordsArr = ch.content ? ch.content.split(/\s+/).filter(w => w.trim() !== "") : [];
      return { ...ch, words: wordsArr, index: safeIdx };
    }, [chaptersData, activeChapterIndex]),
    mode,
    wpm,
  });

  const { clusterChunks } = useClusterEngine({
    currentChapter: React.useMemo(() => {
      const safeIdx = Math.min(Math.max(0, activeChapterIndex), chaptersData.length - 1);
      const ch = chaptersData[safeIdx] || { title: "No Book", content: "" };
      const wordsArr = ch.content ? ch.content.split(/\s+/).filter(w => w.trim() !== "") : [];
      return { ...ch, words: wordsArr, index: safeIdx };
    }, [chaptersData, activeChapterIndex]),
    mode,
    wpm,
  });

  // Consuming custom Autosave Hook
  useReaderAutosave({
    activeBook,
    saveProgressForBook,
  });

  // Intercept and wrap chapter selection to trigger immediate saves
  const handleChapterChange = React.useCallback((chapterIndex: number) => {
    useReadingStore.getState().setIsPlaying(false);
    useReadingStore.getState().setCompletedChapter(null);
    
    const activeBookVal = activeBookRef.current;
    
    useReadingStore.getState().setActiveChapterIndex(chapterIndex);
    useReadingStore.getState().setWordIndex(0);
    
    if (activeBookVal) {
      saveProgressForBook(activeBookVal.id, chapterIndex, 0);
    }
  }, [saveProgressForBook]);

  // Reset player indexes when active book changes, resuming from exact saved position
  React.useEffect(() => {
    const book = activeBookRef.current;
    if (!book || !activeBookId) {
      useReadingStore.getState().initBook("", 0, 0, 600, "normal", []);
      initializedBookIdRef.current = null;
      return;
    }

    if (chaptersData.length === 0) return;
    
    if (initializedBookIdRef.current !== activeBookId) {
      initializedBookIdRef.current = activeBookId;

      let savedChapterIdx = book.lastChapterIndex ?? null;
      let savedWordIdx = book.lastWordIndex ?? null;
      let savedLocalPageIdx = book.lastLocalPageIndex;

      try {
        const cacheKey = `visus_book_progress_${book.id}`;
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
      } catch (_) {}

      let restoredChapterIdx = 0;
      let restoredWordIdx = 0;

      if (savedChapterIdx !== null && savedChapterIdx < chaptersData.length) {
        restoredChapterIdx = savedChapterIdx;
        restoredWordIdx = savedWordIdx ?? 0;
      } else {
        restoredChapterIdx = Math.min(
          chaptersData.length - 1,
          Math.max(0, Math.floor((book.progress / 100) * chaptersData.length))
        );
        restoredWordIdx = 0;
      }

      useReadingStore.getState().initBook(
        book.id,
        restoredChapterIdx,
        restoredWordIdx,
        600,
        "normal",
        chaptersData
      );

      if (
        restoredChapterIdx !== (book.lastChapterIndex ?? 0) ||
        restoredWordIdx !== (book.lastWordIndex ?? 0) ||
        (savedLocalPageIdx !== undefined && savedLocalPageIdx !== book.lastLocalPageIndex)
      ) {
        updateBook(book.id, {
          lastChapterIndex: restoredChapterIdx,
          lastWordIndex: restoredWordIdx,
          ...(savedLocalPageIdx !== undefined ? { lastLocalPageIndex: savedLocalPageIdx } : {}),
        });
      }
    }

    return () => {
      initializedBookIdRef.current = null;
      useReadingStore.getState().setIsPlaying(false);
    };
  }, [activeBookId, chaptersData, updateBook]);

  const handlePageChange = React.useCallback((direction: "prev" | "next", forceComplete: boolean = false) => {
    if (allBookPages.length === 0 || !activeBookRef.current) return;
    
    const activeBookVal = activeBookRef.current;
    const { wordIndex, activeChapterIndex, wpm, mode } = useReadingStore.getState();
    const activePage = allBookPages.find(
      (p) => p.chapterIndex === activeChapterIndex && wordIndex >= p.startWordIndex && wordIndex <= p.endWordIndex
    ) || allBookPages.find(
      (p) => p.chapterIndex === activeChapterIndex && wordIndex < p.startWordIndex
    ) || allBookPages.filter(p => p.chapterIndex === activeChapterIndex).pop() || allBookPages[0];

    if (!activePage) return;
    
    if (direction === "prev") {
      if (activePage.absolutePageIndex > 0) {
        const prevPageObj = allBookPages[activePage.absolutePageIndex - 1];
        useReadingStore.getState().setActiveChapterIndex(prevPageObj.chapterIndex);
        useReadingStore.getState().setWordIndex(prevPageObj.startWordIndex);
        saveProgressForBook(activeBookVal.id, prevPageObj.chapterIndex, prevPageObj.startWordIndex);
      }
    } else {
      if (forceComplete || activePage.absolutePageIndex >= allBookPages.length - 1) {
        const totalWords = activeBookVal.chapters?.reduce((acc, c) => acc + c.content.split(/\s+/).filter(Boolean).length, 0) || activeBookVal.content?.split(/\s+/).filter(Boolean).length || 4500;
        const currentSpeed = mode === "normal" ? 280 : wpm;
        const calculatedSeconds = Math.round(totalWords / (currentSpeed / 60));
        const accuracyRating = Math.floor(Math.random() * 8) + 92;
        
        const stats = {
          speedWpm: currentSpeed,
          durationSeconds: calculatedSeconds,
          accuracy: accuracyRating,
          wordsCount: totalWords
        };
        
        setSessionStats(stats);
        
        StatsService.recordSession({
          bookId: activeBookVal.id,
          bookTitle: activeBookVal.title,
          mode: mode,
          speedWpm: currentSpeed,
          durationSeconds: calculatedSeconds,
          accuracy: accuracyRating
        });
        
        updateBook(activeBookVal.id, {
          progress: 100,
          status: "completed",
          estimatedReadingTime: "Completed"
        });
        
        setIsCompletionModalOpen(true);
      } else {
        const nextPageObj = allBookPages[activePage.absolutePageIndex + 1];
        useReadingStore.getState().setActiveChapterIndex(nextPageObj.chapterIndex);
        useReadingStore.getState().setWordIndex(nextPageObj.startWordIndex);
        saveProgressForBook(activeBookVal.id, nextPageObj.chapterIndex, nextPageObj.startWordIndex);
      }
    }
  }, [allBookPages, saveProgressForBook, updateBook]);

  const handlePrevChapter = React.useCallback(() => {
    const { activeChapterIndex } = useReadingStore.getState();
    if (activeChapterIndex > 0) {
      const prevChapterIdx = activeChapterIndex - 1;
      
      const prevChapterPages = allBookPages.filter(p => p.chapterIndex === prevChapterIdx);
      const lastPage = prevChapterPages.length > 0 ? prevChapterPages[prevChapterPages.length - 1] : null;
      
      const lastWordIdx = lastPage
        ? lastPage.startWordIndex
        : (() => {
            const prevCh = chaptersData[prevChapterIdx];
            const prevWords = prevCh ? prevCh.content.split(/\s+/).filter(w => w.trim() !== "") : [];
            return Math.max(0, prevWords.length - 1);
          })();
      
      useReadingStore.getState().setIsPlaying(false);
      useReadingStore.getState().setCompletedChapter(null);
      const activeBookVal = activeBookRef.current;
      
      useReadingStore.getState().setActiveChapterIndex(prevChapterIdx);
      useReadingStore.getState().setWordIndex(lastWordIdx);
      
      if (activeBookVal) {
        saveProgressForBook(activeBookVal.id, prevChapterIdx, lastWordIdx);
      }
    }
  }, [chaptersData, saveProgressForBook, allBookPages]);

  const handleNextChapter = React.useCallback(() => {
    const { activeChapterIndex } = useReadingStore.getState();
    if (activeChapterIndex < chaptersData.length - 1) {
      const nextChapterIdx = activeChapterIndex + 1;
      
      useReadingStore.getState().setIsPlaying(false);
      useReadingStore.getState().setCompletedChapter(null);
      const activeBookVal = activeBookRef.current;
      
      useReadingStore.getState().setActiveChapterIndex(nextChapterIdx);
      useReadingStore.getState().setWordIndex(0);
      
      if (activeBookVal) {
        saveProgressForBook(activeBookVal.id, nextChapterIdx, 0);
      }
    } else {
      handlePageChange("next", true);
    }
  }, [chaptersData.length, saveProgressForBook, handlePageChange]);

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
    setIsPlaying: (p) => useReadingStore.getState().setIsPlaying(p),
    setActiveChapterIndex: (ch) => useReadingStore.getState().setActiveChapterIndex(ch),
    setWordIndex: (w) => useReadingStore.getState().setWordIndex(w),
    saveProgressForBook,
  });

  const setMode = React.useCallback((newMode: "rsvp" | "cluster" | "normal") => {
    const currentMode = useReadingStore.getState().mode;
    if (currentMode !== newMode) {
      useReadingStore.getState().setMode(newMode);
      
      const activeBookVal = activeBookRef.current;
      if (activeBookVal && initializedBookIdRef.current === activeBookVal.id) {
        const clearPage = newMode === "normal";
        const { activeChapterIndex, wordIndex, progressPercentage } = useReadingStore.getState();
        updateBook(activeBookVal.id, {
          lastChapterIndex: activeChapterIndex,
          lastWordIndex: wordIndex,
          progress: progressPercentage,
          ...(clearPage ? { lastLocalPageIndex: undefined } : {}),
        });
      }
    }
  }, [updateBook]);

  // Synchronous snapshot getter for static properties
  const getSnapshot = () => {
    const state = useReadingStore.getState();
    const activeChapterIdx = state.activeChapterIndex;
    const safeIdx = Math.min(Math.max(0, activeChapterIdx), chaptersData.length - 1);
    const ch = chaptersData[safeIdx] || { title: "No Book Loaded", content: "" };
    const wordsArr = ch.content ? ch.content.split(/\s+/).filter(w => w.trim() !== "") : [];
    
    return {
      wordIndex: state.wordIndex,
      activeChapterIndex: state.activeChapterIndex,
      isPlaying: state.isPlaying,
      wpm: state.wpm,
      mode: state.mode,
      completedChapter: state.completedChapter,
      progressPercentage: state.progressPercentage,
      currentChapter: { ...ch, words: wordsArr, index: safeIdx },
      words: wordsArr,
    };
  };

  const snapshot = getSnapshot();

  return {
    ...snapshot,
    isCompletionModalOpen,
    sessionStats,
    saveProgressForBook,
    setWordIndex: (w: number) => useReadingStore.getState().setWordIndex(w),
    setActiveChapterIndex: (ch: number) => useReadingStore.getState().setActiveChapterIndex(ch),
    setIsPlaying: (p: boolean) => useReadingStore.getState().setIsPlaying(p),
    setWpm: (w: number) => useReadingStore.getState().setWpm(w),
    setMode,
    setCompletedChapter: (c: string | null) => useReadingStore.getState().setCompletedChapter(c),
    setIsCompletionModalOpen,
    chaptersData,
    allBookPages,
    setAllBookPages,
    progressPercentage: snapshot.progressPercentage,
    handleChapterChange,
    handlePageChange,
    handlePrevChapter,
    handleNextChapter,
    handleRewind: () => {
      const { wordIndex } = useReadingStore.getState();
      const nextIdx = Math.max(0, wordIndex - 10);
      useReadingStore.getState().setWordIndex(nextIdx);
    },
    handleSkip: () => {
      const { wordIndex, chapters, activeChapterIndex } = useReadingStore.getState();
      const safeIdx = Math.min(Math.max(0, activeChapterIndex), chapters.length - 1);
      const ch = chapters[safeIdx];
      const words = ch?.content ? ch.content.split(/\s+/).filter(w => w.trim() !== "") : [];
      const nextIdx = Math.min(Math.max(0, words.length - 1), wordIndex + 10);
      useReadingStore.getState().setWordIndex(nextIdx);
    },
    handleAddBookmark,
    handleRemoveBookmark,
    handleUpdateBookmarkName,
    handleGoToBookmark,
    rsvpSequence,
    clusterChunks,
    activeClusterIndex: 0,
    subscribeToPlayback: (callback: (idx: number) => void) => {
      let lastWordIndex = useReadingStore.getState().wordIndex;
      return useReadingStore.subscribe((state) => {
        if (state.wordIndex !== lastWordIndex) {
          lastWordIndex = state.wordIndex;
          callback(state.wordIndex);
        }
      });
    },
  };
}
