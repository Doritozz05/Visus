import * as React from "react";
import { Book } from "@/core/entities/book";
import { StatsService } from "@/core/services/stats-service";
import { useReadingStore } from "../stores/reading-store";
import { BookVisualPage } from "@/lib/parser/paginator";
import { findPageForWordIndex, findFirstPageOfChapter, findLastPageOfChapter } from "../utils/binarySearch";

export interface UseReaderNavigationProps {
  activeBookRef: React.MutableRefObject<Book | null>;
  chaptersData: any[];
  allBookPages: BookVisualPage[];
  updateBook: (id: string, updates: Partial<Book>, silent?: boolean) => void;
  saveProgressForBook: (bookId: string, chapterIndex: number, wordIndex: number) => void;
}

export function useReaderNavigation({
  activeBookRef,
  chaptersData,
  allBookPages,
  updateBook,
  saveProgressForBook,
}: UseReaderNavigationProps) {
  const setIsCompletionModalOpen = useReadingStore((state) => state.setIsCompletionModalOpen);
  const setSessionStats = useReadingStore((state) => state.setSessionStats);

  const handlePageChange = React.useCallback((direction: "prev" | "next", forceComplete: boolean = false) => {
    if (allBookPages.length === 0 || !activeBookRef.current) return;
    
    const activeBookVal = activeBookRef.current;
    const { wordIndex, activeChapterIndex, wpm, mode } = useReadingStore.getState();

    const activePage =
      findPageForWordIndex(allBookPages, activeChapterIndex, wordIndex) ||
      (() => {
        // Find first or last depending on if we are under or over
        const first = findFirstPageOfChapter(allBookPages, activeChapterIndex);
        if (first && wordIndex < first.startWordIndex) return first;
        const last = findLastPageOfChapter(allBookPages, activeChapterIndex);
        if (last && wordIndex > last.endWordIndex) return last;
        return null;
      })() ||
      allBookPages[0];

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
        const { chapterWordCounts } = useReadingStore.getState();
        const totalWords = chapterWordCounts && chapterWordCounts.length > 0
          ? chapterWordCounts.reduce((acc: number, count: number) => acc + count, 0)
          : 4500;
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
  }, [allBookPages, saveProgressForBook, updateBook, setIsCompletionModalOpen, setSessionStats, activeBookRef]);

  const handlePrevChapter = React.useCallback(() => {
    const { activeChapterIndex, chapterWordCounts } = useReadingStore.getState();
    if (activeChapterIndex > 0) {
      const prevChapterIdx = activeChapterIndex - 1;
      
      const lastPage = findLastPageOfChapter(allBookPages, prevChapterIdx);
      
      const lastWordIdx = lastPage
        ? lastPage.startWordIndex
        : (() => {
            const count = (chapterWordCounts && chapterWordCounts[prevChapterIdx]) || 1;
            return Math.max(0, count - 1);
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
  }, [saveProgressForBook, allBookPages, activeBookRef]);

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
  }, [chaptersData.length, saveProgressForBook, handlePageChange, activeBookRef]);

  const handleRewind = React.useCallback(() => {
    const { wordIndex, activeChapterIndex, chapterWordCounts, setCompletedChapter, setIsPlaying, setActiveChapterIndex, setWordIndex } = useReadingStore.getState();
    setCompletedChapter(null);
    
    if (wordIndex === 0) {
      if (activeChapterIndex > 0) {
        const prevChapterIdx = activeChapterIndex - 1;
        const count = (chapterWordCounts && chapterWordCounts[prevChapterIdx]) || 1;
        const lastWordIdx = Math.max(0, count - 1);
        
        setIsPlaying(false);
        setActiveChapterIndex(prevChapterIdx);
        setWordIndex(lastWordIdx);
        
        const activeBookVal = activeBookRef.current;
        if (activeBookVal) {
          saveProgressForBook(activeBookVal.id, prevChapterIdx, lastWordIdx);
        }
      }
    } else {
      const nextIdx = Math.max(0, wordIndex - 10);
      setWordIndex(nextIdx);
    }
  }, [activeBookRef, saveProgressForBook]);

  const handleSkip = React.useCallback(() => {
    const { wordIndex, activeChapterIndex, chapterWordCounts, setWordIndex } = useReadingStore.getState();
    const safeIdx = Math.min(Math.max(0, activeChapterIndex), chaptersData.length - 1);
    const count = (chapterWordCounts && chapterWordCounts[safeIdx]) || 1;
    const nextIdx = Math.min(Math.max(0, count - 1), wordIndex + 10);
    setWordIndex(nextIdx);
  }, [chaptersData.length]);

  const handleChapterChange = React.useCallback((chapterIndex: number) => {
    useReadingStore.getState().setIsPlaying(false);
    useReadingStore.getState().setCompletedChapter(null);
    
    const activeBookVal = activeBookRef.current;
    
    useReadingStore.getState().setActiveChapterIndex(chapterIndex);
    useReadingStore.getState().setWordIndex(0);
    
    if (activeBookVal) {
      saveProgressForBook(activeBookVal.id, chapterIndex, 0);
    }
  }, [saveProgressForBook, activeBookRef]);

  return {
    handlePageChange,
    handlePrevChapter,
    handleNextChapter,
    handleRewind,
    handleSkip,
    handleChapterChange,
  };
}
