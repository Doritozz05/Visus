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
    },
    fileBlob?: Blob
  ) => string;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  toggleCompleted: (id: string) => void;
  resetLibrary: () => void;
}

const LibraryContext = React.createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = React.useState<Book[]>([]);
  const [activeBookId, setActiveBookIdState] = React.useState<string | null>(null);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // 1. Hydrate state from database/local storage on component mount
  React.useEffect(() => {
    const hydrate = async () => {
      try {
        let loadedBooks = await libraryService.loadLibrary();

        // Background automatic sync check on load
        import("@/core/config/services").then(async ({ authService, remoteSyncService, remoteStorageService }) => {
          const user = await authService.getUser();
          if (user) {
            try {
              const lastSync = localStorage.getItem("visus_last_sync_timestamp") || new Date(0).toISOString();
              const remoteChanges = await remoteSyncService.pullChanges(user.id, lastSync);
              
              if (remoteChanges.books.length > 0 || remoteChanges.deletedBookIds.length > 0) {
                // Apply deletions
                loadedBooks = loadedBooks.filter(b => !remoteChanges.deletedBookIds.includes(b.id));
                
                // Apply additions/updates
                for (const remoteBook of remoteChanges.books) {
                  const existingIndex = loadedBooks.findIndex(b => b.id === remoteBook.id);
                  let finalBook = remoteBook;

                  if (existingIndex >= 0) {
                     loadedBooks[existingIndex] = remoteBook;
                  } else {
                     loadedBooks.push(remoteBook);
                     // If it's a completely new book from the cloud, try to download its binary
                     if (remoteBook.format !== "PHYSICAL" && remoteBook.isInCloud) {
                        try {
                          const fileBlob = await remoteStorageService.downloadBookFile(user.id, remoteBook.id);
                          import("@/core/services/db-service").then(({ dbService }) => {
                            dbService.saveBookBinary({
                              bookId: remoteBook.id,
                              fileBlob: fileBlob,
                              content: `Auto-downloaded book content.` // Basic fallback
                            });
                          });
                        } catch (downloadErr) {
                          console.warn("Auto-download binary failed for", remoteBook.id, downloadErr);
                        }
                     }
                  }
                  // Save to local DB so next reload is fast
                  import("@/core/services/db-service").then(({ dbService }) => dbService.saveBook(remoteBook));
                }
                
                // Update React State with merged cloud data
                setBooks([...loadedBooks]);
                localStorage.setItem("visus_last_sync_timestamp", new Date().toISOString());
              }
            } catch (syncErr) {
              console.warn("Background auto-sync failed:", syncErr);
            }
          }
        });

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
    },
    fileBlob?: Blob
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

    // Create binary data if we have content or a file
    const binary = libraryService.createBookBinary(newBook.id, {
      title,
      author,
      format,
      content,
      chapters,
    }, fileBlob);

    // Save to database asynchronously (non-blocking, O(1))
    libraryService.saveBook(newBook, binary).catch((err) => {
      console.warn("Could not save new book:", err);
    });

    return newBook.id;
  }, []);

  const updateBook = React.useCallback((id: string, updates: Partial<Book>) => {
    setBooks((prevBooks) => {
      const currentBook = prevBooks.find((book) => book.id === id);
      if (!currentBook) return prevBooks;

      // Recalculate progress/status based on updates
      const updatedBook = libraryService.calculateProgress(currentBook, updates);

      // Implement a targeted shallow comparison to avoid deep serialization bottlenecks.
      // We explicitly skip massive static objects like 'content' and 'chapters'
      // which do not mutate during reading sessions.
      let bookChanged = false;
      for (const key in updates) {
        const k = key as keyof Book;
        if (currentBook[k] !== updatedBook[k]) {
          bookChanged = true;
          break;
        }
      }
      
      // Also check if our calculated fields (status, progress, estimatedReadingTime) changed
      if (
        currentBook.status !== updatedBook.status ||
        currentBook.progress !== updatedBook.progress ||
        currentBook.estimatedReadingTime !== updatedBook.estimatedReadingTime
      ) {
        bookChanged = true;
      }

      if (!bookChanged) return prevBooks;

      // Save updated book asynchronously (non-blocking, O(1))
      libraryService.saveBook(updatedBook).catch((err) => {
        console.warn("Could not save updated book:", err);
      });

      return prevBooks.map((book) => (book.id === id ? updatedBook : book));
    });
  }, []);

  const deleteBook = React.useCallback((id: string) => {
    // 1. Remove from local state immediately for fast UI
    setBooks((prev) => {
      const bookToDelete = prev.find(b => b.id === id);
      
      // If it was in the cloud, we should try to delete the file from the bucket
      if (bookToDelete?.isInCloud) {
        import("@/core/config/services").then(({ authService, remoteStorageService }) => {
          authService.getUser().then(user => {
            if (user) {
              remoteStorageService.deleteBookFile(user.id, id).catch(console.warn);
            }
          });
        });
      }
      return prev.filter((book) => book.id !== id);
    });

    // 2. Delete from local DB asynchronously
    libraryService.deleteBook(id).catch((err) => {
      console.warn("Could not delete book from local DB:", err);
    });
    
    // 3. Log deletion for cloud sync
    import("@/core/config/services").then(({ authService, remoteSyncService }) => {
      authService.getUser().then(user => {
        if (user) {
           remoteSyncService.pushChanges(user.id, {
             books: [],
             stats: [],
             deletedBookIds: [id]
           }).catch(console.warn);
        }
      });
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
    setBooks((prevBooks) => {
      const currentBook = prevBooks.find((book) => book.id === id);
      if (!currentBook) return prevBooks;

      const isCurrentlyCompleted = currentBook.status === "completed";
      const newStatus: "active" | "completed" = isCurrentlyCompleted ? "active" : "completed";
      const newProgress = isCurrentlyCompleted ? 0 : 100;

      const updatedBook = libraryService.calculateProgress(currentBook, {
        status: newStatus,
        progress: newProgress,
      });

      // Save to database asynchronously (non-blocking)
      libraryService.saveBook(updatedBook).catch((err) => {
        console.warn("Could not save toggled book:", err);
      });

      return prevBooks.map((book) => (book.id === id ? updatedBook : book));
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
