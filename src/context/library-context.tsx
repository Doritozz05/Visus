"use client";

import * as React from "react";
import { Book, DEFAULT_BOOKS, BookChapter } from "@/core/entities/book";
import { libraryService, ACTIVE_BOOK_KEY } from "@/core/services/library-service";

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

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = React.useState<Book[]>([]);
  const booksRef = React.useRef(books);
  React.useEffect(() => {
    booksRef.current = books;
  }, [books]);
  const [activeBookId, setActiveBookIdState] = React.useState<string | null>(null);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // 1. Hydrate state from database/local storage on component mount
  React.useEffect(() => {
    const hydrate = async () => {
      try {
        const loadedBooks = await libraryService.loadLibrary();
        setBooks(loadedBooks);

        const activeId = localStorage.getItem(ACTIVE_BOOK_KEY);
        if (activeId) {
          setActiveBookIdState(activeId);
        }
      } catch (err) {
        console.warn("Could not parse library. Seeding default library data.", err);
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
    const newBook = libraryService.createBookEntity({
      title,
      author,
      format,
      content,
      chapters,
      metadata,
    });

    setBooks((prev) => [newBook, ...prev]);

    // Save to database asynchronously (non-blocking, O(1))
    libraryService.saveBook(newBook).catch((err) => {
      console.warn("Could not save new book:", err);
    });

    return newBook.id;
  }, []);

  const updateBook = React.useCallback((id: string, updates: Partial<Book>) => {
    const currentBook = booksRef.current.find((book) => book.id === id);
    if (!currentBook) return;

    // Recalculate progress/status based on updates
    const updatedBook = libraryService.calculateProgress(currentBook, updates);

    // Perform shallow checks for primitives, fallback to JSON stringify only for objects
    // to decide if the change justifies a re-render
    let bookChanged = false;
    for (const key in updatedBook) {
      const val1 = currentBook[key as keyof Book];
      const val2 = updatedBook[key as keyof Book];
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

    if (!bookChanged) return;

    // Update state purely
    setBooks((prev) => prev.map((book) => (book.id === id ? updatedBook : book)));

    // Save updated book asynchronously (non-blocking, O(1))
    libraryService.saveBook(updatedBook).catch((err) => {
      console.warn("Could not save updated book:", err);
    });
  }, []);

  const deleteBook = React.useCallback((id: string) => {
    setBooks((prev) => prev.filter((book) => book.id !== id));

    // Delete asynchronously (non-blocking)
    libraryService.deleteBook(id).catch((err) => {
      console.warn("Could not delete book:", err);
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
    const currentBook = booksRef.current.find((book) => book.id === id);
    if (!currentBook) return;

    const isCurrentlyCompleted = currentBook.status === "completed";
    const newStatus: "active" | "completed" = isCurrentlyCompleted ? "active" : "completed";
    const newProgress = isCurrentlyCompleted ? 0 : 100;

    const updatedBook = libraryService.calculateProgress(currentBook, {
      status: newStatus,
      progress: newProgress,
    });

    // Update state purely
    setBooks((prev) => prev.map((book) => (book.id === id ? updatedBook : book)));

    // Save to database asynchronously (non-blocking)
    libraryService.saveBook(updatedBook).catch((err) => {
      console.warn("Could not save toggled book:", err);
    });
  }, []);

  const resetLibrary = React.useCallback(() => {
    setBooks(DEFAULT_BOOKS);
    setActiveBookId(null);

    // Clear database asynchronously (non-blocking)
    libraryService.resetLibrary().catch((err) => {
      console.warn("Could not reset library:", err);
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
