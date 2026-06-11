import * as React from "react";
import { useLibrary } from "@/features/library/context/library-context";
import { parseUploadedFile } from "@/lib/services/book-ingestion-service";
import { calculateFileHash } from "@/lib/utils";
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
        toast.info(`The file "${parsed.title}" is already in your library.`);
      } else {
        toast.success("Book imported successfully");
      }
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
