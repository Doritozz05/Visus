/**
 * @file compression.ts
 * @description Bucketing compression utility to prune detailed speed histories from older logs.
 */

import { dbService } from "@/core/services/db-service";

export async function compressOlderLogs(): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const logs = await dbService.getAllLogs();
    if (logs.length <= 50) return;

    // Sort logs descending by date (most recent first)
    const sortedLogs = [...logs].sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );

    // Logs index 50 and older are candidates for compression
    const olderLogs = sortedLogs.slice(50);

    for (const log of olderLogs) {
      // Check if log contains detailed telemetry data that hasn't been compressed yet
      if (log.telemetryData && log.telemetryData.speed_history && log.telemetryData.speed_history.length > 0) {
        
        // Bucketing: Consolidate speed history into just 3 data points (start, middle, end)
        // or clear it entirely. Let's do a 3-point summary to preserve a high-level trend.
        const history = log.telemetryData.speed_history;
        let bucketedHistory: { offsetSeconds: number; wpm: number }[] = [];
        
        if (history.length > 3) {
          const first = history[0];
          const mid = history[Math.floor(history.length / 2)];
          const last = history[history.length - 1];
          bucketedHistory = [first, mid, last];
        } else {
          bucketedHistory = [...history];
        }

        // Compress log
        log.telemetryData = {
          ...log.telemetryData,
          speed_history: bucketedHistory,
          // Add a custom flag to indicate this has been bucketed/compressed
          focus_level: `${log.telemetryData.focus_level || "Good focus"} (compressed)`
        };

        // Update in IndexedDB
        await dbService.saveLog(log);
      }
    }
    console.log(`[TelemetryCompression] Checked ${olderLogs.length} older logs for compression.`);
  } catch (err) {
    console.warn("[TelemetryCompression] Failed to compress older logs:", err);
  }
}
