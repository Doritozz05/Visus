import { Book, BookBinary, Annotation } from "../entities/book";
import { ReadingSessionLog } from "../entities/stats";
import { toast } from "sonner";

export interface SyncAction {
  id?: number;
  type: "UPDATE_BOOK" | "DELETE_BOOK" | "UNSYNC_BOOK" | "INSERT_STAT";
  payload: any;
  timestamp: string;
}

const DB_NAME = "visus_database";
const DB_VERSION = 7;
const STORES = {
  BOOKS_METADATA: "books_metadata",
  BOOKS_BINARY: "books_binary",
  STATS: "stats_logs",
  SYNC_QUEUE: "sync_queue",
  ACHIEVEMENTS: "achievements",
  USER_ACHIEVEMENTS: "user_achievements",
  READING_LISTS: "reading_lists",
  ANNOTATIONS: "annotations",
};

class DbService {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private writeQueue: Promise<any> = Promise.resolve();

  // Enqueues transactional write operations to execute in strict sequential order,
  // preventing concurrent database race conditions in rapid operations.
  private enqueueWrite<T>(operation: () => Promise<T>): Promise<T> {
    const nextPromise = this.writeQueue.then(() => operation());
    this.writeQueue = nextPromise.catch(() => {});
    return nextPromise;
  }

  private getDb(): Promise<IDBDatabase> {
    if (typeof window === "undefined") {
      return Promise.reject(new Error("IndexedDB is only available in browser environments."));
    }

    if (this.dbPromise) {
      return this.dbPromise;
    }

    this.dbPromise = new Promise((resolve, reject) => {
      console.log(`[DbService] Opening database "${DB_NAME}" version ${DB_VERSION}...`);
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: any) => {
        const db = request.result;
        const oldVersion = event.oldVersion;
        console.log(`[DbService] Upgrading database from v${oldVersion} to v${DB_VERSION}...`);

        // Resilient store creation: check existence instead of just version blocks
        if (!db.objectStoreNames.contains(STORES.BOOKS_METADATA)) {
          const store = db.createObjectStore(STORES.BOOKS_METADATA, { keyPath: "id" });
          store.createIndex("ownerId", "ownerId", { unique: false });
        }
        
        if (!db.objectStoreNames.contains(STORES.BOOKS_BINARY)) {
          db.createObjectStore(STORES.BOOKS_BINARY, { keyPath: "bookId" });
        }
        
        if (!db.objectStoreNames.contains(STORES.STATS)) {
          db.createObjectStore(STORES.STATS, { keyPath: "id" });
        }
        
        if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
          db.createObjectStore(STORES.SYNC_QUEUE, { keyPath: "id", autoIncrement: true });
        }

        if (db.objectStoreNames.contains(STORES.BOOKS_METADATA)) {
          const transaction = event.currentTarget.transaction;
          const store = transaction.objectStore(STORES.BOOKS_METADATA);
          if (!store.indexNames.contains("ownerId")) {
            store.createIndex("ownerId", "ownerId", { unique: false });
          }
        }

        if (!db.objectStoreNames.contains(STORES.ACHIEVEMENTS)) {
          db.createObjectStore(STORES.ACHIEVEMENTS, { keyPath: "id" });
        }
        
        if (!db.objectStoreNames.contains(STORES.USER_ACHIEVEMENTS)) {
          db.createObjectStore(STORES.USER_ACHIEVEMENTS, { keyPath: ["userId", "achievementId"] });
        }

        if (!db.objectStoreNames.contains(STORES.READING_LISTS)) {
          console.log(`[DbService] Creating store "${STORES.READING_LISTS}"...`);
          const store = db.createObjectStore(STORES.READING_LISTS, { keyPath: "id" });
          store.createIndex("ownerId", "ownerId", { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.ANNOTATIONS)) {
          console.log(`[DbService] Creating store "${STORES.ANNOTATIONS}"...`);
          const store = db.createObjectStore(STORES.ANNOTATIONS, { keyPath: "id" });
          store.createIndex("bookId", "bookId", { unique: false });
          store.createIndex("chapterIndex", "chapterIndex", { unique: false });
        }
      };

      request.onsuccess = () => {
        const db = request.result;
        console.log(`[DbService] Database v${db.version} opened successfully.`);

        // Evict cached promise if connection is dropped or closed
        db.onclose = () => {
          console.warn("[DbService] Database connection closed.");
          this.dbPromise = null;
        };
        db.onversionchange = () => {
          console.warn("[DbService] Database version change detected, closing connection...");
          db.close();
          this.dbPromise = null;
          if (typeof window !== "undefined") {
            window.location.reload(); // Force reload to get newest code
          }
        };

        resolve(db);
      };

      request.onerror = () => {
        console.error("[DbService] Database open error:", request.error);
        // Handle version mismatch (e.g., cached code requesting V3 but DB is already V4)
        if (request.error?.name === "VersionError") {
          console.warn("[DbService] IndexedDB version mismatch. Forcing reload to update client code...");
          if (typeof window !== "undefined") {
            window.location.reload();
          }
        }
        this.dbPromise = null;
        reject(request.error);
      };

      request.onblocked = () => {
        console.warn("[DbService] Database upgrade blocked by other open tabs. Please close other Visus tabs.");
        toast.warning("Update blocked: please close other application tabs.");
      };
    });

    return this.dbPromise;
  }

  private async withDb<T>(operation: (db: IDBDatabase) => Promise<T>, retries = 1): Promise<T> {
    try {
      const db = await this.getDb();
      
      // Secondary check: if we are requesting a specific store, verify it exists
      // This is a safety net for cases where the DB opened but stores are missing
      return await operation(db);
    } catch (error) {
      if (error instanceof DOMException && error.name === "InvalidStateError" && retries > 0) {
        console.warn("[DbService] IndexedDB connection closed or invalid, forcing reconnect and retrying...");
        this.dbPromise = null; // Force reconnection
        return this.withDb(operation, retries - 1);
      }
      
      // If it's a NotFoundError (store missing), it might be a corrupted state
      if (error instanceof Error && error.message.includes("object stores was not found")) {
        console.error("[DbService] Missing object store detected. Attempting to force repair...");
        this.dbPromise = null;
        // One-time auto-reload might fix stuck state
        if (retries > 0) return this.withDb(operation, retries - 1);
      }
      
      throw error;
    }
  }

  // --- BOOKS METADATA STORE ACTIONS ---

  async getAllBooks(ownerId?: string): Promise<Book[]> {
    return this.withDb((db) => new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.BOOKS_METADATA, "readonly");
      const store = transaction.objectStore(STORES.BOOKS_METADATA);
      
      let request;
      if (ownerId) {
        const index = store.index("ownerId");
        request = index.getAll(ownerId);
      } else {
        request = store.getAll();
      }

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    }));
  }

  async getBook(id: string): Promise<Book | null> {
    return this.withDb((db) => new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.BOOKS_METADATA, "readonly");
      const store = transaction.objectStore(STORES.BOOKS_METADATA);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    }));
  }

  async saveBook(book: Book): Promise<void> {
    return this.enqueueWrite(() => {
      return this.withDb((db) => new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORES.BOOKS_METADATA, "readwrite");
        const store = transaction.objectStore(STORES.BOOKS_METADATA);
        // Ensure ownerId is set (fallback to 'local' if missing for backward compatibility)
        if (!book.ownerId) {
          book.ownerId = 'local';
        }
        const request = store.put(book);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }));
    });
  }

  async deleteBook(id: string): Promise<void> {
    return this.enqueueWrite(() => {
      return this.withDb((db) => new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORES.BOOKS_METADATA, "readwrite");
        const store = transaction.objectStore(STORES.BOOKS_METADATA);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }));
    });
  }

  async clearBooksByOwnerId(ownerId: string): Promise<void> {
    return this.enqueueWrite(() => {
      return this.withDb((db) => new Promise<void>((resolve, reject) => {
        const transaction = db.transaction([STORES.BOOKS_METADATA, STORES.BOOKS_BINARY], "readwrite");
        const metadataStore = transaction.objectStore(STORES.BOOKS_METADATA);
        const index = metadataStore.index("ownerId");
        
        const request = index.getAllKeys(ownerId);
        
        request.onsuccess = () => {
          const keys = request.result;
          const binaryStore = transaction.objectStore(STORES.BOOKS_BINARY);
          
          keys.forEach(key => {
            metadataStore.delete(key);
            binaryStore.delete(key);
          });
          resolve();
        };
        
        request.onerror = () => reject(request.error);
      }));
    });
  }

  async clearAllBooks(): Promise<void> {
    return this.enqueueWrite(() => {
      return this.withDb((db) => new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORES.BOOKS_METADATA, "readwrite");
        const store = transaction.objectStore(STORES.BOOKS_METADATA);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }));
    });
  }

  // --- BOOKS BINARY STORE ACTIONS ---

  async getBookBinary(bookId: string): Promise<BookBinary | null> {
    return this.withDb((db) => new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.BOOKS_BINARY, "readonly");
      const store = transaction.objectStore(STORES.BOOKS_BINARY);
      const request = store.get(bookId);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    }));
  }

  async saveBookBinary(binary: BookBinary): Promise<void> {
    return this.enqueueWrite(() => {
      return this.withDb((db) => new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORES.BOOKS_BINARY, "readwrite");
        const store = transaction.objectStore(STORES.BOOKS_BINARY);
        const request = store.put(binary);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }));
    });
  }

  async deleteBookBinary(bookId: string): Promise<void> {
    return this.enqueueWrite(() => {
      return this.withDb((db) => new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORES.BOOKS_BINARY, "readwrite");
        const store = transaction.objectStore(STORES.BOOKS_BINARY);
        const request = store.delete(bookId);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }));
    });
  }

  // --- STATS STORE ACTIONS ---

  async getAllLogs(): Promise<ReadingSessionLog[]> {
    return this.withDb((db) => new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.STATS, "readonly");
      const store = transaction.objectStore(STORES.STATS);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = () => {
        reject(request.error);
      };
    }));
  }

  async saveLog(log: ReadingSessionLog): Promise<void> {
    return this.enqueueWrite(() => {
      return this.withDb((db) => new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORES.STATS, "readwrite");
        const store = transaction.objectStore(STORES.STATS);
        const request = store.put(log);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(request.error);
        };
      }));
    });
  }

  async clearAllLogs(): Promise<void> {
    return this.enqueueWrite(() => {
      return this.withDb((db) => new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORES.STATS, "readwrite");
        const store = transaction.objectStore(STORES.STATS);
        const request = store.clear();

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(request.error);
        };
      }));
    });
  }

  // --- SYNC QUEUE STORE ACTIONS ---

  async enqueueSyncAction(action: SyncAction): Promise<void> {
    return this.enqueueWrite(() => {
      return this.withDb((db) => new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORES.SYNC_QUEUE, "readwrite");
        const store = transaction.objectStore(STORES.SYNC_QUEUE);
        const request = store.add(action);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }));
    });
  }

  async getSyncQueue(): Promise<SyncAction[]> {
    return this.withDb((db) => new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.SYNC_QUEUE, "readonly");
      const store = transaction.objectStore(STORES.SYNC_QUEUE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    }));
  }

  async removeSyncAction(id: number): Promise<void> {
    return this.enqueueWrite(() => {
      return this.withDb((db) => new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORES.SYNC_QUEUE, "readwrite");
        const store = transaction.objectStore(STORES.SYNC_QUEUE);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }));
    });
  }

  // --- ACHIEVEMENTS ACTIONS ---
  async getAllAchievements(): Promise<any[]> {
    return this.withDb((db) => new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.ACHIEVEMENTS, "readonly");
      const store = transaction.objectStore(STORES.ACHIEVEMENTS);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    }));
  }

  async saveAchievement(achievement: any): Promise<void> {
    return this.enqueueWrite(() => {
      return this.withDb((db) => new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORES.ACHIEVEMENTS, "readwrite");
        const store = transaction.objectStore(STORES.ACHIEVEMENTS);
        const request = store.put(achievement);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }));
    });
  }

  // --- USER ACHIEVEMENTS ACTIONS ---
  async getUserAchievements(userId: string): Promise<any[]> {
    return this.withDb((db) => new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.USER_ACHIEVEMENTS, "readonly");
      const store = transaction.objectStore(STORES.USER_ACHIEVEMENTS);
      const request = store.getAll();
      request.onsuccess = () => {
        const results = request.result || [];
        resolve(results.filter((ua: any) => ua.userId === userId));
      };
      request.onerror = () => reject(request.error);
    }));
  }

  async saveUserAchievement(userAchievement: any): Promise<void> {
    return this.enqueueWrite(() => {
      return this.withDb((db) => new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORES.USER_ACHIEVEMENTS, "readwrite");
        const store = transaction.objectStore(STORES.USER_ACHIEVEMENTS);
        const request = store.put(userAchievement);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }));
    });
  }

  async clearAllUserAchievements(): Promise<void> {
    return this.enqueueWrite(() => {
      return this.withDb((db) => new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORES.USER_ACHIEVEMENTS, "readwrite");
        const store = transaction.objectStore(STORES.USER_ACHIEVEMENTS);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }));
    });
  }

  // --- READING LISTS STORE ACTIONS ---

  async getAllReadingLists(ownerId: string = 'local'): Promise<any[]> {
    return this.withDb((db) => new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.READING_LISTS, "readonly");
      const store = transaction.objectStore(STORES.READING_LISTS);
      const index = store.index("ownerId");
      const request = index.getAll(ownerId);

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    }));
  }

  async saveReadingList(list: any): Promise<void> {
    return this.enqueueWrite(() => {
      return this.withDb((db) => new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORES.READING_LISTS, "readwrite");
        const store = transaction.objectStore(STORES.READING_LISTS);
        const request = store.put(list);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }));
    });
  }

  async deleteReadingList(id: string): Promise<void> {
    return this.enqueueWrite(() => {
      return this.withDb((db) => new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORES.READING_LISTS, "readwrite");
        const store = transaction.objectStore(STORES.READING_LISTS);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }));
    });
  }

  // --- ANNOTATIONS STORE ACTIONS ---

  async getAnnotationsForBook(bookId: string): Promise<Annotation[]> {
    return this.withDb((db) => new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.ANNOTATIONS, "readonly");
      const store = transaction.objectStore(STORES.ANNOTATIONS);
      const index = store.index("bookId");
      const request = index.getAll(bookId);

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    }));
  }

  async saveAnnotation(annotation: Annotation): Promise<void> {
    return this.enqueueWrite(() => {
      return this.withDb((db) => new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORES.ANNOTATIONS, "readwrite");
        const store = transaction.objectStore(STORES.ANNOTATIONS);
        const request = store.put(annotation);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }));
    });
  }

  async deleteAnnotation(id: string): Promise<void> {
    return this.enqueueWrite(() => {
      return this.withDb((db) => new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORES.ANNOTATIONS, "readwrite");
        const store = transaction.objectStore(STORES.ANNOTATIONS);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }));
    });
  }
}

export const dbService = new DbService();
