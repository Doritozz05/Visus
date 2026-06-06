import * as React from "react";
import { useLibrary } from "@/context/library-context";
import { parseEpub } from "@/lib/parser/epub";
import { parsePdf } from "@/lib/parser/pdf";
import { parseTxt } from "@/lib/parser/txt";

export function useBookIngestion() {
  const { addBook } = useLibrary();
  const localFileInputRef = React.useRef<HTMLInputElement>(null);

  // Parse a file name helper
  const parseFileName = (fileName: string) => {
    const lastDotIndex = fileName.lastIndexOf(".");
    const cleanName = lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;
    const extension = lastDotIndex !== -1 ? fileName.substring(lastDotIndex + 1).toUpperCase() : "TXT";
    const validFormat = (extension === "PDF" || extension === "EPUB" || extension === "TXT") ? (extension as "PDF" | "EPUB" | "TXT") : "TXT";
    let title = cleanName;
    let author = "Unknown Author";
    if (cleanName.includes(" - ")) {
      const parts = cleanName.split(" - ");
      title = parts[0].trim();
      author = parts[1].trim();
    }
    return { title, author, format: validFormat };
  };

  // Direct ingestion upload from within the Reading Room
  const handleLocalFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      alert(`The file "${file.name}" is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). The maximum allowed size is 5.0MB to prevent browser crashes.`);
      return;
    }

    const { title, author, format } = parseFileName(file.name);
    
    if (format === "TXT") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const textContent = event.target?.result as string;
        const parsedChapters = parseTxt(textContent);
        addBook(title, author, format, textContent, parsedChapters);
      };
      reader.readAsText(file);
    } else if (format === "PDF") {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const parsed = await parsePdf(arrayBuffer);
          const finalTitle = parsed.title && parsed.title !== "Unknown PDF" ? parsed.title : title;
          const finalAuthor = parsed.author && parsed.author !== "Unknown Author" ? parsed.author : author;
          const fullContent = parsed.chapters.map(c => c.content).join("\n\n");
          addBook(finalTitle, finalAuthor, format, fullContent, parsed.chapters);
        } catch (pdfErr) {
          console.error("Local PDF Parsing failed:", pdfErr);
          addBook(title, author, format);
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (format === "EPUB") {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const parsed = await parseEpub(arrayBuffer);
          const finalTitle = parsed.title && parsed.title !== "Unknown Title" ? parsed.title : title;
          const finalAuthor = parsed.author && parsed.author !== "Unknown Author" ? parsed.author : author;
          const fullContent = parsed.chapters.map(c => c.content).join("\n\n");
          addBook(finalTitle, finalAuthor, format, fullContent, parsed.chapters, {
            coverUrl: parsed.coverUrl,
            description: parsed.description,
            genres: parsed.genres,
            publisher: parsed.publisher,
            publishDate: parsed.publishDate,
            language: parsed.language
          });
        } catch (epubErr) {
          console.error("Local EPUB Parsing failed:", epubErr);
          addBook(title, author, format);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      addBook(title, author, format);
    }
  };

  const triggerLocalFileBrowser = () => {
    if (localFileInputRef.current) localFileInputRef.current.value = "";
    localFileInputRef.current?.click();
  };

  return {
    localFileInputRef,
    handleLocalFileChange,
    triggerLocalFileBrowser
  };
}
