import * as React from "react";
import { Book } from "@/core/entities/book";
import { BookVisualPage } from "@/lib/parser/paginator";
import { ChapterHtmlData } from "@/features/reader/utils/chapterHtml";
import { useReadingStore } from "@/features/reader/stores/reading-store";
import { findPageForWordIndex } from "../utils/binarySearch";

interface UsePlaybackProgressProps {
  activeBookRef: React.MutableRefObject<Book | null>;
  chaptersData: ChapterHtmlData[];
  mode: "rsvp" | "cluster" | "normal";
  allBookPages: BookVisualPage[];
  updateBook: (id: string, updates: Partial<Book>) => void;
}

export function usePlaybackProgress({
  activeBookRef,
  chaptersData,
  mode,
  allBookPages,
  updateBook,
}: UsePlaybackProgressProps) {
  // Core callback to save book progress to database context
  const saveProgressForBook = React.useCallback((bookId: string, chIdx: number, wIdx: number, localPageIdx?: number) => {
    if (chaptersData.length === 0) {
      return;
    }
    
    // Safely get words count from the pre-calculated store array to prevent heavy string processing
    const chapterWordCounts = useReadingStore.getState().chapterWordCounts;
    const chWordsLength = (chapterWordCounts && chapterWordCounts[chIdx]) || 1;

    // Do NOT overwrite completed status due to unmount cleanup races if we are still near the end
    if (activeBookRef.current?.id === bookId && activeBookRef.current?.status === "completed") {
      const isLastChapter = chIdx === chaptersData.length - 1;
      const targetChapter = chaptersData[chIdx];
      if (targetChapter) {
        const isAtLastWords = wIdx >= chWordsLength - 10;
        if (isLastChapter && isAtLastWords) {
          return;
        }
      }
    }
    
    const targetChapter = chaptersData[chIdx];
    if (!targetChapter) {
      return;
    }
    
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

    const finalLocalPageIdx = mode === "normal"
      ? (localPageIdx !== undefined
        ? localPageIdx
        : (() => {
            if (allBookPages.length > 0) {
              const page = findPageForWordIndex(allBookPages, chIdx, wIdx);
              return page ? page.pageIndex : undefined;
            }
            return undefined;
          })())
      : undefined;

    const updatePayload: Partial<Book> = {
      progress: currentProgress,
      lastChapterIndex: chIdx,
      lastWordIndex: wIdx,
    };

    if (mode !== "normal") {
      updatePayload.lastLocalPageIndex = undefined;
    } else if (finalLocalPageIdx !== undefined) {
      updatePayload.lastLocalPageIndex = finalLocalPageIdx;
    }

    updateBook(bookId, updatePayload);
  }, [chaptersData, updateBook, mode, allBookPages, activeBookRef]);

  return { saveProgressForBook };
}
