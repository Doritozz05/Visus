import JSZip from "jszip";
import { ParsedEpub, TocEntry } from "./epub/types";
import { 
  normalizeEpubSubject, 
  getGeneralEpubGenres, 
  resolveRelativePath 
} from "./epub/utils";
import { parseNcx, parseNav } from "./epub/toc-parsers";
import { postProcessChapters } from "./epub/post-processor";
import { extractEpubMetadata } from "./epub/metadata";
import { processSpineFiles } from "./epub/spine";

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
  
  // Extract Metadata and Manifest Maps using our helper
  const metadata = await extractEpubMetadata(zip, opfXml, opfDir);
  
  // Parse Spine (defines reading order)
  const spineItems = opfXml.querySelectorAll("spine > itemref");
  const spineFilePaths: string[] = [];
  const spineTocId = opfXml.querySelector("spine")?.getAttribute("toc") || undefined;
  
  spineItems.forEach((itemref) => {
    const idref = itemref.getAttribute("idref");
    if (!idref) return;
    const relativeHref = metadata.manifestItems.get(idref);
    if (!relativeHref) return;
    const cleanHref = resolveRelativePath(opfDir, relativeHref.split("#")[0]);
    spineFilePaths.push(cleanHref);
  });
  
  // Locate TOC file path
  let tocPath: string | undefined = undefined;
  
  // EPUB 3 NAV Toc detection (Manifest item with properties="nav")
  const items = opfXml.querySelectorAll("manifest > item");
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
    const relativeNcx = metadata.manifestItems.get(spineTocId);
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
  
  // Group TOC entries by file path to split files cleanly
  const fileToTocEntriesMap = new Map<string, TocEntry[]>();
  tocEntries.forEach((entry) => {
    const entries = fileToTocEntriesMap.get(entry.filePath) || [];
    entries.push(entry);
    fileToTocEntriesMap.set(entry.filePath, entries);
  });
  
  // Process Spine files to compile chapters
  const chapters = await processSpineFiles(
    zip,
    parser,
    opfDir,
    spineFilePaths,
    fileToTocEntriesMap
  );
  
  return {
    title: metadata.title,
    author: metadata.author,
    chapters: postProcessChapters(chapters), // Apply intelligent globally robust chapter post-processing!
    coverUrl: metadata.coverUrl,
    description: metadata.description,
    genres: metadata.genres,
    publisher: metadata.publisher,
    publishDate: metadata.publishDate,
    language: metadata.language
  };
}
