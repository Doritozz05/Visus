import * as React from "react";
import { Book } from "@/core/entities/book";
import { useReadingStore } from "../stores/reading-store";

export interface UseReaderStateSyncProps {
  activeBookRef: React.MutableRefObject<Book | null>;
  activeBookId: string | null;
  chaptersData: any[]; // Assuming it's the mapped chapters
  updateBook: (id: string, updates: Partial<Book>, silent?: boolean) => void;
}

export function useReaderStateSync({
  activeBookRef,
  activeBookId,
  chaptersData,
  updateBook,
}: UseReaderStateSyncProps) {
  const initializedBookIdRef = React.useRef<string | null>(null);

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
  }, [activeBookId, chaptersData, updateBook, activeBookRef]);

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
  }, [updateBook, activeBookRef]);

  return {
    setMode,
    initializedBookIdRef,
  };
}
