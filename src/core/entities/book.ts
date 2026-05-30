/**
 * @file book.ts
 * @description Domain entity representing a Book in the Visus library.
 * Designed according to Clean Architecture guidelines to remain framework and UI-agnostic.
 */

export interface BookChapter {
  title: string;
  content: string;
}

export interface Bookmark {
  id: string;
  chapterIndex: number;
  wordIndex: number;
  name: string;
  createdAt: string;
  chapterTitle: string;
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
  /** Exact chapter index the user was on when they last left the reader */
  lastChapterIndex?: number;
  /** Exact word index (within the chapter) the user was on when they last left the reader */
  lastWordIndex?: number;
  /** Optional saved bookmark position (legacy) */
  bookmarkChapterIndex?: number;
  /** Optional saved bookmark word index within the bookmarked chapter (legacy) */
  bookmarkWordIndex?: number;
  /** Collection of multiple saved bookmarked positions */
  bookmarks?: Bookmark[];
}

/**
 * Seed data representing the initial books in the user's library.
 * Starts completely empty as requested by the user, providing a clean slate.
 */
export const DEFAULT_BOOKS: Book[] = [];
