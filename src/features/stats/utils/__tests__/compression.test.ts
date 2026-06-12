import { describe, it, expect, vi, beforeEach } from "vitest";
import { compressOlderLogs } from "../compression";
import { dbService } from "@/core/services/db-service";
import { ReadingSessionLog } from "@/core/entities/stats";

vi.mock("@/core/services/db-service", () => {
  return {
    dbService: {
      getAllLogs: vi.fn(),
      saveLog: vi.fn(),
    },
  };
});

describe("compressOlderLogs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should do nothing if log count is <= 50", async () => {
    const mockLogs = Array.from({ length: 45 }, (_, i) => ({
      id: `log-${i}`,
      completedAt: new Date(2026, 5, i + 1).toISOString(),
      telemetryData: {
        speed_history: [{ offsetSeconds: 30, wpm: 300 }],
      },
    }));

    vi.mocked(dbService.getAllLogs).mockResolvedValue(mockLogs as ReadingSessionLog[]);

    await compressOlderLogs();

    expect(dbService.saveLog).not.toHaveBeenCalled();
  });

  it("should compress logs older than 50 items", async () => {
    // Generate 55 logs, newer ones first
    const mockLogs = Array.from({ length: 55 }, (_, i) => {
      // i = 0 is newest, i = 54 is oldest
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      return {
        id: `log-${i}`,
        completedAt: date.toISOString(),
        telemetryData: {
          speed_history: [
            { offsetSeconds: 30, wpm: 300 },
            { offsetSeconds: 60, wpm: 350 },
            { offsetSeconds: 90, wpm: 400 },
            { offsetSeconds: 120, wpm: 450 },
            { offsetSeconds: 150, wpm: 500 },
          ],
          focus_level: "Excellent focus",
        },
      };
    });

    vi.mocked(dbService.getAllLogs).mockResolvedValue(mockLogs as unknown as ReadingSessionLog[]);

    await compressOlderLogs();

    // Logs 0 to 49 (newest 50) are not touched
    // Logs 50 to 54 (oldest 5) should be compressed
    expect(dbService.saveLog).toHaveBeenCalledTimes(5);
    
    // Check arguments of saveLog
    const savedLog = vi.mocked(dbService.saveLog).mock.calls[0][0];
    expect(savedLog.telemetryData?.speed_history?.length).toBe(3); // compressed to 3 items
    expect(savedLog.telemetryData?.focus_level).toContain("(compressed)");
  });
});
