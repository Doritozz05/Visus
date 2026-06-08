import * as React from "react";
import { BookVisualPage } from "@/lib/parser/paginator";
import { ChapterHtmlData, prepareChapterHtml } from "@/features/reader/utils/chapterHtml";

interface UseDomPaginationProps {
  chaptersData: ChapterHtmlData[];
  containerDimensions: { width: number; height: number } | null;
  onPagesComputed?: (computedPages: BookVisualPage[]) => void;
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
  setCurrentPageIndex: (idx: number) => void;
  localWordIndexChangeRef: React.MutableRefObject<number | null>;
  pendingRestorePageRef: React.MutableRefObject<number | null>;
  initialReady: boolean;
}

export function useDomPagination({
  chaptersData,
  containerDimensions,
  onPagesComputed,
  scaledFontSize,
  readerFontClass,
  wordsPerPage,
  hiddenPaginatorRef,
  columnGap,
  latestRestoreTargetRef,
  setCurrentPageIndex,
  localWordIndexChangeRef,
  pendingRestorePageRef,
  initialReady,
}: UseDomPaginationProps) {
  const [isPaginationReady, setIsPaginationReady] = React.useState(initialReady);
  const hasComputedRef = React.useRef(false);

  React.useEffect(() => {
    if (!onPagesComputed || !containerDimensions || chaptersData.length === 0) {
      return;
    }

    // Reset ready flag whenever we restart pagination (e.g. chapter/font change)
    setIsPaginationReady(false);

    let active = true;

    const paginateAllChapters = async () => {
      const { width, height } = containerDimensions;
      if (width <= 0 || height <= 0) return;

      const computedPages: BookVisualPage[] = [];
      let absolutePageIndex = 0;

      for (let chIdx = 0; chIdx < chaptersData.length; chIdx++) {
        if (!active) return;

        const chapter = chaptersData[chIdx];
        const chapterHtml = prepareChapterHtml(chapter);
        
        const hiddenEl = hiddenPaginatorRef.current;
        if (!hiddenEl) return;
        
        hiddenEl.innerHTML = chapterHtml;
        
        // Wait a frame for browser layout calculation
        await new Promise((resolve) => requestAnimationFrame(resolve));
        
        if (!active) return;
        
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
          rawChapterPages[i].absolutePageIndex = absolutePageIndex++;
          rawChapterPages[i].title = `Page ${i + 1}`;
          
          if (i < rawChapterPages.length - 1) {
            rawChapterPages[i].endWordIndex = rawChapterPages[i + 1].startWordIndex - 1;
          } else {
            rawChapterPages[i].endWordIndex = totalWords - 1;
          }
        }

        computedPages.push(...rawChapterPages);
      }

      if (active) {
        onPagesComputed(computedPages);

        const { savedLocalPageIndex: currentSLPI, wordIndex: currentWI, chapterIndex: currentCI } = latestRestoreTargetRef.current;
        
        const isInitialLoad = !hasComputedRef.current;

        if (isInitialLoad && currentSLPI !== undefined) {
          const chapterPages = computedPages.filter(p => p.chapterIndex === currentCI);
          const maxLocalPage = Math.max(0, chapterPages.length - 1);
          const clampedPage = Math.min(currentSLPI, maxLocalPage);
          if (chapterPages[clampedPage]) {
            localWordIndexChangeRef.current = chapterPages[clampedPage].startWordIndex;
          }
          pendingRestorePageRef.current = clampedPage;
          setCurrentPageIndex(clampedPage);
        } else {
          // No saved page index or not initial load (reflow) — derive from wordIndex using the freshly computed pages
          const page = computedPages.find(
            (p) => p.chapterIndex === currentCI && currentWI >= p.startWordIndex && currentWI <= p.endWordIndex
          );
          if (page) {
            pendingRestorePageRef.current = page.pageIndex;
            setCurrentPageIndex(page.pageIndex);
          }
        }

        hasComputedRef.current = true;
        // Mark pagination as ready so the spinner is replaced by the actual content
        setIsPaginationReady(true);
      }
    };

    paginateAllChapters();

    return () => {
      active = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chaptersData, scaledFontSize, readerFontClass, containerDimensions, onPagesComputed, wordsPerPage]);

  return {
    isPaginationReady,
    hasComputedRef,
  };
}
