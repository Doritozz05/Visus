import { BookChapter } from "@/core/entities/book";

export async function parsePdf(arrayBuffer: ArrayBuffer): Promise<{ title: string; author: string; chapters: BookChapter[] }> {
  // Dynamic Next.js SSR-safe import of pdfjs-dist
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;
  const chapters: BookChapter[] = [];
  
  // Extract document outline/title if available, or fall back
  let docTitle = "Unknown PDF";
  let docAuthor = "Unknown Author";
  
  try {
    const metadata = await pdf.getMetadata();
    if (metadata && metadata.info) {
      const info = metadata.info as any;
      if (info.Title) docTitle = info.Title;
      if (info.Author) docAuthor = info.Author;
    }
  } catch (err) {
    console.warn("Failed to extract PDF metadata:", err);
  }
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const items = textContent.items as any[];
    
    if (items.length === 0) {
      chapters.push({
        title: `Page ${pageNum}`,
        content: ""
      });
      continue;
    }
    
    // Group text items by vertical height (Y coordinate)
    // transform matrix: [scaleX, skewX, skewY, scaleY, x, y] -> y is transform[5]
    const yThreshold = 3.5; // pixels threshold to match lines
    const linesMap: { y: number; items: any[] }[] = [];
    
    items.forEach((item) => {
      if (!item.str || item.str.trim() === "") return;
      
      const x = item.transform[4];
      const y = item.transform[5];
      
      const existingLine = linesMap.find(line => Math.abs(line.y - y) <= yThreshold);
      if (existingLine) {
        existingLine.items.push({ ...item, x });
      } else {
        linesMap.push({ y, items: [{ ...item, x }] });
      }
    });
    
    // Sort lines vertically descending (top of the page is higher Y value)
    linesMap.sort((a, b) => b.y - a.y);
    
    const reconstructedLines: string[] = [];
    
    linesMap.forEach((line) => {
      // Sort items horizontally left-to-right (by X coordinate)
      line.items.sort((a, b) => a.x - b.x);
      
      // Join words in this line, checking for spaces
      let lineText = "";
      for (let i = 0; i < line.items.length; i++) {
        const item = line.items[i];
        if (i === 0) {
          lineText += item.str;
        } else {
          const prevItem = line.items[i - 1];
          const expectedNextX = prevItem.x + (prevItem.width || 0);
          const gap = item.x - expectedNextX;
          
          // Add a single space if there's a distinct word gap and no existing space
          if (gap > 4 && !lineText.endsWith(" ") && !item.str.startsWith(" ")) {
            lineText += " " + item.str;
          } else {
            lineText += item.str;
          }
        }
      }
      reconstructedLines.push(lineText);
    });
    
    // Combine lines into a single page content, detecting paragraph boundaries
    let pageContent = "";
    for (let i = 0; i < reconstructedLines.length; i++) {
      const line = reconstructedLines[i].trim();
      if (!line) continue;
      
      if (pageContent === "") {
        pageContent = line;
      } else {
        const prevLine = reconstructedLines[i - 1]?.trim() || "";
        const isPrevLineShort = prevLine.length < 55; // heuristic for end of paragraph
        const endsWithSentencePunctuation = /[.!?:]$/.test(prevLine);
        
        if (isPrevLineShort || endsWithSentencePunctuation) {
          pageContent += "\n\n" + line;
        } else if (prevLine.endsWith("-")) {
          // Join hyphenated word directly
          pageContent = pageContent.slice(0, -1) + line;
        } else {
          // Join with single space
          pageContent += " " + line;
        }
      }
    }
    
    chapters.push({
      title: `Page ${pageNum}`,
      content: pageContent
    });
  }
  
  return {
    title: docTitle,
    author: docAuthor,
    chapters
  };
}
