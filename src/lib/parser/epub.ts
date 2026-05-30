import JSZip from "jszip";
import { BookChapter } from "@/core/entities/book";

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
  const titleEl = opfXml.querySelector("title, dc\\:title");
  const creatorEl = opfXml.querySelector("creator, dc\\:creator");
  const title = titleEl?.textContent?.trim() || "Unknown Title";
  const author = creatorEl?.textContent?.trim() || "Unknown Author";
  
  // Extract advanced metadata
  const descriptionEl = opfXml.querySelector("description, dc\\:description");
  const description = descriptionEl?.textContent?.trim() || undefined;
  
  const publisherEl = opfXml.querySelector("publisher, dc\\:publisher");
  const publisher = publisherEl?.textContent?.trim() || undefined;
  
  const dateEl = opfXml.querySelector("date, dc\\:date");
  const publishDate = dateEl?.textContent?.trim() || undefined;
  
  const languageEl = opfXml.querySelector("language, dc\\:language");
  const language = languageEl?.textContent?.trim() || undefined;
  
  // Extract subjects/genres
  const subjectEls = opfXml.querySelectorAll("subject, dc\\:subject");
  const genres: string[] = [];
  subjectEls.forEach(el => {
    const text = el.textContent?.trim();
    if (text) genres.push(text);
  });
  
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
  
  // Extract cover image
  let coverUrl: string | undefined = undefined;
  let coverHref: string | null = null;
  
  // 1. Look for manifest item with cover-image property or generic cover ID
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
  
  // 2. Look for <meta name="cover" content="item-id" />
  if (!coverHref) {
    const coverMeta = opfXml.querySelector("meta[name='cover']");
    const coverId = coverMeta?.getAttribute("content");
    if (coverId) {
      const href = manifestItems.get(coverId);
      if (href) coverHref = href;
    }
  }
  
  // Read cover image from ZIP and convert to base64 Data URL
  if (coverHref) {
    try {
      const fullCoverPath = opfDir + coverHref;
      const cleanCoverPath = decodeURIComponent(fullCoverPath.split("#")[0]);
      
      let coverFile = zip.file(cleanCoverPath);
      if (!coverFile) {
        // Fallback case-insensitive search
        const matchedKey = Object.keys(zip.files).find(k => k.toLowerCase() === cleanCoverPath.toLowerCase());
        if (matchedKey) {
          coverFile = zip.file(matchedKey);
        }
      }
      
      if (coverFile) {
        const coverBase64 = await coverFile.async("base64");
        const ext = cleanCoverPath.split(".").pop()?.toLowerCase();
        const mimeType = ext === "png" ? "image/png" : ext === "gif" ? "image/gif" : "image/jpeg";
        coverUrl = `data:${mimeType};base64,${coverBase64}`;
      }
    } catch (coverErr) {
      console.warn("Could not extract cover image:", coverErr);
    }
  }
  
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
    chapters,
    coverUrl,
    description,
    genres: genres.length > 0 ? genres : undefined,
    publisher,
    publishDate,
    language
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
  
  // Extract plain text for RSVP
  const paragraphs = htmlDoc.querySelectorAll("p, div, li");
  const pTexts: string[] = [];
  paragraphs.forEach((p) => {
    const text = p.textContent?.trim();
    if (!text) return;
    
    const tagName = p.tagName.toLowerCase();
    if (tagName === "p") {
      pTexts.push(text);
    } else if (tagName === "div" && !p.querySelector("p") && !p.querySelector("div")) {
      pTexts.push(text);
    } else if (tagName === "li") {
      pTexts.push(`• ${text}`);
    }
  });
  
  let content = pTexts.join("\n\n");
  if (!content.trim()) {
    content = htmlDoc.body?.textContent?.trim() || "";
    content = content.replace(/\n\s*\n+/g, "\n\n");
  }
  
  // Extract clean HTML structure for premium rendering
  let htmlContent = "";
  if (htmlDoc.body) {
    const cleanBody = htmlDoc.body.cloneNode(true) as HTMLElement;
    
    // Remove scripts and style tags if any exist in the chapter body
    cleanBody.querySelectorAll("script, style").forEach(el => el.remove());
    
    // Remove styling/attributes to prevent dark mode/theme clashes, keeping semantic markup
    cleanBody.querySelectorAll("[style]").forEach(el => el.removeAttribute("style"));
    cleanBody.querySelectorAll("[class]").forEach(el => el.removeAttribute("class"));
    cleanBody.querySelectorAll("[id]").forEach(el => el.removeAttribute("id"));
    
    htmlContent = cleanBody.innerHTML.trim();
  }
  
  if (content.trim()) {
    chapters.push({
      title: chapterTitle,
      content: content,
      htmlContent: htmlContent || undefined
    });
  }
}
