import { describe, it, expect, vi, beforeEach } from "vitest";
import { StatsService } from "../stats-service";
import { ReadingSessionLog, ReadingMode } from "../../entities/stats";
import { dbService } from "../db-service";

vi.mock("../db-service", () => ({
  dbService: {
    getAllLogs: vi.fn(),
    saveLog: vi.fn(),
    clearAllLogs: vi.fn(),
  },
}));

describe("StatsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Simulate browser environment for window-checked methods
    global.window = {} as Window & typeof globalThis;
  });

  describe("getSessionLogs", () => {
    it("should return logs from dbService", async () => {
      const mockLogs = [{ id: "1", speedWpm: 500 } as Partial<ReadingSessionLog>] as ReadingSessionLog[];
      vi.mocked(dbService.getAllLogs).mockResolvedValue(mockLogs);

      const logs = await StatsService.getSessionLogs();
      expect(logs).toEqual(mockLogs);
      expect(dbService.getAllLogs).toHaveBeenCalled();
    });

    it("should return empty array on error", async () => {
      vi.mocked(dbService.getAllLogs).mockRejectedValue(new Error("DB Error"));
      const logs = await StatsService.getSessionLogs();
      expect(logs).toEqual([]);
    });

    it("should return empty array if window is undefined", async () => {
      const originalWindow = global.window;
      // @ts-expect-error
      delete global.window;
      
      const logs = await StatsService.getSessionLogs();
      expect(logs).toEqual([]);
      
      global.window = originalWindow;
    });
  });

  describe("recordSession", () => {
    it("should create a new log and save it", async () => {
      const sessionData = {
        bookId: "book-1",
        bookTitle: "Title",
        mode: "rsvp" as ReadingMode,
        speedWpm: 600,
        durationSeconds: 120,
        accuracy: 98,
      };

      const log = await StatsService.recordSession(sessionData);

      expect(log.id).toContain("log-");
      expect(log.completedAt).toBeDefined();
      expect(log.speedWpm).toBe(600);
      expect(dbService.saveLog).toHaveBeenCalledWith(log);
    });
  });

  describe("getStatsSummary", () => {
    it("should calculate correct summary from logs", async () => {
      const mockLogs = [
        { speedWpm: 400, durationSeconds: 60, completedAt: "2026-06-01T10:00:00Z" },
        { speedWpm: 600, durationSeconds: 120, completedAt: "2026-06-02T10:00:00Z" },
      ] as Partial<ReadingSessionLog>[] as ReadingSessionLog[];
      vi.mocked(dbService.getAllLogs).mockResolvedValue(mockLogs);

      const summary = await StatsService.getStatsSummary(2);

      expect(summary.totalBooksRead).toBe(2);
      expect(summary.averageWpm).toBe(500); // (400+600)/2
      expect(summary.totalReadingTimeMinutes).toBe(3); // (60+120)/60
      expect(summary.currentStreakDays).toBe(2);
    });

    it("should handle empty logs", async () => {
      vi.mocked(dbService.getAllLogs).mockResolvedValue([]);
      const summary = await StatsService.getStatsSummary(0);

      expect(summary.averageWpm).toBe(0);
      expect(summary.totalReadingTimeMinutes).toBe(0);
      expect(summary.currentStreakDays).toBe(0);
    });
  });

  describe("resetStats", () => {
    it("should call dbService.clearAllLogs", async () => {
      await StatsService.resetStats();
      expect(dbService.clearAllLogs).toHaveBeenCalled();
    });
  });
});
