/**
 * @file book.ts
 * @description Domain entity representing a Book in the Visus library.
 * Designed according to Clean Architecture guidelines to remain framework and UI-agnostic.
 */

export interface BookChapter {
  title: string;
  content: string;
  htmlContent?: string; // Rich HTML for column layout rendering
}

export interface Bookmark {
  id: string;
  chapterIndex: number;
  wordIndex: number;
  name: string;
  createdAt: string;
  chapterTitle: string;
}

export interface BookBinary {
  bookId: string;
  content?: string; // Stored text content of the book
  chapters?: BookChapter[]; // Parsed chapters for EPUB/PDF/TXT
  fileBlob?: Blob; // The actual file if needed locally
}

export interface Book {
  id: string;
  title: string;
  author: string;
  format: "PDF" | "EPUB" | "TXT" | "PHYSICAL";
  progress: number; // Percentage complete (0 to 100)
  estimatedReadingTime: string; // Dynamic text, e.g., "2h 15m remaining"
  status: "active" | "completed" | "archived";
  createdAt: string;
  /** Exact chapter index the user was on when they last left the reader */
  lastChapterIndex?: number;
  /** Exact word index (within the chapter) the user was on when they last left the reader */
  lastWordIndex?: number;
  /** Exact local page index (within the chapter) the user was on when they last left the reader.
   *  Stored alongside lastWordIndex to allow direct currentPageIndex restoration without
   *  relying on the potentially unstable wordIndex→page DOM mapping. */
  lastLocalPageIndex?: number;
  /** Collection of multiple saved bookmarked positions */
  bookmarks?: Bookmark[];
  /** Premium Metadata & Cover Image */
  coverUrl?: string; // Base64 encoded or external URL of cover image
  description?: string; // Book synopsis or summary
  genres?: string[]; // Subject tags or genres
  publisher?: string; // Book publisher
  publishDate?: string; // Book publication date
  language?: string; // Language (e.g. 'en', 'es')
  /** Physical book tracking properties */
  currentPage?: number;
  totalPages?: number;
  /** Sync status */
  syncStatus?: "synced" | "pending" | "local_only";
  /** Whether the actual binary file (.epub, .pdf) is stored in the cloud storage (limit 3 for free users) */
  isInCloud?: boolean;
  updatedAt?: string;
  fileHash?: string;
  ownerId: string;
}

export interface ParsedBookData {
  title: string;
  author: string;
  format: "PDF" | "EPUB" | "TXT" | "PHYSICAL";
  ownerId?: string;
  content?: string;
  chapters?: BookChapter[];
  fileBlob?: Blob;
  metadata?: {
    coverUrl?: string;
    description?: string;
    genres?: string[];
    publisher?: string;
    publishDate?: string;
    language?: string;
    currentPage?: number;
    totalPages?: number;
  };
}

/**
 * Seed data representing the initial books in the user's library.
 * Starts completely empty as requested by the user, providing a clean slate.
 */
export const DEFAULT_BOOKS: Book[] = [];
