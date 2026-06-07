import { parseEpub } from "@/lib/parser/epub";
import { parsePdf } from "@/lib/parser/pdf";
import { parseTxt } from "@/lib/parser/txt";
import { BookChapter } from "@/core/entities/book";

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface ParsedBookData {
  title: string;
  author: string;
  format: "PDF" | "EPUB" | "TXT";
  content?: string;
  chapters?: BookChapter[];
  metadata?: {
    coverUrl?: string;
    description?: string;
    genres?: string[];
    publisher?: string;
    publishDate?: string;
    language?: string;
  };
}

/**
 * Parses a file name to extract the guessed title, author, and format format.
 */
export function parseFileName(fileName: string): { title: string; author: string; format: "PDF" | "EPUB" | "TXT" } {
  const lastDotIndex = fileName.lastIndexOf(".");
  const cleanName = lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;
  const extension = lastDotIndex !== -1 ? fileName.substring(lastDotIndex + 1).toUpperCase() : "TXT";
  
  const validFormat = (extension === "PDF" || extension === "EPUB" || extension === "TXT") 
    ? (extension as "PDF" | "EPUB" | "TXT") 
    : "TXT";

  let title = cleanName;
  let author = "Unknown Author";

  if (cleanName.includes(" - ")) {
    const parts = cleanName.split(" - ");
    title = parts[0].trim();
    author = parts[1].trim();
  } else if (cleanName.includes("_")) {
    const parts = cleanName.split("_");
    title = parts.join(" ").trim();
  }

  return { title, author, format: validFormat };
}

/**
 * Validates and parses an uploaded file (PDF, EPUB, TXT) to produce readable book content.
 */
export async function parseUploadedFile(file: File): Promise<ParsedBookData> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`The file "${file.name}" is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). The maximum allowed size is 5.0MB to prevent browser crashes.`);
  }

  const { title, author, format } = parseFileName(file.name);

  if (format === "TXT") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const textContent = event.target?.result as string;
          const parsedChapters = parseTxt(textContent);
          resolve({
            title,
            author,
            format,
            content: textContent,
            chapters: parsedChapters,
          });
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error(`Failed to read "${file.name}"`));
      reader.readAsText(file);
    });
  }

  if (format === "PDF") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const parsed = await parsePdf(arrayBuffer);
          const finalTitle = parsed.title && parsed.title !== "Unknown PDF" ? parsed.title : title;
          const finalAuthor = parsed.author && parsed.author !== "Unknown Author" ? parsed.author : author;
          const fullContent = parsed.chapters.map(c => c.content).join("\n\n");
          resolve({
            title: finalTitle,
            author: finalAuthor,
            format,
            content: fullContent,
            chapters: parsed.chapters,
          });
        } catch (pdfErr) {
          console.error("PDF Parsing failed:", pdfErr);
          // Fallback to shell book to allow ingestion even if deep parsing fails
          resolve({ title, author, format });
        }
      };
      reader.onerror = () => reject(new Error(`Failed to read "${file.name}"`));
      reader.readAsArrayBuffer(file);
    });
  }

  if (format === "EPUB") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const parsed = await parseEpub(arrayBuffer);
          const finalTitle = parsed.title && parsed.title !== "Unknown Title" ? parsed.title : title;
          const finalAuthor = parsed.author && parsed.author !== "Unknown Author" ? parsed.author : author;
          const fullContent = parsed.chapters.map(c => c.content).join("\n\n");
          resolve({
            title: finalTitle,
            author: finalAuthor,
            format,
            content: fullContent,
            chapters: parsed.chapters,
            metadata: {
              coverUrl: parsed.coverUrl,
              description: parsed.description,
              genres: parsed.genres,
              publisher: parsed.publisher,
              publishDate: parsed.publishDate,
              language: parsed.language
            }
          });
        } catch (epubErr) {
          console.error("EPUB Parsing failed:", epubErr);
          // Fallback to shell book to allow ingestion even if deep parsing fails
          resolve({ title, author, format });
        }
      };
      reader.onerror = () => reject(new Error(`Failed to read "${file.name}"`));
      reader.readAsArrayBuffer(file);
    });
  }

  // Fallback for unexpected formats
  return { title, author, format };
}
