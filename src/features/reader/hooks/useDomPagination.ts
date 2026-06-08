import * as React from "react";
import { BookVisualPage } from "@/lib/parser/paginator";
import { ChapterHtmlData, prepareChapterHtml } from "@/features/reader/utils/chapterHtml";
import { useReadingStore } from "@/features/reader/stores/reading-store";

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
  wordsPerPage,
  hiddenPaginatorRef,
  columnGap,
  latestRestoreTargetRef,
  initialReady,
}: UseDomPaginationProps) {
  const [isPaginationReady, setIsPaginationReady] = React.useState(initialReady);
  const [isFullPaginationReady, setIsFullPaginationReady] = React.useState(initialReady);
  const hasComputedRef = React.useRef(false);

  React.useEffect(() => {
    if (!containerDimensions || chaptersData.length === 0) {
      return;
    }

    // Reset ready flag whenever we restart pagination (e.g. chapter/font change)
    setIsPaginationReady(false);
    setIsFullPaginationReady(false);

    let active = true;

    const paginateChapter = async (chIdx: number, width: number): Promise<BookVisualPage[]> => {
      const chapter = chaptersData[chIdx];
      const chapterHtml = prepareChapterHtml(chapter);
      
      const hiddenEl = hiddenPaginatorRef.current;
      if (!hiddenEl) return [];
      
      hiddenEl.innerHTML = chapterHtml;
      
      // Wait a frame for browser layout calculation
      await new Promise((resolve) => requestAnimationFrame(resolve));
      if (!active) return [];
      
      const scrollWidth = hiddenEl.scrollWidth;
      const totalPagesInChapter = Math.max(1, Math.ceil((scrollWidth + columnGap) / (width + columnGap)));
      
      const blocks = hiddenEl.querySelectorAll("[data-start-word-idx]");
      const blockPositions = Array.from(blocks).map((block) => {
        const el = block as HTMLElement;
        return {
          offsetLeft: el.offsetLeft,
          startIdx: parseInt(el.getAttribute("data-start-word-idx") || "0", 10),
          endIdx: parseInt(el.getAttribute("data-end-word-idx") || "0", 10),
        };
      });
      
      const wordsArr = chapter.content.split(/\s+/).filter((w) => w.trim() !== "");
      const totalWords = Math.max(1, wordsArr.length);
      
      const findStartWordForPage = (pIdx: number): number => {
        const targetOffset = pIdx * (width + columnGap);
        let closestBlockStart = -1;
        let minDiff = Infinity;
        
        for (const block of blockPositions) {
          if (block.offsetLeft >= targetOffset - 30) {
            const diff = block.offsetLeft - targetOffset;
            if (diff < minDiff) {
              minDiff = diff;
              closestBlockStart = block.startIdx;
            }
          }
        }
        
        if (closestBlockStart === -1) {
          if (blockPositions.length > 0) {
            return blockPositions[blockPositions.length - 1].startIdx;
          }
          return 0;
        }
        
        return closestBlockStart;
      };

      const rawChapterPages: BookVisualPage[] = [];
      for (let pIdx = 0; pIdx < totalPagesInChapter; pIdx++) {
        const startWordIndex = findStartWordForPage(pIdx);
        
        rawChapterPages.push({
          pageIndex: pIdx,
          chapterIndex: chIdx,
          absolutePageIndex: 0,
          title: `Page ${pIdx + 1}`,
          content: "",
          leftColumn: "",
          rightColumn: "",
          startWordIndex,
          endWordIndex: 0,
        });
      }
      
      // Interpolate duplicate startWordIndex values to ensure smooth traversal and avoid collapsing pages
      let i = 0;
      while (i < rawChapterPages.length) {
        let j = i + 1;
        while (j < rawChapterPages.length && rawChapterPages[j].startWordIndex === rawChapterPages[i].startWordIndex) {
          j++;
        }
        
        const runLength = j - i;
        if (runLength > 1) {
          const startVal = rawChapterPages[i].startWordIndex;
          const endVal = j < rawChapterPages.length ? rawChapterPages[j].startWordIndex : totalWords;
          const diff = endVal - startVal;
          
          for (let k = 1; k < runLength; k++) {
            const step = Math.round((runLength > 0 ? (diff * k) / runLength : 0));
            rawChapterPages[i + k].startWordIndex = Math.min(endVal, startVal + step);
            if (rawChapterPages[i + k].startWordIndex < rawChapterPages[i + k - 1].startWordIndex) {
              rawChapterPages[i + k].startWordIndex = rawChapterPages[i + k - 1].startWordIndex;
            }
          }
        }
        i = j;
      }
      
      // Assign correct sequential page indices and word ranges without collapsing pages
      for (let i = 0; i < rawChapterPages.length; i++) {
        rawChapterPages[i].pageIndex = i;
        rawChapterPages[i].title = `Page ${i + 1}`;
        
        if (i < rawChapterPages.length - 1) {
          rawChapterPages[i].endWordIndex = rawChapterPages[i + 1].startWordIndex - 1;
        } else {
          rawChapterPages[i].endWordIndex = totalWords - 1;
        }
      }

      return rawChapterPages;
    };

    const paginateAllChapters = async () => {
      const { width, height } = containerDimensions;
      if (width <= 0 || height <= 0) return;

      const { activeChapterIndex, setAllBookPages } = useReadingStore.getState();
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
      
      // 1. Paginate active chapter first
      if (activeChapterIndex >= 0 && activeChapterIndex < totalChapters) {
        pagesByChapter[activeChapterIndex] = await paginateChapter(activeChapterIndex, width);
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
        
        pagesByChapter[chIdx] = await paginateChapter(chIdx, width);
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
  }, [chaptersData, scaledFontSize, readerFontClass, containerDimensions, wordsPerPage, columnGap]);

  return {
    isPaginationReady,
    isFullPaginationReady,
    hasComputedRef,
  };
}
