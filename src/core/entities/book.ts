/**
 * @file book.ts
 * @description Domain entity representing a Book in the Visus library.
 * Designed according to Clean Architecture guidelines to remain framework and UI-agnostic.
 */

export interface BookChapter {
  title: string;
  content: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  format: "PDF" | "EPUB" | "TXT";
  progress: number; // Percentage complete (0 to 100)
  estimatedReadingTime: string; // Dynamic text, e.g., "2h 15m remaining"
  status: "active" | "completed" | "archived";
  content?: string; // Stored text content of the book
  chapters?: BookChapter[]; // Parsed chapters for EPUB/PDF/TXT
  createdAt: string;
}

/**
 * Seed data representing the initial books in the user's library.
 * Starts completely empty as requested by the user, providing a clean slate.
 */
export const DEFAULT_BOOKS: Book[] = [];
