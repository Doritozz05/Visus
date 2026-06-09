import { Book, BookBinary } from "../entities/book";
import { ReadingSessionLog } from "../entities/stats";

const DB_NAME = "visus_database";
const DB_VERSION = 2;
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
          // If we come from v1, we could migrate, but for simplicity
          // and to align with the new offline-first architecture:
          if (!db.objectStoreNames.contains(STORES.BOOKS_METADATA)) {
            db.createObjectStore(STORES.BOOKS_METADATA, { keyPath: "id" });
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
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        this.dbPromise = null;
        reject(request.error);
      };
    });

    return this.dbPromise;
  }

  // --- BOOKS METADATA STORE ACTIONS ---

  async getAllBooks(): Promise<Book[]> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.BOOKS_METADATA, "readonly");
      const store = transaction.objectStore(STORES.BOOKS_METADATA);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async saveBook(book: Book): Promise<void> {
    return this.enqueueWrite(async () => {
      const db = await this.getDb();
      return new Promise<void>((resolve, reject) => {
        try {
          const transaction = db.transaction(STORES.BOOKS_METADATA, "readwrite");
          const store = transaction.objectStore(STORES.BOOKS_METADATA);
          const request = store.put(book);

          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        } catch (error) {
          if (error instanceof DOMException && error.name === "InvalidStateError") {
            resolve();
          } else {
            reject(error);
          }
        }
      });
    });
  }

  async deleteBook(id: string): Promise<void> {
    return this.enqueueWrite(async () => {
      const db = await this.getDb();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORES.BOOKS_METADATA, "readwrite");
        const store = transaction.objectStore(STORES.BOOKS_METADATA);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });
  }

  async clearAllBooks(): Promise<void> {
    return this.enqueueWrite(async () => {
      const db = await this.getDb();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORES.BOOKS_METADATA, "readwrite");
        const store = transaction.objectStore(STORES.BOOKS_METADATA);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });
  }

  // --- BOOKS BINARY STORE ACTIONS ---

  async getBookBinary(bookId: string): Promise<BookBinary | null> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.BOOKS_BINARY, "readonly");
      const store = transaction.objectStore(STORES.BOOKS_BINARY);
      const request = store.get(bookId);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async saveBookBinary(binary: BookBinary): Promise<void> {
    return this.enqueueWrite(async () => {
      const db = await this.getDb();
      return new Promise<void>((resolve, reject) => {
        try {
          const transaction = db.transaction(STORES.BOOKS_BINARY, "readwrite");
          const store = transaction.objectStore(STORES.BOOKS_BINARY);
          const request = store.put(binary);

          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        } catch (error) {
          if (error instanceof DOMException && error.name === "InvalidStateError") {
            resolve();
          } else {
            reject(error);
          }
        }
      });
    });
  }

  async deleteBookBinary(bookId: string): Promise<void> {
    return this.enqueueWrite(async () => {
      const db = await this.getDb();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORES.BOOKS_BINARY, "readwrite");
        const store = transaction.objectStore(STORES.BOOKS_BINARY);
        const request = store.delete(bookId);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });
  }

  // --- STATS STORE ACTIONS ---

  async getAllLogs(): Promise<ReadingSessionLog[]> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.STATS, "readonly");
      const store = transaction.objectStore(STORES.STATS);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async saveLog(log: ReadingSessionLog): Promise<void> {
    return this.enqueueWrite(async () => {
      const db = await this.getDb();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORES.STATS, "readwrite");
        const store = transaction.objectStore(STORES.STATS);
        const request = store.put(log);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    });
  }

  async clearAllLogs(): Promise<void> {
    return this.enqueueWrite(async () => {
      const db = await this.getDb();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORES.STATS, "readwrite");
        const store = transaction.objectStore(STORES.STATS);
        const request = store.clear();

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    });
  }
}

export const dbService = new DbService();
