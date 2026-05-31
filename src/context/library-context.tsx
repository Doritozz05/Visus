"use client";

import * as React from "react";
import { Book, DEFAULT_BOOKS, BookChapter } from "@/core/entities/book";
import { dbService } from "@/core/services/db-service";

interface LibraryContextType {
  books: Book[];
  activeBookId: string | null;
  setActiveBookId: (id: string | null) => void;
  addBook: (
    title: string, 
    author: string, 
    format: "PDF" | "EPUB" | "TXT", 
    content?: string, 
    chapters?: BookChapter[],
    metadata?: {
      coverUrl?: string;
      description?: string;
      genres?: string[];
      publisher?: string;
      publishDate?: string;
      language?: string;
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

  // 1. Hydrate state from IndexedDB on component mount, with legacy LocalStorage migration
  React.useEffect(() => {
    const hydrate = async () => {
      try {
        // --- ONE-TIME LEGACY MIGRATION ---
        const legacyLibraryStr = localStorage.getItem("visus_library");
        if (legacyLibraryStr && legacyLibraryStr.trim() !== "") {
          try {
            const parsed = JSON.parse(legacyLibraryStr);
            if (Array.isArray(parsed) && parsed.length > 0) {
              console.log(`Migrating ${parsed.length} books from LocalStorage to IndexedDB...`);
              for (const book of parsed) {
                await dbService.saveBook(book);
              }
            }
          } catch (e) {
            console.error("Failed to migrate legacy library:", e);
          } finally {
            localStorage.removeItem("visus_library");
          }
        }

        const legacyLogsStr = localStorage.getItem("visus_telemetry_logs");
        if (legacyLogsStr && legacyLogsStr.trim() !== "") {
          try {
            const parsed = JSON.parse(legacyLogsStr);
            if (Array.isArray(parsed) && parsed.length > 0) {
              console.log(`Migrating ${parsed.length} telemetry logs from LocalStorage to IndexedDB...`);
              for (const log of parsed) {
                await dbService.saveLog(log);
              }
            }
          } catch (e) {
            console.error("Failed to migrate legacy telemetry logs:", e);
          } finally {
            localStorage.removeItem("visus_telemetry_logs");
          }
        }
        // ---------------------------------

        const dbBooks = await dbService.getAllBooks();
        if (dbBooks && dbBooks.length > 0) {
          setBooks(dbBooks);
        } else {
          setBooks(DEFAULT_BOOKS);
        }

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
    format: "PDF" | "EPUB" | "TXT", 
    content?: string, 
    chapters?: BookChapter[],
    metadata?: {
      coverUrl?: string;
      description?: string;
      genres?: string[];
      publisher?: string;
      publishDate?: string;
      language?: string;
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
      progress: 0,
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

        // Perform value-equality checks to avoid unnecessary state updates
        let bookChanged = false;
        for (const key in updates) {
          const val1 = book[key as keyof Book];
          const val2 = updates[key as keyof Book];
          if (JSON.stringify(val1) !== JSON.stringify(val2)) {
            bookChanged = true;
            break;
          }
        }

        if (!bookChanged) return book;

        changed = true;
        const mergedBook = { ...book, ...updates };
        
        // Calculate status and estimated reading time based on progress
        if (mergedBook.progress === 100) {
          mergedBook.estimatedReadingTime = "Completed";
          mergedBook.status = "completed";
        } else if (mergedBook.progress > 0 && mergedBook.progress < 100) {
          mergedBook.status = "active";
          mergedBook.estimatedReadingTime = `${mergedBook.progress}% completed`;
        } else {
          mergedBook.status = "active";
          mergedBook.estimatedReadingTime = "Not started";
        }

        // Save individual book updates to IndexedDB asynchronously (non-blocking, O(1))
        dbService.saveBook(mergedBook).catch((err) => {
          console.warn("Could not save updated book to IndexedDB:", err);
        });

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

    setActiveBookIdState((prevActiveId) => {
      if (prevActiveId === id) {
        try {
          localStorage.removeItem(ACTIVE_BOOK_KEY);
        } catch (_) {}
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

