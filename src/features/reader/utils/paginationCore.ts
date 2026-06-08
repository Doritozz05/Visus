import { BookVisualPage } from "@/lib/parser/paginator";
import { ChapterHtmlData, prepareChapterHtml } from "@/features/reader/utils/chapterHtml";

export interface PaginateChapterOptions {
  chIdx: number;
  chapter: ChapterHtmlData;
  width: number;
  columnGap: number;
  hiddenEl: HTMLDivElement;
  checkActive: () => boolean;
}

export async function paginateChapter({
  chIdx,
  chapter,
  width,
  columnGap,
  hiddenEl,
  checkActive,
}: PaginateChapterOptions): Promise<BookVisualPage[]> {
  const chapterHtml = prepareChapterHtml(chapter);
  
  if (!hiddenEl) return [];
  
  hiddenEl.innerHTML = chapterHtml;
  
  // Wait a frame for browser layout calculation
  await new Promise((resolve) => requestAnimationFrame(resolve));
  if (!checkActive()) return [];
  
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
}
