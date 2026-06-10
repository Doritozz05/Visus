import { Book, BookBinary } from "../entities/book";
import { ReadingSessionLog } from "../entities/stats";

const DB_NAME = "visus_database";
const DB_VERSION = 3;
const STORES = {
  BOOKS_METADATA: "books_metadata",
  BOOKS_BINARY: "books_binary",
  STATS: "stats_logs",
  SYNC_QUEUE: "sync_queue"
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
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: any) => {
        const db = request.result;
        const oldVersion = event.oldVersion;

        if (oldVersion < 2) {
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
        }
        
        if (oldVersion < 3) {
          // Add ownerId index to existing books_metadata store if upgrading from v2
          if (db.objectStoreNames.contains(STORES.BOOKS_METADATA)) {
            const transaction = event.currentTarget.transaction;
            const store = transaction.objectStore(STORES.BOOKS_METADATA);
            if (!store.indexNames.contains("ownerId")) {
              store.createIndex("ownerId", "ownerId", { unique: false });
            }
          }
        }
      };

      request.onsuccess = () => {
        const db = request.result;

        // Evict cached promise if connection is dropped or closed
        db.onclose = () => {
          this.dbPromise = null;
        };
        db.onversionchange = () => {
          db.close();
          this.dbPromise = null;
        };

        resolve(db);
      };

      request.onerror = () => {
        this.dbPromise = null;
        reject(request.error);
      };
    });

    return this.dbPromise;
  }

  private async withDb<T>(operation: (db: IDBDatabase) => Promise<T>, retries = 1): Promise<T> {
    try {
      const db = await this.getDb();
      return await operation(db);
    } catch (error) {
      if (error instanceof DOMException && error.name === "InvalidStateError" && retries > 0) {
        console.warn("[DbService] IndexedDB connection closed or invalid, forcing reconnect and retrying...");
        this.dbPromise = null; // Force reconnection
        return this.withDb(operation, retries - 1);
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
}

export const dbService = new DbService();
