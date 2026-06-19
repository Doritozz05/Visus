import * as React from "react";
import { Book } from "@/core/entities/book";
import { SettingsState } from "@/core/entities/settings";
import { useReadingStore } from "../stores/reading-store";
import { dbService } from "@/core/services/db-service";

export interface UseReaderStateSyncProps {
  activeBook: Book | null;
  activeBookRef: React.MutableRefObject<Book | null>;
  activeBookId: string | null;
  chaptersData: any[]; // Assuming it's the mapped chapters
  updateBook: (id: string, updates: Partial<Book>, silent?: boolean) => void;
  isLoadingContent?: boolean;
  settings: SettingsState;
}

export function useReaderStateSync({
  activeBook,
  activeBookRef,
  activeBookId,
  chaptersData,
  updateBook,
  isLoadingContent,
  settings,
}: UseReaderStateSyncProps) {
  const initializedBookIdRef = React.useRef<string | null>(null);

  // Reset player indexes when active book changes, resuming from exact saved position
  React.useEffect(() => {
    if (isLoadingContent) return;

    const book = activeBook;
    const lastWpm = settings.general.lastUsedWpm || 250;
    const lastMode = settings.general.lastUsedMode || "normal";

    if (!book || !activeBookId) {
      useReadingStore.getState().initBook("", 0, 0, lastWpm, lastMode, []);
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
        lastWpm,
        lastMode,
        chaptersData
      );

      // Load annotations asynchronously after initBook
      dbService.getAnnotationsForBook(book.id).then((annotations) => {
        useReadingStore.getState().setAnnotations(annotations || []);
      }).catch(console.error);

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
    } else if (activeBook) {
      // If the book is already initialized, sync the local Zustand store reactively
      // if a newer progress update is received from the cloud (Supabase)
      const state = useReadingStore.getState();
      const remoteChapter = activeBook.lastChapterIndex ?? 0;
      const remoteWord = activeBook.lastWordIndex ?? 0;

      // GUARD: If we recently saved locally (within 3s), ignore remote updates 
      // as they are likely "echoes" of our own save or stale data.
      const lastSaveTime = state.lastLocalSaveTimestamp;
      if (Date.now() - lastSaveTime < 3000) {
        return;
      }

      if (remoteChapter !== state.activeChapterIndex || remoteWord !== state.wordIndex) {
        if (remoteChapter !== state.activeChapterIndex) {
          useReadingStore.getState().setActiveChapterIndex(remoteChapter);
        }
        useReadingStore.getState().setWordIndex(remoteWord);
      }
    }

  }, [activeBookId, activeBook, chaptersData, updateBook, activeBookRef, isLoadingContent, settings.general.lastUsedWpm, settings.general.lastUsedMode]);

  // Handle unmount or book transition cleanup to prevent stale data in the store
  React.useEffect(() => {
    return () => {
      const lastWpm = settings.general.lastUsedWpm || 250;
      const lastMode = settings.general.lastUsedMode || "normal";
      initializedBookIdRef.current = null;
      useReadingStore.getState().setIsPlaying(false);
      useReadingStore.getState().initBook("", 0, 0, lastWpm, lastMode, []);
    };
  }, [activeBookId, settings.general.lastUsedWpm, settings.general.lastUsedMode]);

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
