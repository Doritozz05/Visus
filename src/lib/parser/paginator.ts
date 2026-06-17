export interface VisualPage {
  pageIndex: number; // 0-indexed page within this chapter
  title: string; // Dynamic label e.g., "Page 1"
  content: string; // Complete text of this page
  leftColumn: string; // Left-hand page text
  rightColumn: string; // Right-hand page text
  startWordIndex: number; // Start relative word index in this chapter
  endWordIndex: number; // End relative word index in this chapter
}

export interface BookVisualPage extends VisualPage {
  chapterIndex: number;
  absolutePageIndex: number;
}

/**
 * Generator that yields tokens (non-whitespace matches) with character offsets
 * one at a time, avoiding creation of intermediate arrays.
 */
function* yieldToken(text: string): Generator<{ text: string; start: number; end: number }, void, void> {
  const regex = /\S+/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    yield {
      text: match[0],
      start: match.index,
      end: match.index + match[0].length
    };
  }
}

/**
 * Paginate a chapter's content into a list of visual pages.
 * Uses a lazy generator to stream tokens instead of building a full token array.
 */
export function paginateChapter(chapterContent: string, targetWordsPerPage: number = 300): VisualPage[] {
  const cleanContent = chapterContent.replace(/\r\n/g, "\n");
  const tokenGen = yieldToken(cleanContent);

  const pages: VisualPage[] = [];
  let currentWordOffset = 0;
  let genDone = false;

  while (!genDone) {
    const pageTokens: Array<{ text: string; start: number; end: number }> = [];
    for (let i = 0; i < targetWordsPerPage; i++) {
      const next = tokenGen.next();
      if (next.done) {
        genDone = true;
        break;
      }
      pageTokens.push(next.value);
    }

    if (pageTokens.length === 0) break;

    const pageStartChar = pageTokens[0].start;
    const pageEndChar = pageTokens[pageTokens.length - 1].end;
    const pageText = cleanContent.substring(pageStartChar, pageEndChar);

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
      endWordIndex: currentWordOffset + pageTokens.length
    });

    currentWordOffset += pageTokens.length;
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

/**
 * Safely parses and tags typical HTML block elements (paragraphs, headers, list items)
 * with their absolute start and end word indices in the chapter.
 * Works strictly in the browser context (client-side).
 */
function normalizeMixedContent(container: HTMLElement) {
  const BLOCK_TAGS = new Set([
    "DIV", "SECTION", "ARTICLE", "HEADER", "FOOTER", "MAIN", "ASIDE", 
    "BLOCKQUOTE", "BODY", "LI", "TD", "P", "H1", "H2", "H3", "H4", "H5", "H6", "PRE"
  ]);

  const isBlockNode = (node: Node): boolean => {
    return node.nodeType === Node.ELEMENT_NODE && BLOCK_TAGS.has((node as Element).tagName);
  };

  const walk = (element: HTMLElement) => {
    if (!element) return;
    
    const elementChildren = element.children ? Array.from(element.children) : [];
    elementChildren.forEach((child) => {
      walk(child as HTMLElement);
    });

    const children = element.childNodes ? Array.from(element.childNodes) : [];
    const hasBlockChild = children.some(isBlockNode);

    if (!hasBlockChild) return;

    let currentGroup: Node[] = [];

    const flushGroup = () => {
      if (currentGroup.length === 0) return;

      const hasContent = currentGroup.some(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return (node.textContent || "").trim().length > 0;
        }
        return true;
      });

      if (hasContent) {
        const doc = element.ownerDocument || document;
        const p = doc.createElement("p");
        element.insertBefore(p, currentGroup[0]);
        currentGroup.forEach(node => p.appendChild(node));
      } else {
        currentGroup.forEach(node => {
          if (node.parentNode) node.parentNode.removeChild(node);
        });
      }
      currentGroup = [];
    };

    children.forEach((child) => {
      if (isBlockNode(child)) {
        flushGroup();
      } else {
        currentGroup.push(child);
      }
    });

    flushGroup();
  };

  walk(container);
}

export function tagHtmlBlocksWithWordIndices(htmlContent: string): { html: string; totalWords: number } {
  if (typeof window === "undefined" || !htmlContent) {
    return { html: htmlContent, totalWords: 0 };
  }

  try {
    const parser = new DOMParser();
    // Wrap in a parent element to guarantee a single root for parsing
    const doc = parser.parseFromString(`<div>${htmlContent}</div>`, "text/html");
    const container = doc.body.firstElementChild as HTMLElement;
    if (!container) return { html: htmlContent, totalWords: 0 };

    normalizeMixedContent(container);

    let wordCount = 0;

    // Recursive function to walk through text nodes and wrap words
    const wrapWords = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || "";
        const words = text.split(/(\s+)/); // Preserve whitespace
        const fragment = document.createDocumentFragment();

        words.forEach((word) => {
          if (word.trim().length > 0) {
            const span = document.createElement("span");
            span.setAttribute("data-word-index", wordCount.toString());
            span.textContent = word;
            fragment.appendChild(span);
            wordCount++;
          } else {
            // Keep whitespace as pure text nodes to avoid DOM bloat and spacing issues
            fragment.appendChild(document.createTextNode(word));
          }
        });

        node.parentNode?.replaceChild(fragment, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        // Avoid double-wrapping or processing non-content elements
        if (element.tagName === "SCRIPT" || element.tagName === "STYLE" || element.tagName === "IMG") return;
        
        const children = Array.from(node.childNodes);
        children.forEach(wrapWords);
      }
    };

    wrapWords(container);
    
    return {
      html: container.innerHTML,
      totalWords: wordCount
    };
  } catch (err) {
    console.error("Failed to tag HTML words with indices:", err);
    return { html: htmlContent, totalWords: 0 };
  }
}

