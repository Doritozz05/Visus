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
  forceSync: () => Promise<void>;
}

const LibraryContext = React.createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: isAuthLoading, isMfaPending } = useAuth();
  const [books, setBooks] = React.useState<Book[]>([]);
  const booksRef = React.useRef<Book[]>(books);
  const [activeBookId, setActiveBookIdState] = React.useState<string | null>(null);

  const [isHydrated, setIsHydrated] = React.useState(false);
  const [isInitialSyncing, setIsInitialSyncing] = React.useState(false);
  const inFlightHashes = React.useRef<Set<string>>(new Set());
  const inFlightTitles = React.useRef<Set<string>>(new Set());

  // Sync booksRef and clean up in-flight hashes/titles atomically when books state changes
  React.useEffect(() => {
    booksRef.current = books;
    
    let changed = false;
    
    if (inFlightHashes.current.size > 0) {
      for (const hash of inFlightHashes.current) {
        if (books.some(b => b.fileHash === hash)) {
          inFlightHashes.current.delete(hash);
          changed = true;
        }
      }
    }
    
    if (inFlightTitles.current.size > 0) {
      for (const title of inFlightTitles.current) {
        if (books.some(b => b.title.toLowerCase().trim() === title)) {
          inFlightTitles.current.delete(title);
          changed = true;
        }
      }
    }
    
    if (changed) {
      console.debug("[LibraryContext] In-flight tracking updated, remaining hashes:", inFlightHashes.current.size, "remaining titles:", inFlightTitles.current.size);
    }
  }, [books]);

  const processSyncQueue = React.useCallback(async () => {
    if (!user || isMfaPending || !navigator.onLine) return;
    
    const { dbService } = await import("@/core/services/db-service");
    const { remoteSyncService } = await import("@/core/config/services");
    
    const queue = await dbService.getSyncQueue();
    if (queue.length === 0) return;

    console.log(`[SyncQueue] Processing ${queue.length} pending actions...`);

    for (const action of queue) {
      try {
        if (action.type === "UPDATE_BOOK") {
          await remoteSyncService.pushChanges(user.id, {
            books: [action.payload],
            stats: [],
            deletedBookIds: []
          });
        } else if (action.type === "DELETE_BOOK") {
          await remoteSyncService.pushChanges(user.id, {
            books: [],
            stats: [],
            deletedBookIds: [action.payload]
          });
        } else if (action.type === "UNSYNC_BOOK") {
          const { supabase } = await import("@/lib/supabase");
          await supabase
            .from("books_metadata")
            .delete()
            .eq("id", action.payload)
            .eq("user_id", user.id);
        }
        
        if (action.id !== undefined) {
          await dbService.removeSyncAction(action.id);
        }
      } catch (err) {
        console.warn("[SyncQueue] Failed to process action, will retry later:", err);
        break; 
      }
    }
  }, [user, isMfaPending]);

  const performSync = React.useCallback(async (forceFull = false) => {
    if (isAuthLoading || isMfaPending) return;
    
    const ownerId = (user && !isMfaPending) ? user.id : 'local';
    let loadedBooks = await libraryService.loadLibrary(ownerId);

    if (user && !isMfaPending) {
      setIsInitialSyncing(true);
      try {
        const { dbService } = await import("@/core/services/db-service");
        const { remoteSyncService, remoteStorageService } = await import("@/core/config/services");

        // 1. Migrate any local unauthenticated books
        const localBooks = await libraryService.loadLibrary('local');
        if (localBooks && localBooks.length > 0) {
          await Promise.all(localBooks.map(async (lb) => {
            const migratedBook = { ...lb, ownerId: user.id };
            await dbService.saveBook(migratedBook);
          }));
          await dbService.clearBooksByOwnerId('local');
          loadedBooks = await libraryService.loadLibrary(user.id);
        }

        // 2. Pull remote changes
        const syncKey = `visus_last_sync_${user.id}`;
        const lastSyncStr = forceFull ? null : localStorage.getItem(syncKey);
        const lastSyncDate = lastSyncStr ? new Date(lastSyncStr) : new Date(0);
        const now = new Date();
        
        const diffDays = (now.getTime() - lastSyncDate.getTime()) / (1000 * 3600 * 24);
        const isFullReconciliation = forceFull || diffDays > 7;

        const remoteChanges = await remoteSyncService.pullChanges(user.id, lastSyncDate.toISOString());

        if (isFullReconciliation) {
          const { data: remoteBooks, error: remoteBooksErr } = await (await import("@/lib/supabase")).supabase
            .from("books_metadata")
            .select("id")
            .eq("user_id", user.id);
          
          const { data: hardDeleted } = await (await import("@/lib/supabase")).supabase
            .from("deleted_records")
            .select("record_id")
            .eq("user_id", user.id);

          if (!remoteBooksErr && remoteBooks) {
            const remoteIds = new Set(remoteBooks.map(b => b.id));
            const hardDeletedIds = new Set((hardDeleted || []).map(d => d.record_id));
            
            const cloudMarkedBooks = loadedBooks.filter(b => b.isInCloud);
            
            for (const lb of cloudMarkedBooks) {
               const isLocalOriginal = lb.isLocalOriginal !== false; 

               if (hardDeletedIds.has(lb.id)) {
                  await dbService.deleteBook(lb.id);
                  await dbService.deleteBookBinary(lb.id);
                  loadedBooks = loadedBooks.filter(b => b.id !== lb.id);
               } else if (!remoteIds.has(lb.id)) {
                  if (isLocalOriginal) {
                     const updatedBook = { ...lb, isInCloud: false, isLocalOriginal: true };
                     await dbService.saveBook(updatedBook);
                     const idx = loadedBooks.findIndex(b => b.id === lb.id);
                     if (idx >= 0) loadedBooks[idx] = updatedBook;
                  } else {
                     await dbService.deleteBook(lb.id);
                     await dbService.deleteBookBinary(lb.id);
                     loadedBooks = loadedBooks.filter(b => b.id !== lb.id);
                  }
               }
            }
          }
        } else if (remoteChanges.deletedBookIds.length > 0) {
          loadedBooks = loadedBooks.filter(b => !remoteChanges.deletedBookIds.includes(b.id));
          await Promise.all(remoteChanges.deletedBookIds.map(async (id) => {
            await dbService.deleteBook(id);
            await dbService.deleteBookBinary(id);
          }));
        }

        if (remoteChanges.books.length > 0) {
          await Promise.all(remoteChanges.books.map(async (remoteBook) => {
            remoteBook.ownerId = user.id; 
            remoteBook.isLocalOriginal = false; 
            const existingIndex = loadedBooks.findIndex(b => b.id === remoteBook.id);

            if (existingIndex >= 0) {
               remoteBook.isLocalOriginal = loadedBooks[existingIndex].isLocalOriginal;
               loadedBooks[existingIndex] = remoteBook;
            } else {
               loadedBooks.push(remoteBook);
            }
            
            await dbService.saveBook(remoteBook);
            
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

        const hashGroups = new Map<string, Book[]>();
        for (const b of loadedBooks) {
           if (b.fileHash) {
               if (!hashGroups.has(b.fileHash)) hashGroups.set(b.fileHash, []);
               hashGroups.get(b.fileHash)!.push(b);
           }
        }

        for (const [hash, group] of hashGroups.entries()) {
           if (group.length > 1) {
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
        
        await processSyncQueue();

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
    setIsHydrated(true);
  }, [user, isAuthLoading, isMfaPending, processSyncQueue]);

  const [isOnline, setIsOnline] = React.useState(typeof window !== 'undefined' ? window.navigator.onLine : true);

  // 2. Online/Offline Monitoring
  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log("[SyncQueue] Device is back online.");
    };
    const handleOffline = () => {
      setIsOnline(false);
      console.log("[SyncQueue] Device is offline.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // 3. Reactive Sync Queue Processing
  React.useEffect(() => {
    if (isOnline && user && !isMfaPending && isHydrated) {
      // Small delay to let network stabilize and auth refresh if needed
      const timer = setTimeout(() => {
        processSyncQueue();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, user, isMfaPending, isHydrated, processSyncQueue]);

  const forceSync = React.useCallback(async () => {
    await performSync(true);
  }, [performSync]);

  // 1. Hydrate state and handle auth-driven sync & migrations
  React.useEffect(() => {
    performSync();
  }, [user, isAuthLoading, performSync]);

  // 3. Realtime Sync Subscription
  React.useEffect(() => {
    if (!user || isMfaPending || !isHydrated) return;

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
  }, [user, isMfaPending, isHydrated]);

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
    const normalizedTitle = title.toLowerCase().trim();
    
    // Primary Duplicate Check (Hash-based)
    const isDuplicateByHash = fileHash && (
      booksRef.current.some(b => b.fileHash === fileHash) || 
      inFlightHashes.current.has(fileHash)
    );

    // Fallback Duplicate Check (Title-based) to catch missing hashes in batch ingestion
    const isDuplicateByTitle = !isDuplicateByHash && (
      booksRef.current.some(b => b.title.toLowerCase().trim() === normalizedTitle) ||
      inFlightTitles.current.has(normalizedTitle)
    );

    if (isDuplicateByHash || isDuplicateByTitle) {
      return null;
    }

    // Register in-flight signatures to block subsequent duplicates in the same batch
    if (fileHash) {
      inFlightHashes.current.add(fileHash);
    }
    inFlightTitles.current.add(normalizedTitle);

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

    setBooks((prev) => {
      // Final sanity check before state commit
      if (
        (fileHash && prev.some(b => b.fileHash === fileHash)) ||
        prev.some(b => b.title.toLowerCase().trim() === normalizedTitle)
      ) {
        console.warn("[LibraryContext] Duplicate book detected in setBooks functional update:", title);
        return prev;
      }
      return [newBook, ...prev];
    });

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
  }, [user]);

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

      const timestamp = new Date().toISOString();
      const finalBook = { ...updatedBook, updatedAt: timestamp };

      libraryService.saveBook(finalBook).catch((err) => {
        console.warn("Could not save updated book:", err);
      });

      if (user && finalBook.isInCloud) {
        import("@/core/config/services").then(({ remoteSyncService }) => {
          remoteSyncService.pushChanges(user.id, {
            books: [finalBook],
            stats: [],
            deletedBookIds: []
          }).catch(async (pushErr) => {
            console.warn("Could not push update, adding to sync queue:", pushErr);
            const { dbService } = await import("@/core/services/db-service");
            await dbService.enqueueSyncAction({
              type: "UPDATE_BOOK",
              payload: finalBook,
              timestamp: timestamp
            });
          });
        });
      }

      return prevBooks.map((book) => (book.id === id ? finalBook : book));
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
          }).catch(async (pushErr) => {
             console.warn("Could not push deletion, adding to sync queue:", pushErr);
             const { dbService } = await import("@/core/services/db-service");
             await dbService.enqueueSyncAction({
               type: "DELETE_BOOK",
               payload: id,
               timestamp: new Date().toISOString()
             });
          });
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

      const timestamp = new Date().toISOString();
      const finalBook = { ...updatedBook, updatedAt: timestamp };

      libraryService.saveBook(finalBook).catch((err) => {
        console.warn("Could not save toggled book:", err);
      });

      if (user && finalBook.isInCloud) {
        import("@/core/config/services").then(({ remoteSyncService }) => {
           remoteSyncService.pushChanges(user.id, {
             books: [finalBook],
             stats: [],
             deletedBookIds: []
           }).catch(async () => {
              const { dbService } = await import("@/core/services/db-service");
              await dbService.enqueueSyncAction({
                type: "UPDATE_BOOK",
                payload: finalBook,
                timestamp: timestamp
              });
           });
        });
      }

      return prevBooks.map((book) => (book.id === id ? finalBook : book));
    });
  }, [user]);

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
        forceSync
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