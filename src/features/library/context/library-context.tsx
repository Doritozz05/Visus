"use client";

import * as React from "react";
import { Book, DEFAULT_BOOKS, BookChapter } from "@/core/entities/book";
import { libraryService, ACTIVE_BOOK_KEY } from "@/core/services/library-service";
import { useAuth } from "@/features/auth/context/auth-context";

interface LibraryContextType {
  books: Book[];
  activeBookId: string | null;
  isHydrated: boolean;
  isInitialSyncing: boolean;
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
    fileBlob?: Blob,
    fileHash?: string
  ) => string | null;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  toggleCompleted: (id: string) => void;
  resetLibrary: () => void;
}

const LibraryContext = React.createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [books, setBooks] = React.useState<Book[]>([]);
  const [activeBookId, setActiveBookIdState] = React.useState<string | null>(null);
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [isInitialSyncing, setIsInitialSyncing] = React.useState(false);

  // 1. Hydrate state and handle auth-driven sync & migrations
  React.useEffect(() => {
    if (isAuthLoading) return; // Wait for auth to settle

    const hydrate = async () => {
      try {
        const ownerId = user ? user.id : 'local';
        let loadedBooks = await libraryService.loadLibrary(ownerId);

        if (user) {
          setIsInitialSyncing(true);
          try {
            const { dbService } = await import("@/core/services/db-service");
            const { remoteSyncService, remoteStorageService } = await import("@/core/config/services");

            // 1. Migrate any local unauthenticated books to the cloud user
            const localBooks = await libraryService.loadLibrary('local');
            if (localBooks && localBooks.length > 0) {
              await Promise.all(localBooks.map(async (lb) => {
                const migratedBook = { ...lb, ownerId: user.id };
                await dbService.saveBook(migratedBook);
              }));
              await dbService.clearBooksByOwnerId('local');
              // Reload to get merged list
              loadedBooks = await libraryService.loadLibrary(user.id);
            }

            // 2. Pull remote changes from cloud using user-specific timestamp
            const syncKey = `visus_last_sync_${user.id}`;
            const lastSync = localStorage.getItem(syncKey) || new Date(0).toISOString();
            const remoteChanges = await remoteSyncService.pullChanges(user.id, lastSync);

            if (remoteChanges.books.length > 0 || remoteChanges.deletedBookIds.length > 0) {
              // Apply deletions
              loadedBooks = loadedBooks.filter(b => !remoteChanges.deletedBookIds.includes(b.id));

              await Promise.all(remoteChanges.books.map(async (remoteBook) => {
                remoteBook.ownerId = user.id; // Enforce ownership
                const existingIndex = loadedBooks.findIndex(b => b.id === remoteBook.id);

                if (existingIndex >= 0) {
                   loadedBooks[existingIndex] = remoteBook;
                } else {
                   loadedBooks.push(remoteBook);
                }
                
                await dbService.saveBook(remoteBook);

                // Download missing binary for newly synced cloud books
                if (remoteBook.format !== "PHYSICAL" && remoteBook.isInCloud) {
                   const binary = await dbService.getBookBinary(remoteBook.id);
                   if (!binary || !binary.fileBlob) {
                      try {
                        const fileBlob = await remoteStorageService.downloadBookFile(user.id, remoteBook.id);
                        await libraryService.ingestRemoteBinary(remoteBook, fileBlob);
                      } catch (downloadErr) {
                        console.warn("Auto-download binary failed for", remoteBook.id, downloadErr);
                      }
                   }
                }
              }));
              localStorage.setItem(syncKey, new Date().toISOString());
            }

            // 3. Deduplication pass by fileHash
            const hashGroups = new Map<string, Book[]>();
            for (const b of loadedBooks) {
               if (b.fileHash) {
                   if (!hashGroups.has(b.fileHash)) hashGroups.set(b.fileHash, []);
                   hashGroups.get(b.fileHash)!.push(b);
               }
            }

            for (const [hash, group] of hashGroups.entries()) {
               if (group.length > 1) {
                  // Sort to find the winner: Cloud wins first, then newest updatedAt
                  group.sort((a, b) => {
                     if (a.isInCloud && !b.isInCloud) return -1;
                     if (!a.isInCloud && b.isInCloud) return 1;
                     return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
                  });
                  
                  const winner = group[0];
                  const losers = group.slice(1);

                  for (const loser of losers) {
                     const winnerBinary = await dbService.getBookBinary(winner.id);
                     if (!winnerBinary || !winnerBinary.fileBlob) {
                        const loserBinary = await dbService.getBookBinary(loser.id);
                        if (loserBinary && loserBinary.fileBlob) {
                           loserBinary.bookId = winner.id;
                           await dbService.saveBookBinary(loserBinary);
                        }
                     }
                     
                     await dbService.deleteBook(loser.id);
                     await dbService.deleteBookBinary(loser.id);
                     loadedBooks = loadedBooks.filter(b => b.id !== loser.id);
                  }
               }
            }
          } catch (syncErr) {
            console.warn("Background auto-sync failed:", syncErr);
          } finally {
            setIsInitialSyncing(false);
          }
        }

        setBooks([...loadedBooks]);

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
  }, [user, isAuthLoading]);

  // 2. Persist activeBookId to localStorage on change
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
    fileBlob?: Blob,
    fileHash?: string
  ) => {
    // Duplicate Check
    if (fileHash) {
      const isDuplicate = books.some(b => b.fileHash === fileHash);
      if (isDuplicate) {
        return null;
      }
    }

    const ownerId = user ? user.id : 'local';

    const newBook = libraryService.createBookEntity({
      title,
      author,
      format,
      content,
      chapters,
      metadata,
      ownerId,
    });
    
    if (fileHash) {
      newBook.fileHash = fileHash;
    }

    setBooks((prev) => [newBook, ...prev]);

    // Create binary data if we have content or a file
    const binary = libraryService.createBookBinary(newBook.id, {
      title,
      author,
      format,
      content,
      chapters,
    }, fileBlob);

    // Save to database asynchronously
    libraryService.saveBook(newBook, binary).catch((err) => {
      console.warn("Could not save new book:", err);
    });

    return newBook.id;
  }, [user, books]);

  const updateBook = React.useCallback((id: string, updates: Partial<Book>) => {
    setBooks((prevBooks) => {
      const currentBook = prevBooks.find((book) => book.id === id);
      if (!currentBook) return prevBooks;

      const updatedBook = libraryService.calculateProgress(currentBook, updates);

      let bookChanged = false;
      for (const key in updates) {
        const k = key as keyof Book;
        if (currentBook[k] !== updatedBook[k]) {
          bookChanged = true;
          break;
        }
      }
      
      if (
        currentBook.status !== updatedBook.status ||
        currentBook.progress !== updatedBook.progress ||
        currentBook.estimatedReadingTime !== updatedBook.estimatedReadingTime
      ) {
        bookChanged = true;
      }

      if (!bookChanged) return prevBooks;

      libraryService.saveBook(updatedBook).catch((err) => {
        console.warn("Could not save updated book:", err);
      });

      return prevBooks.map((book) => (book.id === id ? updatedBook : book));
    });
  }, []);

  const deleteBook = React.useCallback((id: string) => {
    setBooks((prev) => {
      const bookToDelete = prev.find(b => b.id === id);
      
      if (bookToDelete?.isInCloud && user) {
        import("@/core/config/services").then(({ remoteStorageService }) => {
          remoteStorageService.deleteBookFile(user.id, id).catch(console.warn);
        });
      }
      return prev.filter((book) => book.id !== id);
    });

    libraryService.deleteBook(id).catch((err) => {
      console.warn("Could not delete book from local DB:", err);
    });
    
    if (user) {
      import("@/core/config/services").then(({ remoteSyncService }) => {
         remoteSyncService.pushChanges(user.id, {
           books: [],
           stats: [],
           deletedBookIds: [id]
         }).catch(console.warn);
      });
    }

    setActiveBookIdState((prevActiveId) => {
      if (prevActiveId === id) {
        try {
          localStorage.removeItem(ACTIVE_BOOK_KEY);
        } catch (_) {}
        return null;
      }
      return prevActiveId;
    });
  }, [user]);

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

      libraryService.saveBook(updatedBook).catch((err) => {
        console.warn("Could not save toggled book:", err);
      });

      return prevBooks.map((book) => (book.id === id ? updatedBook : book));
    });
  }, []);

  const resetLibrary = React.useCallback(() => {
    setBooks(DEFAULT_BOOKS);
    setActiveBookId(null);

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
        isInitialSyncing,
        setActiveBookId,
        addBook,
        updateBook,
        deleteBook,
        toggleCompleted,
        resetLibrary,
      }}
    >
      {/* Optional built-in blocking overlay can be added here or handled by consumers checking isInitialSyncing */}
      {isInitialSyncing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 font-mono text-sm uppercase tracking-wider text-muted-foreground animate-pulse">Synchronizing Library...</p>
        </div>
      )}
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