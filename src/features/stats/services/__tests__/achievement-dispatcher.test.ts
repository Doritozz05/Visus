import { describe, it, expect, vi, beforeEach } from "vitest";
import { AchievementDispatcher } from "../achievement-dispatcher";
import { ReadingSessionLog } from "@/core/entities/stats";

// Mock dbService
vi.mock("@/core/services/db-service", () => {
  return {
    dbService: {
      getAllLogs: vi.fn(),
      getUserAchievements: vi.fn(),
      saveUserAchievement: vi.fn(),
      getAllAchievements: vi.fn().mockResolvedValue([]),
      saveAchievement: vi.fn(),
    },
  };
});

// Mock toast
vi.mock("sonner", () => {
  return {
    toast: {
      custom: vi.fn(),
    },
  };
});

describe("AchievementDispatcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("calculateStreakWithGrace", () => {
    it("should return 0 when there are no logs", () => {
      expect(AchievementDispatcher.calculateStreakWithGrace([])).toBe(0);
    });

    it("should calculate correct streak without grace days", () => {
      const logs: Partial<ReadingSessionLog>[] = [
        { completedAt: "2026-06-10T12:00:00Z" },
        { completedAt: "2026-06-11T12:00:00Z" },
        { completedAt: "2026-06-12T12:00:00Z" },
      ];

      // Stub current date as 2026-06-12 to keep streak active
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-06-12T15:00:00Z"));

      const streak = AchievementDispatcher.calculateStreakWithGrace(logs as ReadingSessionLog[]);
      expect(streak).toBe(3);

      vi.useRealTimers();
    });

    it("should bridge 1 day gap if grace days are available", () => {
      // 31 distinct days total -> earns 1 grace day
      const logs: Partial<ReadingSessionLog>[] = [];
      const baseDate = new Date("2026-05-01T12:00:00Z");
      
      // Add 30 consecutive days of reading (May 1 to May 30)
      for (let i = 0; i < 30; i++) {
        const d = new Date(baseDate);
        d.setDate(baseDate.getDate() + i);
        logs.push({ completedAt: d.toISOString() });
      }

      // Skip June 1, read on June 2
      const dateJune2 = new Date("2026-05-01T12:00:00Z");
      dateJune2.setDate(baseDate.getDate() + 31); // day 32 (gap of exactly 1 day on June 1)
      logs.push({ completedAt: dateJune2.toISOString() });

      vi.useFakeTimers();
      vi.setSystemTime(dateJune2); // stub today's time to June 2

      const streak = AchievementDispatcher.calculateStreakWithGrace(logs as ReadingSessionLog[]);
      // 30 days + 1 skipped bridged + 1 current day = 32
      expect(streak).toBe(32);

      vi.useRealTimers();
    });

    it("should return 0 if the streak is inactive (not read today or yesterday)", () => {
      const logs: Partial<ReadingSessionLog>[] = [
        { completedAt: "2026-06-01T12:00:00Z" },
        { completedAt: "2026-06-02T12:00:00Z" },
      ];

      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-06-10T12:00:00Z")); // 8 days later

      const streak = AchievementDispatcher.calculateStreakWithGrace(logs as ReadingSessionLog[]);
      expect(streak).toBe(0);

      vi.useRealTimers();
    });
  });
});
