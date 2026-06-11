import * as React from "react";
import { parseUploadedFile } from "@/lib/services/book-ingestion-service";
import { Book } from "@/core/entities/book";
import { calculateFileHash } from "@/lib/utils";
import { toast } from "sonner";

export function useBookIngestion(
  addBook: (
    title: string,
    author: string,
    format: "PDF" | "EPUB" | "TXT" | "PHYSICAL",
    content?: string,
    chapters?: { title: string; content: string }[],
    metadata?: any,
    fileBlob?: Blob,
    fileHash?: string
  ) => string | null
) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [isIngesting, setIsIngesting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const processAndAddFile = async (file: File) => {
    const parsed = await parseUploadedFile(file);
    let fileHash: string | undefined = undefined;
    if (parsed.fileBlob) {
      try {
        fileHash = await calculateFileHash(parsed.fileBlob);
      } catch (err) {
        console.warn("Could not calculate file hash:", err);
      }
    }
    
    const resultId = addBook(
      parsed.title,
      parsed.author,
      parsed.format,
      parsed.content,
      parsed.chapters,
      parsed.metadata,
      parsed.fileBlob,
      fileHash
    );

    if (!resultId) {
      throw new Error(`The file "${parsed.title}" is already in your library.`);
    }
  };

  const processFilesBatch = async (fileList: FileList) => {
    setIsIngesting(true);
    const files = Array.from(fileList);
    
    // Immutable tracking for accurate batch reporting
    const successes: string[] = [];
    const duplicates: string[] = [];
    const failures: { name: string; message: string }[] = [];
    
    // Track intra-batch duplicates explicitly before heavy parsing
    const intraBatchSignatures = new Set<string>();
    
    try {
      for (const file of files) {
        // Basic intra-batch file deduplication
        const fileSignature = `${file.name}-${file.size}`;
        if (intraBatchSignatures.has(fileSignature)) {
          duplicates.push(file.name);
          continue; // Skip entirely, it's a duplicate in this exact batch
        }
        intraBatchSignatures.add(fileSignature);

        try {
          await processAndAddFile(file);
          successes.push(file.name);
        } catch (err: any) {
          if (err?.message?.includes("already in your library")) {
            duplicates.push(file.name);
          } else {
            console.warn(`Failed to process file "${file.name}":`, err);
            failures.push({
              name: file.name,
              message: err?.message || "Unknown file read error"
            });
          }
        }
      }
      
      const successCount = successes.length;
      const duplicateCount = duplicates.length;

      // Notify failures if any
      if (failures.length > 0) {
        const errorMessages = failures.map(f => `${f.name}: ${f.message}`).join(", ");
        toast.error(failures.length === 1 ? "File could not be imported" : "Some files could not be imported", {
          description: errorMessages
        });
      }
      
      // Consolidated success & duplicate reporting
      if (successCount > 0) {
        let message = successCount === 1 ? "Book imported successfully" : `${successCount} books imported successfully`;
        if (duplicateCount > 0) {
          message += `. ${duplicateCount} ${duplicateCount === 1 ? "duplicate was" : "duplicates were"} skipped.`;
        }
        toast.success(message);
      } else if (duplicateCount > 0 && failures.length === 0) {
        toast.info(duplicateCount === 1 ? "This book is already in your library" : `${duplicateCount} books were already in your library`);
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
