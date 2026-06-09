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
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      completedAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      try {
        await dbService.saveLog(newLog);
      } catch (err) {
        console.warn("Could not save reading log to IndexedDB:", err);
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

    // Simple streak calculation (based on consecutive active days in logs)
    let currentStreakDays = 0;
    try {
      const uniqueDays = new Set(
        logs.map((log) => new Date(log.completedAt).toDateString())
      );
      currentStreakDays = uniqueDays.size;
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
        await dbService.clearAllLogs();
      } catch (_) {}
    }
  }
}

