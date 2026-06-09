import * as React from "react";
import { parseUploadedFile } from "@/lib/services/book-ingestion-service";
import { Book } from "@/core/entities/book";

export function useBookIngestion(
  addBook: (
    title: string,
    author: string,
    format: "PDF" | "EPUB" | "TXT" | "PHYSICAL",
    content?: string,
    chapters?: { title: string; content: string }[],
    metadata?: any,
    fileBlob?: Blob
  ) => void
) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [isIngesting, setIsIngesting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const processAndAddFile = async (file: File) => {
    const parsed = await parseUploadedFile(file);
    addBook(
      parsed.title,
      parsed.author,
      parsed.format,
      parsed.content,
      parsed.chapters,
      parsed.metadata,
      parsed.fileBlob
    );
  };

  const processFilesBatch = async (fileList: FileList) => {
    setIsIngesting(true);
    const files = Array.from(fileList);
    
    try {
      const results = await Promise.allSettled(
        files.map(file => processAndAddFile(file))
      );
      
      const failures = results.filter(
        (r): r is PromiseRejectedResult => r.status === "rejected"
      );
      
      if (failures.length > 0) {
        const errorMessages = failures.map(f => f.reason?.message || "Unknown file read error").join("\n");
        alert(`Some files could not be imported:\n${errorMessages}`);
      }
    } catch (err) {
      console.error("Batch file ingestion failed:", err);
    } finally {
      setIsIngesting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await processFilesBatch(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    await processFilesBatch(files);
  };

  const triggerFileBrowser = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return {
    isDragOver,
    isIngesting,
    fileInputRef,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    triggerFileBrowser
  };
}
