import DOMPurify from "isomorphic-dompurify";
import { tagHtmlBlocksWithWordIndices } from "@/lib/parser/paginator";

export interface ChapterHtmlData {
  title: string;
  content: string;
  htmlContent?: string;
  index: number;
  words?: string[];
}

// Simple LRU-style cache for processed chapter HTML to avoid heavy re-processing on the main thread.
const processedHtmlCache = new Map<string, string>();
const MAX_CACHE_SIZE = 10;

export function prepareChapterHtml(chapter: ChapterHtmlData): string {
  const cacheKey = `${chapter.index}_${chapter.htmlContent ? "html" : "text"}_${chapter.content.length}`;
  if (processedHtmlCache.has(cacheKey)) {
    return processedHtmlCache.get(cacheKey)!;
  }

  let rawHtml = "";
  if (chapter.htmlContent) {
    rawHtml = chapter.htmlContent;
  } else {
    // Fallback convert plain text to simple paragraphs
    rawHtml = chapter.content
      .split(/\n\s*\n+/)
      .map((p) => {
        const clean = p.trim();
        if (!clean) return "";
        return `<p class="mb-4 text-justify leading-relaxed">${clean}</p>`;
      })
      .join("");
  }

  let finalHtml = rawHtml;

  // Clean trailing empty elements and sanitize in one go if possible
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${rawHtml}</div>`, "text/html");
    const container = doc.body.firstElementChild as HTMLElement;
    if (container) {
      const cleanTrailing = (el: HTMLElement): boolean => {
        let modified = false;
        const children = Array.from(el.children);
        for (let i = children.length - 1; i >= 0; i--) {
          const child = children[i] as HTMLElement;
          const tagName = child.tagName.toLowerCase();
          const text = child.textContent?.trim() || "";
          const isMedia = child.querySelector("img, image, svg, iframe") || tagName === "img";
          
          if (!text && !isMedia && (tagName === "p" || tagName === "div" || tagName === "br" || tagName === "span" || tagName === "section")) {
            child.remove();
            modified = true;
          } else {
            if (tagName === "div" || tagName === "p" || tagName === "section") {
              if (cleanTrailing(child)) {
                modified = true;
              }
            }
            break;
          }
        }
        return modified;
      };

      cleanTrailing(container);
      finalHtml = container.innerHTML;
    }
  } catch (e) {
    console.warn("Failed to sanitize/trim trailing empty tags:", e);
  }

  // Harden DOMPurify configuration to prevent rendering of potentially dangerous tags.
  finalHtml = DOMPurify.sanitize(finalHtml, {
    FORBID_TAGS: ['iframe', 'object', 'embed', 'script', 'form', 'input', 'button', 'textarea', 'select', 'base', 'link'],
    FORBID_ATTR: ['formaction', 'on*']
  });

  const tagged = tagHtmlBlocksWithWordIndices(finalHtml);
  const result = tagged.html;

  // Cache management
  if (processedHtmlCache.size >= MAX_CACHE_SIZE) {
    const firstKey = processedHtmlCache.keys().next().value;
    if (firstKey !== undefined) processedHtmlCache.delete(firstKey);
  }
  processedHtmlCache.set(cacheKey, result);

  return result;
}
