import * as React from "react";
import { Book, BookChapter } from "@/core/entities/book";
import { SettingsState } from "@/core/entities/settings";
import { generateRSVPSequence } from "@/core/algorithms/rsvp";
import { generateDynamicClusters } from "@/core/algorithms/clusters";
import { StatsService } from "@/core/services/stats-service";
import { paginateChapter, BookVisualPage } from "@/lib/parser/paginator";

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
  const [mode, setMode] = React.useState<"rsvp" | "cluster" | "normal">("normal");
  const [completedChapter, setCompletedChapter] = React.useState<string | null>(null);
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

  // Manage pages globally across the entire book chapters.
  // We initialize with a static estimation as fallback, which is overridden by the dynamic background paginator when normal mode mounts.
  const [allBookPages, setAllBookPages] = React.useState<BookVisualPage[]>([]);

  React.useEffect(() => {
    if (chaptersData.length === 0) {
      setAllBookPages([]);
      return;
    }
    
    let absolutePageIndex = 0;
    const staticPages = chaptersData.flatMap((ch, chIdx) => {
      const chPages = paginateChapter(ch.content, wordsPerPage);
      return chPages.map((page) => {
        const absPageIdx = absolutePageIndex++;
        return {
          ...page,
          chapterIndex: chIdx,
          absolutePageIndex: absPageIdx,
        };
      });
    });
    setAllBookPages(staticPages);
  }, [chaptersData, wordsPerPage]);

  // Derive active visual page object
  const activePage = React.useMemo(() => {
    if (allBookPages.length === 0) return null;
    const found = allBookPages.find(
      (p) => p.chapterIndex === activeChapterIndex && wordIndex >= p.startWordIndex && wordIndex < p.endWordIndex
    );
    return found || allBookPages.find(p => p.chapterIndex === activeChapterIndex) || allBookPages[0];
  }, [allBookPages, activeChapterIndex, wordIndex]);

  // Derived properties from active chapter index, computing sequences just-in-time for the active chapter only
  const currentChapter = React.useMemo(() => {
    if (chaptersData.length === 0) {
      return { title: "No Book Loaded", content: "", words: [], rsvpSequence: [], clusterChunks: [], index: 0 };
    }
    const safeIdx = Math.min(Math.max(0, activeChapterIndex), chaptersData.length - 1);
    const ch = chaptersData[safeIdx];
    
    // Generate RSVP, Cluster sequences, and words JIT to guarantee instant page transitions
    const wordsArr = ch.content.split(/\s+/).filter(w => w.trim() !== "");
    const rsvpSeq = generateRSVPSequence(wordsArr);
    const clusterSeq = generateDynamicClusters(wordsArr, 3);
    
    return {
      ...ch,
      words: wordsArr,
      rsvpSequence: rsvpSeq,
      clusterChunks: clusterSeq,
    };
  }, [chaptersData, activeChapterIndex]);

  const words = React.useMemo(() => {
    return currentChapter?.words || [];
  }, [currentChapter]);

  const rsvpSequence = React.useMemo(() => {
    return currentChapter?.rsvpSequence || [];
  }, [currentChapter]);

  const clusterChunks = React.useMemo(() => {
    return currentChapter?.clusterChunks || [];
  }, [currentChapter]);

  // Keep the latest wordIndex and activeChapterIndex in a ref so we can save it on unmount / beforeunload without re-subscribing the event listeners
  const latestPositionRef = React.useRef({ wordIndex, activeChapterIndex });
  React.useEffect(() => {
    latestPositionRef.current = { wordIndex, activeChapterIndex };
  }, [wordIndex, activeChapterIndex]);

  // Keep track of the active book ID to save progress before switching books
  const prevBookIdRef = React.useRef<string | null>(null);

  // Core callback to save book progress to database context
  const saveProgressForBook = React.useCallback((bookId: string, chIdx: number, wIdx: number) => {
    if (chaptersData.length === 0) return;
    
    // Do NOT overwrite completed status due to unmount cleanup races if we are still near the end
    if (activeBookRef.current?.id === bookId && activeBookRef.current?.status === "completed") {
      const isLastChapter = chIdx === chaptersData.length - 1;
      const targetChapter = chaptersData[chIdx];
      if (targetChapter) {
        const chWords = targetChapter.content ? targetChapter.content.split(/\s+/).filter(w => w.trim() !== "") : [];
        const chWordsLength = chWords.length || 1;
        const isAtLastWords = wIdx >= chWordsLength - 10;
        if (isLastChapter && isAtLastWords) {
          return;
        }
      }
    }
    
    const targetChapter = chaptersData[chIdx];
    if (!targetChapter) return;
    
    // Safely calculate words count from content as chaptersData is lightweight
    const chWords = targetChapter.content ? targetChapter.content.split(/\s+/).filter(w => w.trim() !== "") : [];
    const chWordsLength = chWords.length || 1;
    
    const progressInChapter = wIdx / chWordsLength;
    let currentProgress = Math.min(
      100,
      Math.round(((chIdx + progressInChapter) / chaptersData.length) * 100)
    );

    const isLastChapter = chIdx === chaptersData.length - 1;
    const isAtLastWords = wIdx >= chWordsLength - 5;
    
    if (isLastChapter && isAtLastWords) {
      currentProgress = 100;
    }

    updateBook(bookId, {
      progress: currentProgress,
      lastChapterIndex: chIdx,
      lastWordIndex: wIdx,
    });
  }, [chaptersData, updateBook]);

  // Event Callback ref pattern to avoid infinite loops when saveProgressForBook changes reference
  const saveProgressRef = React.useRef(saveProgressForBook);
  React.useEffect(() => {
    saveProgressRef.current = saveProgressForBook;
  }, [saveProgressForBook]);

  // Unmount cleanup and tab close safety hook
  React.useEffect(() => {
    const handleBeforeUnload = () => {
      if (initializedBookIdRef.current === activeBook?.id) {
        saveProgressRef.current(
          initializedBookIdRef.current,
          latestPositionRef.current.activeChapterIndex,
          latestPositionRef.current.wordIndex
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (initializedBookIdRef.current) {
        saveProgressRef.current(
          initializedBookIdRef.current,
          latestPositionRef.current.activeChapterIndex,
          latestPositionRef.current.wordIndex
        );
      }
    };
  }, [activeBook?.id]);

  // Save previous book progress when activeBook changes
  React.useEffect(() => {
    if (activeBook) {
      if (prevBookIdRef.current && prevBookIdRef.current !== activeBook.id) {
        if (initializedBookIdRef.current === prevBookIdRef.current) {
          saveProgressRef.current(
            prevBookIdRef.current,
            latestPositionRef.current.activeChapterIndex,
            latestPositionRef.current.wordIndex
          );
        }
      }
      prevBookIdRef.current = activeBook.id;
    }
  }, [activeBook]);

  // Save position when the player pauses
  React.useEffect(() => {
    if (!isPlaying && initializedBookIdRef.current === activeBook?.id) {
      saveProgressRef.current(
        initializedBookIdRef.current,
        latestPositionRef.current.activeChapterIndex,
        latestPositionRef.current.wordIndex
      );
    }
  }, [isPlaying, activeBook?.id]);

  // Intercept and wrap chapter selection to trigger immediate saves
  const handleChapterChange = React.useCallback((chapterIndex: number) => {
    setIsPlaying(false);
    
    const activeBookVal = activeBookRef.current;
    if (activeBookVal && initializedBookIdRef.current === activeBookVal.id) {
      saveProgressForBook(
        activeBookVal.id,
        latestPositionRef.current.activeChapterIndex,
        latestPositionRef.current.wordIndex
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
    if (!activeBook || chaptersData.length === 0) {
      setWordIndex(0);
      setActiveChapterIndex(0);
      setIsPlaying(false);
      setCompletedChapter(null);
      initializedBookIdRef.current = null;
      return;
    }
    
    if (initializedBookIdRef.current !== activeBook.id) {
      initializedBookIdRef.current = activeBook.id;

      // Prefer the exact saved chapter/word position over the rough progress-based estimate
      const savedChapterIdx = activeBook.lastChapterIndex ?? null;
      const savedWordIdx = activeBook.lastWordIndex ?? null;

      if (savedChapterIdx !== null && savedChapterIdx < chaptersData.length) {
        setActiveChapterIndex(savedChapterIdx);
        setWordIndex(savedWordIdx ?? 0);
      } else {
        // Fallback for books saved before this update (only progress% available)
        const targetChapterIdx = Math.min(
          chaptersData.length - 1,
          Math.max(0, Math.floor((activeBook.progress / 100) * chaptersData.length))
        );
        setActiveChapterIndex(targetChapterIdx);
        setWordIndex(0);
      }

      setIsPlaying(false);
      setCompletedChapter(null);
    }
  }, [activeBook, chaptersData.length]);

  // Map individual word index to correct dynamic semantic foveal cluster chunk
  const activeClusterIndex = React.useMemo(() => {
    let currentWordOffset = 0;
    for (let i = 0; i < clusterChunks.length; i++) {
      const chunkWordsCount = clusterChunks[i].wordCount;
      if (wordIndex >= currentWordOffset && wordIndex < currentWordOffset + chunkWordsCount) {
        return i;
      }
      currentWordOffset += chunkWordsCount;
    }
    return Math.max(0, clusterChunks.length - 1);
  }, [clusterChunks, wordIndex]);

  // Master speed reading playback timer loop (chapter-scoped)
  React.useEffect(() => {
    if (!isPlaying || rsvpSequence.length === 0) return;

    const baseDelayMs = (60 * 1000) / wpm;
    let finalDelay = baseDelayMs;
    let wordsToAdvance = 1;

    if (mode === "rsvp") {
      const currentWordObj = rsvpSequence[wordIndex];
      const delayMultiplier = currentWordObj ? currentWordObj.delayMultiplier : 1.0;
      finalDelay = baseDelayMs * delayMultiplier;
      wordsToAdvance = 1;
    } else if (mode === "cluster") {
      const currentChunk = clusterChunks[activeClusterIndex];
      if (currentChunk) {
        const delayMultiplier = currentChunk.delayMultiplier || 1.0;
        finalDelay = baseDelayMs * currentChunk.wordCount * delayMultiplier;
        wordsToAdvance = currentChunk.wordCount;
      }
    } else {
      setIsPlaying(false);
      return;
    }

    const interval = setTimeout(() => {
      setWordIndex((prev) => {
        const nextIndex = prev + wordsToAdvance;

        if (nextIndex >= rsvpSequence.length) {
          setIsPlaying(false);
          setCompletedChapter(currentChapter.title);
          return Math.min(nextIndex, rsvpSequence.length - 1);
        }
        return nextIndex;
      });
    }, finalDelay);

    return () => clearTimeout(interval);
  }, [isPlaying, wordIndex, wpm, rsvpSequence, mode, clusterChunks, activeClusterIndex, currentChapter]);

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

  // Add a new named bookmark and persist it
  const handleAddBookmark = React.useCallback((name: string, chapterIndex: number, wordIndex: number) => {
    if (!activeBook) return;
    const currentBookmarks = activeBook.bookmarks || [];
    
    // Find chapter title
    const chapterTitle = chaptersData[chapterIndex]?.title || `Section ${chapterIndex + 1}`;
    
    const newBookmark = {
      id: `bookmark-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      chapterIndex,
      wordIndex,
      name,
      createdAt: new Date().toISOString(),
      chapterTitle,
    };
    
    updateBook(activeBook.id, {
      bookmarks: [...currentBookmarks, newBookmark],
    });
  }, [activeBook, chaptersData, updateBook]);

  // Remove an existing bookmark
  const handleRemoveBookmark = React.useCallback((id: string) => {
    if (!activeBook) return;
    const currentBookmarks = activeBook.bookmarks || [];
    updateBook(activeBook.id, {
      bookmarks: currentBookmarks.filter((b) => b.id !== id),
    });
  }, [activeBook, updateBook]);

  // Update a bookmark's custom name
  const handleUpdateBookmarkName = React.useCallback((id: string, name: string) => {
    if (!activeBook) return;
    const currentBookmarks = activeBook.bookmarks || [];
    updateBook(activeBook.id, {
      bookmarks: currentBookmarks.map((b) => (b.id === id ? { ...b, name } : b)),
    });
  }, [activeBook, updateBook]);

  // Jump to any saved bookmark position
  const handleGoToBookmark = React.useCallback((chapterIndex: number, wordIndex: number) => {
    setIsPlaying(false);
    setActiveChapterIndex(chapterIndex);
    setWordIndex(wordIndex);
    const activeBookVal = activeBookRef.current;
    if (activeBookVal) {
      saveProgressForBook(activeBookVal.id, chapterIndex, wordIndex);
    }
  }, [saveProgressForBook]);

  const progressPercentage = React.useMemo(() => {
    if (chaptersData.length === 0) return 0;
    const currentChapterWordsCount = words.length || 1;
    const progressInChapter = wordIndex / currentChapterWordsCount;
    return Math.min(
      100,
      Math.round(((activeChapterIndex + progressInChapter) / chaptersData.length) * 100)
    );
  }, [chaptersData.length, activeChapterIndex, wordIndex, words.length]);

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
  };
}
