import JSZip from "jszip";
import { BookChapter } from "@/core/entities/book";

export interface ParsedEpub {
  title: string;
  author: string;
  chapters: BookChapter[];
}

export async function parseEpub(arrayBuffer: ArrayBuffer): Promise<ParsedEpub> {
  const zip = await JSZip.loadAsync(arrayBuffer);
  
  // 1. Read container.xml to locate content.opf
  const containerFile = zip.file("META-INF/container.xml");
  if (!containerFile) {
    throw new Error("Invalid EPUB: Missing META-INF/container.xml");
  }
  const containerXmlStr = await containerFile.async("string");
  const parser = new DOMParser();
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
  
  // Extract Title and Author metadata
  // dc:title and dc:creator might be styled as dc\:title / dc\:creator or simply title / creator
  const titleEl = opfXml.querySelector("title, dc\\:title");
  const creatorEl = opfXml.querySelector("creator, dc\\:creator");
  const title = titleEl?.textContent?.trim() || "Unknown Title";
  const author = creatorEl?.textContent?.trim() || "Unknown Author";
  
  // Parse Manifest (id -> href)
  const manifestItems = new Map<string, string>();
  const items = opfXml.querySelectorAll("manifest > item");
  items.forEach((item) => {
    const id = item.getAttribute("id");
    const href = item.getAttribute("href");
    if (id && href) {
      manifestItems.set(id, href);
    }
  });
  
  // Parse Spine (defines reading order)
  const spineItems = opfXml.querySelectorAll("spine > itemref");
  const chapters: BookChapter[] = [];
  
  for (let i = 0; i < spineItems.length; i++) {
    const idref = spineItems[i].getAttribute("idref");
    if (!idref) continue;
    
    const relativeHref = manifestItems.get(idref);
    if (!relativeHref) continue;
    
    // Resolve absolute path in ZIP
    const fullHref = opfDir + relativeHref;
    // Strip hash anchor if present
    const cleanHref = decodeURIComponent(fullHref.split("#")[0]);
    
    const file = zip.file(cleanHref);
    if (!file) {
      // Try case-insensitive or partial matching as a backup
      const matchedFile = Object.keys(zip.files).find(k => k.toLowerCase() === cleanHref.toLowerCase());
      if (!matchedFile) continue;
      const f = zip.file(matchedFile);
      if (!f) continue;
      
      const htmlStr = await f.async("string");
      await parseHtmlFile(htmlStr, chapters);
    } else {
      const htmlStr = await file.async("string");
      await parseHtmlFile(htmlStr, chapters);
    }
  }
  
  return {
    title,
    author,
    chapters
  };
}

async function parseHtmlFile(htmlStr: string, chapters: BookChapter[]) {
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(htmlStr, "text/html");
  
  // Extract chapter title
  let chapterTitle = "";
  const hEl = htmlDoc.querySelector("h1, h2, h3, h4");
  if (hEl && hEl.textContent) {
    chapterTitle = hEl.textContent.trim();
  }
  if (!chapterTitle) {
    chapterTitle = `Chapter ${chapters.length + 1}`;
  }
  
  // Extract paragraph texts
  const paragraphs = htmlDoc.querySelectorAll("p, div, li");
  const pTexts: string[] = [];
  paragraphs.forEach((p) => {
    const text = p.textContent?.trim();
    if (!text) return;
    
    const tagName = p.tagName.toLowerCase();
    if (tagName === "p") {
      pTexts.push(text);
    } else if (tagName === "div" && !p.querySelector("p") && !p.querySelector("div")) {
      // Only include divs that are raw leaf containers
      pTexts.push(text);
    } else if (tagName === "li") {
      pTexts.push(`• ${text}`);
    }
  });
  
  let content = pTexts.join("\n\n");
  if (!content.trim()) {
    // Fallback: extract raw body text
    content = htmlDoc.body.textContent?.trim() || "";
    // Clean up excessive empty newlines
    content = content.replace(/\n\s*\n+/g, "\n\n");
  }
  
  if (content.trim()) {
    chapters.push({
      title: chapterTitle,
      content: content
    });
  }
}
