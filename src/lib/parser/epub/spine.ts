import JSZip from "jszip";
import { BookChapter } from "@/core/entities/book";
import { TocEntry } from "./types";
import { 
  cleanTitle, 
  resolveRelativePath 
} from "./utils";
import { 
  checkIfContentExistsBefore, 
  extractHtmlBetweenRange, 
  cleanDocumentBody, 
  extractCleanText, 
  processImages 
} from "./dom-helpers";

export async function processSpineFiles(
  zip: JSZip,
  parser: DOMParser,
  opfDir: string,
  spineFilePaths: string[],
  fileToTocEntriesMap: Map<string, TocEntry[]>
): Promise<BookChapter[]> {
  const chapters: BookChapter[] = [];

  for (const spinePath of spineFilePaths) {
    let file = zip.file(spinePath);
    if (!file) {
      // Try case-insensitive fallback
      const matchedKey = Object.keys(zip.files).find(k => k.toLowerCase() === spinePath.toLowerCase());
      if (matchedKey) file = zip.file(matchedKey);
    }
    
    if (!file) continue;
    
    const htmlStr = await file.async("string");
    const doc = parser.parseFromString(htmlStr, "text/html");
    
    // Inject and base64 encode all relative images offline
    await processImages(zip, doc, spinePath);
    
    // Find all TOC entries pointing to this file
    const fileTocEntries = fileToTocEntriesMap.get(spinePath) || [];
    
    if (fileTocEntries.length > 0) {
      // Split the HTML document based on TOC anchors using DOM Range API
      const markers = fileTocEntries.map((entry) => {
        let element: HTMLElement | null = null;
        if (entry.anchor) {
          element = doc.getElementById(entry.anchor) || 
                    doc.querySelector(`[name='${entry.anchor}']`) as HTMLElement | null;
        }
        return { entry, element };
      });
      
      // Filter only found anchors and sort them in structural document layout order
      const foundMarkers = markers.filter((m) => m.element !== null) as { entry: TocEntry; element: HTMLElement }[];
      
      foundMarkers.sort((a, b) => {
        const comparison = a.element.compareDocumentPosition(b.element);
        if (comparison & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
        if (comparison & Node.DOCUMENT_POSITION_PRECEDING) return 1;
        return 0;
      });
      
      if (foundMarkers.length === 0) {
        // If TOC references anchors but they weren't found in DOM, keep file as a single chapter
        const title = fileTocEntries[0].title;
        const htmlContent = cleanDocumentBody(doc.body);
        const plainText = extractCleanText(htmlContent);
        chapters.push({ title, content: plainText, htmlContent });
      } else {
        // If there is content BEFORE the first anchor, create a preface or append to first chapter
        const firstMarker = foundMarkers[0];
        const hasSignificantPreface = checkIfContentExistsBefore(doc.body, firstMarker.element);
        
        if (hasSignificantPreface) {
          const prefaceHtml = extractHtmlBetweenRange(doc, doc.body, 0, firstMarker.element, false);
          if (prefaceHtml && extractCleanText(prefaceHtml).trim().length > 100) {
            const prefaceTitle = fileTocEntries[0].title.includes("CHAPTER") 
              ? "Introduction" 
              : `${fileTocEntries[0].title} (Intro)`;
            chapters.push({
              title: prefaceTitle,
              content: extractCleanText(prefaceHtml),
              htmlContent: prefaceHtml
            });
          }
        }
        
        // Extract chapters between anchors
        for (let i = 0; i < foundMarkers.length; i++) {
          const current = foundMarkers[i];
          const next = foundMarkers[i + 1];
          let chapterHtml = "";
          
          if (next) {
            chapterHtml = extractHtmlBetweenRange(doc, current.element, 0, next.element, false);
          } else {
            // Last anchor goes until the end of the document body
            chapterHtml = extractHtmlBetweenRange(doc, current.element, 0, doc.body, true);
          }
          
          if (chapterHtml.trim()) {
            chapters.push({
              title: current.entry.title,
              content: extractCleanText(chapterHtml),
              htmlContent: chapterHtml
            });
          }
        }
      }
    } else {
      // Fallback spine file (not listed in TOC, e.g. cover pages or custom files)
      // Check if file is huge and has internal headings to split dynamically
      const headings = doc.querySelectorAll("h1, h2, h3");
      if (htmlStr.length > 25000 && headings.length >= 2) {
        const foundHeadings = Array.from(headings) as HTMLElement[];
        
        // Split huge file by headings automatically
        for (let i = 0; i < foundHeadings.length; i++) {
          const current = foundHeadings[i];
          const next = foundHeadings[i + 1];
          let chapterHtml = "";
          
          if (next) {
            chapterHtml = extractHtmlBetweenRange(doc, current, 0, next, false);
          } else {
            chapterHtml = extractHtmlBetweenRange(doc, current, 0, doc.body, true);
          }
          
          const rawTitle = current.textContent ? cleanTitle(current.textContent) : "";
          const currentTitle = (rawTitle && rawTitle.length <= 80) ? rawTitle : `Chapter ${chapters.length + 1}`;
          if (chapterHtml.trim()) {
            chapters.push({
              title: currentTitle,
              content: extractCleanText(chapterHtml),
              htmlContent: chapterHtml
            });
          }
        }
      } else {
        // Normal sized unlisted spine file - load whole file as single chapter
        let chapterTitle = "";
        const hEl = doc.querySelector("h1, h2, h3, h4");
        if (hEl && hEl.textContent) {
          const possibleTitle = cleanTitle(hEl.textContent);
          if (possibleTitle.length > 0 && possibleTitle.length <= 80) {
            chapterTitle = possibleTitle;
          }
        }
        if (!chapterTitle) {
          chapterTitle = spinePath.substring(spinePath.lastIndexOf("/") + 1)
            .replace(/\.xhtml$|\.html$|\.htm$/gi, "")
            .replace(/[_-]/g, " ");
          chapterTitle = cleanTitle(chapterTitle);
          chapterTitle = chapterTitle.charAt(0).toUpperCase() + chapterTitle.slice(1);
        }
        
        const htmlContent = cleanDocumentBody(doc.body);
        const plainText = extractCleanText(htmlContent);
        
        if (plainText.trim()) {
          chapters.push({
            title: chapterTitle,
            content: plainText,
            htmlContent
          });
        }
      }
    }
  }

  return chapters;
}
