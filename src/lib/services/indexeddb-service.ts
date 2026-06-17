/**
 * @file indexeddb-service.ts
 * @description Centralized IndexedDB connection and configuration for Visus local storage.
 * Provides a modular base for other services like font-storage and image-storage.
 */

const DB_NAME = "visus_local_db";
const DB_VERSION = 1;

export const STORE_NAMES = {
  FONTS: "custom_fonts",
  IMAGES: "custom_images",
} as const;

/**
 * Initializes and returns a connection to the global IndexedDB.
 * Manages database migrations and object store creation.
 */
export function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is only available in browser environments with IndexedDB support"));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Store for custom typography fonts (migrated from legacy local db)
      if (!db.objectStoreNames.contains(STORE_NAMES.FONTS)) {
        db.createObjectStore(STORE_NAMES.FONTS, { keyPath: "id" });
      }

      // Store for heavy image assets like custom theme 4k backgrounds
      if (!db.objectStoreNames.contains(STORE_NAMES.IMAGES)) {
        db.createObjectStore(STORE_NAMES.IMAGES, { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error || new Error("Failed to open global IndexedDB"));
    };
  });
}
