import * as React from "react";
import { Book } from "@/core/entities/book";
import { useReadingStore } from "@/features/reader/stores/reading-store";

interface UseReaderAutosaveProps {
  activeBook: Book | null;
  saveProgressForBook: (bookId: string, chIdx: number, wIdx: number) => void;
}

export function useReaderAutosave({
  activeBook,
  saveProgressForBook,
}: UseReaderAutosaveProps) {
  const isPlaying = useReadingStore((state) => state.isPlaying);
  const saveProgressRef = React.useRef(saveProgressForBook);
  
  React.useEffect(() => {
    saveProgressRef.current = saveProgressForBook;
  }, [saveProgressForBook]);

  // Unmount cleanup and tab close safety hook
  React.useEffect(() => {
    const handleBeforeUnload = () => {
      const state = useReadingStore.getState();
      if (state.activeBookId && state.activeBookId === activeBook?.id) {
        saveProgressRef.current(
          state.activeBookId,
          state.activeChapterIndex,
          state.wordIndex
        );
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        const state = useReadingStore.getState();
        if (state.activeBookId && state.activeBookId === activeBook?.id) {
          saveProgressRef.current(
            state.activeBookId,
            state.activeChapterIndex,
            state.wordIndex
          );
        }
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }
    
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      }
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
      
      const state = useReadingStore.getState();
      if (state.activeBookId && state.activeBookId === activeBook?.id) {
        saveProgressRef.current(
          state.activeBookId,
          state.activeChapterIndex,
          state.wordIndex
        );
      }
    };
  }, [activeBook?.id]);

  const wasPlayingRef = React.useRef(false);

  // Save position when the player pauses
  React.useEffect(() => {
    const state = useReadingStore.getState();
    if (!isPlaying && wasPlayingRef.current && state.activeBookId && state.activeBookId === activeBook?.id) {
      saveProgressRef.current(
        state.activeBookId,
        state.activeChapterIndex,
        state.wordIndex
      );
    }
    wasPlayingRef.current = isPlaying;
  }, [isPlaying, activeBook?.id]);
}
