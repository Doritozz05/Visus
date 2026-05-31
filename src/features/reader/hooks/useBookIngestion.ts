import * as React from "react";
import { useLibrary } from "@/context/library-context";
import { parseEpub } from "@/lib/parser/epub";
import { parsePdf } from "@/lib/parser/pdf";
import { parseTxt } from "@/lib/parser/txt";

export function useBookIngestion() {
  const { addBook, setActiveBookId } = useLibrary();
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
    const { title, author, format } = parseFileName(file.name);
    
    if (format === "TXT") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const textContent = event.target?.result as string;
        const parsedChapters = parseTxt(textContent);
        const newId = addBook(title, author, format, textContent, parsedChapters);
        setActiveBookId(newId);
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
          const newId = addBook(finalTitle, finalAuthor, format, fullContent, parsed.chapters);
          setActiveBookId(newId);
        } catch (pdfErr) {
          console.error("Local PDF Parsing failed:", pdfErr);
          const newId = addBook(title, author, format);
          setActiveBookId(newId);
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
          const newId = addBook(finalTitle, finalAuthor, format, fullContent, parsed.chapters, {
            coverUrl: parsed.coverUrl,
            description: parsed.description,
            genres: parsed.genres,
            publisher: parsed.publisher,
            publishDate: parsed.publishDate,
            language: parsed.language
          });
          setActiveBookId(newId);
        } catch (epubErr) {
          console.error("Local EPUB Parsing failed:", epubErr);
          const newId = addBook(title, author, format);
          setActiveBookId(newId);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      const newId = addBook(title, author, format);
      setActiveBookId(newId);
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
