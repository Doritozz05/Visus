import * as React from "react";
import { Book } from "@/core/entities/book";
import { SettingsState } from "@/core/entities/settings";
import { useReadingStore } from "../stores/reading-store";
import { buildChaptersData } from "@/lib/parser/chapter-fallback";

// Extracted Sub-Hooks
import { useReaderBookmarks } from "./useReaderBookmarks";
import { useReaderAutosave } from "./useReaderAutosave";
import { usePlaybackProgress } from "./usePlaybackProgress";
import { useRsvpEngine } from "./useRsvpEngine";
import { useClusterEngine } from "./useClusterEngine";
import { useReaderStateSync } from "./useReaderStateSync";
import { useReaderNavigation } from "./useReaderNavigation";

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
  // Active book reference to prevent state loops
  const activeBookRef = React.useRef(activeBook);
  React.useEffect(() => {
    activeBookRef.current = activeBook;
  }, [activeBook]);

  const activeBookId = activeBook?.id || null;
  const activeBookChapters = activeBook?.chapters;
  const activeBookContent = activeBook?.content;

  // Extracted logic to pure function
  const chaptersData = React.useMemo(() => {
    return buildChaptersData(activeBookId, activeBookChapters, activeBookContent);
  }, [activeBookId, activeBookChapters, activeBookContent]);

  const allBookPages = useReadingStore((state) => state.allBookPages);
  const setAllBookPages = useReadingStore((state) => state.setAllBookPages);

  // Reset allBookPages when there is no book or chapters loaded
  React.useEffect(() => {
    if (chaptersData.length === 0) {
      setAllBookPages([]);
    }
  }, [chaptersData.length, setAllBookPages]);

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
      const wordsArr = ch.content ? ch.content.split(/\s+/).filter((w: string) => w.trim() !== "") : [];
      return { ...ch, words: wordsArr, index: safeIdx };
    }, [chaptersData, activeChapterIndex]),
    mode,
    wpm,
  });

  const { clusterChunks } = useClusterEngine({
    currentChapter: React.useMemo(() => {
      const safeIdx = Math.min(Math.max(0, activeChapterIndex), chaptersData.length - 1);
      const ch = chaptersData[safeIdx] || { title: "No Book", content: "" };
      const wordsArr = ch.content ? ch.content.split(/\s+/).filter((w: string) => w.trim() !== "") : [];
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

  // Consuming custom State Sync Hook
  const { setMode, initializedBookIdRef } = useReaderStateSync({
    activeBookRef,
    activeBookId,
    chaptersData,
    updateBook,
  });

  // Consuming custom Navigation Hook
  const {
    handlePageChange,
    handlePrevChapter,
    handleNextChapter,
    handleRewind,
    handleSkip,
    handleChapterChange,
  } = useReaderNavigation({
    activeBookRef,
    chaptersData,
    allBookPages,
    updateBook,
    saveProgressForBook,
  });

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

  return {
    saveProgressForBook,
    setMode,
    initializedBookIdRef,
    chaptersData,
    allBookPages,
    setAllBookPages,
    handleChapterChange,
    handlePageChange,
    handlePrevChapter,
    handleNextChapter,
    handleRewind,
    handleSkip,
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
