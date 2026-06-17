/**
 * @file image-storage.ts
 * @description Service for storing and retrieving heavy image assets (like 4K backgrounds) using IndexedDB.
 * Leverages native Blob storage for maximum performance and to avoid localStorage quota limits.
 */

import { getDB, STORE_NAMES } from "./indexeddb-service";

export interface CustomImage {
  id: string;
  fileName: string;
  fileType: string;
  data: Blob;
  fileSize: number;
  createdAt: number;
}

export const IDB_IMAGE_PREFIX = "idb://";

/**
 * Saves an image File/Blob natively into IndexedDB.
 * @param file The image file or blob to save.
 * @returns A unique identifier prefixed with `idb://` representing the image.
 */
export async function saveBackgroundImage(file: File | Blob): Promise<string> {
  const id = `${IDB_IMAGE_PREFIX}bg-${Date.now()}`;
  
  const fileName = file instanceof File ? file.name : `bg-${Date.now()}.webp`;
  
  const customImage: CustomImage = {
    id,
    fileName,
    fileType: file.type || "image/webp",
    data: file, // Store the blob natively
    fileSize: file.size,
    createdAt: Date.now()
  };

  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAMES.IMAGES, "readwrite");
    const store = transaction.objectStore(STORE_NAMES.IMAGES);
    const request = store.put(customImage);

    request.onsuccess = () => resolve(id);
    request.onerror = () => reject(request.error || new Error("Failed to save background image"));
  });
}

/**
 * Retrieves the raw Blob of a saved image from IndexedDB.
 * @param id The unique identifier of the image.
 * @returns The image Blob or null if not found.
 */
export async function getBackgroundImageBlob(id: string): Promise<Blob | null> {
  try {
    if (typeof window === "undefined") return null;

    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAMES.IMAGES, "readonly");
      const store = transaction.objectStore(STORE_NAMES.IMAGES);
      const request = store.get(id);

      request.onsuccess = () => {
        const result = request.result as CustomImage | undefined;
        resolve(result?.data || null);
      };

      request.onerror = () => {
        reject(request.error || new Error("Failed to load background image"));
      };
    });
  } catch (err) {
    console.warn("Could not load background image from IndexedDB:", err);
    return null;
  }
}

/**
 * Retrieves a locally created Object URL (`blob:http...`) for a saved image.
 * Remember to call `URL.revokeObjectURL()` when the URL is no longer needed to prevent memory leaks.
 * @param id The unique identifier of the image.
 * @returns A blob URL string, or null if the image was not found.
 */
export async function getBackgroundImageUrl(id: string): Promise<string | null> {
  const blob = await getBackgroundImageBlob(id);
  if (!blob) return null;
  return URL.createObjectURL(blob);
}

/**
 * Deletes an image from IndexedDB.
 * @param id The unique identifier of the image to delete.
 */
export async function deleteBackgroundImage(id: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAMES.IMAGES, "readwrite");
    const store = transaction.objectStore(STORE_NAMES.IMAGES);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error || new Error("Failed to delete background image"));
  });
}
