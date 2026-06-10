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
            const lastSyncStr = localStorage.getItem(syncKey);
            const lastSyncDate = lastSyncStr ? new Date(lastSyncStr) : new Date(0);
            const now = new Date();
            
            // Reconcile strategy: 
            // - If last sync was > 7 days ago, do a FULL integrity check (Reconciliation)
            // - Otherwise, do an incremental sync using deleted_records (Performance)
            const diffDays = (now.getTime() - lastSyncDate.getTime()) / (1000 * 3600 * 24);
            const isFullReconciliation = diffDays > 7;

            const remoteChanges = await remoteSyncService.pullChanges(user.id, lastSyncDate.toISOString());

            if (isFullReconciliation) {
              // TOTAL RECONCILIATION: Verify integrity of all cloud-linked books
              const { data: remoteBooks, error: remoteBooksErr } = await (await import("@/lib/supabase")).supabase
                .from("books_metadata")
                .select("id")
                .eq("user_id", user.id);
              
              const { data: hardDeleted, error: hardDeletedErr } = await (await import("@/lib/supabase")).supabase
                .from("deleted_records")
                .select("record_id")
                .eq("user_id", user.id);

              if (!remoteBooksErr && remoteBooks) {
                const remoteIds = new Set(remoteBooks.map(b => b.id));
                const hardDeletedIds = new Set((hardDeleted || []).map(d => d.record_id));
                
                // Find local books that are marked as being in the cloud
                const cloudMarkedBooks = loadedBooks.filter(b => b.isInCloud);
                
                for (const lb of cloudMarkedBooks) {
                   // Backward compatibility: If undefined, assume it's a legacy local book
                   const isLocalOriginal = lb.isLocalOriginal !== false; 

                   if (hardDeletedIds.has(lb.id)) {
                      // 1. HARD DELETE: User meant to kill the book everywhere
                      await dbService.deleteBook(lb.id);
                      await dbService.deleteBookBinary(lb.id);
                      loadedBooks = loadedBooks.filter(b => b.id !== lb.id);
                   } else if (!remoteIds.has(lb.id)) {
                      // 2. UN-SYNC: Book removed from cloud
                      if (isLocalOriginal) {
                         // Master: Keep locally, just remove sync tag
                         const updatedBook = { ...lb, isInCloud: false, isLocalOriginal: true };
                         await dbService.saveBook(updatedBook);
                         const idx = loadedBooks.findIndex(b => b.id === lb.id);
                         if (idx >= 0) loadedBooks[idx] = updatedBook;
                      } else {
                         // Slave/Secondary: Delete completely to clean up
                         await dbService.deleteBook(lb.id);
                         await dbService.deleteBookBinary(lb.id);
                         loadedBooks = loadedBooks.filter(b => b.id !== lb.id);
                      }
                   }
                }
              }
            } else if (remoteChanges.deletedBookIds.length > 0) {
              // INCREMENTAL SYNC: Hard delete books that were explicitly put in the trash
              loadedBooks = loadedBooks.filter(b => !remoteChanges.deletedBookIds.includes(b.id));
              await Promise.all(remoteChanges.deletedBookIds.map(async (id) => {
                await dbService.deleteBook(id);
                await dbService.deleteBookBinary(id);
              }));
            }

            if (remoteChanges.books.length > 0) {
              await Promise.all(remoteChanges.books.map(async (remoteBook) => {
                remoteBook.ownerId = user.id; // Enforce ownership
                remoteBook.isLocalOriginal = false; // It came from cloud
                const existingIndex = loadedBooks.findIndex(b => b.id === remoteBook.id);

                if (existingIndex >= 0) {
                   // Preserve local original status if we already had it
                   remoteBook.isLocalOriginal = loadedBooks[existingIndex].isLocalOriginal;
                   loadedBooks[existingIndex] = remoteBook;
                } else {
                   loadedBooks.push(remoteBook);
                }
                
                await dbService.saveBook(remoteBook);
                
                // ... rest of binary download ...
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
                  // Sort to find the winner: Local Originals win first, then Cloud, then newest
                  group.sort((a, b) => {
                     if (a.isLocalOriginal && !b.isLocalOriginal) return -1;
                     if (!a.isLocalOriginal && b.isLocalOriginal) return 1;
                     if (a.isInCloud && !b.isInCloud) return -1;
                     if (!a.isInCloud && b.isInCloud) return 1;
                     return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
                  });
                  
                  const winner = group[0];
                  const losers = group.slice(1);

                  for (const loser of losers) {
                     // Transfer original status to winner if loser was an original
                     if (loser.isLocalOriginal) winner.isLocalOriginal = true;

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

  // 2. Realtime Sync Subscription
  React.useEffect(() => {
    if (!user || !isHydrated) return;

    const setupRealtime = async () => {
      const { supabase } = await import("@/lib/supabase");
      const { SupabaseSyncService } = await import("@/lib/services/supabase-sync-service");
      const { dbService } = await import("@/core/services/db-service");
      const { remoteStorageService } = await import("@/core/config/services");

      const channel = supabase
        .channel(`library_changes_${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'books_metadata',
            filter: `user_id=eq.${user.id}`,
          },
          async (payload) => {
            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
              const remoteBook = SupabaseSyncService.mapRowToBook(payload.new);
              
              // Only process if it's marked as in cloud (STRICT SYNC)
              if (!remoteBook.isInCloud) return;

              setBooks((prev) => {
                const existingIndex = prev.findIndex(b => b.id === remoteBook.id);
                
                if (existingIndex >= 0) {
                  const localBook = prev[existingIndex];
                  // Keep our local original status
                  remoteBook.isLocalOriginal = localBook.isLocalOriginal;

                  const remoteDate = new Date(remoteBook.updatedAt || 0).getTime();
                  const localDate = new Date(localBook.updatedAt || 0).getTime();
                  
                  if (remoteDate <= localDate) return prev; // Local is newer or same
                  
                  const newBooks = [...prev];
                  newBooks[existingIndex] = remoteBook;
                  return newBooks;
                }
                
                // If it's new to us, it's definitely not a local original
                remoteBook.isLocalOriginal = false;
                return [remoteBook, ...prev];
              });

              // Persist to local DB
              await dbService.saveBook(remoteBook);

              // Auto-download binary if missing
              if (remoteBook.format !== "PHYSICAL") {
                const binary = await dbService.getBookBinary(remoteBook.id);
                if (!binary || !binary.fileBlob) {
                  try {
                    const fileBlob = await remoteStorageService.downloadBookFile(user.id, remoteBook.id);
                    await libraryService.ingestRemoteBinary(remoteBook, fileBlob);
                  } catch (err) {
                    console.warn("Realtime binary download failed:", err);
                  }
                }
              }
            } else if (payload.eventType === 'DELETE') {
              const deletedId = payload.old.id;
              
              setBooks((prev) => {
                const localBook = prev.find(b => b.id === deletedId);
                
                if (localBook?.isLocalOriginal) {
                  // I AM THE MASTER: Keep it locally, just remove cloud tag
                  return prev.map(b => b.id === deletedId ? { ...b, isInCloud: false } : b);
                } else {
                  // I AM A SLAVE/SECONDARY: Delete it completely
                  return prev.filter(b => b.id !== deletedId);
                }
              });

              const localBook = await dbService.getBook(deletedId);
              if (localBook) {
                if (localBook.isLocalOriginal) {
                  await dbService.saveBook({ ...localBook, isInCloud: false });
                } else {
                  await dbService.deleteBook(deletedId);
                  await dbService.deleteBookBinary(deletedId);
                }
              }
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'deleted_records',
            filter: `user_id=eq.${user.id}`,
          },
          async (payload) => {
            const deletedId = payload.new.record_id;
            // HARD DELETE: Explicit trash icon action
            setBooks((prev) => prev.filter(b => b.id !== deletedId));
            await dbService.deleteBook(deletedId);
            await dbService.deleteBookBinary(deletedId);
          }
        )
        .subscribe();

      return channel;
    };

    const channelPromise = setupRealtime();

    return () => {
      channelPromise.then(channel => {
        if (channel) channel.unsubscribe();
      });
    };
  }, [user, isHydrated]);

  // 3. Persist activeBookId to localStorage on change
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

      if (user && updatedBook.isInCloud) {
        import("@/core/config/services").then(({ remoteSyncService }) => {
          remoteSyncService.pushChanges(user.id, {
            books: [updatedBook],
            stats: [],
            deletedBookIds: []
          }).catch(console.warn);
        });
      }

      return prevBooks.map((book) => (book.id === id ? updatedBook : book));
    });
  }, [user]);

  const deleteBook = React.useCallback((id: string) => {
    setBooks((prev) => {
      const bookToDelete = prev.find(b => b.id === id);
      
      if (user && bookToDelete?.isInCloud) {
        import("@/core/config/services").then(({ remoteStorageService, remoteSyncService }) => {
          // 1. Delete file from storage
          remoteStorageService.deleteBookFile(user.id, id).catch(console.warn);
          
          // 2. Notify cloud about deletion
          remoteSyncService.pushChanges(user.id, {
            books: [],
            stats: [],
            deletedBookIds: [id]
          }).catch(console.warn);
        });
      }
      return prev.filter((book) => book.id !== id);
    });

    libraryService.deleteBook(id).catch((err) => {
      console.warn("Could not delete book from local DB:", err);
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