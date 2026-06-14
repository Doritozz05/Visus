/**
 * @file stats-service.ts
 * @description Architectural persistence service for reading telemetries and session logs.
 */

import { ReadingSessionLog, LibraryStatsSummary, ReadingMode } from "../entities/stats";
import { dbService } from "./db-service";

export class StatsService {
  /**
   * Fetch all recorded reading session logs from local database (IndexedDB)
   */
  static async getSessionLogs(): Promise<ReadingSessionLog[]> {
    if (typeof window === "undefined") return [];
    try {
      const logs = await dbService.getAllLogs();
      return logs || [];
    } catch (err) {
      console.warn("Could not retrieve reading logs from IndexedDB:", err);
      return [];
    }
  }

  /**
   * Save a new reading session telemetry log
   */
  static async recordSession(session: Omit<ReadingSessionLog, "id" | "completedAt">): Promise<ReadingSessionLog> {
    const newLog: ReadingSessionLog = {
      ...session,
      id: `log-${crypto.randomUUID()}`,
      completedAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      try {
        await dbService.saveLog(newLog);

        // Check privacy/telemetry preference from localStorage
        const storedSettings = localStorage.getItem("visus_settings");
        let preference = "cloud";
        if (storedSettings) {
          try {
            const parsed = JSON.parse(storedSettings);
            preference = parsed?.general?.telemetryPreference || "cloud";
          } catch (_) {}
        }

        if (preference !== "disabled") {
          const hasSupabaseConfig = typeof process !== "undefined" && process.env && process.env.NEXT_PUBLIC_SUPABASE_URL;
          
          if (hasSupabaseConfig) {
            const { supabase } = await import("@/lib/supabase");
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            const user = currentSession?.user;

            if (user) {
              if (navigator.onLine) {
                const { remoteSyncService } = await import("@/core/config/services");
                await remoteSyncService.pushChanges(user.id, {
                  books: [],
                  stats: [newLog],
                  deletedBookIds: []
                }).catch(async (syncErr) => {
                  console.warn("[StatsService] Live telemetry push failed, queueing offline:", syncErr);
                  await dbService.enqueueSyncAction({
                    type: "INSERT_STAT",
                    payload: newLog,
                    timestamp: new Date().toISOString()
                  });
                });
              } else {
                console.log("[StatsService] Device offline, queueing telemetry log for synchronization.");
                await dbService.enqueueSyncAction({
                  type: "INSERT_STAT",
                  payload: newLog,
                  timestamp: new Date().toISOString()
                });
              }
            }
          }
        }

        // Evaluate achievements and compress older logs locally after saving log
        try {
          const { AchievementDispatcher } = await import("@/features/stats/services/achievement-dispatcher");
          await AchievementDispatcher.evaluate();
          const { compressOlderLogs } = await import("@/features/stats/utils/compression");
          await compressOlderLogs();
        } catch (achErr) {
          console.warn("[StatsService] Local achievement evaluation or compression failed:", achErr);
        }

        // Dispatch global event for real-time dashboard updates
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("stats-updated"));
        }
      } catch (err) {
        console.warn("Could not save or sync reading log:", err);
      }
    }
    return newLog;
  }

  /**
   * Calculate summary statistics for the user based on logged sessions
   */
  static async getStatsSummary(booksReadCount: number): Promise<LibraryStatsSummary> {
    const logs = await this.getSessionLogs();
    
    const totalWpm = logs.reduce((sum, log) => sum + log.speedWpm, 0);
    const averageWpm = logs.length > 0 ? Math.round(totalWpm / logs.length) : 0;
    
    const totalReadingTimeSeconds = logs.reduce((sum, log) => sum + log.durationSeconds, 0);
    const totalReadingTimeMinutes = Math.round(totalReadingTimeSeconds / 60);

    // Streak calculation supporting grace day period
    let currentStreakDays = 0;
    try {
      const { AchievementDispatcher } = await import("@/features/stats/services/achievement-dispatcher");
      currentStreakDays = AchievementDispatcher.calculateStreakWithGrace(logs);
    } catch (_) {}

    return {
      totalBooksRead: booksReadCount,
      averageWpm,
      currentStreakDays,
      completionRatePercent: booksReadCount > 0 ? 100 : 0, // Simplified for now, or use actual logic if needed
      totalReadingTimeMinutes,
    };
  }

  /**
   * Clear all reading session history
   */
  static async resetStats(): Promise<void> {
    if (typeof window !== "undefined") {
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data: { session } } = await supabase.auth.getSession();
        const isLoggedIn = !!session?.user?.id;

        // Always clear local reading logs
        await dbService.clearAllLogs();

        if (isLoggedIn) {
          // If logged in: Keep achievements, only delete logs from cloud
          try {
            await supabase.from("reading_logs").delete().eq("user_id", session!.user.id);
          } catch (_) {}
        } else {
          // If guest: Wipe local achievements too so they can start completely fresh
          await dbService.clearAllUserAchievements();
        }
      } catch (err) {
        console.error("[StatsService] Error resetting stats:", err);
      }
    }
  }
}

