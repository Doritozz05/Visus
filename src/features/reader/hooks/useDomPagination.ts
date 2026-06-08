import * as React from "react";
import { BookVisualPage } from "@/lib/parser/paginator";
import { ChapterHtmlData } from "@/features/reader/utils/chapterHtml";
import { useReadingStore } from "@/features/reader/stores/reading-store";
import { paginateChapter } from "@/features/reader/utils/paginationCore";

interface UseDomPaginationProps {
  chaptersData: ChapterHtmlData[];
  containerDimensions: { width: number; height: number } | null;
  scaledFontSize: number;
  readerFontClass: string;
  wordsPerPage: number;
  hiddenPaginatorRef: React.RefObject<HTMLDivElement | null>;
  columnGap: number;
  latestRestoreTargetRef: React.MutableRefObject<{
    savedLocalPageIndex: number | undefined;
    wordIndex: number;
    chapterIndex: number;
  }>;
  initialReady: boolean;
}

export function useDomPagination({
  chaptersData,
  containerDimensions,
  scaledFontSize,
  readerFontClass,
  wordsPerPage, // kept for dependency tracking though not used in core
  hiddenPaginatorRef,
  columnGap,
  latestRestoreTargetRef,
  initialReady,
}: UseDomPaginationProps) {
  const [isPaginationReady, setIsPaginationReady] = React.useState(initialReady);
  const [isFullPaginationReady, setIsFullPaginationReady] = React.useState(initialReady);
  const hasComputedRef = React.useRef(false);
  const activeChapterIndex = useReadingStore((state) => state.activeChapterIndex);

  const lastLayoutRef = React.useRef("");

  React.useEffect(() => {
    if (!containerDimensions || chaptersData.length === 0) {
      return;
    }

    const currentLayoutKey = `${chaptersData.length}-${scaledFontSize}-${readerFontClass}-${containerDimensions?.width || 0}x${containerDimensions?.height || 0}-${wordsPerPage}-${columnGap}`;
    const isLayoutChange = currentLayoutKey !== lastLayoutRef.current;
    
    // Check if we already have pages computed for the active chapter
    const hasPagesForActive = useReadingStore.getState().allBookPages.some(p => p.chapterIndex === activeChapterIndex);
    
    if (!isLayoutChange && hasPagesForActive) {
      setIsPaginationReady(true);
      return;
    }

    // Reset ready flag whenever we restart pagination (e.g. layout change or uncomputed chapter)
    lastLayoutRef.current = currentLayoutKey;
    setIsPaginationReady(false);
    setIsFullPaginationReady(false);

    let active = true;

    const paginateAllChapters = async () => {
      const { width, height } = containerDimensions;
      if (width <= 0 || height <= 0) return;

      const { setAllBookPages } = useReadingStore.getState();
      const totalChapters = chaptersData.length;
      
      const pagesByChapter: BookVisualPage[][] = new Array(totalChapters).fill([]);

      const updateStore = () => {
        let absoluteIndexCounter = 0;
        const incrementalPages: BookVisualPage[] = [];
        for (let i = 0; i < totalChapters; i++) {
          const chapterPages = pagesByChapter[i];
          for (const page of chapterPages) {
            incrementalPages.push({
              ...page,
              absolutePageIndex: absoluteIndexCounter++
            });
          }
        }
        setAllBookPages(incrementalPages);
      };
      
      const checkActive = () => active;

      // 1. Paginate active chapter first
      if (activeChapterIndex >= 0 && activeChapterIndex < totalChapters) {
        pagesByChapter[activeChapterIndex] = await paginateChapter({
          chIdx: activeChapterIndex,
          chapter: chaptersData[activeChapterIndex],
          width,
          columnGap,
          hiddenEl: hiddenPaginatorRef.current!,
          checkActive
        });
        
        if (!active) return;
        
        updateStore();

        const { savedLocalPageIndex: currentSLPI, chapterIndex: currentCI } = latestRestoreTargetRef.current;
        const isInitialLoad = !hasComputedRef.current;

        // Apply restore logic only for the active chapter
        if (currentCI === activeChapterIndex) {
          if (isInitialLoad && currentSLPI !== undefined) {
            const maxLocalPage = Math.max(0, pagesByChapter[activeChapterIndex].length - 1);
            const clampedPage = Math.min(currentSLPI, maxLocalPage);
            if (pagesByChapter[activeChapterIndex][clampedPage]) {
              useReadingStore.getState().setWordIndex(pagesByChapter[activeChapterIndex][clampedPage].startWordIndex);
            }
          }
        }

        hasComputedRef.current = true;
        setIsPaginationReady(true);
      }

      // 2. Paginate the rest asynchronously
      for (let chIdx = 0; chIdx < totalChapters; chIdx++) {
        if (!active) return;
        if (chIdx === activeChapterIndex) continue; // Already done
        
        pagesByChapter[chIdx] = await paginateChapter({
          chIdx,
          chapter: chaptersData[chIdx],
          width,
          columnGap,
          hiddenEl: hiddenPaginatorRef.current!,
          checkActive
        });
        
        if (!active) return;
        
        updateStore();
        
        // Yield to allow UI updates and not block the main thread
        await new Promise((resolve) => setTimeout(resolve, 0));
      }

      // Mark full pagination completed once the loop concludes
      if (active) {
        setIsFullPaginationReady(true);
      }
    };

    paginateAllChapters();

    return () => {
      active = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chaptersData, scaledFontSize, readerFontClass, containerDimensions, wordsPerPage, columnGap, activeChapterIndex]);

  return {
    isPaginationReady,
    isFullPaginationReady,
    hasComputedRef,
  };
}
