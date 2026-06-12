/**
 * @file export.ts
 * @description Utility functions to export telemetry session logs as JSON and CSV files.
 */

import { ReadingSessionLog } from "@/core/entities/stats";

/**
 * Downloads reading session logs as a formatted JSON file.
 */
export function exportToJSON(logs: ReadingSessionLog[]): void {
  try {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `visus_telemetry_history_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  } catch (err) {
    console.error("[Export] Failed to export JSON:", err);
  }
}

/**
 * Downloads reading session logs as a formatted CSV file.
 */
export function exportToCSV(logs: ReadingSessionLog[]): void {
  try {
    const headers = ["ID", "Document Title", "Mode", "Speed (WPM)", "Duration (Seconds)", "Accuracy (%)", "Completed At"];
    const rows = logs.map((log) => [
      log.id,
      `"${log.bookTitle.replace(/"/g, '""')}"`,
      log.mode,
      log.speedWpm,
      log.durationSeconds,
      log.accuracy,
      log.completedAt
    ]);

    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", url);
    downloadAnchor.setAttribute("download", `visus_telemetry_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("[Export] Failed to export CSV:", err);
  }
}
