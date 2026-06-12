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
  accuracy?: number | null;
  completedAt: string; // ISO Date String
  telemetryData?: {
    speed_history?: { offsetSeconds: number; wpm: number; }[];
    regression_events?: number[];
    interruption_count?: number;
    eye_strain_index?: number;
    focus_level?: string;
    device_context?: {
      device_type?: string;
      screen_width?: number;
      theme?: string;
      font_size?: number;
    };
  };
}

export interface LibraryStatsSummary {
  totalBooksRead: number;
  averageWpm: number;
  currentStreakDays: number;
  completionRatePercent: number;
  totalReadingTimeMinutes: number;
}
