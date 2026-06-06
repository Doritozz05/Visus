"use client";

import * as React from "react";
import { Book, DEFAULT_BOOKS, BookChapter } from "@/core/entities/book";
import { dbService } from "@/core/services/db-service";

interface LibraryContextType {
  books: Book[];
  activeBookId: string | null;
  isHydrated: boolean;
  setActiveBookId: (id: string | null) => void;
  addBook: (
    title: string,
    author: string,
    format: "PDF" | "EPUB" | "TXT" | "PHYSICAL",
    content?: string,
    chapters?: BookChapter[],
    metadata?: {
      coverUrl?: string;
      description?: string;
      genres?: string[];
      publisher?: string;
      publishDate?: string;
      language?: string;
      currentPage?: number;
      totalPages?: number;
    }
  ) => string;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  toggleCompleted: (id: string) => void;
  resetLibrary: () => void;
}

const LibraryContext = React.createContext<LibraryContextType | undefined>(undefined);

const ACTIVE_BOOK_KEY = "visus_active_book_id";

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = React.useState<Book[]>([]);
  const [activeBookId, setActiveBookIdState] = React.useState<string | null>(null);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // 1. Hydrate state from IndexedDB on component mount
  React.useEffect(() => {
    const hydrate = async () => {
      try {
        const dbBooks = await dbService.getAllBooks();
        let loadedBooks = dbBooks && dbBooks.length > 0 ? dbBooks : DEFAULT_BOOKS;

        // Restore any newer progress cached synchronously in localStorage from unclosed sessions
        loadedBooks = loadedBooks.map((book) => {
          try {
            const cacheKey = `visus_book_progress_${book.id}`;
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
                    lastLocalPageIndex: parsed.lastLocalPageIndex ?? book.lastLocalPageIndex,
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

        setBooks(loadedBooks);

        const activeId = localStorage.getItem(ACTIVE_BOOK_KEY);
        if (activeId) {
          setActiveBookIdState(activeId);
        }
      } catch (err) {
        console.warn("Could not parse library from IndexedDB. Seeding default library data.", err);
        setBooks(DEFAULT_BOOKS);
      } finally {
        setIsHydrated(true);
      }
    };

    hydrate();
  }, []);

  // 2. Persist activeBookId to localStorage on change (tiny key, safe for localStorage)
  const setActiveBookId = React.useCallback((id: string | null) => {
    setActiveBookIdState(id);
    try {
      if (id) {
        localStorage.setItem(ACTIVE_BOOK_KEY, id);
      } else {
        localStorage.removeItem(ACTIVE_BOOK_KEY);
      }
    } catch (err) {
      console.warn("Could not save active book ID to localStorage:", err);
    }
  }, []);

  // CRUD Implementations

  const addBook = React.useCallback((
    title: string,
    author: string,
    format: "PDF" | "EPUB" | "TXT" | "PHYSICAL",
    content?: string,
    chapters?: BookChapter[],
    metadata?: {
      coverUrl?: string;
      description?: string;
      genres?: string[];
      publisher?: string;
      publishDate?: string;
      language?: string;
      currentPage?: number;
      totalPages?: number;
    }
  ) => {
    const bookId = `book-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Default placeholder content if none is provided (e.g. for PDF/EPUB uploads)
    const placeholderContent = `Welcome to your Visus Reading Room!
 
You are currently reading "${title}" by ${author || "Unknown Author"}. This high-performance speed reader locks your foveal focus onto the Optimal Recognition Point (ORP) of every word, eliminating traditional ocular scanning patterns.
 
By stabilizing your eye alignment and moving foveal targets rapidly, RSVP enables your brain to absorb information at extreme visual speeds. Together with foveal cluster semantic chunking, you can train your foveal reading path to expand its peripheral field of vision.
 
Keep calibrating your target words per minute (WPM), relax your foveal field, and let foveal visual processing take over as your eyes settle on the foveal alignment guides. Visus is designed to minimize cognitive visual friction, letting you enter a seamless, deep flow state.`;

    const newBook: Book = {
      id: bookId,
      title: title.trim(),
      author: author.trim() || "Unknown Author",
      format,
      progress: metadata?.totalPages && metadata?.currentPage !== undefined 
        ? Math.min(100, Math.round((metadata.currentPage / metadata.totalPages) * 100)) 
        : 0,
      estimatedReadingTime: "Not started",
      status: "active",
      content: content ? content.trim() : placeholderContent,
      chapters,
      createdAt: new Date().toISOString(),
      coverUrl: metadata?.coverUrl,
      description: metadata?.description,
      genres: metadata?.genres,
      publisher: metadata?.publisher,
      publishDate: metadata?.publishDate,
      language: metadata?.language,
      currentPage: metadata?.currentPage,
      totalPages: metadata?.totalPages,
    };

    setBooks((prev) => [newBook, ...prev]);

    // Save to IndexedDB asynchronously (non-blocking, O(1))
    dbService.saveBook(newBook).catch((err) => {
      console.warn("Could not save new book to IndexedDB:", err);
    });

    return bookId;
  }, []);

  const updateBook = React.useCallback((id: string, updates: Partial<Book>) => {
    setBooks((prev) => {
      let changed = false;
      const nextBooks = prev.map((book) => {
        if (book.id !== id) return book;

        // Perform shallow checks for primitives, fallback to JSON stringify only for objects
        let bookChanged = false;
        for (const key in updates) {
          const val1 = book[key as keyof Book];
          const val2 = updates[key as keyof Book];
          if (typeof val1 === "object" && val1 !== null && typeof val2 === "object" && val2 !== null) {
            if (JSON.stringify(val1) !== JSON.stringify(val2)) {
              bookChanged = true;
              break;
            }
          } else if (val1 !== val2) {
            bookChanged = true;
            break;
          }
        }

        if (!bookChanged) return book;

        changed = true;
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

        // Save individual book updates to IndexedDB asynchronously (non-blocking, O(1))
        dbService.saveBook(mergedBook).catch((err) => {
          console.warn("Could not save updated book to IndexedDB:", err);
        });

        // Cache progress synchronously in localStorage to prevent data loss on tab close / reload
        if (mergedBook.format !== "PHYSICAL") {
          try {
            const cacheKey = `visus_book_progress_${mergedBook.id}`;
            localStorage.setItem(cacheKey, JSON.stringify({
              lastChapterIndex: mergedBook.lastChapterIndex,
              lastWordIndex: mergedBook.lastWordIndex,
              lastLocalPageIndex: mergedBook.lastLocalPageIndex,
              progress: mergedBook.progress,
              estimatedReadingTime: mergedBook.estimatedReadingTime,
              status: mergedBook.status,
              updatedAt: new Date().toISOString()
            }));
          } catch (_) {}
        }

        return mergedBook;
      });

      return changed ? nextBooks : prev;
    });
  }, []);

  const deleteBook = React.useCallback((id: string) => {
    setBooks((prev) => prev.filter((book) => book.id !== id));

    // Delete from IndexedDB asynchronously (non-blocking)
    dbService.deleteBook(id).catch((err) => {
      console.warn("Could not delete book from IndexedDB:", err);
    });

    // Clean up temporary synchronous progress cache
    try {
      localStorage.removeItem(`visus_book_progress_${id}`);
    } catch (_) {}

    setActiveBookIdState((prevActiveId) => {
      if (prevActiveId === id) {
        try {
          localStorage.removeItem(ACTIVE_BOOK_KEY);
        } catch (_) { }
        return null;
      }
      return prevActiveId;
    });
  }, []);

  const toggleCompleted = React.useCallback((id: string) => {
    setBooks((prev) =>
      prev.map((book) => {
        if (book.id !== id) return book;

        const isCurrentlyCompleted = book.status === "completed";
        const newStatus: "active" | "completed" = isCurrentlyCompleted ? "active" : "completed";
        const newProgress = isCurrentlyCompleted ? 0 : 100;
        const newEstTime = isCurrentlyCompleted ? "Not started" : "Completed";

        const updatedBook = {
          ...book,
          status: newStatus,
          progress: newProgress,
          estimatedReadingTime: newEstTime,
        };

        // Save to IndexedDB asynchronously (non-blocking)
        dbService.saveBook(updatedBook).catch((err) => {
          console.warn("Could not save toggled book to IndexedDB:", err);
        });

        return updatedBook;
      })
    );
  }, []);

  const resetLibrary = React.useCallback(() => {
    setBooks(DEFAULT_BOOKS);
    setActiveBookId(null);

    // Clear IndexedDB asynchronously (non-blocking)
    dbService.clearAllBooks().catch((err) => {
      console.warn("Could not reset library in IndexedDB:", err);
    });
  }, [setActiveBookId]);

  return (
    <LibraryContext.Provider
      value={{
        books,
        activeBookId,
        isHydrated,
        setActiveBookId,
        addBook,
        updateBook,
        deleteBook,
        toggleCompleted,
        resetLibrary,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = React.useContext(LibraryContext);
  if (context === undefined) {
    throw new Error("useLibrary must be used within a LibraryProvider");
  }
  return context;
}

