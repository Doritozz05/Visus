import type { CustomFont } from "@/lib/typography";

const DB_NAME = "visus_fonts";
const STORE_NAME = "custom_fonts";
const DB_VERSION = 1;

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is only available in browser environments with IndexedDB support"));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error || new Error("Failed to open IndexedDB"));
    };
  });
}

export async function saveCustomFont(name: string, file: File): Promise<CustomFont> {
  // Convert file to Base64
  const dataBase64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Extract base64 part
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error || new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

  const id = `font-custom-${Date.now()}`;
  const customFont: CustomFont = {
    id,
    name: name.trim(),
    fileName: file.name,
    fileType: file.type || "font/ttf",
    dataBase64,
    fileSize: file.size,
  };

  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(customFont);

    request.onsuccess = () => {
      resolve(customFont);
    };

    request.onerror = () => {
      reject(request.error || new Error("Failed to save custom font"));
    };
  });
}

export async function getCustomFonts(): Promise<CustomFont[]> {
  try {
    // Avoid SSR issues
    if (typeof window === "undefined") {
      return [];
    }

    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = () => {
        reject(request.error || new Error("Failed to load custom fonts"));
      };
    });
  } catch (err) {
    // Don't log if it's just a missing IndexedDB in a test environment (noise reduction)
    const isMissingIndexedDB = err instanceof Error && err.message.includes("IndexedDB is only available in browser");
    if (process.env.NODE_ENV !== "test" || !isMissingIndexedDB) {
      console.warn("Could not load custom fonts from IndexedDB:", err);
    }
    return [];
  }
}

export async function deleteCustomFont(id: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error || new Error("Failed to delete custom font"));
    };
  });
}
