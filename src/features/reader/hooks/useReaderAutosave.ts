import * as React from "react";
import { Book } from "@/core/entities/book";

interface UseReaderAutosaveProps {
  activeBook: Book | null;
  isPlaying: boolean;
  currentWordIndexRef: React.MutableRefObject<number>;
  latestPositionRef: React.MutableRefObject<{ wordIndex: number; activeChapterIndex: number }>;
  initializedBookIdRef: React.MutableRefObject<string | null>;
  saveProgressForBook: (bookId: string, chIdx: number, wIdx: number) => void;
  setWordIndex: (w: number) => void;
}

export function useReaderAutosave({
  activeBook,
  isPlaying,
  currentWordIndexRef,
  latestPositionRef,
  initializedBookIdRef,
  saveProgressForBook,
  setWordIndex,
}: UseReaderAutosaveProps) {
  // Keep the latest saveProgress callback in a ref to prevent re-subscribing the unload handlers
  const saveProgressRef = React.useRef(saveProgressForBook);
  React.useEffect(() => {
    saveProgressRef.current = saveProgressForBook;
  }, [saveProgressForBook]);

  // Keep track of the active book ID to save progress before switching books
  const prevBookIdRef = React.useRef<string | null>(null);

  // Unmount cleanup and tab close safety hook
  React.useEffect(() => {
    const currentBookId = initializedBookIdRef.current;

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
      if (currentBookId) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const position = latestPositionRef.current;
        saveProgressRef.current(currentBookId, position.activeChapterIndex, position.wordIndex);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- latestPositionRef.current must be read dynamically at cleanup time
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
  }, [activeBook, initializedBookIdRef, latestPositionRef]);

  const wasPlayingRef = React.useRef(false);

  // Save position when the player pauses
  React.useEffect(() => {
    if (!isPlaying && wasPlayingRef.current && initializedBookIdRef.current === activeBook?.id) {
      setWordIndex(currentWordIndexRef.current);
      saveProgressRef.current(
        initializedBookIdRef.current,
        latestPositionRef.current.activeChapterIndex,
        currentWordIndexRef.current
      );
    }
    wasPlayingRef.current = isPlaying;
  }, [isPlaying, activeBook?.id, initializedBookIdRef, latestPositionRef, currentWordIndexRef, setWordIndex]);
}
