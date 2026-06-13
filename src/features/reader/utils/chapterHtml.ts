import DOMPurify from "isomorphic-dompurify";
import { tagHtmlBlocksWithWordIndices } from "@/lib/parser/paginator";

export interface ChapterHtmlData {
  title: string;
  content: string;
  htmlContent?: string;
  index: number;
  words?: string[];
}

export function prepareChapterHtml(chapter: ChapterHtmlData): string {
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

  // Clean trailing empty elements
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
          const isMedia =
            child.querySelector("img, image, svg, iframe") || tagName === "img";

          if (
            !text &&
            !isMedia &&
            (tagName === "p" ||
              tagName === "div" ||
              tagName === "br" ||
              tagName === "span" ||
              tagName === "section")
          ) {
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

  // Apply strict defense-in-depth sanitization config to prevent SSRF and phishing attacks.
  // We forbid tags and attributes that default settings may allow to render.
  // Note: 'iframe' is intentionally omitted from FORBID_TAGS to allow embedded media (e.g. YouTube).
  finalHtml = DOMPurify.sanitize(finalHtml, {
    FORBID_TAGS: [
      "object",
      "embed",
      "form",
      "input",
      "button",
      "script",
    ],
    FORBID_ATTR: ["action", "method", "srcdoc"],
  });

  const tagged = tagHtmlBlocksWithWordIndices(finalHtml);
  return tagged.html;
}
