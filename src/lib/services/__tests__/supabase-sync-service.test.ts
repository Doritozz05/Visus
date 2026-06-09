import { describe, it, expect, vi, beforeEach } from "vitest";
import { SupabaseSyncService } from "../supabase-sync-service";
import { supabase } from "@/lib/supabase";

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      gt: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      upsert: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
    })),
  },
}));

describe("SupabaseSyncService", () => {
  let service: SupabaseSyncService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new SupabaseSyncService();
  });

  describe("pullChanges", () => {
    it("should pull books, stats and deleted records", async () => {
      const mockBooks = [{ id: "book-1", title: "Test Book", user_id: "user-1", is_in_cloud: true }];
      const mockStats = [{ id: "stat-1", book_id: "book-1" }];
      const mockDeleted = [{ record_id: "book-old" }];

      const fromSpy = vi.spyOn(supabase, "from");
      
      // Mock successive calls to from().select()...
      // This is a bit complex due to the chained API, but we can mock the results
      (supabase.from as any).mockImplementation((table: string) => {
        let result: any = { data: [], error: null };
        if (table === "books_metadata") result = { data: mockBooks, error: null };
        if (table === "stats_logs") result = { data: mockStats, error: null };
        if (table === "deleted_records") result = { data: mockDeleted, error: null };

        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          gt: vi.fn().mockReturnThis(),
          then: (cb: any) => Promise.resolve(cb(result)),
        };
      });

      const payload = await service.pullChanges("user-1", "2026-01-01T00:00:00Z");

      expect(payload.books).toHaveLength(1);
      expect(payload.books[0].id).toBe("book-1");
      expect(payload.stats).toHaveLength(1);
      expect(payload.deletedBookIds).toEqual(["book-old"]);
    });

    it("should throw error if any request fails", async () => {
      (supabase.from as any).mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        gt: vi.fn().mockReturnThis(),
        then: (cb: any) => Promise.resolve(cb({ data: null, error: { message: "Error" } })),
      }));

      await expect(service.pullChanges("user-1", "now")).rejects.toThrow("Error pulling changes");
    });
  });

  describe("pushChanges", () => {
    it("should push books and stats using upsert", async () => {
      const payload = {
        books: [{ id: "book-1", title: "Book", isInCloud: true } as any],
        stats: [{ id: "stat-1", bookId: "book-1" } as any],
        deletedBookIds: ["book-deleted"]
      };

      const upsertSpy = vi.fn().mockResolvedValue({ error: null });
      const deleteSpy = vi.fn().mockResolvedValue({ error: null });

      (supabase.from as any).mockImplementation(() => ({
        upsert: upsertSpy,
        delete: vi.fn().mockReturnThis(),
        in: deleteSpy,
      }));

      await service.pushChanges("user-1", payload);

      expect(upsertSpy).toHaveBeenCalledTimes(2); // One for books, one for stats
      expect(deleteSpy).toHaveBeenCalledWith("id", ["book-deleted"]);
    });
  });
});
