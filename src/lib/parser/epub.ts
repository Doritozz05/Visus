import JSZip from "jszip";
import { BookChapter } from "@/core/entities/book";

function cleanTitle(rawTitle: string): string {
  return rawTitle.replace(/\s+/g, " ").trim();
}

export interface ParsedEpub {
  title: string;
  author: string;
  chapters: BookChapter[];
  coverUrl?: string;
  description?: string;
  genres?: string[];
  publisher?: string;
  publishDate?: string;
  language?: string;
}

export function normalizeEpubSubject(subject: string): string | null {
  const cleaned = subject.replace(/\s+/g, " ").trim();
  if (!cleaned) return null;

  const subdivisionParts = cleaned
    .split(/\s+--\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  let normalized = subdivisionParts.length > 1
    ? subdivisionParts[subdivisionParts.length - 1]
    : cleaned;

  const trailingParenthetical = normalized.match(/\(([^)]+)\)\s*$/);
  if (trailingParenthetical) {
    normalized = trailingParenthetical[1].trim();
  }

  normalized = normalized.replace(/\s+/g, " ").trim();
  return normalized || null;
}

export function getGeneralEpubGenres(subjects: string[]): string[] {
  const genres: string[] = [];
  const seen = new Set<string>();

  subjects.forEach((subject) => {
    const normalized = normalizeEpubSubject(subject);
    if (!normalized) return;

    const key = normalized.toLowerCase();
    if (seen.has(key)) return;

    seen.add(key);
    genres.push(normalized);
  });

  return genres;
}

interface TocEntry {
  title: string;
  href: string; // Zip path with anchor, e.g. "OEBPS/text/chap1.xhtml#sec1"
  filePath: string; // Zip path to file, e.g. "OEBPS/text/chap1.xhtml"
  anchor?: string; // Anchor ID, e.g. "sec1"
}

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

// --- TOC FORMAT PARSERS ---

async function parseNcx(zip: JSZip, ncxPath: string): Promise<TocEntry[]> {
  const file = zip.file(ncxPath);
  if (!file) return [];
  const xmlStr = await file.async("string");
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlStr, "text/xml");
  const ncxDir = ncxPath.includes("/") ? ncxPath.substring(0, ncxPath.lastIndexOf("/") + 1) : "";
  
  const entries: TocEntry[] = [];
  const navPoints = doc.querySelectorAll("navPoint");
  
  navPoints.forEach((navPoint) => {
    const textEl = navPoint.querySelector("navLabel > text");
    const contentEl = navPoint.querySelector("content");
    const title = textEl?.textContent ? cleanTitle(textEl.textContent) : "Untitled Section";
    const relativeSrc = contentEl?.getAttribute("src");
    
    if (relativeSrc) {
      const cleanHref = resolveRelativePath(ncxDir, relativeSrc);
      const [filePath, anchor] = cleanHref.split("#");
      entries.push({
        title,
        href: decodeURIComponent(ncxDir + relativeSrc),
        filePath,
        anchor
      });
    }
  });
  
  return entries;
}

async function parseNav(zip: JSZip, navPath: string): Promise<TocEntry[]> {
  const file = zip.file(navPath);
  if (!file) return [];
  const htmlStr = await file.async("string");
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlStr, "text/html");
  const navDir = navPath.includes("/") ? navPath.substring(0, navPath.lastIndexOf("/") + 1) : "";
  
  const entries: TocEntry[] = [];
  // Support standard EPUB 3 TOC <nav epub:type="toc"> or fallback <nav>
  const navEl = doc.querySelector("nav[*|type='toc'], nav[epub\\:type='toc'], nav");
  const aEls = (navEl || doc).querySelectorAll("a");
  
  aEls.forEach((a) => {
    const title = a.textContent ? cleanTitle(a.textContent) : "Untitled Section";
    const relativeSrc = a.getAttribute("href");
    
    if (relativeSrc) {
      const cleanHref = resolveRelativePath(navDir, relativeSrc);
      const [filePath, anchor] = cleanHref.split("#");
      entries.push({
        title,
        href: decodeURIComponent(navDir + relativeSrc),
        filePath,
        anchor
      });
    }
  });
  
  return entries;
}

// --- CHAPTER POST-PROCESSING PIPELINE ---

function isStandaloneSection(title: string): boolean {
  const t = title.toUpperCase().trim();
  return (
    t.includes("TITLE PAGE") ||
    t.includes("CONTENTS") ||
    t.includes("TABLE OF CONTENTS") ||
    t.includes("PROLOGUE") ||
    t.includes("PREFACE") ||
    t.includes("ACT ") ||
    t.includes("ACTI") ||
    t.includes("SCENE") ||
    t.includes("CHAPTER") ||
    t.includes("EPILOGUE") ||
    t.includes("DEDICATION") ||
    t.includes("INTRODUCTION") ||
    t.includes("INTRO")
  );
}

function postProcessChapters(rawChapters: BookChapter[]): BookChapter[] {
  if (rawChapters.length <= 1) return rawChapters;
  
  const processed: BookChapter[] = [];
  let current = { ...rawChapters[0] };
  
  for (let i = 1; i < rawChapters.length; i++) {
    const next = rawChapters[i];
    
    const currentWordCount = current.content.split(/\s+/).filter(Boolean).length;
    const nextWordCount = next.content.split(/\s+/).filter(Boolean).length;
    
    // Standalone sections should NEVER be merged
    const currentIsStandalone = isStandaloneSection(current.title);
    const nextIsStandalone = isStandaloneSection(next.title);
    
    if (currentIsStandalone || nextIsStandalone) {
      processed.push(current);
      current = { ...next };
      continue;
    }
    
    // Heuristics 1: Merge adjacent cover title & subtitle fragments
    const isContinuation = 
      /^[a-z]/.test(next.title) || 
      next.title.toLowerCase().startsWith("or ") || 
      next.title.toLowerCase().startsWith("and ") ||
      current.title.endsWith(";") || 
      current.title.endsWith(",");
      
    // Only merge if it's a clear continuation and very short, OR if next is an extremely tiny fragment without substantive content (e.g. < 15 words)
    const isTinyFragment = nextWordCount < 15;
    
    if ((nextWordCount < 150 && isContinuation) || isTinyFragment) {
      // Merge titles cleanly
      if (current.title.endsWith(";")) {
        current.title = `${current.title} ${next.title}`;
      } else if (current.title.toLowerCase() === next.title.toLowerCase()) {
        // Keep current title
      } else {
        current.title = `${current.title} - ${next.title}`;
      }
      
      // Merge plain and HTML content
      current.content = `${current.content}\n\n${next.content}`;
      if (current.htmlContent && next.htmlContent) {
        current.htmlContent = `${current.htmlContent}\n${next.htmlContent}`;
      } else if (next.htmlContent) {
        current.htmlContent = next.htmlContent;
      }
    } else {
      processed.push(current);
      current = { ...next };
    }
  }
  processed.push(current);
  
  return processed;
}

// --- DOM RANGE & HTML HELPERS ---

function checkIfContentExistsBefore(body: HTMLElement, markerElement: HTMLElement): boolean {
  try {
    const range = body.ownerDocument.createRange();
    range.setStart(body, 0);
    range.setEndBefore(markerElement);
    return range.toString().trim().length > 0;
  } catch (_) {
    return false;
  }
}

function extractHtmlBetweenRange(
  doc: Document,
  startNode: Node,
  startOffset: number,
  endNode: Node,
  isEndAfter: boolean
): string {
  try {
    const range = doc.createRange();
    
    if (startNode === doc.body && startOffset === 0) {
      range.setStart(doc.body, 0);
    } else {
      range.setStartBefore(startNode);
    }
    
    if (isEndAfter) {
      if (endNode === doc.body) {
        range.setEndAfter(doc.body.lastChild || doc.body);
      } else {
        range.setEndAfter(endNode);
      }
    } else {
      range.setEndBefore(endNode);
    }
    
    const fragment = range.cloneContents();
    const div = doc.createElement("div");
    div.appendChild(fragment);
    
    return cleanDocumentBody(div);
  } catch (err) {
    console.error("DOM Range Extraction failed:", err);
    return "";
  }
}

function cleanDocumentBody(container: HTMLElement): string {
  const clone = container.cloneNode(true) as HTMLElement;
  
  clone.querySelectorAll("script, style, iframe").forEach(el => el.remove());
  
  clone.querySelectorAll("[style]").forEach(el => {
    const styleAttr = el.getAttribute("style") || "";
    const cleanStyles = styleAttr
      .split(";")
      .filter(rule => {
        const r = rule.toLowerCase().trim();
        return !r.startsWith("color") && 
               !r.startsWith("background") && 
               !r.startsWith("font-family") &&
               !r.startsWith("font-size");
      })
      .join(";");
    
    if (cleanStyles.trim()) {
      el.setAttribute("style", cleanStyles);
    } else {
      el.removeAttribute("style");
    }
  });
  
  return clone.innerHTML.trim();
}

function extractCleanText(htmlContent: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");
  
  const paragraphs = doc.querySelectorAll("p, div, li, h1, h2, h3, h4, h5, h6");
  const pTexts: string[] = [];
  
  paragraphs.forEach((p) => {
    const text = p.textContent?.trim();
    if (!text) return;
    
    const tagName = p.tagName.toLowerCase();
    if (tagName === "p" || tagName.startsWith("h")) {
      pTexts.push(text);
    } else if (tagName === "div" && !p.querySelector("p") && !p.querySelector("div")) {
      pTexts.push(text);
    } else if (tagName === "li") {
      pTexts.push(text);
    }
  });
  
  let content = pTexts.join("\n\n");
  if (!content.trim()) {
    content = doc.body?.textContent?.trim() || "";
    content = content.replace(/\n\s*\n+/g, "\n\n");
  }
  
  return content;
}

// --- OFFLINE IMAGE PROCESSING ---

function resolveRelativePath(baseDir: string, relativePath: string): string {
  const decodedPath = decodeURIComponent(relativePath);
  const parts = (baseDir + decodedPath).split("/");
  const stack: string[] = [];
  
  for (const part of parts) {
    if (part === "" || part === ".") continue;
    if (part === "..") {
      stack.pop();
    } else {
      stack.push(part);
    }
  }
  
  return stack.join("/");
}

async function loadImageAsBase64(zip: JSZip, cleanPath: string): Promise<string | null> {
  let file = zip.file(cleanPath);
  if (!file) {
    const matchedKey = Object.keys(zip.files).find(k => k.toLowerCase() === cleanPath.toLowerCase());
    if (matchedKey) file = zip.file(matchedKey);
  }
  
  if (!file) return null;
  
  try {
    const base64 = await file.async("base64");
    const ext = cleanPath.split(".").pop()?.toLowerCase();
    let mimeType = "image/jpeg";
    if (ext === "png") mimeType = "image/png";
    else if (ext === "gif") mimeType = "image/gif";
    else if (ext === "svg") mimeType = "image/svg+xml";
    
    return `data:${mimeType};base64,${base64}`;
  } catch (err) {
    console.warn(`Could not load image at ${cleanPath} from zip:`, err);
    return null;
  }
}

async function processImages(zip: JSZip, doc: Document, currentFilePath: string) {
  const currentDir = currentFilePath.includes("/") 
    ? currentFilePath.substring(0, currentFilePath.lastIndexOf("/") + 1) 
    : "";
    
  const imgs = doc.querySelectorAll("img");
  for (const img of Array.from(imgs)) {
    const src = img.getAttribute("src");
    if (!src || src.startsWith("data:") || src.includes("://")) continue;
    
    const resolvedPath = resolveRelativePath(currentDir, src);
    const base64Data = await loadImageAsBase64(zip, resolvedPath);
    if (base64Data) {
      img.setAttribute("src", base64Data);
    }
  }
  
  const svgImages = doc.querySelectorAll("image, svg\\:image");
  for (const img of Array.from(svgImages)) {
    const href = img.getAttribute("href") || img.getAttribute("xlink:href");
    if (!href || href.startsWith("data:") || href.includes("://")) continue;
    
    const resolvedPath = resolveRelativePath(currentDir, href);
    const base64Data = await loadImageAsBase64(zip, resolvedPath);
    if (base64Data) {
      img.setAttribute("href", base64Data);
      img.setAttribute("xlink:href", base64Data);
    }
  }
}
