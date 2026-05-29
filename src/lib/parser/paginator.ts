export interface VisualPage {
  pageIndex: number; // 0-indexed page within this chapter
  title: string; // Dynamic label e.g., "Page 1"
  content: string; // Complete text of this page
  leftColumn: string; // Left-hand page text
  rightColumn: string; // Right-hand page text
  startWordIndex: number; // Start relative word index in this chapter
  endWordIndex: number; // End relative word index in this chapter
}

/**
 * Paginate a chapter's content into a list of visual pages.
 */
export function paginateChapter(chapterContent: string, targetWordsPerPage: number = 300): VisualPage[] {
  const cleanContent = chapterContent.replace(/\r\n/g, "\n");
  const words = cleanContent.split(/\s+/).filter(w => w.trim() !== "");
  
  if (words.length === 0) return [];
  
  const pages: VisualPage[] = [];
  let currentWordOffset = 0;
  
  while (currentWordOffset < words.length) {
    const pageWords = words.slice(currentWordOffset, currentWordOffset + targetWordsPerPage);
    const pageText = pageWords.join(" ");
    
    // Find absolute split index for columns, aligning at the nearest sentence boundary
    const splitIndex = findSmartSplitPoint(pageText);
    const leftColumn = pageText.substring(0, splitIndex).trim();
    const rightColumn = pageText.substring(splitIndex).trim();
    
    pages.push({
      pageIndex: pages.length,
      title: `Page ${pages.length + 1}`,
      content: pageText,
      leftColumn,
      rightColumn,
      startWordIndex: currentWordOffset,
      endWordIndex: currentWordOffset + pageWords.length
    });
    
    currentWordOffset += pageWords.length;
  }
  
  return pages;
}

/**
 * Finds the optimal index to split page text into two columns.
 * Prioritizes sentence boundaries (. ! ?) closest to the halfway point.
 * Falls back to space boundaries if no punctuation is near.
 */
function findSmartSplitPoint(text: string): number {
  const mid = Math.floor(text.length / 2);
  const sentenceBoundaries = /[.!?]\s+/g;
  
  let bestIndex = mid;
  let minDiff = Infinity;
  
  let match;
  while ((match = sentenceBoundaries.exec(text)) !== null) {
    const index = match.index + 1; // Split right after punctuation
    const diff = Math.abs(index - mid);
    if (diff < minDiff) {
      minDiff = diff;
      bestIndex = index;
    }
  }
  
  // If no sentence boundary is close (within 20% of text length), split by nearest space
  if (minDiff > text.length * 0.20) {
    const spaceIndices: number[] = [];
    let spaceIndex = text.indexOf(" ");
    while (spaceIndex !== -1) {
      spaceIndices.push(spaceIndex);
      spaceIndex = text.indexOf(" ", spaceIndex + 1);
    }
    
    let closestSpaceIndex = mid;
    let spaceMinDiff = Infinity;
    spaceIndices.forEach(idx => {
      const diff = Math.abs(idx - mid);
      if (diff < spaceMinDiff) {
        spaceMinDiff = diff;
        closestSpaceIndex = idx;
      }
    });
    
    bestIndex = closestSpaceIndex;
  }
  
  return bestIndex;
}
