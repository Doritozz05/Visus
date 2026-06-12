import { IRemoteSyncService, SyncPayload } from "@/core/services/interfaces";
import { Book } from "@/core/entities/book";
import { supabase } from "@/lib/supabase";

export class SupabaseSyncService implements IRemoteSyncService {
  async pullChanges(userId: string, sinceTimestamp: string): Promise<SyncPayload> {
    // STRICT SYNC: Only pull books that are marked as being in the cloud
    const { data: books, error: booksErr } = await supabase
      .from("books_metadata")
      .select("*")
      .eq("user_id", userId)
      .eq("is_in_cloud", true)
      .gt("updated_at", sinceTimestamp);

    const { data: stats, error: statsErr } = await supabase
      .from("stats_logs")
      .select("*")
      .eq("user_id", userId)
      .gt("updated_at", sinceTimestamp);

    const { data: deleted, error: delErr } = await supabase
      .from("deleted_records")
      .select("record_id")
      .eq("user_id", userId)
      .gt("deleted_at", sinceTimestamp);

    if (booksErr || statsErr || delErr) {
      throw new Error("Error pulling changes from Supabase");
    }

    return {
      books: (books || []).map(b => SupabaseSyncService.mapRowToBook(b)),
      stats: (stats || []).map(s => ({
        id: s.id,
        bookId: s.book_id,
        bookTitle: s.book_title,
        mode: s.mode,
        speedWpm: s.speed_wpm,
        durationSeconds: s.duration_seconds,
        accuracy: s.accuracy,
        completedAt: s.completed_at,
        telemetryData: s.telemetry_data
      })),
      deletedBookIds: deleted?.map((d) => d.record_id) || [],
    };
  }

  static mapRowToBook(b: any): Book {
    return {
      id: b.id,
      title: b.title,
      author: b.author,
      format: b.format,
      progress: b.progress,
      estimatedReadingTime: b.estimated_reading_time,
      status: b.status,
      createdAt: b.created_at,
      updatedAt: b.updated_at,
      lastChapterIndex: b.last_chapter_index,
      lastWordIndex: b.last_word_index,
      lastLocalPageIndex: b.last_local_page_index,
      bookmarks: b.bookmarks || [],
      coverUrl: b.cover_url,
      description: b.description,
      genres: b.genres,
      publisher: b.publisher,
      publishDate: b.publish_date,
      language: b.language,
      currentPage: b.current_page,
      totalPages: b.total_pages,
      isInCloud: b.is_in_cloud,
      fileHash: b.file_hash,
      ownerId: b.user_id
    };
  }

  async pushChanges(userId: string, changes: SyncPayload): Promise<void> {
    // Implement push logic using Supabase upsert
    // STRICT SYNC: Only push books that are explicitly marked to be in the cloud.
    const booksToSync = changes.books.filter(b => b.isInCloud);
    
    if (booksToSync.length > 0) {
      const { error } = await supabase
        .from("books_metadata")
        .upsert(booksToSync.map(b => ({
          id: b.id,
          user_id: userId,
          title: b.title,
          author: b.author,
          format: b.format,
          progress: b.progress,
          estimated_reading_time: b.estimatedReadingTime,
          status: b.status,
          created_at: b.createdAt,
          updated_at: b.updatedAt || new Date().toISOString(),
          last_chapter_index: b.lastChapterIndex,
          last_word_index: b.lastWordIndex,
          last_local_page_index: b.lastLocalPageIndex,
          bookmarks: b.bookmarks || [],
          cover_url: b.coverUrl,
          description: b.description,
          genres: b.genres,
          publisher: b.publisher,
          publish_date: b.publishDate,
          language: b.language,
          current_page: b.currentPage,
          total_pages: b.totalPages,
          is_in_cloud: true, // By definition, since we filtered them
          file_hash: b.fileHash
        })));
      if (error) throw new Error(`Push books failed: ${error.message}`);
    }

    if (changes.stats.length > 0) {
      const storedSettings = typeof window !== "undefined" ? localStorage.getItem("visus_settings") : null;
      let preference = "cloud";
      if (storedSettings) {
        try {
          const parsed = JSON.parse(storedSettings);
          preference = parsed?.general?.telemetryPreference || "cloud";
        } catch (_) {}
      }

      if (preference === "disabled") {
        console.log("[SupabaseSyncService] Telemetry is disabled. Skipping upload of stats.");
      } else {
        const { hashString } = await import("@/lib/utils");
        const statsToUpload = await Promise.all(changes.stats.map(async s => {
          let bookTitle = s.bookTitle;
          let bookId = s.bookId;
          
          if (preference === "anonymous") {
            bookTitle = await hashString(s.bookTitle);
            bookId = "anonymous-book";
          }
          
          return {
            id: s.id,
            user_id: userId,
            book_id: bookId,
            book_title: bookTitle,
            mode: s.mode,
            speed_wpm: s.speedWpm,
            duration_seconds: s.durationSeconds,
            accuracy: s.accuracy,
            completed_at: s.completedAt,
            telemetry_data: s.telemetryData || {}
          };
        }));

        if (statsToUpload.length > 0) {
          const { error } = await supabase
            .from("stats_logs")
            .upsert(statsToUpload);
          if (error) throw new Error(`Push stats failed: ${error.message}`);
        }
      }
    }

    if (changes.deletedBookIds.length > 0) {
      // Handle soft/hard deletes remotely
      // 1. Log the deletion for other devices to sync
      const { error: delError } = await supabase
        .from("deleted_records")
        .insert(changes.deletedBookIds.map(id => ({
          user_id: userId,
          record_id: id,
          table_name: "books_metadata"
        })));
      
      if (delError) {
        console.error("Error logging deletion to deleted_records:", delError);
        // We continue anyway to try and delete the metadata, but the sync might be incomplete
      }

      // 2. Remove from remote metadata
      const { error } = await supabase
        .from("books_metadata")
        .delete()
        .in("id", changes.deletedBookIds);
      if (error) throw new Error(`Delete books failed: ${error.message}`);
    }
  }
}
