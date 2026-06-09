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
      books: (books || []).map(b => ({
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
        bookmarkChapterIndex: b.bookmark_chapter_index,
        bookmarkWordIndex: b.bookmark_word_index,
        bookmarks: b.bookmarks || [],
        coverUrl: b.cover_url,
        description: b.description,
        genres: b.genres,
        publisher: b.publisher,
        publishDate: b.publish_date,
        language: b.language,
        currentPage: b.current_page,
        totalPages: b.total_pages,
        isInCloud: b.is_in_cloud
      })),
      stats: (stats || []).map(s => ({
        id: s.id,
        bookId: s.book_id,
        bookTitle: s.book_title,
        mode: s.mode,
        speedWpm: s.speed_wpm,
        durationSeconds: s.duration_seconds,
        accuracy: s.accuracy,
        completedAt: s.completed_at
      })),
      deletedBookIds: deleted?.map((d) => d.record_id) || [],
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
          bookmark_chapter_index: b.bookmarkChapterIndex,
          bookmark_word_index: b.bookmarkWordIndex,
          bookmarks: b.bookmarks || [],
          cover_url: b.coverUrl,
          description: b.description,
          genres: b.genres,
          publisher: b.publisher,
          publish_date: b.publishDate,
          language: b.language,
          current_page: b.currentPage,
          total_pages: b.totalPages,
          is_in_cloud: true // By definition, since we filtered them
        })));
      if (error) throw new Error(`Push books failed: ${error.message}`);
    }

    if (changes.stats.length > 0) {
      const { error } = await supabase
        .from("stats_logs")
        .upsert(changes.stats.map(s => ({
          id: s.id,
          user_id: userId,
          book_id: s.bookId,
          book_title: s.bookTitle,
          mode: s.mode,
          speed_wpm: s.speedWpm,
          duration_seconds: s.durationSeconds,
          accuracy: s.accuracy,
          completed_at: s.completedAt
        })));
      if (error) throw new Error(`Push stats failed: ${error.message}`);
    }

    if (changes.deletedBookIds.length > 0) {
      // Handle soft/hard deletes remotely
      const { error } = await supabase
        .from("books_metadata")
        .delete()
        .in("id", changes.deletedBookIds);
      if (error) throw new Error(`Delete books failed: ${error.message}`);
    }
  }
}
