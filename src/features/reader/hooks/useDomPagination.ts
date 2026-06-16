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
  const pageIndexMapRef = React.useRef(new Map<string, number>());
  const activeChapterIndex = useReadingStore((state) => state.activeChapterIndex);

  const lastLayoutRef = React.useRef("");

  React.useEffect(() => {
    if (!containerDimensions || chaptersData.length === 0) {
      return;
    }

    const currentLayoutKey = `${chaptersData.length}-${scaledFontSize}-${readerFontClass}-${containerDimensions?.width || 0}x${containerDimensions?.height || 0}-${wordsPerPage}-${columnGap}`;
    const isLayoutChange = currentLayoutKey !== lastLayoutRef.current;
    
    // Check existing pages state
    const existingPages = useReadingStore.getState().allBookPages;
    const computedChapters = new Set<number>();
    existingPages.forEach(p => computedChapters.add(p.chapterIndex));
    const isFullyComputed = computedChapters.size === chaptersData.length;
    const hasPagesForActive = computedChapters.has(activeChapterIndex);
    
    if (!isLayoutChange && isFullyComputed) {
      setIsPaginationReady(true);
      setIsFullPaginationReady(true);
      return;
    }

    if (!isLayoutChange && hasPagesForActive) {
      setIsPaginationReady(true);
    } else if (hasPagesForActive) {
      // If we have pages for active chapter, keep them visible while re-paginating in background
      setIsPaginationReady(true);
    } else {
      setIsPaginationReady(false);
    }

    // Reset full ready flag whenever we restart pagination
    lastLayoutRef.current = currentLayoutKey;
    setIsFullPaginationReady(false);

    let active = true;

    const paginateAllChapters = async () => {
      const { width, height } = containerDimensions;
      if (width <= 0 || height <= 0) return;

      const { setAllBookPages } = useReadingStore.getState();
      const totalChapters = chaptersData.length;
      
      const pagesByChapter: BookVisualPage[][] = new Array(totalChapters).fill([]);

      // Atomic Update Strategy: Don't clear the store. 
      // We will replace the entire state once the active chapter (at least) is ready.
      if (!isLayoutChange) {
        for (const page of existingPages) {
          if (!pagesByChapter[page.chapterIndex]) {
            pagesByChapter[page.chapterIndex] = [];
          }
          pagesByChapter[page.chapterIndex].push(page);
        }
      }

      const updateStore = () => {
        let absoluteIndexCounter = 0;
        const incrementalPages: BookVisualPage[] = [];
        const map = new Map<string, number>();
        for (let i = 0; i < totalChapters; i++) {
          const chapterPages = pagesByChapter[i];
          if (!chapterPages) continue;
          for (const page of chapterPages) {
            incrementalPages.push({
              ...page,
              absolutePageIndex: absoluteIndexCounter
            });
            map.set(`${page.chapterIndex}_${page.pageIndex}`, absoluteIndexCounter);
            absoluteIndexCounter++;
          }
        }
        pageIndexMapRef.current = map;
        setAllBookPages(incrementalPages);
      };
      
      const checkActive = () => active;

      // 1. Paginate active chapter first if not already computed
      if (activeChapterIndex >= 0 && activeChapterIndex < totalChapters) {
        if (!pagesByChapter[activeChapterIndex] || pagesByChapter[activeChapterIndex].length === 0) {
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
              // Only snap to the page start if the page actually exists. 
              // If it exceeds the current layout (due to premature measurement), trust the raw wordIndex.
              if (currentSLPI <= maxLocalPage) {
                if (pagesByChapter[activeChapterIndex][currentSLPI]) {
                  useReadingStore.getState().setWordIndex(pagesByChapter[activeChapterIndex][currentSLPI].startWordIndex);
                }
              }
            }
          }
        }

        hasComputedRef.current = true;
        setIsPaginationReady(true);
      }

      // 2. Paginate the rest asynchronously
      for (let chIdx = 0; chIdx < totalChapters; chIdx++) {
        if (!active) return;
        if (chIdx === activeChapterIndex) continue; // Already handled
        if (pagesByChapter[chIdx] && pagesByChapter[chIdx].length > 0) continue; // Skip already computed
        
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
    pageIndexMapRef,
  };
}
