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

      // 3. Push to books_metadata in Supabase
      const { remoteSyncService } = await import("@/core/config/services");
      const bookToPush = cloudBooks.find(b => b.id === bookId) || books.find(b => b.id === bookId);
      
      if (bookToPush) {
        try {
          await remoteSyncService.pushChanges(user.id, {
            books: [{ ...bookToPush, isInCloud: true }],
            stats: [],
            deletedBookIds: []
          });
        } catch (pushErr) {
          // If the trigger rejected it, we must delete the file from storage to keep it clean
          await remoteStorageService.deleteBookFile(user.id, bookId);
          throw pushErr;
        }
      }

      // 4. Update book metadata locally
      updateBook(bookId, { isInCloud: true });

    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
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

      // 2. Remove metadata from Supabase WITHOUT logging in deleted_records
      // This allows other devices to keep the book locally but un-synced.
      const { supabase } = await import("@/lib/supabase");
      const { error: metaErr } = await supabase
        .from("books_metadata")
        .delete()
        .eq("id", bookId)
        .eq("user_id", user.id);
      
      if (metaErr) throw metaErr;

      // 3. Update book metadata locally
      updateBook(bookId, { isInCloud: false });

    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
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
