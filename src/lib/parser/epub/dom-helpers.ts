import JSZip from "jszip";
import { resolveRelativePath, loadImageAsBase64 } from "./utils";

export function checkIfContentExistsBefore(body: HTMLElement, markerElement: HTMLElement): boolean {
  try {
    const range = body.ownerDocument.createRange();
    range.setStart(body, 0);
    range.setEndBefore(markerElement);
    return range.toString().trim().length > 0;
  } catch (_) {
    return false;
  }
}

export function extractHtmlBetweenRange(
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

export function cleanDocumentBody(container: HTMLElement): string {
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

export function extractCleanText(htmlContent: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");
  
  if (doc.body) {
    normalizeMixedContent(doc.body);
  }
  
  const paragraphs = doc.querySelectorAll("p, div, li, h1, h2, h3, h4, h5, h6, blockquote, pre, td");
  const pTexts: string[] = [];
  
  paragraphs.forEach((p) => {
    const text = p.textContent?.trim();
    if (!text) return;
    
    const tagName = p.tagName.toLowerCase();
    if (
      tagName === "p" || 
      tagName.startsWith("h") || 
      tagName === "li" || 
      tagName === "blockquote" || 
      tagName === "pre" || 
      tagName === "td"
    ) {
      pTexts.push(text);
    } else if (
      tagName === "div" && 
      !p.querySelector("p") && 
      !p.querySelector("div") && 
      !p.querySelector("blockquote") && 
      !p.querySelector("pre") && 
      !p.querySelector("td") &&
      !p.querySelector("li")
    ) {
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

export async function processImages(zip: JSZip, doc: Document, currentFilePath: string) {
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
