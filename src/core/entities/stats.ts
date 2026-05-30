/**
 * @file stats.ts
 * @description Domain entity definitions for telemetry and reading session statistics.
 */

export type ReadingMode = "rsvp" | "cluster" | "normal";

export interface ReadingSessionLog {
  id: string;
  bookId: string;
  bookTitle: string;
  mode: ReadingMode;
  speedWpm: number;
  durationSeconds: number;
  accuracy: number;
  completedAt: string; // ISO Date String
}

export interface LibraryStatsSummary {
  totalBooksRead: number;
  averageWpm: number;
  currentStreakDays: number;
  completionRatePercent: number;
  totalReadingTimeMinutes: number;
}
