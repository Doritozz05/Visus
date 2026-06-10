import * as React from "react";
import { useLibrary } from "@/features/library/context/library-context";
import { parseUploadedFile } from "@/lib/services/book-ingestion-service";
import { toast } from "sonner";

export function useBookIngestion() {
  const { addBook } = useLibrary();
  const localFileInputRef = React.useRef<HTMLInputElement>(null);

  // Direct ingestion upload from within the Reading Room
  const handleLocalFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    
    try {
      const parsed = await parseUploadedFile(file);
      addBook(
        parsed.title,
        parsed.author,
        parsed.format,
        parsed.content,
        parsed.chapters,
        parsed.metadata
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to import file";
      toast.error(message);
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
