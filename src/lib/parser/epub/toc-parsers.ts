import JSZip from "jszip";
import { TocEntry } from "./types";
import { cleanTitle, resolveRelativePath } from "./utils";

export async function parseNcx(zip: JSZip, ncxPath: string): Promise<TocEntry[]> {
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

export async function parseNav(zip: JSZip, navPath: string): Promise<TocEntry[]> {
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
