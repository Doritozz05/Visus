import * as React from "react";
import { Book, BookBinary } from "@/core/entities/book";
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
  bookBinary: BookBinary | null;
  updateBook: (id: string, updates: Partial<Book>, silent?: boolean) => void;
  settings: SettingsState;
  wordsPerPage: number;
  isLoadingContent: boolean;
}

export function useReaderPlayback({
  activeBook,
  bookBinary,
  updateBook,
  settings,
  wordsPerPage,
  isLoadingContent,
}: UseReaderPlaybackProps) {
  // Active book reference to prevent state loops
  const activeBookRef = React.useRef(activeBook);
  React.useEffect(() => {
    activeBookRef.current = activeBook;
  }, [activeBook]);

  const activeBookId = activeBook?.id || null;
  const activeBookChapters = bookBinary?.chapters;
  const activeBookContent = bookBinary?.content;

  // Extracted logic to pure function
  const chaptersData = React.useMemo(() => {
    return buildChaptersData(activeBookId, activeBookChapters, activeBookContent);
  }, [activeBookId, activeBookChapters, activeBookContent]);

  const allBookPages = useReadingStore((state) => state.allBookPages);
  const setAllBookPages = useReadingStore((state) => state.setAllBookPages);

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
    isLoadingContent,
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
