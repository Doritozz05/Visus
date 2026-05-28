/**
 * @file reader.ts
 * @description Defines data types, configurations, and states for rapid reading engines.
 * Serves as the single source of truth for reading session playback state variables.
 */

/**
 * Display modes supported for rapid reading.
 */
export type ReadingMode = "rsvp" | "clusters";

/**
 * Visual themes available in reading panels, optimized for visual strain and contrast.
 */
export type ReadingTheme = "light" | "dark" | "sepia" | "nordic" | "contrast";

/**
 * General configuration settings for the rapid reading engine.
 */
export interface ReaderSettings {
  wordsPerMinute: number;
  fontSize: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  theme: ReadingTheme;
  mode: ReadingMode;
  chunkSize: number;          // Number of words to group in Cluster mode (typically between 2 and 5)
  showFocusPoint: boolean;     // Highlight the central/ORP character in the RSVP player
  pauseOnPunctuation: boolean; // Dynamic delays at punctuation marks (periods, commas, etc.)
  autoScroll: boolean;         // Automatic scrolling of context in side panels
}

/**
 * Real-time dynamic state of the active reading session.
 */
export interface ReaderState {
  isPlaying: boolean;
  currentWordIndex: number;
  currentParagraphIndex: number;
  elapsedTimeSeconds: number;
  progressPercentage: number;
}
