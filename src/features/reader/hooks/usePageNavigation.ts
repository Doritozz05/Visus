import * as React from "react";
import { BookVisualPage } from "@/lib/parser/paginator";

interface UsePageNavigationProps {
  allBookPages: BookVisualPage[];
  currentChapterIndex: number;
  columnsContainerRef: React.RefObject<HTMLDivElement | null>;
  containerDimensions: { width: number; height: number } | null;
  columnGap: number;
  currentPageIndex: number;
  totalPages: number;
  setWordIndex: (w: number) => void;
  onSavePageProgress?: (localPageIndex: number, wordIndex: number) => void;
  onPrevChapter: () => void;
  onNextChapter: () => void;
}

export function usePageNavigation({
  allBookPages,
  currentChapterIndex,
  columnsContainerRef,
  containerDimensions,
  columnGap,
  currentPageIndex,
  totalPages,
  setWordIndex,
  onSavePageProgress,
  onPrevChapter,
  onNextChapter,
}: UsePageNavigationProps) {

  // Helper to map wordIndex to the exact page index using DOM coordinates!
  const getPageIndexForWord = React.useCallback((wIdx: number): number => {
    if (allBookPages.length > 0) {
      const page = allBookPages.find(
        (p) => p.chapterIndex === currentChapterIndex && wIdx >= p.startWordIndex && wIdx <= p.endWordIndex
      );
      if (page) {
        return page.pageIndex;
      }
    }

    const el = columnsContainerRef.current;
    if (!el || !containerDimensions) return 0;
    const width = containerDimensions.width || 1;
    
    // Find the block containing this word
    const blocks = el.querySelectorAll("[data-start-word-idx]");
    let activeBlock: HTMLElement | null = null;
    let lastBlock: HTMLElement | null = null;
    
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i] as HTMLElement;
      const start = parseInt(block.getAttribute("data-start-word-idx") || "0", 10);
      const end = parseInt(block.getAttribute("data-end-word-idx") || "0", 10);
      
      lastBlock = block;
      
      if (wIdx >= start && wIdx <= end) {
        activeBlock = block;
        break;
      }
    }
    
    if (activeBlock) {
      // Use Math.round to handle minor column gaps, sub-pixel offsets, and margin differences safely!
      return Math.round(activeBlock.offsetLeft / (width + columnGap));
    }
    
    // Fallback: if wordIndex exceeds tagged block range (structural chapters like TOC/licenses),
    // return the last page instead of 0 to prevent navigation jumping to the start
    if (lastBlock) {
      return Math.round(lastBlock.offsetLeft / (width + columnGap));
    }
    
    return 0;
  }, [containerDimensions, allBookPages, currentChapterIndex, columnsContainerRef, columnGap]);

  // Helper to map page index to its starting word index using DOM coordinates!
  const getWordIndexForPage = React.useCallback((pIdx: number): number => {
    if (allBookPages.length > 0) {
      const page = allBookPages.find(
        (p) => p.chapterIndex === currentChapterIndex && p.pageIndex === pIdx
      );
      if (page) {
        return page.startWordIndex;
      }
    }

    const el = columnsContainerRef.current;
    if (!el || !containerDimensions) return 0;
    const width = containerDimensions.width || 1;
    const targetOffset = pIdx * (width + columnGap);
    
    const blocks = el.querySelectorAll("[data-start-word-idx]");
    let closestBlock: HTMLElement | null = null;
    let minDiff = Infinity;
    
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i] as HTMLElement;
      const blockLeft = block.offsetLeft;
      
      // Find the first block that starts inside this target column page area
      // Tolerating 30px for margins/paddings and sub-pixel offsets
      if (blockLeft >= targetOffset - 30) {
        const diff = blockLeft - targetOffset;
        if (diff < minDiff) {
          minDiff = diff;
          closestBlock = block;
        }
      }
    }
    
    if (closestBlock) {
      return parseInt(closestBlock.getAttribute("data-start-word-idx") || "0", 10);
    }
    
    return 0;
  }, [containerDimensions, allBookPages, currentChapterIndex, columnsContainerRef, columnGap]);

  const handlePrev = () => {
    if (currentPageIndex > 0) {
      const prevPageIndex = currentPageIndex - 1;
      const targetWordIndex = getWordIndexForPage(prevPageIndex);
      setWordIndex(targetWordIndex);
      // Persist the local page index on every page turn so restore is always exact
      if (onSavePageProgress) {
        onSavePageProgress(prevPageIndex, targetWordIndex);
      }
    } else {
      // Crossing chapter boundary to previous file
      onPrevChapter();
    }
  };

  const handleNext = () => {
    if (currentPageIndex < totalPages - 1) {
      const nextPageIndex = currentPageIndex + 1;
      const targetWordIndex = getWordIndexForPage(nextPageIndex);
      setWordIndex(targetWordIndex);
      // Persist the local page index on every page turn so restore is always exact
      if (onSavePageProgress) {
        onSavePageProgress(nextPageIndex, targetWordIndex);
      }
    } else {
      // Crossing chapter boundary to next file or completing book
      onNextChapter();
    }
  };

  return {
    getPageIndexForWord,
    getWordIndexForPage,
    handlePrev,
    handleNext,
  };
}
