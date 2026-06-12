import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Dynamically combines Tailwind CSS classes, resolving collisions intelligently.
 * It is a fundamental dependency for variant composition in Shadcn UI components.
 * 
 * @param inputs - List or array of optional class names, booleans, or objects.
 * @returns Clean and optimized string of unified classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculates a SHA-256 hash for a given Blob (e.g., File upload).
 * Used for deduplication in the synchronization system.
 * 
 * @param file - The Blob or File object to hash
 * @returns A hex string representing the SHA-256 hash
 */
export async function calculateFileHash(file: Blob): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

/**
 * Calculates a SHA-256 hash for a given text string.
 * Used for irreversible hashing of book titles in anonymous telemetry mode.
 * 
 * @param text - The string to hash
 * @returns A hex string representing the SHA-256 hash
 */
export async function hashString(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

