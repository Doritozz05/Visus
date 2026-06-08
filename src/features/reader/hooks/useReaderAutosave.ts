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
      
      const currentBookId = initializedBookIdRef.current;
      if (currentBookId) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const position = latestPositionRef.current;
        saveProgressRef.current(currentBookId, position.activeChapterIndex, position.wordIndex);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- latestPositionRef.current must be read dynamically at cleanup time
  }, [activeBook?.id, initializedBookIdRef]);

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
