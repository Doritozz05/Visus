import { Book } from "../entities/book";
import { ReadingSessionLog } from "../entities/stats";

const DB_NAME = "visus_database";
const DB_VERSION = 1;
const STORES = {
  BOOKS: "books",
  STATS: "stats"
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

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORES.BOOKS)) {
          db.createObjectStore(STORES.BOOKS, { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains(STORES.STATS)) {
          db.createObjectStore(STORES.STATS, { keyPath: "id" });
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

  // --- BOOKS STORE ACTIONS ---

  async getAllBooks(): Promise<Book[]> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.BOOKS, "readonly");
      const store = transaction.objectStore(STORES.BOOKS);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async saveBook(book: Book): Promise<void> {
    return this.enqueueWrite(async () => {
      const db = await this.getDb();
      return new Promise<void>((resolve, reject) => {
        try {
          const transaction = db.transaction(STORES.BOOKS, "readwrite");
          const store = transaction.objectStore(STORES.BOOKS);
          const request = store.put(book);

          request.onsuccess = () => {
            resolve();
          };

          request.onerror = () => {
            reject(request.error);
          };
        } catch (error) {
          if (error instanceof DOMException && error.name === "InvalidStateError") {
            // DB is closing (e.g. tab closed), fail silently
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
        const transaction = db.transaction(STORES.BOOKS, "readwrite");
        const store = transaction.objectStore(STORES.BOOKS);
        const request = store.delete(id);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    });
  }

  async clearAllBooks(): Promise<void> {
    return this.enqueueWrite(async () => {
      const db = await this.getDb();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORES.BOOKS, "readwrite");
        const store = transaction.objectStore(STORES.BOOKS);
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
