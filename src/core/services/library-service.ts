import { Book, DEFAULT_BOOKS, ParsedBookData } from "../entities/book";
import { dbService } from "./db-service";

export const ACTIVE_BOOK_KEY = "visus_active_book_id";
export const BOOK_PROGRESS_PREFIX = "visus_book_progress_";

export function getBookProgressKey(bookId: string): string {
  return `${BOOK_PROGRESS_PREFIX}${bookId}`;
}

export function generateBookId(): string {
  return `book-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export function createBookEntity(data: ParsedBookData): Book {
  const title = data.title.trim();
  const author = data.author.trim() || "Unknown Author";

  // Default placeholder content if none is provided (e.g. for PDF/EPUB uploads)
  const placeholderContent = `Welcome to your Visus Reading Room!
 
You are currently reading "${title}" by ${author}. This high-performance speed reader locks your foveal focus onto the Optimal Recognition Point (ORP) of every word, eliminating traditional ocular scanning patterns.
 
By stabilizing your eye alignment and moving foveal targets rapidly, RSVP enables your brain to absorb information at extreme visual speeds. Together with foveal cluster semantic chunking, you can train your foveal reading path to expand its peripheral field of vision.
 
Keep calibrating your target words per minute (WPM), relax your foveal field, and let foveal visual processing take over as your eyes settle on the foveal alignment guides. Visus is designed to minimize cognitive visual friction, letting you enter a seamless, deep flow state.`;

  return {
    id: generateBookId(),
    title,
    author,
    format: data.format,
    progress: data.metadata?.totalPages && data.metadata?.currentPage !== undefined 
      ? Math.min(100, Math.round((data.metadata.currentPage / data.metadata.totalPages) * 100)) 
      : 0,
    estimatedReadingTime: "Not started",
    status: "active",
    content: data.content ? data.content.trim() : placeholderContent,
    chapters: data.chapters,
    createdAt: new Date().toISOString(),
    coverUrl: data.metadata?.coverUrl,
    description: data.metadata?.description,
    genres: data.metadata?.genres,
    publisher: data.metadata?.publisher,
    publishDate: data.metadata?.publishDate,
    language: data.metadata?.language,
    currentPage: data.metadata?.currentPage,
    totalPages: data.metadata?.totalPages,
  };
}

export function calculateProgress(book: Book, updates: Partial<Book>): Book {
  const mergedBook = { ...book, ...updates };

  // Calculate status and estimated reading time based on progress
  if (mergedBook.format === "PHYSICAL" && mergedBook.currentPage !== undefined && mergedBook.totalPages) {
    mergedBook.progress = Math.min(100, Math.round((mergedBook.currentPage / mergedBook.totalPages) * 100));
  }

  let naturalStatus: "active" | "completed" = "active";
  if (mergedBook.progress === 100) {
    mergedBook.estimatedReadingTime = "Completed";
    naturalStatus = "completed";
  } else if (mergedBook.progress > 0 && mergedBook.progress < 100) {
    naturalStatus = "active";
    mergedBook.estimatedReadingTime = mergedBook.format === "PHYSICAL" 
      ? `${mergedBook.currentPage}/${mergedBook.totalPages} pages`
      : `${mergedBook.progress}% completed`;
  } else {
    naturalStatus = "active";
    mergedBook.estimatedReadingTime = "Not started";
  }

  if (updates.status) {
    mergedBook.status = updates.status;
  } else if (mergedBook.status !== "archived") {
    mergedBook.status = naturalStatus;
  }

  return mergedBook;
}

export async function saveBook(book: Book): Promise<void> {
  // Cache progress synchronously in localStorage FIRST to guarantee persistence on tab close / reload
  if (typeof window !== "undefined" && book.format !== "PHYSICAL") {
    try {
      const cacheKey = getBookProgressKey(book.id);
      localStorage.setItem(cacheKey, JSON.stringify({
        lastChapterIndex: book.lastChapterIndex,
        lastWordIndex: book.lastWordIndex,
        lastLocalPageIndex: book.lastLocalPageIndex,
        progress: book.progress,
        estimatedReadingTime: book.estimatedReadingTime,
        status: book.status,
        updatedAt: new Date().toISOString()
      }));
    } catch (_) {}
  }

  // Save to IndexedDB asynchronously
  await dbService.saveBook(book);
}

export async function loadLibrary(): Promise<Book[]> {
  const dbBooks = await dbService.getAllBooks();
  let loadedBooks = dbBooks && dbBooks.length > 0 ? dbBooks : DEFAULT_BOOKS;

  if (typeof window !== "undefined") {
    // Restore any newer progress cached synchronously in localStorage from unclosed sessions
    loadedBooks = loadedBooks.map((book) => {
      try {
        const cacheKey = getBookProgressKey(book.id);
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === "object") {
            const hasNewerProgress =
              parsed.lastChapterIndex !== undefined &&
              (parsed.lastChapterIndex !== book.lastChapterIndex || parsed.lastWordIndex !== book.lastWordIndex);

            if (hasNewerProgress) {
              const updatedBook = {
                ...book,
                lastChapterIndex: parsed.lastChapterIndex,
                lastWordIndex: parsed.lastWordIndex,
                lastLocalPageIndex: parsed.lastLocalPageIndex,
                progress: parsed.progress,
                estimatedReadingTime: parsed.estimatedReadingTime || book.estimatedReadingTime,
                status: parsed.status || book.status
              };
              // Sync database back to cache level asynchronously
              dbService.saveBook(updatedBook).catch(() => {});
              return updatedBook;
            }
          }
        }
      } catch (_) {}
      return book;
    });
  }

  return loadedBooks;
}

export async function deleteBook(id: string): Promise<void> {
  // Delete from IndexedDB
  await dbService.deleteBook(id);

  // Clean up temporary synchronous progress cache
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(getBookProgressKey(id));
    } catch (_) {}
  }
}

export async function resetLibrary(): Promise<void> {
  // Clear IndexedDB
  await dbService.clearAllBooks();
}

export const libraryService = {
  generateBookId,
  createBookEntity,
  calculateProgress,
  saveBook,
  loadLibrary,
  deleteBook,
  resetLibrary,
};
