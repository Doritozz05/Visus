import { useState, useCallback } from "react";
import { Book, BookBinary } from "@/core/entities/book";
import { remoteStorageService, authService } from "@/core/config/services";
import { dbService } from "@/core/services/db-service";

export const MAX_CLOUD_SLOTS = 3;

export function useCloudSync(books: Book[], updateBook: (id: string, updates: Partial<Book>) => void) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncToCloud = useCallback(async (bookId: string) => {
    setIsSyncing(true);
    setError(null);

    try {
      const user = await authService.getUser();
      if (!user) throw new Error("User must be logged in to sync to cloud.");

      const cloudBooks = books.filter(b => b.isInCloud);
      if (cloudBooks.length >= MAX_CLOUD_SLOTS) {
        throw new Error(`Cloud storage limit reached. You can only sync up to ${MAX_CLOUD_SLOTS} books.`);
      }

      // 1. Get binary from local DB
      const binary = await dbService.getBookBinary(bookId);
      if (!binary) {
        throw new Error("Local book data not found. Please try re-importing the book.");
      }
      
      if (!binary.fileBlob) {
        console.warn("Book binary found but fileBlob is missing:", binary);
        throw new Error("The original file was not saved locally. Please delete this book and re-import it to enable cloud sync.");
      }

      // 2. Upload to Supabase Storage
      await remoteStorageService.uploadBookFile(user.id, bookId, binary.fileBlob);

      // 3. Update book metadata
      updateBook(bookId, { isInCloud: true });

    } catch (err: any) {
      setError(err.message);
      console.error("Sync to cloud failed:", err);
    } finally {
      setIsSyncing(false);
    }
  }, [books, updateBook]);

  const removeFromCloud = useCallback(async (bookId: string) => {
    setIsSyncing(true);
    setError(null);

    try {
      const user = await authService.getUser();
      if (!user) throw new Error("User must be logged in.");

      // 1. Delete from Supabase Storage
      await remoteStorageService.deleteBookFile(user.id, bookId);

      // 2. Remove metadata from Supabase
      import("@/core/config/services").then(({ remoteSyncService }) => {
        remoteSyncService.pushChanges(user.id, {
          books: [],
          stats: [],
          deletedBookIds: [bookId]
        }).catch(console.warn);
      });

      // 3. Update book metadata locally
      updateBook(bookId, { isInCloud: false });

    } catch (err: any) {
      setError(err.message);
      console.error("Remove from cloud failed:", err);
    } finally {
      setIsSyncing(false);
    }
  }, [updateBook]);

  return {
    syncToCloud,
    removeFromCloud,
    isSyncing,
    error,
    cloudSlotsUsed: books.filter(b => b.isInCloud).length,
    maxSlots: MAX_CLOUD_SLOTS
  };
}
