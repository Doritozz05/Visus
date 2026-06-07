import JSZip from "jszip";
import { BookChapter } from "@/core/entities/book";
import { ParsedEpub, TocEntry } from "./epub/types";
import { 
  cleanTitle, 
  normalizeEpubSubject, 
  getGeneralEpubGenres, 
  resolveRelativePath, 
  loadImageAsBase64 
} from "./epub/utils";
import { 
  checkIfContentExistsBefore, 
  extractHtmlBetweenRange, 
  cleanDocumentBody, 
  extractCleanText, 
  processImages 
} from "./epub/dom-helpers";
import { parseNcx, parseNav } from "./epub/toc-parsers";
import { postProcessChapters } from "./epub/post-processor";

// Re-export public API items
export type { ParsedEpub };
export { normalizeEpubSubject, getGeneralEpubGenres };

export async function parseEpub(arrayBuffer: ArrayBuffer): Promise<ParsedEpub> {
  const zip = await JSZip.loadAsync(arrayBuffer);
  const parser = new DOMParser();

  // 1. Read container.xml to locate content.opf
  const containerFile = zip.file("META-INF/container.xml");
  if (!containerFile) {
    throw new Error("Invalid EPUB: Missing META-INF/container.xml");
  }
  const containerXmlStr = await containerFile.async("string");
  const containerXml = parser.parseFromString(containerXmlStr, "text/xml");
  const rootfile = containerXml.querySelector("rootfile");
  const opfPath = rootfile?.getAttribute("full-path");
  if (!opfPath) {
    throw new Error("Invalid EPUB: Cannot find root OPF file path");
  }
  
  // Get base directory of the OPF file
  const opfDir = opfPath.includes("/") ? opfPath.substring(0, opfPath.lastIndexOf("/") + 1) : "";
  
  // 2. Read content.opf
  const opfFile = zip.file(opfPath);
  if (!opfFile) {
    throw new Error(`Invalid EPUB: Missing OPF file at ${opfPath}`);
  }
  const opfXmlStr = await opfFile.async("string");
  const opfXml = parser.parseFromString(opfXmlStr, "text/xml");
  
  // Extract Metadata
  const titleEl = opfXml.querySelector("title, dc\\:title");
  const creatorEl = opfXml.querySelector("creator, dc\\:creator");
  const title = titleEl?.textContent ? cleanTitle(titleEl.textContent) : "Unknown Title";
  const author = creatorEl?.textContent ? cleanTitle(creatorEl.textContent) : "Unknown Author";
  
  const descriptionEl = opfXml.querySelector("description, dc\\:description");
  const description = descriptionEl?.textContent?.trim() || undefined;
  
  const publisherEl = opfXml.querySelector("publisher, dc\\:publisher");
  const publisher = publisherEl?.textContent?.trim() || undefined;
  
  const dateEl = opfXml.querySelector("date, dc\\:date");
  const publishDate = dateEl?.textContent?.trim() || undefined;
  
  const languageEl = opfXml.querySelector("language, dc\\:language");
  const language = languageEl?.textContent?.trim() || undefined;
  
  const subjectEls = opfXml.querySelectorAll("subject, dc\\:subject");
  const rawSubjects: string[] = [];
  subjectEls.forEach((el) => {
    const text = el.textContent?.trim();
    if (text) rawSubjects.push(text);
  });
  const genres = getGeneralEpubGenres(rawSubjects);
  
  // Parse Manifest (id -> href)
  const manifestItems = new Map<string, string>();
  const manifestProperties = new Map<string, string>();
  const items = opfXml.querySelectorAll("manifest > item");
  items.forEach((item) => {
    const id = item.getAttribute("id");
    const href = item.getAttribute("href");
    const properties = item.getAttribute("properties");
    if (id && href) {
      manifestItems.set(id, href);
      if (properties) {
        manifestProperties.set(id, properties);
      }
    }
  });
  
  // Extract cover image
  let coverUrl: string | undefined = undefined;
  let coverHref: string | null = null;
  
  items.forEach((item) => {
    const id = item.getAttribute("id");
    const href = item.getAttribute("href");
    const properties = item.getAttribute("properties");
    if (properties === "cover-image" && href) {
      coverHref = href;
    } else if ((id === "cover" || id === "cover-image" || id === "cover-img") && href && !coverHref) {
      coverHref = href;
    }
  });
  
  if (!coverHref) {
    const coverMeta = opfXml.querySelector("meta[name='cover']");
    const coverId = coverMeta?.getAttribute("content");
    if (coverId) {
      const href = manifestItems.get(coverId);
      if (href) coverHref = href;
    }
  }
  
  if (coverHref) {
    try {
      const fullCoverPath = opfDir + coverHref;
      const cleanCoverPath = decodeURIComponent(fullCoverPath.split("#")[0]);
      const coverBase64 = await loadImageAsBase64(zip, cleanCoverPath);
      if (coverBase64) coverUrl = coverBase64;
    } catch (coverErr) {
      console.warn("Could not extract cover image:", coverErr);
    }
  }
  
  // Parse Spine (defines reading order)
  const spineItems = opfXml.querySelectorAll("spine > itemref");
  const spineFilePaths: string[] = [];
  const spineTocId = opfXml.querySelector("spine")?.getAttribute("toc") || undefined;
  
  spineItems.forEach((itemref) => {
    const idref = itemref.getAttribute("idref");
    if (!idref) return;
    const relativeHref = manifestItems.get(idref);
    if (!relativeHref) return;
    const cleanHref = resolveRelativePath(opfDir, relativeHref.split("#")[0]);
    spineFilePaths.push(cleanHref);
  });
  
  // Locate TOC file path
  let tocPath: string | undefined = undefined;
  
  // EPUB 3 NAV Toc detection (Manifest item with properties="nav")
  items.forEach((item) => {
    const properties = item.getAttribute("properties");
    const href = item.getAttribute("href");
    if (properties && href) {
      const propList = properties.split(/\s+/);
      if (propList.includes("nav")) {
        tocPath = resolveRelativePath(opfDir, href);
      }
    }
  });
  
  // Fallback to EPUB 2 NCX Toc detection
  if (!tocPath && spineTocId) {
    const relativeNcx = manifestItems.get(spineTocId);
    if (relativeNcx) {
      tocPath = opfDir + relativeNcx;
    }
  }
  
  // Last resort NCX filename scan
  if (!tocPath) {
    items.forEach((item) => {
      const href = item.getAttribute("href");
      const mediaType = item.getAttribute("media-type");
      if (href && (mediaType === "application/x-dtbncx+xml" || href.toLowerCase().endsWith(".ncx"))) {
        tocPath = opfDir + href;
      }
    });
  }
  
  // Parse Table of Contents to gather chapters map
  let tocEntries: TocEntry[] = [];
  if (tocPath) {
    const cleanTocPath = decodeURIComponent(tocPath);
    try {
      if (cleanTocPath.toLowerCase().endsWith(".ncx")) {
        tocEntries = await parseNcx(zip, cleanTocPath);
      } else {
        tocEntries = await parseNav(zip, cleanTocPath);
      }
    } catch (tocErr) {
      console.warn("Failed parsing table of contents, falling back to spine order:", tocErr);
    }
  }
  
  const chapters: BookChapter[] = [];
  
  // Group TOC entries by file path to split files cleanly
  const fileToTocEntriesMap = new Map<string, TocEntry[]>();
  tocEntries.forEach((entry) => {
    const entries = fileToTocEntriesMap.get(entry.filePath) || [];
    entries.push(entry);
    fileToTocEntriesMap.set(entry.filePath, entries);
  });
  
  // Process Spine files in chronological reading order
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
  
  return {
    title,
    author,
    chapters: postProcessChapters(chapters), // Apply intelligent globally robust chapter post-processing!
    coverUrl,
    description,
    genres: genres.length > 0 ? genres : undefined,
    publisher,
    publishDate,
    language
  };
}
